/**
 * Hook para Capturar e Rastrear Erros em Requisições
 * Uso: const { data, error } = useErrorTracking(() => fetch(...))
 */

"use client";

import { useCallback } from "react";
import * as Sentry from "@sentry/nextjs";

export function useErrorTracking() {
  const captureError = useCallback((error, context = {}) => {
    if (!error) return;

    // Enviar para Sentry
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, {
        contexts: {
          request: context,
        },
        tags: {
          errorTracking: "true",
        },
      });
    }

    // Log no console
    console.error("❌ Error captured:", error, context);

    // Retornar erro formatado
    return {
      message: error.message || "Erro desconhecido",
      status: error.status || 500,
      context,
    };
  }, []);

  const trackFetchError = useCallback(
    async (url, options = {}) => {
      try {
        const response = await fetch(url, options);

        // Se status não OK, capturar como erro
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          );
          error.status = response.status;

          captureError(error, {
            url,
            method: options.method || "GET",
            status: response.status,
            ...errorData,
          });

          throw error;
        }

        return response;
      } catch (error) {
        captureError(error, {
          url,
          method: options.method || "GET",
          type: "fetch",
        });
        throw error;
      }
    },
    [captureError]
  );

  const trackMutationError = useCallback(
    (mutationName, error, variables = {}) => {
      captureError(error, {
        type: "mutation",
        mutation: mutationName,
        variables: sanitizeVariables(variables), // Remover dados sensíveis
      });
    },
    [captureError]
  );

  return {
    captureError,
    trackFetchError,
    trackMutationError,
  };
}

/**
 * Remover dados sensíveis antes de enviar para Sentry
 */
function sanitizeVariables(variables) {
  if (!variables || typeof variables !== "object") return variables;

  const sanitized = { ...variables };
  const sensitiveKeys = ["password", "token", "secret", "apiKey", "credit_card"];

  sensitiveKeys.forEach((key) => {
    if (key in sanitized) {
      sanitized[key] = "[REDACTED]";
    }
  });

  return sanitized;
}
