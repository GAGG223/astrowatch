/**
 * Configuracao global dos testes (Vitest).
 *
 * - Registra os matchers do jest-dom (toBeInTheDocument, toBeDisabled, ...).
 * - Desmonta os componentes renderizados ao fim de cada teste, para que um
 *   teste nunca "enxergue" o DOM deixado pelo anterior.
 */
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
