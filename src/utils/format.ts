/** Utilitarios de formatacao numerica (locale pt-BR). */

/** Formata um numero em km com separador de milhar e 0 casas decimais. */
export function formatKm(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km`
}

/** Formata um diametro em km com 3 casas decimais. */
export function formatDiameterKm(value: number): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} km`
}

/** Formata uma velocidade em km/h com separador de milhar. */
export function formatVelocity(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km/h`
}
