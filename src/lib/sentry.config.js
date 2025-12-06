/**
 * Sentry Configuration File
 * Gerado automaticamente pelo CLI Sentry
 * 
 * Para obter seu DSN:
 * 1. Acesse https://sentry.io
 * 2. Create a new project (Next.js)
 * 3. Copie o DSN
 * 4. Adicione como environment variable: NEXT_PUBLIC_SENTRY_DSN
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.NODE_ENV;

if (SENTRY_DSN) {
  Sentry.init({
    // DSN do projeto Sentry
    dsn: SENTRY_DSN,

    // Ambiente de deployment
    environment: SENTRY_ENVIRONMENT,

    // Release version
    release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

    // Rastreamento de performance
    tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,

    // Capturar replays de erro (vídeo do que aconteceu)
    replaysSessionSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0, // Se houver erro, sempre capturar

    // Integração com HTTP
    httpClient: {
      breadcrumbs: true,
      timeout: 10000,
    },

    // Ignorar erros comuns que não precisam de tracking
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      "chrome-extension://",
      "moz-extension://",
      
      // Erros de rede normais
      "NetworkError",
      "Network request failed",
      
      // Erros de user (ignorar)
      "AbortError",
      "Aborted",
    ],

    // Denylist de URLs a ignorar
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      
      // Bibliotecas de third-party que sabemos que têm erros
      /graph\.instagram\.com/i,
      /connect\.facebook\.net/i,
    ],

    // Integração com Session Replay
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Debug mode
    debug: SENTRY_ENVIRONMENT === "development",

    // Before send - filtrar eventos
    beforeSend(event, hint) {
      // Ignorar erros em desenvolvimento
      if (SENTRY_ENVIRONMENT === "development") {
        console.log("Sentry Event (development):", event);
      }

      // Filtrar PII (Personally Identifiable Information)
      if (event.request?.url) {
        event.request.url = event.request.url.replace(/\/user\/\d+/g, "/user/[id]");
      }

      return event;
    },

    // Attachments
    attachStacktrace: true,
    maxAttachmentSize: 1024 * 1024 * 10, // 10MB

    // Middleware para Next.js
    autoSessionTracking: true,
    spotlightBroadcasterUrl: undefined,
  });
}

export default SENTRY_DSN;
