import styled from 'styled-components'
import type { Asteroid } from '../types/nasa'
import { AsteroidCard } from './AsteroidCard'

interface AsteroidListProps {
  asteroids: Asteroid[]
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
`

/** Grade responsiva de cartoes de asteroides. */
export function AsteroidList({ asteroids }: AsteroidListProps) {
  return (
    <Grid>
      {asteroids.map((asteroid) => (
        <AsteroidCard key={asteroid.id} asteroid={asteroid} />
      ))}
    </Grid>
  )
}
