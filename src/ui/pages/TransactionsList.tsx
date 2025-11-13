/**
 * Example Transaction List Page Component
 * Location: src/ui/pages/TransactionsList.tsx
 * 
 * Demonstrates how to use the new folder structure:
 * - Uses hooks from domain layer
 * - Shared UI components from ui/components/shared
 * - Types from domain layer
 */

import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField } from '@mui/material';

// Hooks from domain layer
import { useTransactions, useCreateTransaction } from 'domain/transactions/hooks';

// Types from domain layer
import { TransactionFilters, CreateTransactionDTO } from 'domain/transactions/types';
import { TransactionType, TransactionCategory } from 'core/types';

// Shared UI components
import { DataTable, DataTableColumn } from 'ui/components/shared';

/**
 * Example page component showing the architecture in action
 */
export function TransactionsList() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [page, setPage] = useState(1);

  // Using domain hooks to fetch data
  const { transactions, total, loading: fetchLoading, error: fetchError, refetch } = useTransactions({
    filters,
    page,
    pageSize: 10,
  });

  const { create: createTransaction, loading: creating } = useCreateTransaction();

  // Define table columns using shared DataTable types
  const tableColumns: DataTableColumn<Record<string, unknown>>[] = [
    {
      key: 'date' as const,
      label: 'Date',
      align: 'left',
    },
    {
      key: 'description' as const,
      label: 'Description',
      align: 'left',
    },
    {
      key: 'category' as const,
      label: 'Category',
      align: 'left',
    },
    {
      key: 'amount' as const,
      label: 'Amount',
      align: 'right',
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      key: 'type' as const,
      label: 'Type',
      align: 'center',
      render: (value: unknown) => (
        <span style={{ color: value === 'income' ? 'green' : 'red' }}>{String(value)}</span>
      ),
    },
  ];

  const handleCreateTransaction = async () => {
    const newTransaction: CreateTransactionDTO = {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      amount: 50,
      currency: 'USD',
      description: 'Example transaction',
      date: new Date().toISOString(),
      account: 'Checking',
    };

    try {
      await createTransaction(newTransaction);
      await refetch(); // Refresh the list
    } catch (err) {
      console.error('Failed to create transaction:', err);
    }
  };

  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1); // Reset to first page on filter change
  };

  const tableData = (transactions as unknown as Record<string, unknown>[]) || [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Filters Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              placeholder="Search transactions..."
              onChange={(_e) => handleFilterChange({})}
            />
            <Button variant="contained" onClick={handleCreateTransaction} disabled={creating}>
              {creating ? 'Creating...' : 'Add Transaction'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Data Table using shared component */}
      <DataTable<Record<string, unknown>>
        columns={tableColumns}
        data={tableData}
        loading={fetchLoading || false}
        error={fetchError}
        emptyMessage="No transactions found"
        rowKey={'id'}
        onRowClick={() => {
          // Navigate to detail page or open modal
        }}
      />

      {/* Pagination info */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <p>
          Page {page} of {Math.ceil((total || 0) / 10)} • Total: {total || 0} transactions
        </p>
      </Box>
    </Box>
  );
}
