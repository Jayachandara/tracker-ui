# Redux & RTK Query Setup

## Overview

This project uses **Redux Toolkit** for state management and **RTK Query** for server state management (API calls). This provides:

- Centralized state management
- Automatic API caching and synchronization
- Built-in loading/error states
- Type-safe hooks
- Simplified data fetching

## Architecture

### Store Structure

```
src/core/store/
├── store.ts              # Redux store configuration
├── hooks.ts              # Typed Redux hooks
└── slices/               # Feature slices
    ├── transactions.slice.ts  # Transaction UI state
    ├── filters.slice.ts       # Filter state
    └── ui.slice.ts            # Global UI state

src/core/api/
├── transactions.api.ts   # RTK Query for transactions
├── products.api.ts       # RTK Query for products
└── users.api.ts          # RTK Query for users
```

### Reducers

#### Store Configuration
```typescript
// src/core/store/store.ts
const store = configureStore({
  reducer: {
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
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
```

**API Reducers**: Manage server state (transactions, products, users)
**Feature Slices**: Manage client state (UI state, filters, selections)

### Typed Hooks

```typescript
// src/core/store/hooks.ts
import { useAppDispatch, useAppSelector } from 'core/store/hooks';

// Usage in components
const dispatch = useAppDispatch();
const selectedTransaction = useAppSelector(state => state.transactions.selectedTransaction);
```

## RTK Query - Data Fetching

### Transactions API

```typescript
import { useGetTransactionsQuery, useCreateTransactionMutation } from 'core/api/transactions.api';

// Get transactions
const { data, isLoading, error } = useGetTransactionsQuery({
  page: 1,
  pageSize: 20,
  type: 'expense'
});

// Create transaction
const [createTransaction, { isLoading }] = useCreateTransactionMutation();
await createTransaction({ amount: 100, category: 'FOOD' });
```

### Key Features

- **Automatic Caching**: Query results cached and reused
- **Tag-Based Invalidation**: Mutations automatically invalidate related queries
- **Loading/Error States**: Built-in `isLoading`, `error`, `isFetching`
- **Refetch**: `refetch()` to manually refresh data

### Available Hooks

**Queries (GET):**
- `useGetTransactionsQuery(filters)` - List with pagination/filters
- `useGetTransactionByIdQuery(id)` - Single transaction
- `useGetTransactionStatsQuery()` - Statistics
- `useGetProductsQuery(filters)`
- `useGetUsersQuery(filters)`
- `useGetCurrentUserQuery()`

**Mutations (POST/PATCH/DELETE):**
- `useCreateTransactionMutation()`
- `useUpdateTransactionMutation()`
- `useDeleteTransactionMutation()`
- `useBulkDeleteTransactionsMutation()`

## Redux Slices - UI State

### Transactions Slice

```typescript
import { useAppDispatch, useAppSelector } from 'core/store/hooks';
import { selectTransaction, setSortBy } from 'core/store/slices/transactions.slice';

// Dispatch actions
dispatch(selectTransaction(transaction));
dispatch(setSortBy('amount'));

// Read state
const sortBy = useAppSelector(state => state.transactions.sortBy);
```

**Actions:**
- `selectTransaction` - Select current transaction
- `setSortBy` - Change sort column
- `setSortOrder` - Ascending/descending
- `setPageSize` - Items per page

### Filters Slice

```typescript
import { setTransactionFilters, setSearchTerm, clearFilters } from 'core/store/slices/filters.slice';

dispatch(setTransactionFilters({ type: 'expense', category: 'FOOD' }));
dispatch(setSearchTerm('starbucks'));
dispatch(clearFilters());
```

**Actions:**
- `setTransactionFilters` - Set active filters
- `setDateRange` - Set date range
- `setSearchTerm` - Search query
- `clearFilters` - Reset all filters

### UI Slice

```typescript
import {
  toggleSidebar,
  setTheme,
  showNotification,
  closeNotification,
} from 'core/store/slices/ui.slice';

dispatch(toggleSidebar());
dispatch(setTheme('dark'));
dispatch(showNotification({ message: 'Success!', type: 'success' }));
```

**Actions:**
- `toggleSidebar` / `setSidebarOpen`
- `setTheme` - Light/dark mode
- `setLoading` - Global loading state
- `setError` - Global error message
- `showNotification` - Toast notifications
- `closeNotification` - Hide notification

## Example Usage in Components

### Fetch Data with RTK Query

```typescript
import { useGetTransactionsQuery } from 'core/api/transactions.api';
import { useAppSelector } from 'core/store/hooks';

export function TransactionsList() {
  const filters = useAppSelector(state => state.filters.transactionFilters);
  const { data, isLoading, error } = useGetTransactionsQuery({
    ...filters,
    page: 1,
    pageSize: 20,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <List>
      {data?.items.map(tx => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </List>
  );
}
```

### Mutation - Create with Loading

```typescript
import { useCreateTransactionMutation } from 'core/api/transactions.api';
import { showNotification } from 'core/store/slices/ui.slice';

export function CreateTransactionForm() {
  const dispatch = useAppDispatch();
  const [create, { isLoading }] = useCreateTransactionMutation();

  const handleSubmit = async (formData) => {
    try {
      await create(formData).unwrap();
      dispatch(showNotification({
        message: 'Transaction created!',
        type: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: error.message,
        type: 'error',
      }));
    }
  };

  return <Form onSubmit={handleSubmit} isLoading={isLoading} />;
}
```

### Manage UI State

```typescript
import { useAppDispatch, useAppSelector } from 'core/store/hooks';
import { showNotification, setLoading } from 'core/store/slices/ui.slice';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { sidebarOpen, theme, notification } = useAppSelector(state => state.ui);

  const handleLoadData = async () => {
    dispatch(setLoading(true));
    try {
      // fetch data...
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to load data',
        type: 'error',
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Sidebar open={sidebarOpen} />
      <Toast open={notification.open} message={notification.message} />
    </>
  );
}
```

## Configuration

### API Base URL

Set `VITE_API_URL` environment variable or it defaults to `http://localhost:3001/api`:

```env
VITE_API_URL=https://api.example.com
```

### Middleware

All RTK Query middleware is registered in the store configuration to handle:
- Request timing
- Cache invalidation
- Error handling
- Polling

## Best Practices

1. **Use Typed Hooks**: Always use `useAppDispatch` and `useAppSelector` for type safety
2. **Keep Local State Small**: Use Redux for global UI/server state only
3. **Leverage Tag Invalidation**: RTK Query handles cache automatically via tags
4. **Handle Errors Gracefully**: Check `error` state and display user-friendly messages
5. **Refactor to Slices**: As features grow, create new slices in `src/core/store/slices/`

## Adding New Features

### 1. Create a New API

```typescript
// src/core/api/newfeature.api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const newFeatureApi = createApi({
  reducerPath: 'newFeatureApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/newfeature` }),
  tagTypes: ['NewFeature'],
  endpoints: (builder) => ({
    getItems: builder.query(...)
    // ... more endpoints
  }),
});
```

### 2. Register in Store

```typescript
// src/core/store/store.ts
import { newFeatureApi } from 'core/api/newfeature.api';

reducer: {
  [newFeatureApi.reducerPath]: newFeatureApi.reducer,
  // ...
},
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(newFeatureApi.middleware),
```

### 3. Create Feature Slice (if needed)

```typescript
// src/core/store/slices/newfeature.slice.ts
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'newfeature',
  initialState: {},
  reducers: { /* ... */ },
});
```

## Debugging

### Redux DevTools

Install [Redux DevTools Browser Extension](https://github.com/reduxjs/redux-devtools-extension) to:
- Track state changes
- Time-travel debugging
- Inspect actions
- Export/import state

### RTK Query DevTools

Uncomment in `store.ts` to enable RTK Query inspection:

```typescript
import { setupListeners } from '@reduxjs/toolkit/query';

setupListeners(store.dispatch);
```

## Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Style Guide](https://redux.js.org/style-guide/style-guide)
