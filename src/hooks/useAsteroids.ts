import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchAsteroids, NasaApiError } from '../services/nasaApi'
import type { Asteroid } from '../types/nasa'
import { getLast7DaysRange } from '../utils/date'

interface UseAsteroidsResult {
  asteroids: Asteroid[]
  /** Carregamento "cheio" (tela de loading) — apenas para buscas disparadas pelo usuario. */
  loading: boolean
  /** Atualizacao em segundo plano em andamento (auto-refresh), sem bloquear a UI. */
  refreshing: boolean
  error: string | null
  /** Momento da ultima atualizacao bem-sucedida (null antes da primeira). */
  lastUpdated: Date | null
  /** Dispara uma nova busca para o intervalo informado (mostra tela de loading). */
  search: (startDate: string, endDate: string) => void
  /** Reexecuta a busca do intervalo atual em segundo plano (botao "Atualizar agora"). */
  refresh: () => void
  /**
   * Recarrega os ultimos 7 dias a partir da data atual, em segundo plano.
   * Usado na virada do dia para trazer o intervalo mais recente.
   */
  reloadLatest: () => void
}

/**
 * Hook responsavel por buscar e manter o estado dos asteroides.
 *
 * Diferencia dois tipos de busca:
 * - `search`: acionada pelo usuario (filtro/carga inicial) -> usa `loading`.
 * - `refresh`: reexecuta o intervalo atual em segundo plano -> usa `refreshing`,
 *   mantendo a lista visivel enquanto atualiza (ideal para o auto-refresh).
 */
export function useAsteroids(): UseAsteroidsResult {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Guarda o ultimo intervalo buscado para que o refresh saiba o que recarregar.
  const rangeRef = useRef(getLast7DaysRange())

  // Controla a requisicao em andamento para evitar "corrida" entre buscas:
  // se o usuario dispara uma nova busca, a anterior e cancelada e sua resposta
  // (mesmo que chegue depois) nunca sobrescreve o resultado mais recente.
  const abortRef = useRef<AbortController | null>(null)

  /**
   * Executa a busca. Quando `silent` e true, nao exibe a tela de loading
   * (usado pelo auto-refresh), apenas o indicador de "refreshing".
   */
  const run = useCallback(
    async (startDate: string, endDate: string, silent: boolean) => {
      // Cancela a busca anterior (se houver) e registra esta como a vigente.
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const result = await fetchAsteroids(startDate, endDate, controller.signal)
        // Resposta de uma busca ja substituida por outra mais nova: descarta.
        if (controller.signal.aborted) return
        setAsteroids(result)
        setLastUpdated(new Date())
      } catch (err) {
        // Busca cancelada por uma mais nova: nao e erro e nao mexe no estado.
        if (controller.signal.aborted) return

        const message =
          err instanceof NasaApiError
            ? err.message
            : 'Ocorreu um erro inesperado ao buscar os asteroides.'
        setError(message)
        // Num refresh silencioso, preservamos a lista anterior para nao esvaziar a tela.
        if (!silent) {
          setAsteroids([])
        }
      } finally {
        // So a busca vigente encerra os indicadores; uma cancelada nao pode
        // desligar o "carregando" da busca que a substituiu.
        if (abortRef.current === controller) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    },
    [],
  )

  const search = useCallback(
    (startDate: string, endDate: string) => {
      rangeRef.current = { startDate, endDate }
      void run(startDate, endDate, false)
    },
    [run],
  )

  const refresh = useCallback(() => {
    const { startDate, endDate } = rangeRef.current
    void run(startDate, endDate, true)
  }, [run])

  const reloadLatest = useCallback(() => {
    const latest = getLast7DaysRange()
    rangeRef.current = latest
    void run(latest.startDate, latest.endDate, true)
  }, [run])

  // Carga inicial: ultimos 7 dias. No cleanup, cancela a requisicao pendente
  // (ao desmontar ou no segundo ciclo do StrictMode em desenvolvimento).
  useEffect(() => {
    const { startDate, endDate } = rangeRef.current
    void run(startDate, endDate, false)
    return () => abortRef.current?.abort()
  }, [run])

  return {
    asteroids,
    loading,
    refreshing,
    error,
    lastUpdated,
    search,
    refresh,
    reloadLatest,
  }
}
