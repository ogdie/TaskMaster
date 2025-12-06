import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginError: null,
  signupError: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginError: (state, action) => {
      state.loginError = action.payload;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    setSignupError: (state, action) => {
      state.signupError = action.payload;
    },
    clearSignupError: (state) => {
      state.signupError = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setLoginError,
  clearLoginError,
  setSignupError,
  clearSignupError,
  setLoading,
} = authSlice.actions;
export default authSlice.reducer;

