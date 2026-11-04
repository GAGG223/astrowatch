/**
 * Helper de teste: renderiza um componente dentro do ThemeProvider.
 *
 * Os componentes usam `theme.colors...` do styled-components; sem o provider
 * o tema seria indefinido e a renderizacao quebraria.
 */
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme'

export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}
