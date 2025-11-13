# Quick Reference: Tracker Architecture

## In 30 Seconds

**4-Layer Architecture:**
1. **UI Layer** (`ui/pages/`, `ui/components/`) - React components
2. **Domain Layer** (`domain/[feature]/`) - Business logic & hooks
3. **API Layer** (`api/`) - HTTP calls & mock data
4. **Core Layer** (`core/`) - Shared utilities & types

**Data flows:** Component → Hook → Service → API

---

## Adding a New Page

```bash
# 1. Create domain if needed
mkdir -p src/domain/[feature]

# 2. Create the structure
touch src/domain/[feature]/types.ts        # Types and interfaces
touch src/domain/[feature]/services.ts     # Business logic
touch src/domain/[feature]/hooks.ts        # React hooks

# 3. Create page component
touch src/ui/pages/[Feature]Page.tsx

# 4. Add route
# Edit src/routes/router.tsx
```

---

## Imports Template

```typescript
// ✅ Use these
import { useMyFeature } from 'domain/[feature]/hooks';
import { MyEntity } from 'domain/[feature]/types';
import { formatCurrency } from 'core/utils/format-functions';
import { TransactionType } from 'core/types';
import { DataTable } from 'ui/components/shared';
import { STORAGE_KEYS } from 'core/config/constants';

// ❌ Avoid these
import { useMyFeature } from '../../../domain/[feature]/hooks';
import utils from './utils.ts';
import constants from './constants';
```

---

## File Structure by Feature

```
domain/
└── transactions/
    ├── types.ts
    │   ├── interfaces (Transaction, TransactionFilters)
    │   ├── DTOs (CreateTransactionDTO)
    │   └── enums (imported from core/types)
    │
    ├── services.ts
    │   ├── export class TransactionService { }
    │   ├── methods (getAll, getOne, create, update, delete)
    │   └── export const transactionService = new TransactionService()
    │
    └── hooks.ts
        ├── export useTransactions() { }
        ├── export useTransaction(id) { }
        └── export useCreateTransaction() { }
```

---

## Creating a Hook

```typescript
// src/domain/[feature]/hooks.ts
import { useState, useEffect, useCallback } from 'react';
import { [Feature]Service } from './services';

export const use[Features] = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await [feature]Service.getAll();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
```

---

## Creating a Service

```typescript
// src/domain/[feature]/services.ts
import { [Entity], Create[Entity]DTO } from './types';

class [Feature]Service {
  async getAll(): Promise<[Entity][]> {
    // Call API or use mock data
    return [feature]Api.getAll();
  }

  async getOne(id: string): Promise<[Entity] | null> {
    return [feature]Api.getOne(id);
  }

  async create(data: Create[Entity]DTO): Promise<[Entity]> {
    return [feature]Api.create(data);
  }

  async delete(id: string): Promise<boolean> {
    return [feature]Api.delete(id);
  }
}

export const [feature]Service = new [Feature]Service();
```

---

## Using in a Component

```typescript
// src/ui/pages/MyPage.tsx
import { use[Features] } from 'domain/[feature]/hooks';
import { DataTable } from 'ui/components/shared';

export function MyPage() {
  const { data, loading, error, refetch } = use[Features]();

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'amount', label: 'Amount', render: (v) => `$${v}` }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      rowKey="id"
    />
  );
}
```

---

## Layer Responsibilities

### Core (`src/core/`)
| Folder | What Goes Here | Example |
|--------|---|---|
| `config/` | App constants, config | `APP_NAME`, `STORAGE_KEYS` |
| `utils/` | Pure functions | `formatCurrency()`, `debounce()` |
| `types/` | Global types, enums | `TransactionType`, `UserRole` |

### Domain (`src/domain/[feature]/`)
| File | Responsibility | Rules |
|------|---|---|
| `types.ts` | Define all types for feature | Interfaces, enums, DTOs |
| `services.ts` | Business logic (no React) | Can be tested without React |
| `hooks.ts` | React integration | Wraps services with state |

### API (`src/api/`)
| Folder | What Goes Here | Example |
|--------|---|---|
| `endpoints/` | HTTP client functions | `transactionApi.getAll()` |
| `mock/` | Test/dev data | `transactionsMockData` |

### UI (`src/ui/`)
| Folder | What Goes Here | Example |
|--------|---|---|
| `components/shared/` | Reusable components | `DataTable`, `Modal` |
| `components/forms/` | Form components | `TransactionForm` |
| `pages/` | Full page components | `DashboardPage`, `SettingsPage` |

---

## Common Patterns

### 1. Fetch with Filters
```typescript
const { data, loading } = useTransactions({ 
  filters: { category: 'food', type: 'expense' },
  page: 1,
  pageSize: 20
});
```

### 2. Create and Refetch
```typescript
const { create, loading } = useCreateTransaction();
const { refetch } = useTransactions();

const handleCreate = async (data) => {
  await create(data);
  await refetch();
};
```

### 3. Use DataTable with Hook
```typescript
const { data, loading, error } = useMyItems();
return (
  <DataTable 
    data={data} 
    loading={loading}
    error={error}
    columns={[...]}
  />
);
```

---

## Dos and Don'ts

### ✅ Do
- Keep domains focused on one concept
- Put business logic in services (testable)
- Export types from domain types.ts
- Use shared components across features
- Write pure utility functions in core/utils

### ❌ Don't
- Mix UI and business logic
- Use relative imports like `../../../`
- Create circular dependencies between domains
- Put React hooks in services
- Deeply nest folder structures

---

## Environment

- **Dev Server:** `npm run dev` (http://localhost:3001/tracker or port 3000)
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`

---

## Key Files

| File | Purpose |
|------|---------|
| `FOLDER_STRUCTURE.md` | Detailed architecture guide |
| `STRUCTURE_IMPLEMENTATION.md` | What was implemented |
| `REFACTORING_SUMMARY.md` | This document |
| `src/domain/transactions/` | Complete working example |
| `src/ui/pages/TransactionsList.tsx` | Example usage |

---

## TypeScript Tips

```typescript
// ✅ Good - Strongly typed
interface User {
  id: string;
  name: string;
}

const user: User = { id: '1', name: 'John' };

// ❌ Avoid - Loose typing
const user: any = { id: '1', name: 'John' };

// ✅ Good - Use enums
type Status = TransactionType.INCOME | TransactionType.EXPENSE;

// ❌ Avoid - String literals
type Status = 'income' | 'expense';
```

---

## Debugging

**Imports not resolving?**
- Check `vite.config.ts` for path alias configuration
- Make sure you're using the `src/` root path
- Example: `import X from 'domain/X'` not `import X from './domain/X'`

**Hook returns undefined?**
- Did you call the hook inside a React component?
- Check if the service method is returning the correct type
- Add `console.log` to see what's happening

**Component not updating?**
- Is the hook being called correctly?
- Check if the data is actually changing (try `useEffect`)
- Use React DevTools to inspect component state

---

## Need Help?

1. **Architecture Questions** → Read `FOLDER_STRUCTURE.md`
2. **Usage Examples** → Check `src/domain/transactions/` 
3. **Component Example** → Look at `src/ui/pages/TransactionsList.tsx`
4. **Type Examples** → See `src/core/types/index.ts`
5. **API Patterns** → Check `src/api/endpoints/transactions.api.ts`

---

**Last Updated:** 2024
**Status:** ✅ Production Ready
