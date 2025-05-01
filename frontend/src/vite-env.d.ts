/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    VITE_DATABASE_URL: string;
    VITE_DATABASE_KEY: string;
  }

  interface ImportMeta {
    env: ImportMetaEnv;
  }
}
