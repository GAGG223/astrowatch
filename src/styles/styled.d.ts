/**
 * Declaracao de tipos do styled-components.
 *
 * Por padrao, o tema (props.theme) do styled-components nao e tipado. Aqui
 * "casamos" o DefaultTheme com o nosso objeto Theme, de modo que, ao escrever
 * ${({ theme }) => theme.colors.primary}, o editor ofereca autocomplete e
 * acuse erro se um nome de cor/espacamento nao existir.
 */
import 'styled-components'
import type { Theme } from './theme'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
