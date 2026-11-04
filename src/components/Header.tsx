import styled from 'styled-components'

const Wrapper = styled.header`
  position: relative;
  padding: 40px 0 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(
    180deg,
    rgba(11, 61, 145, 0.25) 0%,
    transparent 100%
  );
`

const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
    gap: 14px;
  }
`

const Logo = styled.div`
  flex-shrink: 0;
  filter: drop-shadow(0 0 12px rgba(79, 195, 247, 0.4));
`

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1.1;
  text-transform: uppercase;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.5rem;
  }
`

/** Logo "meatball" da NASA desenhado em SVG (azul + orbita + estrelas). */
function NasaLogo() {
  return (
    <svg width="72" height="72" viewBox="0 0 100 100" aria-label="Logo NASA">
      <circle cx="50" cy="50" r="48" fill="#0b3d91" />
      {/* estrelas */}
      <g fill="#ffffff">
        <circle cx="30" cy="30" r="1.1" />
        <circle cx="42" cy="24" r="0.9" />
        <circle cx="60" cy="28" r="1.2" />
        <circle cx="70" cy="38" r="0.8" />
        <circle cx="34" cy="42" r="0.8" />
        <circle cx="66" cy="55" r="1" />
      </g>
      {/* orbita vermelha */}
      <path
        d="M14 62 Q 50 40 88 46"
        stroke="#fc3d21"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* faixa/rastro */}
      <path
        d="M22 70 Q 55 58 82 70"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
        opacity="0.85"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="Orbitron, sans-serif"
        fontWeight="900"
        fontSize="20"
        fill="#ffffff"
        letterSpacing="1"
      >
        NASA
      </text>
    </svg>
  )
}

/** Cabecalho com a identidade visual da NASA e titulo da aplicacao. */
export function Header() {
  return (
    <Wrapper>
      <Inner>
        <Logo>
          <NasaLogo />
        </Logo>
        <Title>AstroWatch</Title>
      </Inner>
    </Wrapper>
  )
}
