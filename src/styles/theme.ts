/** Tema central da aplicacao. Inspirado na identidade visual da Olos (laranja + grafite). */
export const theme = {
  colors: {
    background: '#0f1115',
    surface: '#1a1d24',
    surfaceAlt: '#22262f',
    border: '#2e333d',
    primary: '#f26a21', // laranja Olos
    primaryDark: '#c9521a',
    text: '#f5f6fa',
    textMuted: '#9aa1ad',
    danger: '#ff5a5a',
    dangerSurface: 'rgba(255, 90, 90, 0.12)',
    safe: '#4caf82',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
  },
  shadow: {
    card: '0 4px 20px rgba(0, 0, 0, 0.35)',
  },
  breakpoints: {
    sm: '640px',
    md: '900px',
  },
} as const

export type Theme = typeof theme
