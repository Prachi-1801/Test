import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:7272/Auth" }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    saveConnectionId: builder.mutation({
      query: (body) => ({
        url: "saveConnectionId",
        method: "POST",
        body,
      }),
    }),

    // POST - create user
    createUser: builder.mutation({
      query: (user) => ({
        url: "/AddUpdateUser",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"], // auto-refetch getUsers after create
    }),

    // DELETE user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Auto-generated hooks
export const {
  useLoginMutation,
  useSaveConnectionIdMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;
