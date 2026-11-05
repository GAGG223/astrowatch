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
    // Modo padrao ordena por dia mais recente primeiro (c = 11-03, a = 11-02).
    expect(ids(result)).toEqual(['c', 'a'])
  })

  it('padrao: ordena por dia mais recente e, dentro do dia, do maior ao menor', () => {
    const sameDay = [
      makeAsteroid({ id: 'hoje-pequeno', approachDate: '2026-11-04', diameterMaxKm: 0.2 }),
      makeAsteroid({ id: 'ontem', approachDate: '2026-11-03', diameterMaxKm: 0.9 }),
      makeAsteroid({ id: 'hoje-grande', approachDate: '2026-11-04', diameterMaxKm: 0.8 }),
    ]
    expect(ids(filterAndSortAsteroids(sameDay, base))).toEqual([
      'hoje-grande',
      'hoje-pequeno',
      'ontem',
    ])
  })

  describe('modo "mais proximos da Terra" (< 7,5 mi km)', () => {
    const list = [
      makeAsteroid({ id: 'perto1', missDistanceKm: 2_000_000 }),
      makeAsteroid({ id: 'longe', missDistanceKm: 10_000_000 }),
      makeAsteroid({ id: 'perto2', missDistanceKm: 500_000 }),
      makeAsteroid({ id: 'limite', missDistanceKm: 7_500_000 }), // no limite: fora
    ]

    it('lista apenas os que passaram a menos de 7,5 mi km', () => {
      const result = filterAndSortAsteroids(list, { ...base, sortBy: 'distance' })
      expect(ids(result)).toEqual(['perto2', 'perto1'])
    })

    it('ordena do mais proximo ao mais distante', () => {
      const result = filterAndSortAsteroids(list, { ...base, sortBy: 'distance' })
      expect(result[0].id).toBe('perto2')
    })

    it('ignora asteroides sem distancia (0)', () => {
      const semDist = [makeAsteroid({ id: 'x', missDistanceKm: 0 })]
      expect(filterAndSortAsteroids(semDist, { ...base, sortBy: 'distance' })).toEqual([])
    })
  })

  describe('modo "maiores asteroides" (> 0,14 km)', () => {
    const list = [
      makeAsteroid({ id: 'grande', diameterMaxKm: 0.5 }),
      makeAsteroid({ id: 'pequeno', diameterMaxKm: 0.1 }),
      makeAsteroid({ id: 'medio', diameterMaxKm: 0.2 }),
      makeAsteroid({ id: 'limite', diameterMaxKm: 0.14 }), // no limite: fora
    ]

    it('lista apenas os com diametro acima de 0,14 km', () => {
      const result = filterAndSortAsteroids(list, { ...base, sortBy: 'size' })
      expect(ids(result)).toEqual(['grande', 'medio'])
    })

    it('ordena do maior ao menor', () => {
      const result = filterAndSortAsteroids(list, { ...base, sortBy: 'size' })
      expect(result[0].id).toBe('grande')
    })
  })

  it('combina busca e filtro de perigosos no modo padrao', () => {
    const result = filterAndSortAsteroids(asteroids, {
      term: '2021',
      onlyHazardous: true,
      sortBy: 'date',
    })
    expect(ids(result)).toEqual(['c'])
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
