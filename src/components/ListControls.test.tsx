import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../test/renderWithTheme'
import { ListControls } from './ListControls'

describe('ListControls', () => {
  it('informa a ordenacao escolhida', () => {
    const onSortChange = vi.fn()
    renderWithTheme(
      <ListControls
        sortBy="date"
        onSortChange={onSortChange}
        onlyHazardous={false}
        onOnlyHazardousChange={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText('Ordenar por'), {
      target: { value: 'distance' },
    })

    expect(onSortChange).toHaveBeenCalledWith('distance')
  })

  it('informa quando o filtro de perigosos e marcado', () => {
    const onOnlyHazardousChange = vi.fn()
    renderWithTheme(
      <ListControls
        sortBy="date"
        onSortChange={vi.fn()}
        onlyHazardous={false}
        onOnlyHazardousChange={onOnlyHazardousChange}
      />,
    )

    fireEvent.click(screen.getByLabelText(/Somente potencialmente perigosos/))

    expect(onOnlyHazardousChange).toHaveBeenCalledWith(true)
  })
})
