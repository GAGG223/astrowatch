/**
 * Dados de apoio compartilhados pelos testes.
 *
 * - makeAsteroid: cria um Asteroid (modelo normalizado) com valores padrao,
 *   permitindo sobrescrever so o que importa em cada teste.
 * - rawFeedResponse: resposta no formato real da API NeoWs (agrupada por data).
 */
import type { Asteroid, NeoFeedResponse } from '../types/nasa'

export function makeAsteroid(overrides: Partial<Asteroid> = {}): Asteroid {
  return {
    id: '1',
    name: '(2020 AA)',
    approachDate: '2026-11-01',
    approachEpoch: 0,
    diameterMinKm: 0.1,
    diameterMaxKm: 0.2,
    missDistanceKm: 1_000_000,
    velocityKmh: 50_000,
    isHazardous: false,
    jplUrl: 'https://ssd.jpl.nasa.gov/example',
    ...overrides,
  }
}

/** Resposta bruta da API com 3 asteroides em 2 dias (fora de ordem de proposito). */
export const rawFeedResponse: NeoFeedResponse = {
  element_count: 3,
  near_earth_objects: {
    '2026-11-02': [
      {
        id: '30',
        name: '(2021 CC)',
        nasa_jpl_url: 'https://jpl/30',
        is_potentially_hazardous_asteroid: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.05, estimated_diameter_max: 0.11 },
        },
        close_approach_data: [
          {
            close_approach_date: '2026-11-02',
            epoch_date_close_approach: 1793923200000,
            orbiting_body: 'Earth',
            miss_distance: { kilometers: '5000000.5', lunar: '13' },
            relative_velocity: { kilometers_per_hour: '30000.9' },
          },
        ],
      },
    ],
    '2026-11-01': [
      {
        id: '10',
        name: '467351 (2003 KO2)',
        nasa_jpl_url: 'https://jpl/10',
        is_potentially_hazardous_asteroid: true,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.224, estimated_diameter_max: 0.501 },
        },
        close_approach_data: [
          {
            close_approach_date: '2026-11-01',
            epoch_date_close_approach: 1793836800000,
            orbiting_body: 'Earth',
            miss_distance: { kilometers: '16718435.4', lunar: '43' },
            relative_velocity: { kilometers_per_hour: '49346.04' },
          },
        ],
      },
      {
        id: '20',
        name: '(2008 WY32)',
        nasa_jpl_url: 'https://jpl/20',
        is_potentially_hazardous_asteroid: false,
        estimated_diameter: {
          kilometers: { estimated_diameter_min: 0.084, estimated_diameter_max: 0.188 },
        },
        close_approach_data: [
          {
            close_approach_date: '2026-11-01',
            epoch_date_close_approach: 1793880000000,
            orbiting_body: 'Earth',
            miss_distance: { kilometers: '59090433.5', lunar: '153' },
            relative_velocity: { kilometers_per_hour: '49391.3' },
          },
        ],
      },
    ],
  },
}
