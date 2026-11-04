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

  // Dois dias com varios asteroides cada, fora de ordem de proposito.
  const twoDays = [
    makeAsteroid({ id: 'ontem-longe-pequeno', approachDate: '2026-11-03', missDistanceKm: 9e6, diameterMaxKm: 0.1 }),
    makeAsteroid({ id: 'hoje-medio', approachDate: '2026-11-04', missDistanceKm: 5e6, diameterMaxKm: 0.5 }),
    makeAsteroid({ id: 'ontem-perto-grande', approachDate: '2026-11-03', missDistanceKm: 1e6, diameterMaxKm: 0.9 }),
    makeAsteroid({ id: 'hoje-perto-pequeno', approachDate: '2026-11-04', missDistanceKm: 2e6, diameterMaxKm: 0.2 }),
    makeAsteroid({ id: 'hoje-longe-grande', approachDate: '2026-11-04', missDistanceKm: 8e6, diameterMaxKm: 0.8 }),
  ]

  it('padrao: dia mais recente primeiro, mantendo a ordem original dentro do dia', () => {
    const result = filterAndSortAsteroids(twoDays, base)
    expect(ids(result)).toEqual([
      'hoje-medio',
      'hoje-perto-pequeno',
      'hoje-longe-grande',
      'ontem-longe-pequeno',
      'ontem-perto-grande',
    ])
  })

  it('mais proximos: mantem os dias na ordem e ordena dentro de cada dia', () => {
    const result = filterAndSortAsteroids(twoDays, { ...base, sortBy: 'distance' })
    expect(ids(result)).toEqual([
      'hoje-perto-pequeno',
      'hoje-medio',
      'hoje-longe-grande',
      'ontem-perto-grande',
      'ontem-longe-pequeno',
    ])
  })

  it('maiores primeiro: mantem os dias na ordem e ordena dentro de cada dia', () => {
    const result = filterAndSortAsteroids(twoDays, { ...base, sortBy: 'size' })
    expect(ids(result)).toEqual([
      'hoje-longe-grande',
      'hoje-medio',
      'hoje-perto-pequeno',
      'ontem-perto-grande',
      'ontem-longe-pequeno',
    ])
  })

  it('o asteroide mais proximo de um dia antigo nunca passa na frente de hoje', () => {
    const result = filterAndSortAsteroids(twoDays, { ...base, sortBy: 'distance' })
    // 'ontem-perto-grande' e o mais proximo de todos (1e6 km), mas e de ontem.
    expect(result[0].approachDate).toBe('2026-11-04')
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
