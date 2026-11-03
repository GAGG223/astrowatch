import { useState } from 'react'
import styled from 'styled-components'

interface FiltersProps {
  /** Valor atual do campo de busca por nome. */
  searchTerm: string
  /** Callback acionado a cada alteracao no campo de busca. */
  onSearchTermChange: (value: string) => void
  /** Callback acionado ao submeter um novo intervalo de datas. */
  onDateFilter: (startDate: string, endDate: string) => void
  /** Datas atualmente aplicadas, para preencher os campos. */
  startDate: string
  endDate: string
  /** Desabilita o botao enquanto uma busca esta em andamento. */
  loading: boolean
}

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 16px;
  align-items: end;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const SearchField = styled(Field)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-column: 1 / -1;
  }
`

const Input = styled.input`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 12px;
  font-size: 0.95rem;
  color-scheme: dark;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 11px 22px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

/**
 * Barra de filtros: busca por nome (instantanea) e filtro por intervalo de datas
 * (aplicado ao submeter o formulario).
 */
export function Filters({
  searchTerm,
  onSearchTermChange,
  onDateFilter,
  startDate,
  endDate,
  loading,
}: FiltersProps) {
  const [localStart, setLocalStart] = useState(startDate)
  const [localEnd, setLocalEnd] = useState(endDate)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onDateFilter(localStart, localEnd)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <SearchField>
        Buscar pelo nome do asteroide
        <Input
          type="search"
          placeholder="Ex.: 2021 KO2"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </SearchField>

      <Field>
        Data inicial
        <Input
          type="date"
          value={localStart}
          max={localEnd}
          onChange={(e) => setLocalStart(e.target.value)}
        />
      </Field>

      <Field>
        Data final
        <Input
          type="date"
          value={localEnd}
          min={localStart}
          onChange={(e) => setLocalEnd(e.target.value)}
        />
      </Field>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? 'Buscando...' : 'Filtrar'}
      </SubmitButton>
    </Form>
  )
}
