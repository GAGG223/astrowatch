import { describe, expect, it } from 'vitest'
import {
  formatApproachTime,
  formatDiameterKm,
  formatKm,
  formatVelocity,
} from './format'

describe('formatKm', () => {
  it('usa ponto como separador de milhar e nenhuma casa decimal', () => {
    expect(formatKm(16718435.399)).toBe('16.718.435 km')
    expect(formatKm(0)).toBe('0 km')
  })
})

describe('formatDiameterKm', () => {
  it('usa virgula decimal com 3 casas', () => {
    expect(formatDiameterKm(0.2241583786)).toBe('0,224 km')
    expect(formatDiameterKm(1)).toBe('1,000 km')
  })
})

describe('formatVelocity', () => {
  it('formata em km/h sem casas decimais', () => {
    expect(formatVelocity(49346.0485)).toBe('49.346 km/h')
  })
})

describe('formatApproachTime', () => {
  it('retorna null quando o horario nao esta disponivel (epoch 0)', () => {
    expect(formatApproachTime(0)).toBeNull()
  })

  it('formata um epoch valido como HH:MM', () => {
    // Nao fixamos o valor exato porque depende do fuso de quem roda o teste.
    expect(formatApproachTime(1793836800000)).toMatch(/^\d{2}:\d{2}$/)
  })
})
