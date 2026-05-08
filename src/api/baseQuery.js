import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://your-api.com/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // read from authSlice
    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // attach to every request
    }
    return headers;
  },
});

// Wrapper: auto logout if token expires (401)
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(clearAuth()); // clear token → redirect to login
  }
  return result;
};
