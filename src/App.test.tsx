/**
 * Teste de integracao do App: simula o fluxo do usuario com a API mockada.
 */
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { NasaApiError, fetchAsteroids } from './services/nasaApi'
import { makeAsteroid } from './test/fixtures'
import { renderWithTheme } from './test/renderWithTheme'

vi.mock('./services/nasaApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./services/nasaApi')>()),
  fetchAsteroids: vi.fn(),
}))

const fetchMock = vi.mocked(fetchAsteroids)

const asteroids = [
  makeAsteroid({
    id: '1',
    name: '467351 (2003 KO2)',
    approachDate: '2026-11-02',
    missDistanceKm: 16_000_000,
    diameterMaxKm: 0.5,
    isHazardous: true,
  }),
  makeAsteroid({
    id: '2',
    name: '(2008 WY32)',
    approachDate: '2026-11-01',
    missDistanceKm: 59_000_000,
    diameterMaxKm: 0.2,
  }),
  makeAsteroid({
    id: '3',
    name: '(2021 CC)',
    approachDate: '2026-11-03',
    missDistanceKm: 5_000_000,
    diameterMaxKm: 0.9,
  }),
]

/** Nomes dos cards na ordem em que aparecem na tela. */
const cardNames = () =>
  screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent)

beforeEach(() => {
  fetchMock.mockReset()
})

describe('App', () => {
  it('mostra o carregando e depois a lista de asteroides', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(await screen.findAllByRole('article')).toHaveLength(3)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('ordena por data de aproximacao por padrao', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    expect(cardNames()).toEqual(['(2008 WY32)', '467351 (2003 KO2)', '(2021 CC)'])
  })

  it('busca pelo nome sem nova requisicao', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.change(screen.getByLabelText(/Buscar pelo nome/), {
      target: { value: 'ko2' },
    })

    expect(cardNames()).toEqual(['467351 (2003 KO2)'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('mostra apenas os perigosos quando o filtro e marcado', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.click(screen.getByLabelText(/Somente potencialmente perigosos/))

    expect(cardNames()).toEqual(['467351 (2003 KO2)'])
  })

  it('reordena pelos mais proximos da Terra', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.change(screen.getByLabelText('Ordenar por'), {
      target: { value: 'distance' },
    })

    expect(cardNames()).toEqual(['(2021 CC)', '467351 (2003 KO2)', '(2008 WY32)'])
  })

  it('mostra o estado vazio quando a busca nao encontra nada', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.change(screen.getByLabelText(/Buscar pelo nome/), {
      target: { value: 'inexistente' },
    })

    expect(screen.getByText('Nenhum asteroide encontrado')).toBeInTheDocument()
  })

  it('mostra a mensagem de erro quando a API falha', async () => {
    fetchMock.mockRejectedValue(new NasaApiError('Limite de requisicoes atingido'))
    renderWithTheme(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Limite de requisicoes atingido',
    )
  })

  it('o filtro de data dispara nova requisicao com o intervalo escolhido', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.change(screen.getByLabelText('Data inicial'), {
      target: { value: '2026-10-30' },
    })
    fireEvent.change(screen.getByLabelText('Data final'), {
      target: { value: '2026-11-02' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        '2026-10-30',
        '2026-11-02',
        expect.any(AbortSignal),
      ),
    )
  })

  it('o botao Atualizar agora refaz a consulta', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.click(screen.getByRole('button', { name: /Atualizar agora/ }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })
})
