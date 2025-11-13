import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from 'domain/users/types';
import { mockUsersService } from './mock/users-service';

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
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListResponse, UserFilters>({
      queryFn: (filters) => {
        const data = mockUsersService.getUsers(filters);
        return { data };
      },
      providesTags: ['Users'],
    }),

    getUserById: builder.query<{ data: User }, string>({
      queryFn: (id) => {
        const data = mockUsersService.getUserById(id);
        return { data: { data } };
      },
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),

    getCurrentUser: builder.query<{ data: User }, void>({
      queryFn: () => {
        const data = mockUsersService.getCurrentUser();
        return { data: { data } };
      },
      providesTags: ['Users'],
    }),

    updateUser: builder.mutation<{ data: User }, { id: string; data: Partial<User> }>({
      queryFn: ({ id, data }) => {
        const result = mockUsersService.updateUser(id, data);
        return { data: { data: result } };
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Users', id }, 'Users'],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      queryFn: (id) => {
        const data = mockUsersService.deleteUser(id);
        return { data };
      },
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
