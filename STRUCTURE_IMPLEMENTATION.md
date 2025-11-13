# New Folder Structure Implementation Summary

## Overview

The Tracker application has been refactored into a modern, scalable architecture with clear separation of concerns. This document summarizes what was created and how to use it.

## Created Example Files

### 1. Core Layer Examples

#### `src/core/config/constants.ts`
Application-wide constants and configuration.
- App metadata (name, version)
- Storage keys for persistence
- Date/time formats
- Feature flags

#### `src/core/utils/format-functions.ts`
Pure utility functions with no dependencies.
- `formatCurrency()` - Format numbers as currency
- `capitalizePathname()` - Format route names
- `debounce()` - Function debouncing utility
- `formatDate()` - Date formatting

#### `src/core/utils/validators.ts`
Validation functions for common data.
- `validateEmail()` - Email validation
- `validatePassword()` - Password strength validation
- `validatePhone()` - Phone number validation

#### `src/core/types/index.ts`
Global types, enums, and interfaces used across the app.
- `TransactionType` enum (INCOME, EXPENSE, TRANSFER)
- `TransactionCategory` enum (FOOD, TRANSPORT, UTILITIES, etc.)
- `UserRole` enum (ADMIN, USER, VIEWER)
- Common API response types
- Pagination types

### 2. Domain Layer Examples

#### Transaction Domain (`src/domain/transactions/`)

**`types.ts`** - Transaction-specific types
- `Transaction` interface (id, amount, type, category, etc.)
- `TransactionFilters` for querying
- `TransactionStats` for aggregate data
- `CreateTransactionDTO` for creating new transactions
- `UpdateTransactionDTO` for updates

**`services.ts`** - Transaction business logic
- `TransactionService` class with methods:
  - `getTransactions(filters, page, pageSize)` - Fetch with pagination
  - `getTransactionById(id)` - Get single transaction
  - `getTransactionStats()` - Calculate statistics
  - `createTransaction(data)` - Create new
  - `deleteTransaction(id)` - Delete

**`hooks.ts`** - React hooks for components
- `useTransactions(options)` - Fetch transactions with filters
- `useTransaction(id)` - Fetch single transaction
- `useTransactionStats()` - Fetch and compute stats
- `useCreateTransaction()` - Create transaction
- `useDeleteTransaction()` - Delete transaction

Each hook handles:
- State management (useState)
- Side effects (useEffect)
- Loading states
- Error handling

#### Product Domain (`src/domain/products/types.ts`)
Example product feature showing the same pattern as transactions.
- `ProductCategory` and `ProductStatus` enums
- `Product` interface
- `ProductFilters`, `ProductStats`, DTOs

#### User Domain (`src/domain/users/types.ts`)
Example user feature demonstrating the pattern.
- `UserRole` and `UserStatus` enums
- `User` interface with address and metadata
- `UserFilters`, `UserStats`, `AuthDTO`, `AuthResponse`

### 3. API Layer Examples

#### `src/api/endpoints/transactions.api.ts`
RESTful API client functions.
- `getTransactions()` - API call wrapper
- `getTransactionById()` - Single fetch
- `createTransaction()` - POST request
- `updateTransaction()` - PATCH request
- `deleteTransaction()` - DELETE request
- Exported as `transactionApi` namespace

#### `src/api/mock/index.ts`
Mock data for development and testing.
- `transactionsMockData` - Sample transaction array
- `productsMockData` - Sample product array
- `usersMockData` - Sample user array
- Uses proper enum values from core/types

### 4. UI Layer Examples

#### `src/ui/components/shared/DataTable/DataTable.tsx`
Generic, reusable data table component.
- Strongly typed with TypeScript generics
- Column configuration system
- Loading and error states
- Custom cell rendering
- Row click handlers
- Used by all list pages

#### `src/ui/components/shared/index.ts`
Barrel export for easy shared component imports.
```typescript
import { DataTable, DataTableColumn } from 'ui/components/shared';
```

#### `src/ui/pages/TransactionsList.tsx`
Complete example page showing the architecture in action.
- Uses `useTransactions()` hook from domain
- Uses `DataTable` shared component
- Demonstrates filtering, pagination, creation
- Shows the data flow: Component → Hook → Service → API

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    UI LAYER (ui/)                            │
│  TransactionsList.tsx → Uses hooks, renders DataTable      │
└────────────────────┬────────────────────────────────────────┘
                     │ Calls
┌────────────────────▼────────────────────────────────────────┐
│              DOMAIN LAYER (domain/)                          │
│  useTransactions() hook → Manages state, calls service     │
│         ↓ Calls                                             │
│  transactionService → Business logic, calls API             │
└────────────────────┬────────────────────────────────────────┘
                     │ Calls
┌────────────────────▼────────────────────────────────────────┐
│               API LAYER (api/)                              │
│  transactionApi.getTransactions() → HTTP call              │
│         ↓ Uses                                              │
│  Mock data (api/mock/) or backend endpoint                 │
└─────────────────────────────────────────────────────────────┘

┌────────────────┐
│  CORE LAYER    │ Shared across all layers
│  (core/)       │ - Types, Utils, Config
└────────────────┘
```

## Data Flow Example

```
User clicks "Load Transactions"
        ↓
Component calls useTransactions()
        ↓
Hook: Creates useState for data, loading, error
        ↓
Hook: useEffect → calls transactionService.getTransactions()
        ↓
Service: Receives mock/API response
        ↓
Service: Filters and transforms data
        ↓
Service: Returns transformed data to hook
        ↓
Hook: Updates useState with data
        ↓
Component: Re-renders with new data
        ↓
DataTable component displays rows
```

## Quick Start: Adding a New Feature

### Step 1: Define Types
```typescript
// src/domain/[feature]/types.ts
export interface MyEntity { /* ... */ }
export interface CreateMyEntityDTO { /* ... */ }
```

### Step 2: Create Service
```typescript
// src/domain/[feature]/services.ts
class MyEntityService {
  async getAll() { /* business logic */ }
}
export const myEntityService = new MyEntityService();
```

### Step 3: Create Hooks
```typescript
// src/domain/[feature]/hooks.ts
export const useMyEntities = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    myEntityService.getAll().then(setData);
  }, []);
  return { data, loading, error };
};
```

### Step 4: Create Page Component
```typescript
// src/ui/pages/MyFeature.tsx
export function MyFeaturePage() {
  const { data } = useMyEntities();
  return <DataTable columns={...} data={data} />;
}
```

### Step 5: Add Route
```typescript
// src/routes/router.tsx
{
  path: '/my-feature',
  element: <React.lazy(() => import('ui/pages/MyFeature')),
}
```

## File Organization Benefits

✅ **Clear Separation of Concerns** - Each layer has one responsibility
✅ **Easy Testing** - Services can be tested without React
✅ **Reusability** - Shared components and utils across features
✅ **Scalability** - New features follow the same pattern
✅ **Maintainability** - Related code grouped together
✅ **Type Safety** - Strong TypeScript types throughout
✅ **Performance** - Lazy-loaded routes, memoized hooks

## Next Steps

1. **Migrate existing code**
   - Move helpers/ files to core/utils/
   - Move DTOs to domain/*/types.ts
   - Move data files to api/mock/
   - Extract business logic into services.ts files

2. **Refactor existing components**
   - Update imports to use new paths
   - Replace direct data imports with hooks
   - Consolidate duplicate components into shared/

3. **Add new features** following the pattern shown in examples

## Key Files Reference

| Purpose | File |
|---------|------|
| See architecture guide | `FOLDER_STRUCTURE.md` |
| Transaction example (complete) | `src/domain/transactions/*` |
| Shared components | `src/ui/components/shared/*` |
| Global types | `src/core/types/index.ts` |
| App constants | `src/core/config/constants.ts` |
| Utility functions | `src/core/utils/*` |

## Import Examples

```typescript
// ✅ Import from domain
import { useTransactions } from 'domain/transactions/hooks';
import { Transaction, TransactionFilters } from 'domain/transactions/types';

// ✅ Import from core
import { formatCurrency, debounce } from 'core/utils/format-functions';
import { TransactionType } from 'core/types';

// ✅ Import from shared components
import { DataTable } from 'ui/components/shared';

// ✅ Import from API
import { transactionApi } from 'api/endpoints/transactions.api';
```

## Questions?

Refer to `FOLDER_STRUCTURE.md` for detailed explanations of each layer, best practices, and FAQs.
