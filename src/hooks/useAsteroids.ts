import { useCallback, useEffect, useState } from 'react'
import { fetchAsteroids, NasaApiError } from '../services/nasaApi'
import type { Asteroid } from '../types/nasa'
import { getLast7DaysRange } from '../utils/date'

interface UseAsteroidsResult {
  asteroids: Asteroid[]
  loading: boolean
  error: string | null
  /** Dispara uma nova busca para o intervalo informado. */
  search: (startDate: string, endDate: string) => void
}

/**
 * Hook responsavel por buscar e manter o estado dos asteroides.
 * Na montagem, carrega automaticamente o intervalo dos ultimos 7 dias.
 */
export function useAsteroids(): UseAsteroidsResult {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAsteroids(startDate, endDate)
      setAsteroids(result)
    } catch (err) {
      const message =
        err instanceof NasaApiError
          ? err.message
          : 'Ocorreu um erro inesperado ao buscar os asteroides.'
      setError(message)
      setAsteroids([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Carga inicial: ultimos 7 dias.
  useEffect(() => {
    const { startDate, endDate } = getLast7DaysRange()
    void search(startDate, endDate)
  }, [search])

  return { asteroids, loading, error, search }
}
