import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeAsteroid } from '../test/fixtures'
import { renderWithTheme } from '../test/renderWithTheme'
import { AsteroidCard } from './AsteroidCard'

describe('AsteroidCard', () => {
  it('exibe os dados exigidos pelo desafio formatados em pt-BR', () => {
    renderWithTheme(
      <AsteroidCard
        asteroid={makeAsteroid({
          name: '467351 (2003 KO2)',
          diameterMinKm: 0.2241583786,
          diameterMaxKm: 0.5012333723,
          missDistanceKm: 16718435.4,
          approachDate: '2026-11-01',
        })}
      />,
    )

    expect(screen.getByRole('heading', { name: '467351 (2003 KO2)' })).toBeInTheDocument()
    expect(screen.getByText('0,224 km')).toBeInTheDocument()
    expect(screen.getByText('0,501 km')).toBeInTheDocument()
    expect(screen.getByText('16.718.435 km')).toBeInTheDocument()
    expect(screen.getByText(/01\/11\/2026/)).toBeInTheDocument()
  })

  it('mostra o horario da aproximacao quando disponivel', () => {
    renderWithTheme(
      <AsteroidCard
        asteroid={makeAsteroid({ approachDate: '2026-11-01', approachEpoch: 1793836800000 })}
      />,
    )

    // Data seguida do horario no formato "as HH:MM".
    expect(screen.getByText(/01\/11\/2026 às \d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('mostra so a data quando o horario nao esta disponivel', () => {
    renderWithTheme(
      <AsteroidCard
        asteroid={makeAsteroid({ approachDate: '2026-11-01', approachEpoch: 0 })}
      />,
    )

    expect(screen.getByText(/01\/11\/2026/)).toBeInTheDocument()
    expect(screen.queryByText(/às/)).not.toBeInTheDocument()
  })

  it('mostra o aviso quando o asteroide e potencialmente perigoso', () => {
    renderWithTheme(<AsteroidCard asteroid={makeAsteroid({ isHazardous: true })} />)

    expect(screen.getByText(/Perigoso/)).toBeInTheDocument()
  })

  it('nao mostra o aviso quando o asteroide nao e perigoso', () => {
    renderWithTheme(<AsteroidCard asteroid={makeAsteroid({ isHazardous: false })} />)

    expect(screen.queryByText(/Perigoso/)).not.toBeInTheDocument()
  })

  it('abre a pagina da NASA em nova aba, de forma segura', () => {
    renderWithTheme(
      <AsteroidCard asteroid={makeAsteroid({ jplUrl: 'https://jpl/10' })} />,
    )

    const link = screen.getByRole('link', { name: /Ver na NASA/ })
    expect(link).toHaveAttribute('href', 'https://jpl/10')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
