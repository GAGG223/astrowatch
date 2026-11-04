import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../test/renderWithTheme'
import { Filters } from './Filters'

function setup(overrides: Partial<React.ComponentProps<typeof Filters>> = {}) {
  const props = {
    searchTerm: '',
    onSearchTermChange: vi.fn(),
    onDateFilter: vi.fn(),
    startDate: '2026-10-28',
    endDate: '2026-11-03',
    loading: false,
    ...overrides,
  }
  renderWithTheme(<Filters {...props} />)
  return props
}

describe('Filters', () => {
  it('chama onSearchTermChange conforme o usuario digita', () => {
    const { onSearchTermChange } = setup()

    fireEvent.change(screen.getByLabelText(/Buscar pelo nome/), {
      target: { value: 'KO2' },
    })

    expect(onSearchTermChange).toHaveBeenCalledWith('KO2')
  })

  it('envia o intervalo valido ao filtrar', () => {
    const { onDateFilter } = setup()

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(onDateFilter).toHaveBeenCalledWith('2026-10-28', '2026-11-03')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('bloqueia intervalo maior que 7 dias e mostra a mensagem', () => {
    const { onDateFilter } = setup()

    fireEvent.change(screen.getByLabelText('Data inicial'), {
      target: { value: '2026-10-01' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(onDateFilter).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/7 dias/)
  })

  it('remove a mensagem depois que o usuario corrige o intervalo', () => {
    const { onDateFilter } = setup()
    const start = screen.getByLabelText('Data inicial')
    const submit = screen.getByRole('button', { name: 'Filtrar' })

    fireEvent.change(start, { target: { value: '2026-10-01' } })
    fireEvent.click(submit)
    expect(screen.getByRole('alert')).toBeInTheDocument()

    fireEvent.change(start, { target: { value: '2026-11-01' } })
    fireEvent.click(submit)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(onDateFilter).toHaveBeenCalledWith('2026-11-01', '2026-11-03')
  })

  it('desabilita o botao enquanto carrega', () => {
    setup({ loading: true })

    expect(screen.getByRole('button', { name: 'Buscando...' })).toBeDisabled()
  })
})
