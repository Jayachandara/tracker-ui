import { trans } from './transactions-data';
import type { Transaction, TransactionFilters } from 'domain/transactions/types';
import { TransactionType, TransactionCategory } from 'core/types';

export const mockTransactionsService = {
  /**
   * Get transactions with pagination and filters
   */
  getTransactions: (
    filters: TransactionFilters & { page?: number; pageSize?: number }
  ) => {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    
    let filtered = trans;

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(t => {
        if (filters.type === 'income') return t.type === 'CR';
        if (filters.type === 'expense') return t.type === 'DR';
        return true;
      });
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Apply amount range
    if (filters.minAmount) {
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
    }

    // Apply account filter
    if (filters.account) {
      filtered = filtered.filter(t => t.account === filters.account);
    }

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end).map((t, idx) => ({
      id: `tx_${start + idx}`,
      userId: 'user_1',
      type: t.type === 'CR' ? TransactionType.INCOME : TransactionType.EXPENSE,
      category: (t.category || 'other') as TransactionCategory,
      amount: t.amount,
      currency: 'INR',
      description: t.place,
      date: t.date,
      account: t.account,
      status: 'completed' as const,
      tags: t.tags ? t.tags.split(',') : [],
      createdAt: t.date,
      updatedAt: t.date,
    })) as Transaction[];

    return {
      items,
      total,
      page,
      pageSize,
      hasMore: end < total,
    };
  },

  /**
   * Get single transaction
   */
  getTransactionById: (id: string): Transaction => {
    const idx = parseInt(id.replace('tx_', ''), 10);
    const t = trans[idx];
    return {
      id,
      userId: 'user_1',
      type: t.type === 'CR' ? TransactionType.INCOME : TransactionType.EXPENSE,
      category: (t.category || 'other') as TransactionCategory,
      amount: t.amount,
      currency: 'INR',
      description: t.place,
      date: t.date,
      account: t.account,
      status: 'completed',
      tags: t.tags ? t.tags.split(',') : [],
      createdAt: t.date,
      updatedAt: t.date,
    };
  },

  /**
   * Get transaction statistics
   */
  getStats: () => {
    const income = trans
      .filter(t => t.type === 'CR')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = trans
      .filter(t => t.type === 'DR' && t.expense === 'Yes')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      transactionCount: trans.length,
    };
  },

  /**
   * Create transaction (mock)
   */
  createTransaction: (data: any): Transaction => {
    const id = `tx_${Date.now()}`;
    return {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Update transaction (mock)
   */
  updateTransaction: (id: string, data: any): Transaction => {
    const original = mockTransactionsService.getTransactionById(id);
    return {
      ...original,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Delete transaction (mock)
   */
  deleteTransaction: (_id: string) => {
    return { success: true };
  },

  /**
   * Bulk delete transactions (mock)
   */
  bulkDeleteTransactions: (_ids: string[]) => {
    return { success: true };
  },
};
