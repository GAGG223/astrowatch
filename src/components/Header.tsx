import styled from 'styled-components'

const Wrapper = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 3px solid ${({ theme }) => theme.colors.primary};
  padding: 28px 0;
`

const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
`

const Title = styled.h1`
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 0.5px;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Subtitle = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
`

/** Cabecalho da aplicacao com titulo e breve descricao. */
export function Header() {
  return (
    <Wrapper>
      <Inner>
        <Title>
          Asteroides <span>NeoWs</span>
        </Title>
        <Subtitle>
          Asteroides que se aproximaram da Terra, via API da NASA
        </Subtitle>
      </Inner>
    </Wrapper>
  )
}
