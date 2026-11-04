import { createGlobalStyle } from 'styled-components'

/**
 * Estilos globais da aplicacao.
 * Cria um fundo de "universo": gradiente escuro do cosmos + um campo de
 * estrelas desenhado com multiplos box-shadow (sem imagens externas).
 */
export const GlobalStyle = createGlobalStyle`
  /* As fontes (Orbitron, Space Grotesk e Inter) sao carregadas em main.tsx via @fontsource. */

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    background:
      radial-gradient(ellipse at 20% 0%, rgba(124, 77, 255, 0.18), transparent 45%),
      radial-gradient(ellipse at 80% 10%, rgba(11, 61, 145, 0.25), transparent 50%),
      linear-gradient(180deg, ${({ theme }) => theme.colors.backgroundTop} 0%, ${({ theme }) => theme.colors.backgroundBottom} 70%);
    background-attachment: fixed;
    position: relative;
    overflow-x: hidden;
  }

  /* Campo de estrelas: duas camadas de pontos com densidades diferentes */
  body::before,
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  body::before {
    background-image:
      radial-gradient(1px 1px at 25% 15%, #ffffff, transparent),
      radial-gradient(1px 1px at 60% 35%, #ffffff, transparent),
      radial-gradient(1px 1px at 85% 20%, #cfe3ff, transparent),
      radial-gradient(1px 1px at 10% 55%, #ffffff, transparent),
      radial-gradient(1px 1px at 45% 70%, #e2ecff, transparent),
      radial-gradient(1px 1px at 75% 65%, #ffffff, transparent),
      radial-gradient(1px 1px at 90% 85%, #cfe3ff, transparent),
      radial-gradient(1px 1px at 30% 90%, #ffffff, transparent),
      radial-gradient(2px 2px at 15% 30%, #ffffff, transparent),
      radial-gradient(2px 2px at 70% 50%, #bcd4ff, transparent);
    background-size: 100% 100%;
    opacity: 0.8;
  }

  /* Estrelas que piscam suavemente */
  body::after {
    background-image:
      radial-gradient(1px 1px at 35% 25%, #ffffff, transparent),
      radial-gradient(1px 1px at 55% 10%, #9fc0ff, transparent),
      radial-gradient(1px 1px at 20% 80%, #ffffff, transparent),
      radial-gradient(1px 1px at 80% 75%, #ffffff, transparent),
      radial-gradient(1px 1px at 50% 55%, #cfe3ff, transparent);
    animation: twinkle 4s ease-in-out infinite alternate;
  }

  @keyframes twinkle {
    from { opacity: 0.25; }
    to { opacity: 0.75; }
  }

  #root {
    position: relative;
    z-index: 1;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input {
    font-family: inherit;
  }

  @media (prefers-reduced-motion: reduce) {
    body::after {
      animation: none;
    }
  }
`
