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

/** Dois dias com dois asteroides cada, para testar a ordenacao dentro do dia. */
const sameDayAsteroids = [
  makeAsteroid({ id: 'o1', name: '(ONTEM LONGE)', approachDate: '2026-11-03', missDistanceKm: 9e6, diameterMaxKm: 0.8 }),
  makeAsteroid({ id: 'h1', name: '(HOJE LONGE)', approachDate: '2026-11-04', missDistanceKm: 7e6, diameterMaxKm: 0.9 }),
  makeAsteroid({ id: 'o2', name: '(ONTEM PERTO)', approachDate: '2026-11-03', missDistanceKm: 1e6, diameterMaxKm: 0.1 }),
  makeAsteroid({ id: 'h2', name: '(HOJE PERTO)', approachDate: '2026-11-04', missDistanceKm: 2e6, diameterMaxKm: 0.2 }),
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

  it('por padrao mostra o dia mais recente no topo', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    expect(cardNames()).toEqual(['(2021 CC)', '467351 (2003 KO2)', '(2008 WY32)'])
  })

  it('separa os cards com um titulo para cada dia', async () => {
    fetchMock.mockResolvedValue(asteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    // Um titulo h2 por dia (3 dias distintos), do mais recente ao mais antigo.
    const dayTitles = screen.getAllByRole('heading', { level: 2 })
    expect(dayTitles.map((h) => h.textContent)).toEqual([
      expect.stringContaining('03/11/2026'),
      expect.stringContaining('02/11/2026'),
      expect.stringContaining('01/11/2026'),
    ])
  })

  it('no modo padrao, ordena cada dia do maior para o menor', async () => {
    fetchMock.mockResolvedValue(sameDayAsteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    // Hoje no topo (maior antes do menor), depois ontem (idem).
    expect(cardNames()).toEqual(['(HOJE LONGE)', '(HOJE PERTO)', '(ONTEM LONGE)', '(ONTEM PERTO)'])
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

  it('"mais proximos" lista so os < 7,5 mi km, do mais perto ao mais longe, sem agrupar', async () => {
    fetchMock.mockResolvedValue(sameDayAsteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.change(screen.getByLabelText('Visualizar'), {
      target: { value: 'distance' },
    })

    // "(ONTEM LONGE)" tem 9 mi km -> fica de fora. Os outros, por distancia crescente.
    expect(cardNames()).toEqual(['(ONTEM PERTO)', '(HOJE PERTO)', '(HOJE LONGE)'])
    // Sem titulos de dia: nao aparece o cabecalho "(N asteroides)" do agrupamento.
    expect(screen.queryByText(/asteroides\)/)).not.toBeInTheDocument()
  })

  it('"maiores asteroides" lista so os > 0,14 km, do maior ao menor, sem agrupar', async () => {
    fetchMock.mockResolvedValue(sameDayAsteroids)
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.change(screen.getByLabelText('Visualizar'), {
      target: { value: 'size' },
    })

    // "(ONTEM PERTO)" tem 0,1 km -> fica de fora. Os outros, do maior ao menor.
    expect(cardNames()).toEqual(['(HOJE LONGE)', '(ONTEM LONGE)', '(HOJE PERTO)'])
  })

  it('mostra mensagem especifica quando nenhum asteroide e grande o bastante', async () => {
    fetchMock.mockResolvedValue([
      makeAsteroid({ id: 'p', name: '(PEQUENO)', diameterMaxKm: 0.05 }),
    ])
    renderWithTheme(<App />)
    await screen.findAllByRole('article')

    fireEvent.change(screen.getByLabelText('Visualizar'), {
      target: { value: 'size' },
    })

    expect(screen.getByText(/diâmetro acima de 0,14 km/)).toBeInTheDocument()
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
