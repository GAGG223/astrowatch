/**
 * AsteroidList — renderiza a grade (grid) de asteroides.
 *
 * Componente de apresentacao: recebe a lista ja pronta via props e delega a
 * exibicao de cada item ao AsteroidCard. Os cards sao sempre separados por dia
 * de aproximacao, com um titulo para cada dia ("Hoje", "Ontem"...).
 */
import styled from 'styled-components'
import type { Asteroid } from '../types/nasa'
import { groupByDay } from '../utils/asteroids'
import { formatDayLabel } from '../utils/date'
import { AsteroidCard } from './AsteroidCard'

interface AsteroidListProps {
  /** Lista de asteroides ja filtrada e ordenada (dia mais recente primeiro). */
  asteroids: Asteroid[]
}

/**
 * Grid responsivo: cria quantas colunas couberem, cada uma com no minimo
 * 320px. Em telas pequenas, colapsa para uma unica coluna automaticamente.
 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
`

const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const DaySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

// Titulo do dia, com uma linha que se estende ate o fim da largura.
const DayTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`

const DayCount = styled.span`
  font-weight: 500;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

export function AsteroidList({ asteroids }: AsteroidListProps) {
  return (
    <Groups>
      {groupByDay(asteroids).map((group) => (
        <DaySection key={group.date}>
          <DayTitle>
            {formatDayLabel(group.date)}
            <DayCount>
              ({group.asteroids.length}{' '}
              {group.asteroids.length === 1 ? 'asteroide' : 'asteroides'})
            </DayCount>
          </DayTitle>
          <Grid>
            {/* Dentro de um dia (h2), o nome do asteroide vira h3. */}
            {group.asteroids.map((asteroid) => (
              <AsteroidCard key={asteroid.id} asteroid={asteroid} headingLevel="h3" />
            ))}
          </Grid>
        </DaySection>
      ))}
    </Groups>
  )
}
