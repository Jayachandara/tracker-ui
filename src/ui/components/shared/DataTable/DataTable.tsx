/**
 * DataTable - Reusable data table component
 * Example of a shared UI component used across multiple features
 *
 * Location: src/ui/components/shared/DataTable/DataTable.tsx
 * This component demonstrates the shared UI layer pattern
 */

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';

export interface DataTableColumn<T extends Record<string, unknown>> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowKey: keyof T;
}

/**
 * Generic reusable data table component
 * Example usage:
 * 
 * const columns: DataTableColumn<Record<string, unknown>>[] = [
 *   { key: 'name' as const, label: 'Name' },
 *   { key: 'amount' as const, label: 'Amount', render: (val) => `$${val}` }
 * ];
 * 
 * <DataTable 
 *   columns={columns} 
 *   data={transactions}
 *   rowKey="id"
 * />
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  onRowClick,
  rowKey,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box p={2}>
        <Typography color="textSecondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {columns.map((col) => (
              <TableCell key={String(col.key)} align={col.align || 'left'}>
                <strong>{col.label}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={String(row[rowKey])}
              onClick={() => onRowClick?.(row)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default', '&:hover': { backgroundColor: '#fafafa' } }}
            >
              {columns.map((col) => (
                <TableCell key={String(col.key)} align={col.align || 'left'}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
