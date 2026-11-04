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

/** Diferenca maxima, em dias, aceita pela API NeoWs entre start_date e end_date. */
export const MAX_RANGE_DAYS = 7

/**
 * Calcula quantos dias existem entre duas datas YYYY-MM-DD (end - start).
 * Usa UTC para que horario de verao/fuso nao alterem a contagem.
 */
export function daysBetween(startDate: string, endDate: string): number {
  const [sy, sm, sd] = startDate.split('-').map(Number)
  const [ey, em, ed] = endDate.split('-').map(Number)
  const start = Date.UTC(sy, sm - 1, sd)
  const end = Date.UTC(ey, em - 1, ed)
  return Math.round((end - start) / 86_400_000)
}

/**
 * Valida o intervalo escolhido pelo usuario antes de consultar a API.
 *
 * @returns mensagem de erro em portugues, ou null quando o intervalo e valido
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
): string | null {
  if (!startDate || !endDate) {
    return 'Informe a data inicial e a data final.'
  }
  const diff = daysBetween(startDate, endDate)
  if (diff < 0) {
    return 'A data inicial nao pode ser depois da data final.'
  }
  if (diff > MAX_RANGE_DAYS) {
    return `O intervalo maximo permitido pela API e de ${MAX_RANGE_DAYS} dias.`
  }
  return null
}

/**
 * Rotulo amigavel para o titulo de um dia na lista:
 * "Hoje", "Ontem" ou o dia da semana seguido da data (ex.: "Sabado, 01/11/2026").
 *
 * @param isoDate data no formato YYYY-MM-DD
 * @param today   referencia de "hoje" (injetavel para facilitar os testes)
 */
export function formatDayLabel(isoDate: string, today: Date = new Date()): string {
  const todayIso = toApiDate(today)
  const diff = daysBetween(isoDate, todayIso)
  if (diff === 0) return `Hoje, ${formatDateBR(isoDate)}`
  if (diff === 1) return `Ontem, ${formatDateBR(isoDate)}`

  const [year, month, day] = isoDate.split('-').map(Number)
  const weekday = new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'long',
  })
  // Primeira letra maiuscula: "sabado" -> "Sabado".
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  return `${capitalized}, ${formatDateBR(isoDate)}`
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
