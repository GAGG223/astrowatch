import 'styled-components'
import type { Theme } from './theme'

// Estende o DefaultTheme do styled-components com o nosso tema tipado.
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
