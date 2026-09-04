/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly QUASAR_VUE_ROUTER_MODE: 'hash' | 'history';
  readonly QUASAR_VUE_ROUTER_BASE: string;
  readonly QUASAR_MODE: string;
  readonly QUASAR_PROD: boolean;
}
