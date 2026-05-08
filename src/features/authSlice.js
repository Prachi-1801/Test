import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userId: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    clearAuth: (state) => {
      state.token = null;
      state.userId = null;
    },
  },
});

export const { setAuth: setCredentials, clearAuth: logout } = authSlice.actions;
export default authSlice.reducer;
