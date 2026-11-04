import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchAsteroids, NasaApiError } from '../services/nasaApi'
import { makeAsteroid } from '../test/fixtures'
import type { Asteroid } from '../types/nasa'
import { useAsteroids } from './useAsteroids'

// Substitui apenas fetchAsteroids; NasaApiError continua sendo o real.
vi.mock('../services/nasaApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/nasaApi')>()),
  fetchAsteroids: vi.fn(),
}))

const fetchMock = vi.mocked(fetchAsteroids)

/** Promise controlada manualmente, para simular respostas que chegam fora de ordem. */
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

beforeEach(() => {
  fetchMock.mockReset()
})

describe('useAsteroids', () => {
  it('carrega os asteroides automaticamente ao montar', async () => {
    const list = [makeAsteroid({ id: '1' })]
    fetchMock.mockResolvedValue(list)

    const { result } = renderHook(() => useAsteroids())

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.asteroids).toEqual(list)
    expect(result.current.error).toBeNull()
    expect(result.current.lastUpdated).toBeInstanceOf(Date)
  })

  it('expoe a mensagem do NasaApiError e esvazia a lista numa busca normal', async () => {
    fetchMock.mockRejectedValue(new NasaApiError('Limite atingido'))

    const { result } = renderHook(() => useAsteroids())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Limite atingido')
    expect(result.current.asteroids).toEqual([])
  })

  it('usa mensagem generica para erros inesperados', async () => {
    fetchMock.mockRejectedValue(new Error('boom'))

    const { result } = renderHook(() => useAsteroids())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toMatch(/inesperado/)
  })

  it('mantem a lista anterior quando um refresh silencioso falha', async () => {
    const list = [makeAsteroid({ id: '1' })]
    fetchMock.mockResolvedValueOnce(list)

    const { result } = renderHook(() => useAsteroids())
    await waitFor(() => expect(result.current.asteroids).toEqual(list))

    fetchMock.mockRejectedValueOnce(new NasaApiError('Sem conexao'))
    act(() => result.current.refresh())
    await waitFor(() => expect(result.current.error).toBe('Sem conexao'))

    // A tela nao e esvaziada por causa de uma falha na atualizacao em segundo plano.
    expect(result.current.asteroids).toEqual(list)
    expect(result.current.refreshing).toBe(false)
  })

  it('search consulta a API com o intervalo informado', async () => {
    fetchMock.mockResolvedValue([])
    const { result } = renderHook(() => useAsteroids())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.search('2026-10-01', '2026-10-05'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchMock).toHaveBeenLastCalledWith(
      '2026-10-01',
      '2026-10-05',
      expect.any(AbortSignal),
    )
  })

  it('refresh reaproveita o ultimo intervalo pesquisado', async () => {
    fetchMock.mockResolvedValue([])
    const { result } = renderHook(() => useAsteroids())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.search('2026-10-01', '2026-10-05'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.refresh())
    await waitFor(() => expect(result.current.refreshing).toBe(false))

    expect(fetchMock).toHaveBeenLastCalledWith(
      '2026-10-01',
      '2026-10-05',
      expect.any(AbortSignal),
    )
  })

  it('descarta a resposta antiga quando uma busca mais nova ja foi feita (corrida)', async () => {
    const first = deferred<Asteroid[]>()
    const second = deferred<Asteroid[]>()
    const oldList = [makeAsteroid({ id: 'antiga', name: '(ANTIGA)' })]
    const newList = [makeAsteroid({ id: 'nova', name: '(NOVA)' })]

    // 1a chamada = carga inicial; 2a = busca do usuario logo em seguida.
    fetchMock
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)

    const { result } = renderHook(() => useAsteroids())
    act(() => result.current.search('2026-10-01', '2026-10-05'))

    // A resposta MAIS NOVA chega primeiro...
    await act(async () => {
      second.resolve(newList)
    })
    await waitFor(() => expect(result.current.asteroids).toEqual(newList))

    // ...e a antiga chega atrasada, sem poder sobrescrever o resultado.
    await act(async () => {
      first.resolve(oldList)
    })

    expect(result.current.asteroids).toEqual(newList)
    expect(result.current.loading).toBe(false)
  })

  it('cancela a requisicao anterior ao iniciar uma nova', async () => {
    fetchMock.mockReturnValue(new Promise(() => {})) // nunca resolve

    const { result } = renderHook(() => useAsteroids())
    const firstSignal = fetchMock.mock.calls[0][2] as AbortSignal
    expect(firstSignal.aborted).toBe(false)

    act(() => result.current.search('2026-10-01', '2026-10-05'))

    expect(firstSignal.aborted).toBe(true)
  })
})
