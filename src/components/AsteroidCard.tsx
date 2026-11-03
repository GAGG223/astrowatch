import styled from 'styled-components'
import type { Asteroid } from '../types/nasa'
import { formatDateBR } from '../utils/date'
import { formatDiameterKm, formatKm, formatVelocity } from '../utils/format'

interface AsteroidCardProps {
  asteroid: Asteroid
}

const Card = styled.article<{ $hazardous: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $hazardous }) =>
      $hazardous ? theme.colors.danger : theme.colors.border};
  border-left: 4px solid
    ${({ theme, $hazardous }) =>
      $hazardous ? theme.colors.danger : theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: ${({ theme }) => theme.shadow.card};
`

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`

const Name = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  word-break: break-word;
`

const HazardBadge = styled.span`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.dangerSurface};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Attributes = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`

const Attribute = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  dt {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  dd {
    font-size: 0.98rem;
    font-weight: 600;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 12px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

/**
 * Cartao que exibe um asteroide com todos os dados exigidos pelo desafio:
 * nome, diametro min/max (km), distancia da Terra e aviso de perigo.
 */
export function AsteroidCard({ asteroid }: AsteroidCardProps) {
  return (
    <Card $hazardous={asteroid.isHazardous}>
      <Head>
        <Name>{asteroid.name}</Name>
        {asteroid.isHazardous && (
          <HazardBadge title="Asteroide potencialmente perigoso">
            ⚠ Perigoso
          </HazardBadge>
        )}
      </Head>

      <Attributes>
        <Attribute>
          <dt>Diametro minimo</dt>
          <dd>{formatDiameterKm(asteroid.diameterMinKm)}</dd>
        </Attribute>
        <Attribute>
          <dt>Diametro maximo</dt>
          <dd>{formatDiameterKm(asteroid.diameterMaxKm)}</dd>
        </Attribute>
        <Attribute>
          <dt>Distancia da Terra</dt>
          <dd>{formatKm(asteroid.missDistanceKm)}</dd>
        </Attribute>
        <Attribute>
          <dt>Velocidade relativa</dt>
          <dd>{formatVelocity(asteroid.velocityKmh)}</dd>
        </Attribute>
      </Attributes>

      <Footer>
        <span>Aproximacao: {formatDateBR(asteroid.approachDate)}</span>
        <a href={asteroid.jplUrl} target="_blank" rel="noopener noreferrer">
          Ver na NASA ↗
        </a>
      </Footer>
    </Card>
  )
}
