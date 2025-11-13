import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from 'domain/transactions/types';

interface TransactionsState {
  selectedTransaction: Transaction | null;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  pageSize: number;
}

const initialState: TransactionsState = {
  selectedTransaction: null,
  sortBy: 'date',
  sortOrder: 'desc',
  pageSize: 20,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    selectTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'date' | 'amount'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
});

export const { selectTransaction, setSortBy, setSortOrder, setPageSize } = transactionsSlice.actions;
export default transactionsSlice.reducer;
