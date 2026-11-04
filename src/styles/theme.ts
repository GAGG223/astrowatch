/**
 * Tema central da aplicacao.
 * Paleta inspirada no espaco / NASA: azul profundo do cosmos, roxo nebuloso,
 * ciano/azul da Terra e vermelho de alerta para asteroides perigosos.
 */
export const theme = {
  colors: {
    // Fundo do espaco (gradiente aplicado no GlobalStyle)
    background: '#05060f',
    backgroundTop: '#0a0e27',
    backgroundBottom: '#05060f',

    // Superficies (cards, barras) com leve transparencia "glass"
    surface: 'rgba(18, 24, 48, 0.72)',
    surfaceAlt: 'rgba(10, 14, 33, 0.9)',
    surfaceSolid: '#0e1430',
    border: 'rgba(120, 150, 220, 0.18)',
    borderStrong: 'rgba(120, 150, 220, 0.4)',

    // Cores de destaque (cosmos)
    primary: '#4fc3f7', // ciano/azul (Terra, tecnologia)
    primaryDark: '#1e88e5',
    accent: '#7c4dff', // roxo nebulosa
    nasaRed: '#fc3d21', // vermelho oficial da NASA
    nasaBlue: '#0b3d91', // azul oficial da NASA

    // Texto
    text: '#eef2ff',
    textMuted: '#9fb0d9',

    // Estados
    danger: '#ff5a5a',
    dangerSurface: 'rgba(255, 90, 90, 0.14)',
    safe: '#4dd4a0',
  },
  radius: {
    sm: '8px',
    md: '14px',
    lg: '20px',
  },
  shadow: {
    card: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 24px rgba(79, 195, 247, 0.25)',
    glowDanger: '0 0 24px rgba(255, 90, 90, 0.3)',
  },
  breakpoints: {
    sm: '640px',
    md: '900px',
  },
} as const

export type Theme = typeof theme
