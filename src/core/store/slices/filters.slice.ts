import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TransactionFilters } from 'domain/transactions/types';

interface FiltersState {
  transactionFilters: TransactionFilters;
  dateRange: { start: string; end: string } | null;
  searchTerm: string;
}

const initialState: FiltersState = {
  transactionFilters: {},
  dateRange: null,
  searchTerm: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTransactionFilters: (state, action: PayloadAction<TransactionFilters>) => {
      state.transactionFilters = action.payload;
    },
    setDateRange: (
      state,
      action: PayloadAction<{ start: string; end: string } | null>
    ) => {
      state.dateRange = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearFilters: (state) => {
      state.transactionFilters = {};
      state.dateRange = null;
      state.searchTerm = '';
    },
  },
});

export const {
  setTransactionFilters,
  setDateRange,
  setSearchTerm,
  clearFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
