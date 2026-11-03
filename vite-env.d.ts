/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Chave de API da NASA (https://api.nasa.gov/). Opcional: usa DEMO_KEY como fallback. */
  readonly VITE_NASA_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
