import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "@/features/tasks/tasksApi";
import uiReducer from "@/features/ui/uiSlice";
import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
    ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
});

export default store;
