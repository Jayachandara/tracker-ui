/**
 * API Client for Transactions
 * Handles all transaction-related API calls
 *
 * This is an example of how to structure API endpoints.
 * In production, this would make actual HTTP calls to your backend.
 */

import { Transaction, TransactionFilters, CreateTransactionDTO } from 'domain/transactions/types';

const BASE_URL = process.env.VITE_API_BASE_URL || '/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get all transactions with optional filtering
 */
export const getTransactions = async (
  filters?: TransactionFilters,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<{ items: Transaction[]; total: number }>> => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('pageSize', String(pageSize));

  if (filters?.type) params.append('type', filters.type);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.account) params.append('account', filters.account);

  const response = await fetch(`${BASE_URL}/transactions?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return response.json();
};

/**
 * Get a single transaction by ID
 */
export const getTransactionById = async (id: string): Promise<ApiResponse<Transaction>> => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return response.json();
};

/**
 * Create a new transaction
 */
export const createTransaction = async (
  data: CreateTransactionDTO
): Promise<ApiResponse<Transaction>> => {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (
  id: string,
  data: Partial<CreateTransactionDTO>
): Promise<ApiResponse<Transaction>> => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (id: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  return response.json();
};

/**
 * Export all endpoints as a namespace
 */
export const transactionApi = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
