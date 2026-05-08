import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    status: "disconnected", // "connecting" | "connected" | "disconnected"
  },
  reducers: {
    setConnectionStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setConnectionStatus } = connectionSlice.actions;
export default connectionSlice.reducer;
