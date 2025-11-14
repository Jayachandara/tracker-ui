import { TransactionType, TransactionCategory, PaginatedResponse, ApiResponse } from 'core/types';

// ============ Legacy DTO Types (from dtos/transactions-dtos.ts) ============

export type TransactionDTO = {
  id: number;
  date: string;
  time: string;
  place: string;
  amount: number;
  type: "DR" | "CR";
  account: string;
  expense: "Yes" | "No" | "-";
  income: "Yes" | "No" | "-";
  irregularSpends?: "Yes" | null;
  category: string | null;
  tags: string | null;
  note: string | null;
  isReimbersable?: boolean;
  reimbersedTranId?: number;
};

export type SpendsGroupDTO = "EMI" | "Regular Spends" | "Irregular Spends";

export type SpendDTO = {
  name: string;
  spendsCount: number;
  totalAmount: number;
  percentage: number; // 0..100, rounded to 2 decimals
};

export type SpendCategoryGroupDTO = {
  group: "EMI" | "Regular Spends" | "Irregular Spends";
  totalAmount: number;   // same units as input (e.g. rupees)
  percentage: number;    // integer percentage (0 decimals) — sums to 100
};

// ============ Modern Transaction Types ============

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  description: string;
  date: string;
  account: string;
  status: 'pending' | 'completed' | 'failed';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  dateRange?: { start: string; end: string };
  minAmount?: number;
  maxAmount?: number;
  account?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  description: string;
  date: string;
  account: string;
}

export interface UpdateTransactionDTO {
  category?: TransactionCategory;
  amount?: number;
  description?: string;
  date?: string;
}

// API Response types
export type TransactionsListResponse = PaginatedResponse<Transaction>;
export type TransactionDetailResponse = ApiResponse<Transaction>;
export type TransactionStatsResponse = ApiResponse<TransactionStats>;
