/**
 * Regras de filtro e ordenacao da lista de asteroides.
 *
 * Mantidas como funcao pura (sem React) para ficarem faceis de testar e para
 * que o App apenas "consuma" o resultado.
 */
import type { Asteroid } from '../types/nasa'

/**
 * Criterios de visualizacao disponiveis na interface:
 * - 'date'     : mostra todos, agrupados por dia (mais recente no topo),
 *                ordenados do maior para o menor dentro de cada dia.
 * - 'distance' : lista APENAS os que passaram a menos de 7,5 milhoes de km
 *                (mesmo limiar da NASA para "potencialmente perigoso"),
 *                do mais proximo ao mais distante, em lista unica.
 * - 'size'     : lista APENAS os com diametro maximo acima de 0,14 km (140 m),
 *                do maior ao menor, em lista unica.
 */
export type SortKey = 'date' | 'distance' | 'size'

/** Rotulos exibidos no seletor. */
export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: 'date', label: 'Padrão' },
  { value: 'distance', label: 'Mais próximos da Terra' },
  { value: 'size', label: 'Maiores asteroides' },
]

/** Distancia maxima (km) para um asteroide ser considerado "proximo" (criterio NASA). */
export const CLOSE_DISTANCE_KM = 7_500_000
/** Diametro maximo (km) a partir do qual um asteroide e considerado "grande" (criterio NASA). */
export const LARGE_DIAMETER_KM = 0.14

interface ListOptions {
  /** Texto digitado na busca; compara com o nome, ignorando maiusculas. */
  term: string
  /** Quando true, mantem apenas os potencialmente perigosos. */
  onlyHazardous: boolean
  /** Criterio de visualizacao. */
  sortBy: SortKey
}

/** Aplica busca por nome e filtro de perigosos (comum a todos os modos). */
function applyCommonFilters(
  asteroids: Asteroid[],
  term: string,
  onlyHazardous: boolean,
): Asteroid[] {
  const normalizedTerm = term.trim().toLowerCase()
  return asteroids.filter((asteroid) => {
    if (onlyHazardous && !asteroid.isHazardous) return false
    if (normalizedTerm && !asteroid.name.toLowerCase().includes(normalizedTerm)) {
      return false
    }
    return true
  })
}

/**
 * Aplica busca, filtro de perigosos e o criterio escolhido.
 * Nao altera o array original: trabalha sobre copias.
 *
 * Em TODOS os modos a lista e agrupada por dia (mais recente primeiro) na UI.
 * - 'distance' e 'size' tambem FILTRAM (so entram os proximos / grandes) e
 *   ordenam dentro de cada dia pelo criterio.
 * - 'date' nao corta nada e ordena cada dia do maior diametro para o menor.
 */
export function filterAndSortAsteroids(
  asteroids: Asteroid[],
  { term, onlyHazardous, sortBy }: ListOptions,
): Asteroid[] {
  let list = applyCommonFilters(asteroids, term, onlyHazardous)

  // Corte por criterio (apenas nos modos de distancia e tamanho).
  if (sortBy === 'distance') {
    list = list.filter(
      (a) => a.missDistanceKm > 0 && a.missDistanceKm < CLOSE_DISTANCE_KM,
    )
  } else if (sortBy === 'size') {
    list = list.filter((a) => a.diameterMaxKm > LARGE_DIAMETER_KM)
  }

  return [...list].sort((a, b) => {
    // 1o nivel (sempre): dia mais recente primeiro, para o agrupamento por dia.
    const byDay = b.approachDate.localeCompare(a.approachDate)
    if (byDay !== 0) return byDay

    // 2o nivel: criterio dentro de cada dia.
    switch (sortBy) {
      case 'distance':
        return a.missDistanceKm - b.missDistanceKm // mais proximo primeiro
      default:
        return b.diameterMaxKm - a.diameterMaxKm // maior primeiro (padrao e size)
    }
  })
}

/** Grupo de asteroides de um mesmo dia de aproximacao. */
export interface DayGroup {
  /** Data no formato YYYY-MM-DD. */
  date: string
  asteroids: Asteroid[]
}

/**
 * Agrupa uma lista (ja ordenada) por dia de aproximacao, preservando a ordem
 * em que os dias e os asteroides aparecem.
 */
export function groupByDay(asteroids: Asteroid[]): DayGroup[] {
  const groups: DayGroup[] = []
  for (const asteroid of asteroids) {
    const last = groups[groups.length - 1]
    if (last && last.date === asteroid.approachDate) {
      last.asteroids.push(asteroid)
    } else {
      groups.push({ date: asteroid.approachDate, asteroids: [asteroid] })
    }
  }
  return groups
}
