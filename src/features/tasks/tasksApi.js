import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "/api/tasks/",
    // Configurar timeout para evitar requisições longas
    timeout: 10000,
  }),
  tagTypes: ["Task"],
  // Configurações de cache avançadas
  refetchOnMountOrArgChange: 30, // Recarregar dados se não tiverem sido atualizados há 30s
  refetchOnReconnect: true,       // Recarregar quando reconectar à internet
  keepUnusedDataFor: 300,         // Manter dados não utilizados em cache por 5 minutos
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "",
      providesTags: ["Task"],
      // Cache estratégico para lista de tarefas
      keepUnusedDataFor: 60, // Manter por 1 minuto (mais agressivo que o padrão)
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: "",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
      // Otimista update: atualizar cache antes de confirmar no servidor
      async onQueryStarted(newTask, { dispatch, queryFulfilled }) {
        // Tentar atualizar cache otimisticamente
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            draft.push({ ...newTask, _id: Date.now().toString() });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateTask: builder.mutation({
      query: (task) => ({
        url: "",
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Task"],
      // Otimista update para edição
      async onQueryStarted(updatedTask, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            const index = draft.findIndex((t) => t._id === updatedTask._id);
            if (index !== -1) {
              draft[index] = updatedTask;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: "",
        method: "DELETE",
        body: { _id: taskId },
      }),
      invalidatesTags: ["Task"],
      // Otimista update para deleção
      async onQueryStarted(taskId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            return draft.filter((t) => t._id !== taskId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
