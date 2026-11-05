import { afterEach, describe, expect, it, vi } from 'vitest'
import { rawFeedResponse } from '../test/fixtures'
import { fetchAsteroids, NasaApiError } from './nasaApi'

/** Cria uma Response simulada do fetch. */
function mockFetch(response: Partial<Response> & { json?: () => unknown }) {
  const fn = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fn)
  return fn
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchAsteroids', () => {
  it('monta a URL do endpoint /feed com as datas informadas', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => rawFeedResponse })

    await fetchAsteroids('2026-10-28', '2026-11-03')

    const url = fetchMock.mock.calls[0][0] as string
    expect(url).toContain('https://api.nasa.gov/neo/rest/v1/feed')
    expect(url).toContain('start_date=2026-10-28')
    expect(url).toContain('end_date=2026-11-03')
    expect(url).toContain('api_key=')
  })

  it('junta os dias numa lista unica, normaliza e ordena por data', async () => {
    mockFetch({ ok: true, json: async () => rawFeedResponse })

    const result = await fetchAsteroids('2026-11-01', '2026-11-02')

    expect(result).toHaveLength(3)
    // O dia 11-02 vinha primeiro na resposta, mas a lista sai ordenada por data.
    expect(result.map((a) => a.approachDate)).toEqual([
      '2026-11-01',
      '2026-11-01',
      '2026-11-02',
    ])
  })

  it('converte os campos exigidos pelo desafio para o modelo da interface', async () => {
    mockFetch({ ok: true, json: async () => rawFeedResponse })

    const result = await fetchAsteroids('2026-11-01', '2026-11-02')
    const hazardous = result.find((a) => a.id === '10')

    expect(hazardous).toEqual({
      id: '10',
      name: '467351 (2003 KO2)',
      approachDate: '2026-11-01',
      approachEpoch: 1793836800000,
      diameterMinKm: 0.224,
      diameterMaxKm: 0.501,
      // Na API a distancia e a velocidade chegam como texto; viram numero.
      missDistanceKm: 16718435.4,
      velocityKmh: 49346.04,
      isHazardous: true,
      jplUrl: 'https://jpl/10',
    })
  })

  it('repassa o AbortSignal para o fetch', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => rawFeedResponse })
    const controller = new AbortController()

    await fetchAsteroids('2026-11-01', '2026-11-02', controller.signal)

    expect(fetchMock.mock.calls[0][1]).toEqual({ signal: controller.signal })
  })

  it('lanca erro amigavel quando o limite de requisicoes e atingido (429)', async () => {
    mockFetch({ ok: false, status: 429 })

    await expect(fetchAsteroids('a', 'b')).rejects.toThrow(/Limite de requisições/)
  })

  it('lanca erro amigavel quando a API recusa o periodo (400)', async () => {
    mockFetch({ ok: false, status: 400 })

    await expect(fetchAsteroids('a', 'b')).rejects.toThrow(/7 dias/)
  })

  it('lanca erro generico com o status para outras falhas HTTP', async () => {
    mockFetch({ ok: false, status: 500 })

    await expect(fetchAsteroids('a', 'b')).rejects.toThrow(/500/)
  })

  it('lanca NasaApiError quando nao ha conexao', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(fetchAsteroids('a', 'b')).rejects.toBeInstanceOf(NasaApiError)
    await expect(fetchAsteroids('a', 'b')).rejects.toThrow(/conectar/)
  })

  it('repassa o AbortError sem transformar em erro de rede', async () => {
    const abortError = new DOMException('Aborted', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError))

    await expect(fetchAsteroids('a', 'b')).rejects.toBe(abortError)
  })
})
