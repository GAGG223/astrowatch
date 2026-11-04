/**
 * AsteroidList — renderiza a grade (grid) de asteroides.
 *
 * Componente de apresentacao puro: recebe a lista ja pronta via props e
 * delega a exibicao de cada item ao AsteroidCard. Nao contem logica de dados.
 */
import styled from 'styled-components'
import type { Asteroid } from '../types/nasa'
import { AsteroidCard } from './AsteroidCard'

interface AsteroidListProps {
  /** Lista de asteroides ja filtrada/normalizada a ser exibida. */
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

export function AsteroidList({ asteroids }: AsteroidListProps) {
  return (
    <Grid>
      {/* key={asteroid.id} ajuda o React a reconciliar a lista de forma eficiente. */}
      {asteroids.map((asteroid) => (
        <AsteroidCard key={asteroid.id} asteroid={asteroid} />
      ))}
    </Grid>
  )
}
