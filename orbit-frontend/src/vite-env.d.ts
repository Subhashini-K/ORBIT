/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Orbit API server. Defaults to http://localhost:4000 if unset. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
