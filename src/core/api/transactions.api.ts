import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  TransactionFilters,
  TransactionsListResponse,
  TransactionDetailResponse,
  TransactionStatsResponse,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from 'domain/transactions/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/transactions`,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  tagTypes: ['Transactions', 'TransactionStats'],
  endpoints: (builder) => ({
    // Get list of transactions with pagination and filters
    getTransactions: builder.query<TransactionsListResponse, TransactionFilters & { page?: number; pageSize?: number }>({
      query: (filters) => ({
        url: '/list',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Transactions'],
    }),

    // Get single transaction by ID
    getTransactionById: builder.query<TransactionDetailResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Transactions', id }],
    }),

    // Get transaction statistics
    getTransactionStats: builder.query<TransactionStatsResponse, void>({
      query: () => ({
        url: '/stats',
        method: 'GET',
      }),
      providesTags: ['TransactionStats'],
    }),

    // Create new transaction
    createTransaction: builder.mutation<TransactionDetailResponse, CreateTransactionDTO>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transactions', 'TransactionStats'],
    }),

    // Update existing transaction
    updateTransaction: builder.mutation<
      TransactionDetailResponse,
      { id: string; data: UpdateTransactionDTO }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Transactions', id },
        'Transactions',
      ],
    }),

    // Delete transaction
    deleteTransaction: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transactions', 'TransactionStats'],
    }),

    // Bulk operations
    bulkDeleteTransactions: builder.mutation<{ success: boolean }, string[]>({
      query: (ids) => ({
        url: '/bulk-delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Transactions', 'TransactionStats'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetTransactionStatsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useBulkDeleteTransactionsMutation,
} = transactionsApi;
