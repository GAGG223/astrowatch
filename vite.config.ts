/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// base: caminho em que o app e servido no GitHub Pages (https://<user>.github.io/astrowatch/).
export default defineConfig({
  base: '/astrowatch/',
  plugins: [react()],
  test: {
    // jsdom simula o navegador (DOM) para testar componentes React.
    environment: 'jsdom',
    // Executado antes de cada arquivo de teste (matchers do jest-dom, limpeza).
    setupFiles: './src/test/setup.ts',
  },
})
