import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7173/Chat" }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/GetUsers",
      providesTags: ["User"],
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
