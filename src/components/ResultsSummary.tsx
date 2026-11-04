/**
 * ResultsSummary — barra de resumo exibida acima da lista.
 *
 * Mostra, em destaque, quantos asteroides estao sendo exibidos e quantos
 * sao potencialmente perigosos. Faz o "plural" correto de cada texto.
 */
import styled from 'styled-components'

interface ResultsSummaryProps {
  /** Total de asteroides atualmente exibidos (ja considerando os filtros). */
  total: number
  /** Quantos, desse total, sao potencialmente perigosos. */
  hazardous: number
}

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 28px;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`

const Count = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 8px;

  strong {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
    font-weight: 700;
  }
`

const HazardCount = styled(Count)`
  strong {
    color: ${({ theme }) => theme.colors.danger};
  }
`

/** Resumo com a contagem total de asteroides e quantos sao perigosos. */
export function ResultsSummary({ total, hazardous }: ResultsSummaryProps) {
  return (
    <Bar>
      <Count>
        <strong>{total}</strong> {total === 1 ? 'asteroide' : 'asteroides'}
      </Count>
      <HazardCount>
        <strong>{hazardous}</strong>{' '}
        {hazardous === 1 ? 'potencialmente perigoso' : 'potencialmente perigosos'}
      </HazardCount>
    </Bar>
  )
}
