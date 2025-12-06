/**
 * Error Boundary Component
 * Captura erros React e envia para Sentry
 */

"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({
  error,
  reset,
}: ErrorBoundaryProps) {
  useEffect(() => {
    // Log do erro no Sentry
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: error.stack,
          },
        },
      });
    }

    // Log no console
    console.error("❌ Error captured by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full border-2 border-red-500 rounded-lg p-6 bg-gray-900">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">⚠️</span>
          </div>
          <h1 className="text-red-400 text-2xl font-bold">Algo deu errado!</h1>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-4">
          Desculpe, ocorreu um erro inesperado. Nossos engenheiros foram notificados e estão investigando.
        </p>

        {/* Error Details (apenas em dev) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-800 p-3 rounded mb-4 text-xs text-gray-300 overflow-auto max-h-32">
            <p className="font-bold text-red-400 mb-2">Error Details:</p>
            <pre className="whitespace-pre-wrap break-words">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          </div>
        )}

        {/* Error ID (para referência ao suporte) */}
        {error.digest && (
          <div className="bg-blue-900 bg-opacity-30 border border-blue-400 rounded p-3 mb-4">
            <p className="text-blue-300 text-xs">
              <strong>Error ID:</strong> {error.digest}
            </p>
            <p className="text-blue-300 text-xs mt-1">
              Use este ID ao contatar suporte
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition"
          >
            Voltar ao início
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-xs">
            Precisa de ajuda? Envie um email para{" "}
            <a href="mailto:support@taskmaster.com" className="text-green-400 hover:underline">
              support@taskmaster.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
