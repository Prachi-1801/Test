import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "../api/AuthAxiosApi";
import { userApi } from "../api/ChatAxiosApi";
import connectionReducer from "../features/connectionSlice";

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware),
});
