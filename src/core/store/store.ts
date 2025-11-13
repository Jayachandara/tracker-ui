import { configureStore } from '@reduxjs/toolkit';
import { transactionsApi } from 'core/api/transactions.api';
import { productsApi } from 'core/api/products.api';
import { usersApi } from 'core/api/users.api';
import transactionsReducer from './slices/transactions.slice';
import filtersReducer from './slices/filters.slice';
import uiReducer from './slices/ui.slice';

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,

    // Feature slices
    transactions: transactionsReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      transactionsApi.middleware,
      productsApi.middleware,
      usersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
