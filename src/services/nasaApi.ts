import type { Asteroid, NearEarthObject, NeoFeedResponse } from '../types/nasa'

const BASE_URL = 'https://api.nasa.gov/neo/rest/v1/feed'

/**
 * Chave de API da NASA lida das variaveis de ambiente do Vite.
 * Cai para DEMO_KEY quando nenhuma chave e configurada (ver .env.example).
 */
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'

/** Erro especializado para falhas na comunicacao com a API da NASA. */
export class NasaApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NasaApiError'
  }
}

/**
 * Converte um objeto bruto da API (NearEarthObject) no modelo usado pela UI.
 * Extrai somente os campos exigidos pelo desafio.
 */
function normalizeAsteroid(neo: NearEarthObject): Asteroid {
  const approach = neo.close_approach_data[0]

  return {
    id: neo.id,
    name: neo.name,
    approachDate: approach?.close_approach_date ?? '',
    diameterMinKm: neo.estimated_diameter.kilometers.estimated_diameter_min,
    diameterMaxKm: neo.estimated_diameter.kilometers.estimated_diameter_max,
    missDistanceKm: approach ? Number(approach.miss_distance.kilometers) : 0,
    velocityKmh: approach ? Number(approach.relative_velocity.kilometers_per_hour) : 0,
    isHazardous: neo.is_potentially_hazardous_asteroid,
    jplUrl: neo.nasa_jpl_url,
  }
}

/**
 * Busca os asteroides que se aproximaram da Terra no intervalo informado.
 *
 * @param startDate data inicial no formato YYYY-MM-DD
 * @param endDate   data final no formato YYYY-MM-DD (max. 7 dias apos a inicial)
 * @param signal    opcional; permite cancelar a requisicao (AbortController).
 *                  Quando cancelada, a promise rejeita com um AbortError.
 * @returns lista de asteroides normalizados, ordenada por data de aproximacao
 */
export async function fetchAsteroids(
  startDate: string,
  endDate: string,
  signal?: AbortSignal,
): Promise<Asteroid[]> {
  const url = `${BASE_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`

  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    // Cancelamento intencional nao e falha de rede: repassa para o chamador ignorar.
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new NasaApiError(
      'Nao foi possivel conectar a API da NASA. Verifique sua conexao com a internet.',
    )
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new NasaApiError(
        'Limite de requisicoes da API atingido. Configure sua propria VITE_NASA_API_KEY ou aguarde alguns instantes.',
      )
    }
    if (response.status === 400) {
      throw new NasaApiError(
        'A API recusou o periodo informado. Use um intervalo de no maximo 7 dias.',
      )
    }
    throw new NasaApiError(
      `A API da NASA respondeu com erro (${response.status}). Tente novamente mais tarde.`,
    )
  }

  const data = (await response.json()) as NeoFeedResponse

  // A resposta agrupa os asteroides por data; achatamos tudo em uma unica lista.
  const asteroids = Object.values(data.near_earth_objects)
    .flat()
    .map(normalizeAsteroid)
    .sort((a, b) => a.approachDate.localeCompare(b.approachDate))

  return asteroids
}
