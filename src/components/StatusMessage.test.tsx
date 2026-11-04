import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '../test/renderWithTheme'
import { EmptyState, ErrorState, Loading } from './StatusMessage'

describe('StatusMessage', () => {
  it('Loading e anunciado como status para leitores de tela', () => {
    renderWithTheme(<Loading />)

    expect(screen.getByRole('status')).toHaveTextContent(/Carregando/)
  })

  it('ErrorState mostra a mensagem recebida como alerta', () => {
    renderWithTheme(<ErrorState message="Limite atingido" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Limite atingido')
  })

  it('EmptyState orienta o usuario a ajustar os filtros', () => {
    renderWithTheme(<EmptyState />)

    expect(screen.getByText('Nenhum asteroide encontrado')).toBeInTheDocument()
  })
})
