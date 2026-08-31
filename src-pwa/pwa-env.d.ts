/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly QUASAR_SERVICE_WORKER_FILE: string;
  readonly QUASAR_PWA_FALLBACK_HTML: string;
  readonly QUASAR_PWA_SERVICE_WORKER_REGEX: string;
  readonly QUASAR_PROD: boolean;
}
