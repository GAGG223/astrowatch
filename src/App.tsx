import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { AsteroidList } from './components/AsteroidList'
import { Filters } from './components/Filters'
import { Header } from './components/Header'
import { ResultsSummary } from './components/ResultsSummary'
import { EmptyState, ErrorState, Loading } from './components/StatusMessage'
import { useAsteroids } from './hooks/useAsteroids'
import { getLast7DaysRange } from './utils/date'

const Main = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: 28px 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const initialRange = getLast7DaysRange()

/** Componente raiz: orquestra filtros, busca e renderizacao da lista. */
export function App() {
  const { asteroids, loading, error, search } = useAsteroids()

  const [searchTerm, setSearchTerm] = useState('')
  const [range, setRange] = useState(initialRange)

  // Busca por nome aplicada no cliente sobre o resultado ja carregado.
  const filteredAsteroids = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return asteroids
    return asteroids.filter((a) => a.name.toLowerCase().includes(term))
  }, [asteroids, searchTerm])

  const hazardousCount = useMemo(
    () => filteredAsteroids.filter((a) => a.isHazardous).length,
    [filteredAsteroids],
  )

  function handleDateFilter(startDate: string, endDate: string) {
    setRange({ startDate, endDate })
    search(startDate, endDate)
  }

  function renderContent() {
    if (loading) return <Loading />
    if (error) return <ErrorState message={error} />
    if (filteredAsteroids.length === 0) return <EmptyState />
    return <AsteroidList asteroids={filteredAsteroids} />
  }

  return (
    <>
      <Header />
      <Main>
        <Filters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onDateFilter={handleDateFilter}
          startDate={range.startDate}
          endDate={range.endDate}
          loading={loading}
        />

        {!loading && !error && (
          <ResultsSummary
            total={filteredAsteroids.length}
            hazardous={hazardousCount}
          />
        )}

        {renderContent()}
      </Main>
    </>
  )
}
