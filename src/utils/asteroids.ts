/**
 * Regras de filtro e ordenacao da lista de asteroides.
 *
 * Mantidas como funcao pura (sem React) para ficarem faceis de testar e para
 * que o App apenas "consuma" o resultado.
 */
import type { Asteroid } from '../types/nasa'

/** Criterios de ordenacao disponiveis na interface. */
export type SortKey = 'date' | 'distance' | 'size'

/** Rotulos exibidos no seletor de ordenacao. */
export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: 'date', label: 'Mais recentes primeiro' },
  { value: 'distance', label: 'Mais proximos da Terra' },
  { value: 'size', label: 'Maiores primeiro' },
]

interface ListOptions {
  /** Texto digitado na busca; compara com o nome, ignorando maiusculas. */
  term: string
  /** Quando true, mantem apenas os potencialmente perigosos. */
  onlyHazardous: boolean
  /** Criterio de ordenacao. */
  sortBy: SortKey
}

/**
 * Aplica busca por nome, filtro de perigosos e ordenacao.
 * Nao altera o array original: trabalha sobre uma copia.
 */
export function filterAndSortAsteroids(
  asteroids: Asteroid[],
  { term, onlyHazardous, sortBy }: ListOptions,
): Asteroid[] {
  const normalizedTerm = term.trim().toLowerCase()

  const filtered = asteroids.filter((asteroid) => {
    if (onlyHazardous && !asteroid.isHazardous) return false
    if (normalizedTerm && !asteroid.name.toLowerCase().includes(normalizedTerm)) {
      return false
    }
    return true
  })

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        // Menor distancia primeiro.
        return a.missDistanceKm - b.missDistanceKm
      case 'size':
        // Maior diametro maximo primeiro.
        return b.diameterMaxKm - a.diameterMaxKm
      default:
        // Mais recentes primeiro: hoje no topo, depois os dias anteriores.
        // (o formato YYYY-MM-DD permite comparar como texto)
        return b.approachDate.localeCompare(a.approachDate)
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
