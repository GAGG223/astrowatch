/**
 * Tipagem da resposta da API Asteroids - NeoWs (endpoint /feed).
 * Documentacao: https://api.nasa.gov/ (secao "Asteroids NeoWs")
 *
 * Apenas os campos efetivamente utilizados pela aplicacao foram tipados.
 */

/** Estimativa de diametro em diferentes unidades. */
export interface EstimatedDiameter {
  kilometers: {
    estimated_diameter_min: number
    estimated_diameter_max: number
  }
}

/** Dados de aproximacao de um asteroide a um corpo celeste. */
export interface CloseApproachData {
  close_approach_date: string
  miss_distance: {
    /** Distancia que o asteroide passou do corpo (em km). */
    kilometers: string
    lunar: string
  }
  relative_velocity: {
    kilometers_per_hour: string
  }
  orbiting_body: string
}

/** Objeto proximo a Terra (Near Earth Object) retornado pela API. */
export interface NearEarthObject {
  id: string
  name: string
  nasa_jpl_url: string
  estimated_diameter: EstimatedDiameter
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: CloseApproachData[]
}

/** Resposta completa do endpoint /feed. */
export interface NeoFeedResponse {
  element_count: number
  /** Mapa de data (YYYY-MM-DD) para a lista de asteroides daquele dia. */
  near_earth_objects: Record<string, NearEarthObject[]>
}

/**
 * Asteroide ja normalizado para consumo da UI.
 * Deriva os campos exigidos pelo desafio a partir do NearEarthObject bruto.
 */
export interface Asteroid {
  id: string
  name: string
  /** Data de aproximacao (YYYY-MM-DD). */
  approachDate: string
  /** Diametro minimo estimado em km. */
  diameterMinKm: number
  /** Diametro maximo estimado em km. */
  diameterMaxKm: number
  /** Distancia que passou da Terra em km. */
  missDistanceKm: number
  /** Velocidade relativa em km/h. */
  velocityKmh: number
  /** Indica se e um asteroide potencialmente perigoso. */
  isHazardous: boolean
  /** Link para a pagina de detalhes no JPL da NASA. */
  jplUrl: string
}
