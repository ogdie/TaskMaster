/**
 * Exemplo de Uso: Error Tracking com RTK Query
 * 
 * Como integrar error tracking com RTK Query mutations
 */

import { useErrorTracking } from "@/hooks/useErrorTracking";
import { useDispatch } from "react-redux";
import { tasksApi } from "@/features/tasks/tasksApi";

/**
 * Hook customizado para mutations com error tracking
 */
export function useTrackedMutation(mutationHook) {
  const { trackMutationError } = useErrorTracking();
  const dispatch = useDispatch();

  return (mutationName) => {
    const [mutation, result] = mutationHook();

    const wrappedMutation = async (data) => {
      try {
        const response = await mutation(data).unwrap();
        return response;
      } catch (error) {
        // Rastrear erro com contexto
        trackMutationError(mutationName, error, data);
        
        // Re-lançar erro para handler do componente
        throw error;
      }
    };

    return [wrappedMutation, result];
  };
}

/**
 * Exemplo de uso em componente
 */
export function ExampleTaskForm() {
  const { trackFetchError, trackMutationError } = useErrorTracking();
  const [createTask] = tasksApi.useCreateTaskMutation();

  const handleSubmit = async (formData) => {
    try {
      // Usar trackFetchError para requisições HTTP
      const response = await trackFetchError("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("✅ Task created:", data);
    } catch (error) {
      // Erro já foi rastreado, apenas mostrar para usuário
      console.error("Falha ao criar tarefa");
    }
  };

  const handleMutation = async (formData) => {
    try {
      const result = await createTask(formData).unwrap();
      console.log("✅ Task created via mutation:", result);
    } catch (error) {
      // RTK Query já captura, mas você pode adicionar contexto
      trackMutationError("createTask", error, formData);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ title: "Nova tarefa" });
    }}>
      <button type="submit">Criar Tarefa</button>
    </form>
  );
}

/**
 * Integração automática com Sentry em handler de erros global
 */
export function setupGlobalErrorHandlers() {
  // Capturar erros não tratados
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        import("@sentry/nextjs").then(({ captureException }) => {
          captureException(event.error, {
            contexts: {
              runtime: {
                type: "uncaughtError",
              },
            },
          });
        });
      }
    });

    // Capturar promessas rejeitadas
    window.addEventListener("unhandledrejection", (event) => {
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        import("@sentry/nextjs").then(({ captureException }) => {
          captureException(event.reason, {
            contexts: {
              runtime: {
                type: "unhandledRejection",
              },
            },
          });
        });
      }
    });
  }
}
