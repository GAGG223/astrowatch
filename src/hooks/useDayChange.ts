import { useEffect, useRef } from 'react'
import { toApiDate } from '../utils/date'

/**
 * Dispara `onDayChange` quando a data local muda (virada do dia).
 *
 * Em vez de um timer curto, verifica a data a cada minuto e compara com a
 * ultima data conhecida. Assim o custo e minimo e a atualizacao so acontece
 * quando realmente entra um novo dia no intervalo dos ultimos 7 dias.
 */
export function useDayChange(onDayChange: () => void): void {
  const savedCallback = useRef(onDayChange)
  const currentDayRef = useRef(toApiDate(new Date()))

  useEffect(() => {
    savedCallback.current = onDayChange
  }, [onDayChange])

  useEffect(() => {
    // Verifica a cada 60s; leve o suficiente para nao impactar desempenho.
    const id = setInterval(() => {
      const today = toApiDate(new Date())
      if (today !== currentDayRef.current) {
        currentDayRef.current = today
        savedCallback.current()
      }
    }, 60 * 1000)

    return () => clearInterval(id)
  }, [])
}
