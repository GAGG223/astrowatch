import styled from 'styled-components'

interface ResultsSummaryProps {
  total: number
  hazardous: number
}

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`

const Count = styled.span`
  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.05rem;
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
