/**
 * ListControls — controles de visualizacao da lista.
 *
 * Reune o seletor de ordenacao e a opcao "somente perigosos". Sao filtros
 * aplicados no cliente sobre a lista ja carregada (nao geram requisicao).
 */
import styled from 'styled-components'
import { SORT_OPTIONS, type SortKey } from '../utils/asteroids'

interface ListControlsProps {
  /** Criterio de ordenacao selecionado. */
  sortBy: SortKey
  onSortChange: (value: SortKey) => void
  /** Quando true, exibe apenas asteroides potencialmente perigosos. */
  onlyHazardous: boolean
  onOnlyHazardousChange: (value: boolean) => void
}

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 24px;
`

const Field = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Select = styled.select`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 12px;
  font-size: 0.9rem;
  color-scheme: dark;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
`

export function ListControls({
  sortBy,
  onSortChange,
  onlyHazardous,
  onOnlyHazardousChange,
}: ListControlsProps) {
  return (
    <Bar>
      <Field>
        Ordenar por
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <Checkbox
          type="checkbox"
          checked={onlyHazardous}
          onChange={(e) => onOnlyHazardousChange(e.target.checked)}
        />
        Somente potencialmente perigosos
      </Field>
    </Bar>
  )
}
