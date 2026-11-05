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
 * Importante: nos modos 'distance' e 'size' a lista tambem e FILTRADA
 * (so entram os proximos / grandes), virando uma lista unica ordenada.
 * No modo 'date' nada e cortado; a ordenacao por dia e feita na UI (groupByDay).
 */
export function filterAndSortAsteroids(
  asteroids: Asteroid[],
  { term, onlyHazardous, sortBy }: ListOptions,
): Asteroid[] {
  const base = applyCommonFilters(asteroids, term, onlyHazardous)

  if (sortBy === 'distance') {
    // Apenas os que passaram a menos de 7,5 mi km, do mais proximo ao mais distante.
    return base
      .filter((a) => a.missDistanceKm > 0 && a.missDistanceKm < CLOSE_DISTANCE_KM)
      .sort((a, b) => a.missDistanceKm - b.missDistanceKm)
  }

  if (sortBy === 'size') {
    // Apenas os com diametro maximo acima de 0,14 km, do maior ao menor.
    return base
      .filter((a) => a.diameterMaxKm > LARGE_DIAMETER_KM)
      .sort((a, b) => b.diameterMaxKm - a.diameterMaxKm)
  }

  // Padrao: mostra todos. Ordena por dia (mais recente primeiro) e, dentro do
  // dia, do maior diametro para o menor. O agrupamento visual e feito na UI.
  return [...base].sort((a, b) => {
    const byDay = b.approachDate.localeCompare(a.approachDate)
    if (byDay !== 0) return byDay
    return b.diameterMaxKm - a.diameterMaxKm
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
