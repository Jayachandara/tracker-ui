# Tracker UI - Complete Project Guide

A modern admin dashboard built with React 18, Vite, TypeScript, Material UI, and Redux Toolkit.

**Live URL:** `http://localhost:3000/tracker` (during development)

---

## 📋 Quick Links
- [Setup & Run](#setup--run)
- [Project Architecture](#project-architecture)
- [File Structure](#file-structure)
- [Common Tasks](#common-tasks)
- [Key Technologies](#key-technologies)
- [Styling & Theme](#styling--theme)
- [Routing](#routing)

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (LTS >=16 recommended)
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
# Open: http://localhost:3000/tracker
```

### Build & Deploy
```bash
npm run build      # Compile TypeScript & bundle with Vite
npm run preview    # Preview built dist locally (port 5000)
npm run deploy     # Deploy to GitHub Pages
```

### Lint
```bash
npm run lint       # Run ESLint
```

---

## 🏗️ Project Architecture

### 4-Layer Pattern
```
Component (UI)
    ↓
Hook (Domain Layer)
    ↓
Service (Business Logic)
    ↓
API / Mock Data
```

### Folder Breakdown

**`src/core/`** — Shared infrastructure
- `store/` - Redux store, slices, typed hooks
- `api/` - RTK Query endpoints + mock services
- `utils/` - Utilities (formatting, validation, etc.)
- `types/` - Global TypeScript definitions
- `config/` - Constants (e.g., `STORAGE_KEYS`)

**`src/domain/`** — Feature-specific logic
- `transactions/` - Transaction types, services, hooks
- `users/` - User management
- `products/` - Product management

**`src/components/`** — React UI
- `base/` - Reusable primitives (Icon, Image, etc.)
- `sections/dashboard/` - Dashboard page sections
- `loading/` - Loaders (PageLoader, Splash)
- `ui/` - Styled tabs, themed components

**`src/layouts/`** — Page shells
- `main-layout/` - App layout (topbar, sidebar, footer)
- `auth-layout/` - Authentication layout

**`src/pages/`** — Page containers
- `home/Dashboard.tsx`
- `authentication/` - Login, SignUp, etc.
- `errors/Error404.tsx`

**`src/theme/`** — MUI customization
- `palette.ts` - Colors
- `typography.ts` - Fonts & sizes
- `shadows.ts` - Elevation shadows
- `components/` - Per-component MUI overrides

**`src/providers/`** — Context providers
- `BreakpointsProvider.tsx` - Responsive breakpoints
- `ScrollbarProvider.tsx` - Custom scrollbars
- `SettingsDrawerProvider.tsx` - App settings

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry point; mounts providers |
| `src/routes/router.tsx` | Route definitions (lazy-loaded) |
| `src/routes/paths.ts` | Route path constants |
| `src/theme/theme.ts` | MUI theme config; registers component overrides |
| `vite.config.ts` | Vite config with `vite-tsconfig-paths` |
| `tsconfig.json` | Path aliases: `*` → `./src/*` |

---

## 🔧 Common Tasks

### Add a New Page
1. Create domain layer (if needed):
   ```bash
   mkdir -p src/domain/[feature]
   touch src/domain/[feature]/{types.ts,services.ts,hooks.ts}
   ```

2. Create page component:
   ```bash
   touch src/pages/[feature]/MyPage.tsx
   ```

3. Add route in `src/routes/router.tsx`:
   ```typescript
   const MyPage = lazy(async () => {
     return Promise.all([
       import('pages/[feature]/MyPage'),
       new Promise((resolve) => setTimeout(resolve, 500)),
     ]).then(([moduleExports]) => moduleExports);
   });

   // Add to routes array:
   { path: paths.myPage, element: <MyPage /> }
   ```

4. Update `src/routes/paths.ts`:
   ```typescript
   export const paths = { myPage: '/my-page' };
   ```

### Update Theme
**Global tokens:**
- Colors: `src/theme/palette.ts`
- Typography: `src/theme/typography.ts`
- Shadows: `src/theme/shadows.ts`

**Component overrides:**
- Edit/create `src/theme/components/[Component].tsx`
- Register in `src/theme/theme.ts`:
  ```typescript
  import MyComponent from './components/MyComponent';
  
  components: { MuiMyComponent: MyComponent }
  ```

### Use Redux & API
**Access store:**
```typescript
import { useAppDispatch, useAppSelector } from 'core/store/hooks';
import { transactionsSlice } from 'core/store/slices/transactions.slice';

const dispatch = useAppDispatch();
const transactions = useAppSelector(state => state.transactions.data);

// Fetch data
const { data, isLoading, error } = useGetTransactionsQuery({ filters: {} });
```

**Mock services:**
- Located in `src/core/api/mock/`
- Automatically used by RTK Query endpoints (via `fakeBaseQuery`)
- Easy to replace with real HTTP when ready

### Import Best Practices
```typescript
// ✅ DO use path aliases
import { useTransactions } from 'domain/transactions/hooks';
import { formatCurrency } from 'core/utils/format-functions';
import { STORAGE_KEYS } from 'core/config/constants';
import StyledTabs from 'components/ui/StyledTabs';

// ❌ DON'T use relative paths
import { useTransactions } from '../../../domain/transactions/hooks';
```

---

## 🎨 Styling & Theme

### MUI Theme Structure
```typescript
// src/theme/theme.ts
export const theme = createTheme({
  typography: typography,      // Font settings
  palette: palette,            // Colors
  components: {                // Component overrides
    MuiButton: Button,
    MuiCard: Card,
    // ... more overrides
  },
});
```

### Adding Component Override
1. Create `src/theme/components/MyComponent.tsx`:
   ```typescript
   import { Theme } from '@mui/material';
   import { Components } from '@mui/material/styles';

   const MyComponent: Components<Omit<Theme, 'components'>>['MuiMyComponent'] = {
     styleOverrides: {
       root: ({ theme }: any) => ({
         backgroundColor: theme.palette.primary.main,
       }),
     },
   };

   export default MyComponent;
   ```

2. Register in `src/theme/theme.ts`:
   ```typescript
   import MyComponent from './components/MyComponent';
   
   // In createTheme():
   components: { MuiMyComponent: MyComponent }
   ```

---

## 🛣️ Routing

**Path aliases work:**
- `routes/router.tsx`
- `routes/paths.ts`
- `vite.config.ts` has `base: '/tracker'`

**Local development:**
- Routes registered under `/tracker` basename
- Open `http://localhost:3000/tracker` (NOT `http://localhost:3000`)

**Lazy loading pattern:**
```typescript
const MyPage = lazy(async () => {
  return Promise.all([
    import('pages/MyPage'),
    new Promise((resolve) => setTimeout(resolve, 500)), // Artificial delay
  ]).then(([moduleExports]) => moduleExports);
});

// Use in routes array
{ path: paths.myPage, element: <MyPage /> }
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| TypeScript | Type safety |
| MUI 7.x | UI component library |
| Redux Toolkit | State management |
| RTK Query | Data fetching |
| React Router | Client-side routing |
| ECharts | Charts & graphs |
| Dayjs | Date manipulation |

---

## ⚡ Performance Notes

- **Lazy loading:** All routes use `React.lazy` + `Suspense` for code splitting
- **Mock data:** Located in `src/core/api/mock/` for easy development
- **Simplebar:** Custom scrollbars via `ScrollbarProvider`
- **Path aliases:** Faster imports, better refactoring (via `vite-tsconfig-paths`)

---

## 🛠️ Troubleshooting

### 404 errors on page refresh
- Ensure you're opening `http://localhost:3000/tracker` (not `http://localhost:3000`)
- Check `vite.config.ts` for `base: '/tracker'`

### TypeScript errors on build
- Run `npx tsc --noEmit` to check types
- Ensure imports use correct path aliases from `tsconfig.json`

### Build succeeds but styles missing
- Check `src/theme/theme.ts` for all component overrides
- Verify theme is wrapped in `<ThemeProvider>` in `src/main.tsx`

### Redux store not updating
- Use typed hooks from `core/store/hooks` (not Redux hooks directly)
- Dispatch actions with `useAppDispatch`

---

## 📝 License

MIT License. See `LICENSE.txt` for details.

---

**Last Updated:** November 2025
