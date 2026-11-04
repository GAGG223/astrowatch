import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// base: caminho em que o app e servido no GitHub Pages (https://<user>.github.io/astrowatch/).
export default defineConfig({
  base: '/astrowatch/',
  plugins: [react()],
})
