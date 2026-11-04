/**
 * Filters — barra de filtros no topo do conteudo.
 *
 * Reune dois controles:
 * - Busca por nome: "controlada" pelo componente pai (valor e callback vem via props),
 *   aplicada instantaneamente sobre a lista ja carregada.
 * - Filtro por data (inicio/fim): mantido em estado local enquanto o usuario edita e
 *   so disparado ao enviar o formulario, pois gera uma nova requisicao a API.
 */
import { useState } from 'react'
import styled from 'styled-components'
import { validateDateRange } from '../utils/date'

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
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.card};
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

// Mensagem de erro de validacao, ocupa a linha inteira do formulario.
const RangeError = styled.p`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.9rem;
  font-weight: 600;
`

const SubmitButton = styled.button`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primaryDark},
    ${({ theme }) => theme.colors.accent}
  );
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 11px 24px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition:
    filter 0.15s ease,
    box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.15);
    box-shadow: ${({ theme }) => theme.shadow.glow};
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
  // Mensagem de validacao do intervalo (null = intervalo valido).
  const [rangeError, setRangeError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    // Valida antes de consultar a API, evitando o erro 400 de intervalos longos.
    const error = validateDateRange(localStart, localEnd)
    setRangeError(error)
    if (error) return

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

      {/* role="alert" faz leitores de tela anunciarem o erro assim que ele aparece. */}
      {rangeError && <RangeError role="alert">{rangeError}</RangeError>}
    </Form>
  )
}
