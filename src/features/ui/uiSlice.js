import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSignUpModal: false,
  showTaskForm: false,
  editingTask: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSignUpModal: (state) => {
      state.showSignUpModal = true;
    },
    closeSignUpModal: (state) => {
      state.showSignUpModal = false;
    },
    openTaskForm: (state, action) => {
      state.showTaskForm = true;
      state.editingTask = action.payload || null;
    },
    closeTaskForm: (state) => {
      state.showTaskForm = false;
      state.editingTask = null;
    },
  },
});

export const {
  openSignUpModal,
  closeSignUpModal,
  openTaskForm,
  closeTaskForm,
} = uiSlice.actions;

export default uiSlice.reducer;

