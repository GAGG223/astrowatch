import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addDays,
  daysBetween,
  formatDateBR,
  getLast7DaysRange,
  toApiDate,
  validateDateRange,
} from './date'

describe('toApiDate', () => {
  it('formata como YYYY-MM-DD com zeros a esquerda', () => {
    expect(toApiDate(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toApiDate(new Date(2026, 10, 3))).toBe('2026-11-03')
  })
})

describe('addDays', () => {
  it('soma e subtrai dias sem alterar a data original', () => {
    const base = new Date(2026, 10, 3)
    expect(toApiDate(addDays(base, -6))).toBe('2026-10-28')
    expect(toApiDate(addDays(base, 1))).toBe('2026-11-04')
    expect(toApiDate(base)).toBe('2026-11-03')
  })
})

describe('formatDateBR', () => {
  it('converte YYYY-MM-DD para DD/MM/YYYY', () => {
    expect(formatDateBR('2026-11-03')).toBe('03/11/2026')
  })

  it('devolve o texto original quando o formato e invalido', () => {
    expect(formatDateBR('invalido')).toBe('invalido')
  })
})

describe('daysBetween', () => {
  it('conta os dias entre duas datas', () => {
    expect(daysBetween('2026-10-27', '2026-11-03')).toBe(7)
    expect(daysBetween('2026-11-03', '2026-11-03')).toBe(0)
  })

  it('retorna negativo quando o inicio e depois do fim', () => {
    expect(daysBetween('2026-11-03', '2026-11-01')).toBe(-2)
  })

  it('nao e afetada por mudanca de horario de verao', () => {
    // 10/03/2026 a 10/04/2026 cruza a mudanca de horario em varios paises.
    expect(daysBetween('2026-03-01', '2026-04-01')).toBe(31)
  })
})

describe('validateDateRange', () => {
  it('aceita um intervalo de ate 7 dias de diferenca', () => {
    expect(validateDateRange('2026-10-27', '2026-11-03')).toBeNull()
    expect(validateDateRange('2026-11-03', '2026-11-03')).toBeNull()
  })

  it('recusa intervalo maior que 7 dias (a API devolve erro 400)', () => {
    expect(validateDateRange('2026-10-26', '2026-11-03')).toMatch(/7 dias/)
  })

  it('recusa data inicial depois da final', () => {
    expect(validateDateRange('2026-11-03', '2026-11-01')).toMatch(/depois/)
  })

  it('recusa campos vazios', () => {
    expect(validateDateRange('', '2026-11-01')).toMatch(/Informe/)
    expect(validateDateRange('2026-11-01', '')).toMatch(/Informe/)
  })
})

describe('getLast7DaysRange', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna hoje e os 6 dias anteriores (7 dias no total)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 3, 12, 0, 0))

    expect(getLast7DaysRange()).toEqual({
      startDate: '2026-10-28',
      endDate: '2026-11-03',
    })
  })

  it('respeita o limite aceito pela API', () => {
    const { startDate, endDate } = getLast7DaysRange()
    expect(validateDateRange(startDate, endDate)).toBeNull()
  })
})
