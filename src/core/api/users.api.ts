import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from 'domain/users/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface UsersListResponse {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
}

interface UserFilters {
  role?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/users`,
    credentials: 'include',
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListResponse, UserFilters>({
      query: (filters) => ({
        url: '/list',
        params: filters,
      }),
      providesTags: ['Users'],
    }),

    getUserById: builder.query<{ data: User }, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),

    getCurrentUser: builder.query<{ data: User }, void>({
      query: () => '/me',
      providesTags: ['Users'],
    }),

    updateUser: builder.mutation<{ data: User }, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Users', id }, 'Users'],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
