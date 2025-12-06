/**
 * Sentry Server-side Initialization
 * Arquivo especial do Next.js para instrumentação do servidor
 * 
 * Localização: src/instrumentation.ts (ou .js)
 * Next.js carrega automaticamente ao iniciar
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export async function register() {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

      // Performance monitoring no servidor
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

      // Server-side options
      serverName: process.env.VERCEL_ENV || "local",
      beforeSend(event) {
        // Não enviar eventos de desenvolvimento
        if (process.env.NODE_ENV === "development") {
          console.log("[Sentry] Event captured:", event.exception);
        }
        return event;
      },
    });

    console.log("✅ Sentry initialized (server-side)");
  }
}
