import { boot } from 'quasar/wrappers';
import * as Sentry from '@sentry/vue';

import { initLogger } from '@evan/utils/logger';

// See https://sentry.io/eo06/fpl2026/getting-started/javascript-vue/

const PRELOAD_ERRORS = [
  /Loading chunk/i,
  /Failed to fetch dynamically imported module/i,
  /Error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Unable to preload CSS/i,
  /'text\/html' is not a valid JavaScript MIME type/i,
];

export default boot(({ app, router }) => {
  const isProduction = !!process.env.PROD;

  if (isProduction) {
    Sentry.setTag('app.mode', process.env.MODE);
    Sentry.init({
      app,
      dsn: 'https://254c6c119e85db8aee5096d6b786a76d@o4507214700019712.ingest.de.sentry.io/4510390598565968',
      release: process.env.GIT_COMMIT_HASH || 'dev',
      environment: 'production',
      integrations: [Sentry.browserTracingIntegration({ router })],
      enableLogs: true,
      // Ignore some errors: https://docs.sentry.io/platforms/javascript/configuration/filtering/
      // - ResizeObserver loop errors
      // - 'vite:preloadError` equivalent errors
      ignoreErrors: ['ResizeObserver loop', ...PRELOAD_ERRORS],
      // VueOptions: suppress reporting of all props data
      attachProps: false,
    });
  }

  // Initialize logger with Sentry module (or null in dev mode)
  initLogger(isProduction ? Sentry : null, isProduction);
});
