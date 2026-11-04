/**
 * Ponto de entrada da aplicacao.
 *
 * Responsavel por "montar" o React na pagina (no elemento #root do index.html)
 * e por envolver a aplicacao com os provedores globais:
 * - ThemeProvider: disponibiliza o tema (cores, espacamentos) a todos os
 *   componentes estilizados com styled-components.
 * - GlobalStyle: aplica o reset e os estilos globais (fundo, fontes, etc.).
 * - React.StrictMode: ativa verificacoes extras do React em desenvolvimento.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
// Fontes hospedadas junto com o app (sem depender do Google Fonts). So os pesos usados:
// - Orbitron: marca (titulo AstroWatch e logo)
// - Space Grotesk: nomes dos asteroides, numeros e botoes
// - Inter: texto corrido
import '@fontsource/orbitron/900.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import { App } from './App'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './styles/theme'

// Cria a raiz do React no elemento #root e renderiza a arvore de componentes.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
