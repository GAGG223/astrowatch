/** Utilitarios de data usados pela aplicacao. */

/** Formata um objeto Date para o padrao YYYY-MM-DD exigido pela API da NASA. */
export function toApiDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Retorna um novo Date deslocado em "days" dias (aceita valores negativos). */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Converte uma string YYYY-MM-DD em uma data legivel no formato brasileiro
 * (DD/MM/YYYY), evitando problemas de fuso ao interpretar a string como local.
 */
export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

/**
 * Retorna o intervalo padrao dos ultimos 7 dias (incluindo hoje).
 * A API NeoWs aceita no maximo 7 dias entre start_date e end_date.
 */
export function getLast7DaysRange(): { startDate: string; endDate: string } {
  const today = new Date()
  const start = addDays(today, -6)
  return {
    startDate: toApiDate(start),
    endDate: toApiDate(today),
  }
}
