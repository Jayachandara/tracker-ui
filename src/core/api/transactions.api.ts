import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  TransactionFilters,
  TransactionsListResponse,
  TransactionDetailResponse,
  TransactionStatsResponse,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from 'domain/transactions/types';
import { mockTransactionsService } from './mock/transactions-service';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Transactions', 'TransactionStats'],
  endpoints: (builder) => ({
    // Get list of transactions with pagination and filters
    getTransactions: builder.query<
      TransactionsListResponse,
      TransactionFilters & { page?: number; pageSize?: number }
    >({
      queryFn: (filters) => {
        const data = mockTransactionsService.getTransactions(filters);
        return { data };
      },
      providesTags: ['Transactions'],
    }),

    // Get single transaction by ID
    getTransactionById: builder.query<TransactionDetailResponse, string>({
      queryFn: (id) => {
        const data = mockTransactionsService.getTransactionById(id);
        return { data: { success: true, data } };
      },
      providesTags: (_, __, id) => [{ type: 'Transactions', id }],
    }),

    // Get transaction statistics
    getTransactionStats: builder.query<TransactionStatsResponse, void>({
      queryFn: () => {
        const data = mockTransactionsService.getStats();
        return { data: { success: true, data } };
      },
      providesTags: ['TransactionStats'],
    }),

    // Create new transaction
    createTransaction: builder.mutation<TransactionDetailResponse, CreateTransactionDTO>({
      queryFn: (data) => {
        const result = mockTransactionsService.createTransaction(data);
        return { data: { success: true, data: result } };
      },
      invalidatesTags: ['Transactions', 'TransactionStats'],
    }),

    // Update existing transaction
    updateTransaction: builder.mutation<
      TransactionDetailResponse,
      { id: string; data: UpdateTransactionDTO }
    >({
      queryFn: ({ id, data }) => {
        const result = mockTransactionsService.updateTransaction(id, data);
        return { data: { success: true, data: result } };
      },
      invalidatesTags: (_, __, { id }) => [
        { type: 'Transactions', id },
        'Transactions',
      ],
    }),

    // Delete transaction
    deleteTransaction: builder.mutation<{ success: boolean }, string>({
      queryFn: (id) => {
        const data = mockTransactionsService.deleteTransaction(id);
        return { data };
      },
      invalidatesTags: ['Transactions', 'TransactionStats'],
    }),

    // Bulk operations
    bulkDeleteTransactions: builder.mutation<{ success: boolean }, string[]>({
      queryFn: (ids) => {
        const data = mockTransactionsService.bulkDeleteTransactions(ids);
        return { data };
      },
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
