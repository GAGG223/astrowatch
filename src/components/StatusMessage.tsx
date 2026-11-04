/**
 * StatusMessage — componentes de estado da tela.
 *
 * Agrupa as tres telas "de transicao" que substituem a lista quando ela nao
 * pode ser exibida: carregando, erro e vazio. Usa atributos ARIA
 * (role="status" / role="alert") para que leitores de tela anunciem o estado.
 */
import styled from 'styled-components'

// Caixa base centralizada, reutilizada pelos tres estados.
const Box = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  margin: 0 auto 18px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const ErrorBox = styled(Box)`
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.dangerSurface};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.md};
`

const Title = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text};
`

/** Indicador de carregamento. */
export function Loading() {
  return (
    <Box role="status" aria-live="polite">
      <Spinner />
      Carregando asteroides...
    </Box>
  )
}

/** Mensagem de erro de busca. Recebe a mensagem ja tratada pelo service/hook. */
export function ErrorState({ message }: { message: string }) {
  return (
    <ErrorBox role="alert">
      <Title>Nao foi possivel carregar os dados</Title>
      {message}
    </ErrorBox>
  )
}

/** Estado vazio: nenhuma correspondencia encontrada. */
export function EmptyState() {
  return (
    <Box>
      <Title>Nenhum asteroide encontrado</Title>
      Ajuste o intervalo de datas ou o termo de busca e tente novamente.
    </Box>
  )
}
