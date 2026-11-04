/**
 * Utilitarios de formatacao numerica para exibicao na interface.
 *
 * Todos usam o locale 'pt-BR', garantindo separador de milhar com ponto
 * e separador decimal com virgula (ex.: 16.718.435 km).
 * Centralizar a formatacao aqui mantem a apresentacao consistente em toda a UI.
 */

/** Formata um numero como distancia em km, sem casas decimais (ex.: "16.718.435 km"). */
export function formatKm(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km`
}

/**
 * Formata um diametro em km com 3 casas decimais (ex.: "0,224 km").
 * Diametros de asteroides costumam ser frações de quilometro, por isso as casas decimais.
 */
export function formatDiameterKm(value: number): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} km`
}

/** Formata uma velocidade em km/h, sem casas decimais (ex.: "49.346 km/h"). */
export function formatVelocity(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km/h`
}
