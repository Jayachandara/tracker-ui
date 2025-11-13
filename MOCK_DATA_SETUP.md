# Mock Data Integration with RTK Query

## Overview

All RTK Query APIs now use **mock data services** instead of fetch calls. This allows full development and testing without a backend server.

## Mock Data Services

### 1. Transactions Mock Service
**Location:** `src/core/api/mock/transactions-service.ts`

**Features:**
- Get transactions with pagination and filtering
- Filter by type (income/expense), category, amount range, account
- Get single transaction by ID
- Calculate statistics (total income, expense, balance)
- Create, update, delete transactions (mock)
- Bulk delete operations

**Usage:**
```typescript
import { useGetTransactionsQuery } from 'core/api/transactions.api';

const { data, isLoading } = useGetTransactionsQuery({
  type: 'expense',
  category: 'FOOD',
  page: 1,
  pageSize: 20,
});
```

### 2. Products Mock Service
**Location:** `src/core/api/mock/products-service.ts`

**Features:**
- List products with pagination
- Filter by category, search term
- Get single product
- Create, update, delete products (mock)

**Mock Data:**
- Laptop ($1200)
- Headphones ($150)
- Monitor ($400)

**Usage:**
```typescript
import { useGetProductsQuery } from 'core/api/products.api';

const { data } = useGetProductsQuery({
  category: 'ELECTRONICS',
  search: 'laptop',
  page: 1,
  pageSize: 10,
});
```

### 3. Users Mock Service
**Location:** `src/core/api/mock/users-service.ts`

**Features:**
- List users with pagination
- Filter by role, search term
- Get single user
- Get current user
- Update, delete users (mock)

**Mock Data:**
- John Doe (Admin)
- Jane Smith (User)
- Bob Johnson (User)

**Usage:**
```typescript
import { useGetUsersQuery, useGetCurrentUserQuery } from 'core/api/users.api';

const { data: users } = useGetUsersQuery({ role: 'admin' });
const { data: current } = useGetCurrentUserQuery();
```

## How It Works

All RTK Query APIs use `fakeBaseQuery` instead of `fetchBaseQuery`:

```typescript
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockTransactionsService } from './mock/transactions-service';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fakeBaseQuery(),  // No HTTP calls
  tagTypes: ['Transactions'],
  endpoints: (builder) => ({
    getTransactions: builder.query({
      queryFn: (filters) => {
        const data = mockTransactionsService.getTransactions(filters);
        return { data };  // Return mock data directly
      },
      providesTags: ['Transactions'],
    }),
    // ...
  }),
});
```

## Real Data Source

The mock services use real transaction data from `src/api/mock/transactions-data.ts`:

- **1300+ real transactions** from bank CSV data
- Properly typed with `TransactionDTO` interface
- Includes: date, time, place, amount, type (DR/CR), account, category, etc.

When you query transactions, the mock service:
1. Filters from the real transaction dataset
2. Applies pagination
3. Transforms to proper `Transaction` type
4. Returns with RTK Query caching

## Benefits

✅ **No backend needed** - Fully functional without API server
✅ **Real data** - Uses actual transaction dataset
✅ **Type-safe** - Full TypeScript support
✅ **Production-ready** - Easy to swap with real APIs
✅ **Caching works** - RTK Query tag invalidation works seamlessly
✅ **Mutations work** - Can test create/update/delete flows

## Switching to Real API

To use a real backend instead of mock data:

1. Import `fetchBaseQuery` instead of `fakeBaseQuery`
2. Add `baseUrl` configuration
3. Change `queryFn` to use `query` endpoints:

```typescript
// Before (mock)
baseQuery: fakeBaseQuery(),
endpoints: (builder) => ({
  getTransactions: builder.query({
    queryFn: (filters) => {
      const data = mockService.getTransactions(filters);
      return { data };
    },
  }),
})

// After (real API)
baseQuery: fetchBaseQuery({ 
  baseUrl: 'https://api.example.com' 
}),
endpoints: (builder) => ({
  getTransactions: builder.query({
    query: (filters) => ({
      url: '/transactions',
      params: filters,
    }),
  }),
})
```

## Testing Flow

```typescript
// Component using RTK Query (same in both mock and real)
function TransactionsList() {
  const { data, isLoading } = useGetTransactionsQuery({ page: 1 });
  
  if (isLoading) return <Spinner />;
  return <List items={data?.items} />;
}

// Works perfectly with mock data
// Switch API to real backend - no component changes needed
```

## Files Structure

```
src/core/api/
├── transactions.api.ts        ✅ Using mock service
├── products.api.ts            ✅ Using mock service
├── users.api.ts               ✅ Using mock service
└── mock/
    ├── transactions-data.ts   ← Real transaction dataset (1300+ entries)
    ├── transactions-service.ts ← Mock service logic
    ├── products-service.ts    ← Mock service logic
    └── users-service.ts       ← Mock service logic
```

## Next Steps

When you have a backend:
1. Replace `fakeBaseQuery()` with `fetchBaseQuery({ baseUrl: '...' })`
2. Update endpoint definitions from `queryFn` to `query`
3. All components continue to work unchanged ✓

The mock setup makes development fast and keeps the API contract clear!
