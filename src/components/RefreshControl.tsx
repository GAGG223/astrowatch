/**
 * RefreshControl — barra de atualizacao manual.
 *
 * Contem o botao "Atualizar agora" (com icone girando enquanto busca) e o
 * indicador da data/hora da ultima atualizacao bem-sucedida. A atualizacao
 * automatica na virada do dia e tratada separadamente (hook useDayChange).
 */
import styled from 'styled-components'

interface RefreshControlProps {
  /** Indica se ha uma atualizacao em andamento. */
  refreshing: boolean
  /** Momento da ultima atualizacao bem-sucedida. */
  lastUpdated: Date | null
  /** Dispara uma atualizacao manual imediata. */
  onRefreshNow: () => void
}

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 20px;
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px 18px;
`

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadow.glow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Icon = styled.span<{ $spinning: boolean }>`
  display: inline-block;
  font-size: 0.95rem;
  animation: ${({ $spinning }) =>
    $spinning ? 'spin 0.9s linear infinite' : 'none'};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const Status = styled.span`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Dot = styled.span<{ $live: boolean }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ theme, $live }) =>
    $live ? theme.colors.safe : theme.colors.textMuted};
  box-shadow: ${({ theme, $live }) =>
    $live ? `0 0 8px ${theme.colors.safe}` : 'none'};
`

function formatDateTime(date: Date): string {
  const dia = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const hora = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return `${dia} as ${hora}`
}

/**
 * Controle de atualizacao manual: botao "Atualizar agora" e indicador
 * da ultima atualizacao bem-sucedida. A atualizacao automatica ocorre
 * apenas na virada do dia (tratada no App).
 */
export function RefreshControl({
  refreshing,
  lastUpdated,
  onRefreshNow,
}: RefreshControlProps) {
  return (
    <Bar>
      <RefreshButton type="button" onClick={onRefreshNow} disabled={refreshing}>
        <Icon $spinning={refreshing}>↻</Icon>
        {refreshing ? 'Atualizando' : 'Atualizar agora'}
      </RefreshButton>

      <Status>
        <Dot $live={!refreshing} />
        {lastUpdated
          ? `Atualizado em ${formatDateTime(lastUpdated)}`
          : 'Aguardando...'}
      </Status>
    </Bar>
  )
}
