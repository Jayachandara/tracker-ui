import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionFilters, TransactionStats } from './types';
import { transactionService } from './services';

/**
 * React hooks for transaction domain
 * Provide easy access to transaction data and operations
 */

interface UseTransactionsOptions {
  page?: number;
  pageSize?: number;
  filters?: TransactionFilters;
}

/**
 * Hook to fetch transactions with filtering and pagination
 */
export const useTransactions = (options?: UseTransactionsOptions) => {
  const { page = 1, pageSize = 10, filters } = options || {};
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await transactionService.getTransactions(filters, page, pageSize);
      setTransactions(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { transactions, total, loading, error, refetch: fetch };
};

/**
 * Hook to fetch a single transaction
 */
export const useTransaction = (id: string | null) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    transactionService
      .getTransactionById(id)
      .then(setTransaction)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { transaction, loading, error };
};

/**
 * Hook to fetch transaction statistics
 */
export const useTransactionStats = () => {
  const [stats, setStats] = useState<TransactionStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await transactionService.getTransactionStats();
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refetch: fetch };
};

/**
 * Hook to create a new transaction
 */
export const useCreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: Parameters<typeof transactionService.createTransaction>[0]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await transactionService.createTransaction(data);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create transaction';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { create, loading, error };
};

/**
 * Hook to delete a transaction
 */
export const useDeleteTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delete_ = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await transactionService.deleteTransaction(id);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: delete_, loading, error };
};
