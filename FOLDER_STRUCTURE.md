# New Folder Structure Guide

This document explains the new folder structure and how to organize code in the Tracker application.

## Folder Structure Overview

```
src/
├── core/                    # Core application layer (shared logic)
│   ├── config/             # Application configuration and constants
│   ├── utils/              # Pure utility functions (no hooks, no dependencies)
│   └── types/              # Global types, enums, and interfaces
│
├── domain/                 # Feature domains (business logic layer)
│   ├── transactions/       # Transaction feature
│   │   ├── types.ts       # Transaction types, DTOs, interfaces
│   │   ├── services.ts    # Business logic for transactions
│   │   └── hooks.ts       # React hooks for transactions
│   ├── products/          # Product feature
│   │   ├── types.ts
│   │   ├── services.ts
│   │   └── hooks.ts
│   └── users/             # User feature
│       ├── types.ts
│       ├── services.ts
│       └── hooks.ts
│
├── api/                    # API communication layer
│   ├── endpoints/          # API endpoint functions by resource
│   │   ├── transactions.api.ts
│   │   ├── products.api.ts
│   │   └── users.api.ts
│   └── mock/              # Mock data for development/testing
│       └── index.ts       # Centralized mock data
│
├── ui/                     # User interface layer
│   ├── components/         # Reusable UI components
│   │   ├── shared/        # Shared components used across features
│   │   │   ├── DataTable/
│   │   │   ├── LoadingSpinner/
│   │   │   └── Modal/
│   │   └── forms/         # Form-specific components
│   └── pages/             # Full page components
│       ├── Dashboard.tsx
│       ├── Settings.tsx
│       └── NotFound.tsx
│
├── hooks/                  # Global/shared React hooks
│   └── useLocalStorage.ts
│
├── layouts/               # Layout components (unchanged)
├── providers/             # Context providers (unchanged)
└── routes/                # Routing configuration (unchanged)
```

## Layer Explanations

### Core Layer (`src/core/`)
Application-wide utilities and configuration. No domain-specific logic.

**`core/config/`** - Constants, feature flags, storage keys
```typescript
export const STORAGE_KEYS = {
  showScrollbar: 'tracker.showScrollbar',
  userPreferences: 'tracker.preferences',
};
```

**`core/utils/`** - Pure, reusable functions
```typescript
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
```

**`core/types/`** - Global types and enums
```typescript
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}
```

### Domain Layer (`src/domain/`)
Feature-scoped business logic, organized by domain.

**`domain/[feature]/types.ts`** - All types for that domain
- Interfaces (entities, filters, DTOs)
- Enums specific to this domain
- API response types

**`domain/[feature]/services.ts`** - Business logic (no React)
- Fetch and transform data
- Calculate derived values
- Handle business rules
- Returns Promises (can be called from hooks or backend)

**`domain/[feature]/hooks.ts`** - React hooks wrapping services
- State management (useState)
- Side effects (useEffect)
- Memoization (useCallback)
- Easy component integration

**Example: Using Transaction domain**
```typescript
// Component
import { useTransactions, useTransactionStats } from 'domain/transactions/hooks';

export function DashboardPage() {
  const { transactions, loading } = useTransactions({ pageSize: 20 });
  const { stats } = useTransactionStats();
  
  return <div>/* UI using transactions and stats */</div>;
}
```

### API Layer (`src/api/`)
HTTP communication and data fetching.

**`api/endpoints/`** - RESTful API client functions
```typescript
export const transactionApi = {
  getTransactions: (filters, page, pageSize) => fetch(...),
  createTransaction: (data) => fetch(...),
  deleteTransaction: (id) => fetch(...),
};
```

**`api/mock/`** - Mock/fixture data
```typescript
export const transactionsMockData: Transaction[] = [
  { id: '1', /* ... */ },
];
```

### UI Layer (`src/ui/`)
React components for rendering.

**`ui/components/shared/`** - Reusable components
- Used across multiple features
- No feature-specific logic
- Examples: DataTable, Modal, Form fields, Buttons (MUI overrides go in `src/theme/`)

**`ui/components/forms/`** - Form-specific components
- Specialized input fields
- Form layouts
- Examples: TransactionForm, UserProfileForm

**`ui/pages/`** - Full-page components
- Top-level route components
- Orchestrate multiple features
- Compose smaller components

## Data Flow

```
Component (UI) 
    ↓
Hook (domain/[feature]/hooks.ts)
    ↓
Service (domain/[feature]/services.ts)
    ↓
API Client (api/endpoints/)
    ↓
Backend / Mock Data (api/mock/)
```

## Migration Guide

### Moving Existing Code

**Helpers → Core Utils**
```typescript
// Before: src/helpers/format-functions.ts
// After:  src/core/utils/format-functions.ts
import { formatCurrency } from 'core/utils/format-functions';
```

**DTOs → Domain Types**
```typescript
// Before: src/dtos/transactions-dtos.ts
// After:  src/domain/transactions/types.ts
import { CreateTransactionDTO } from 'domain/transactions/types';
```

**Mock Data → API Mock**
```typescript
// Before: src/data/transactions-data.ts
// After:  src/api/mock/index.ts
import { transactionsMockData } from 'api/mock';
```

**Local Data Files → Services**
```typescript
// Before: components directly importing from src/data/
// After:  components use useTransactions() hook
const { transactions } = useTransactions();
```

## Adding a New Feature

1. **Create domain structure**
   ```bash
   mkdir -p src/domain/[feature]
   ```

2. **Create types.ts**
   ```typescript
   // src/domain/[feature]/types.ts
   export interface Entity { /* ... */ }
   export interface CreateDTO { /* ... */ }
   ```

3. **Create services.ts**
   ```typescript
   // src/domain/[feature]/services.ts
   class [Feature]Service {
     async getAll() { /* business logic */ }
   }
   export const [feature]Service = new [Feature]Service();
   ```

4. **Create hooks.ts**
   ```typescript
   // src/domain/[feature]/hooks.ts
   export const use[Feature]s = () => {
     return [feature]Service.getAll();
   };
   ```

5. **Create API endpoint** (if needed)
   ```typescript
   // src/api/endpoints/[feature].api.ts
   export const getAll = () => fetch('/api/[feature]');
   ```

6. **Use in components**
   ```typescript
   import { use[Feature]s } from 'domain/[feature]/hooks';
   
   export function MyComponent() {
     const items = use[Feature]s();
     return <div>{/* render items */}</div>;
   }
   ```

## Best Practices

### Do ✅
- Keep domains focused on a single concept
- Use services for business logic, hooks for React integration
- Export types from `domain/*/types.ts` for import by other layers
- Use `core/utils/` for functions used by multiple domains
- Keep components in `ui/pages/` thin - delegate to hooks

### Don't ❌
- Mix domain logic with UI components
- Create circular imports between domains
- Use domain types outside their domain (define shared types in `core/types/`)
- Add React hooks in services (use in hooks.ts layer instead)
- Create deeply nested folder structures (use flat structure with clear naming)

## Import Paths

With `vite-tsconfig-paths` configured, use clean aliases:

```typescript
// ✅ Good
import { useTransactions } from 'domain/transactions/hooks';
import { formatCurrency } from 'core/utils/format-functions';
import { Transaction } from 'domain/transactions/types';

// ❌ Avoid
import { useTransactions } from '../../../domain/transactions/hooks';
import useTransactions from '../../../../domain/transactions/hooks';
```

## Example: Complete Transaction Feature Flow

```typescript
// 1. Types (src/domain/transactions/types.ts)
export interface Transaction {
  id: string;
  amount: number;
  // ...
}

// 2. Service (src/domain/transactions/services.ts)
class TransactionService {
  async getTransactions() {
    const response = await transactionApi.getTransactions();
    return response.data;
  }
}

// 3. Hook (src/domain/transactions/hooks.ts)
export const useTransactions = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    transactionService.getTransactions().then(setData);
  }, []);
  return data;
};

// 4. Component (src/ui/pages/Dashboard.tsx)
export function Dashboard() {
  const transactions = useTransactions();
  return (
    <div>
      {transactions.map(t => (
        <div key={t.id}>{t.amount}</div>
      ))}
    </div>
  );
}
```

## FAQ

**Q: Where do I put a component used only in one feature?**
A: In the feature's own folder under `src/components/sections/[feature]/` (keep existing pattern), or move to `ui/components/shared/` if it becomes reusable.

**Q: Where do hooks like `useLocalStorage` go?**
A: In `src/hooks/` if they're general-purpose React hooks not tied to a specific domain.

**Q: Should API errors be in services or hooks?**
A: Hooks handle error state (useState for error). Services can throw errors caught by hooks.

**Q: Can domains depend on each other?**
A: Minimize dependencies. If two domains need shared logic, extract to `core/utils/`.

