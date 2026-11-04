import { describe, expect, it } from 'vitest'
import { makeAsteroid } from '../test/fixtures'
import { filterAndSortAsteroids, groupByDay } from './asteroids'

const asteroids = [
  makeAsteroid({
    id: 'a',
    name: '467351 (2003 KO2)',
    approachDate: '2026-11-02',
    missDistanceKm: 5_000_000,
    diameterMaxKm: 0.5,
    isHazardous: true,
  }),
  makeAsteroid({
    id: 'b',
    name: '(2008 WY32)',
    approachDate: '2026-11-01',
    missDistanceKm: 1_000_000,
    diameterMaxKm: 0.2,
  }),
  makeAsteroid({
    id: 'c',
    name: '(2021 CC)',
    approachDate: '2026-11-03',
    missDistanceKm: 9_000_000,
    diameterMaxKm: 0.9,
    isHazardous: true,
  }),
]

const base = { term: '', onlyHazardous: false, sortBy: 'date' as const }
const ids = (list: ReturnType<typeof filterAndSortAsteroids>) =>
  list.map((a) => a.id)

describe('filterAndSortAsteroids', () => {
  it('sem filtros, ordena do dia mais recente para o mais antigo', () => {
    expect(ids(filterAndSortAsteroids(asteroids, base))).toEqual(['c', 'a', 'b'])
  })

  it('busca pelo nome ignorando maiusculas e espacos nas pontas', () => {
    const result = filterAndSortAsteroids(asteroids, { ...base, term: '  ko2 ' })
    expect(ids(result)).toEqual(['a'])
  })

  it('retorna lista vazia quando nada corresponde a busca', () => {
    expect(filterAndSortAsteroids(asteroids, { ...base, term: 'zzz' })).toEqual([])
  })

  it('mantem somente os potencialmente perigosos', () => {
    const result = filterAndSortAsteroids(asteroids, {
      ...base,
      onlyHazardous: true,
    })
    expect(ids(result)).toEqual(['c', 'a'])
  })

  it('combina busca e filtro de perigosos', () => {
    const result = filterAndSortAsteroids(asteroids, {
      term: '2021',
      onlyHazardous: true,
      sortBy: 'date',
    })
    expect(ids(result)).toEqual(['c'])
  })

  it('ordena pelos mais proximos da Terra', () => {
    const result = filterAndSortAsteroids(asteroids, { ...base, sortBy: 'distance' })
    expect(ids(result)).toEqual(['b', 'a', 'c'])
  })

  it('ordena pelos maiores primeiro', () => {
    const result = filterAndSortAsteroids(asteroids, { ...base, sortBy: 'size' })
    expect(ids(result)).toEqual(['c', 'a', 'b'])
  })

  it('nao altera a lista original', () => {
    const original = ids(asteroids)
    filterAndSortAsteroids(asteroids, { ...base, sortBy: 'size' })
    expect(ids(asteroids)).toEqual(original)
  })
})

describe('groupByDay', () => {
  it('agrupa por dia preservando a ordem da lista', () => {
    const list = [
      makeAsteroid({ id: '1', approachDate: '2026-11-03' }),
      makeAsteroid({ id: '2', approachDate: '2026-11-03' }),
      makeAsteroid({ id: '3', approachDate: '2026-11-02' }),
    ]

    const groups = groupByDay(list)

    expect(groups.map((g) => g.date)).toEqual(['2026-11-03', '2026-11-02'])
    expect(groups[0].asteroids.map((a) => a.id)).toEqual(['1', '2'])
    expect(groups[1].asteroids.map((a) => a.id)).toEqual(['3'])
  })

  it('retorna lista vazia para entrada vazia', () => {
    expect(groupByDay([])).toEqual([])
  })
})
