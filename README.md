# Admin Dashboard (tracker-ui)

Compact, customizable admin dashboard built with React, Vite, TypeScript and MUI (Material UI).

![Product screenshot](public/homepage.png)

## Table of contents
- About
- Built with
- Getting started
  - Prerequisites
  - Install
  - Run (dev / build / preview)
- Project structure & key files
- Conventions & gotchas
- License

## About

This repository is a Vite + React + TypeScript dashboard scaffold using Material UI for components and ECharts for charts. It uses a theme-driven approach (MUI theme overrides) and lazy-loaded routes for performance.

## Built with
- React 18
- Vite
- TypeScript
- MUI (Material UI)
- ECharts (`echarts` + `echarts-for-react`)

## Getting started

### Prerequisites
- Node.js (recommend LTS >=16)
- npm or yarn

### Install
Clone and install dependencies:

```powershell
git clone https://github.com/Jayachandara/tracker-ui.git
cd tracker-ui
npm install
```

### Run (development)

Start the development server (Vite):

```powershell
npm run dev
```

Open your browser at: `http://localhost:3000/tracker` — the router uses a `basename` of `/tracker` (see `vite.config.ts` and `src/routes/router.tsx`).

### Build & Preview

```powershell
npm run build     # runs tsc && vite build
npm run preview   # preview built dist on port 5000
```

### Deploy

This project includes a `predeploy` script that copies `index.html` to `404.html` and a `deploy` script using `gh-pages`:

```powershell
npm run predeploy
npm run deploy
```

## Project structure & key files
- `src/main.tsx` — app bootstrap; mounts `ThemeProvider`, `BreakpointsProvider`, `RouterProvider`.
- `src/routes/router.tsx` & `src/routes/paths.ts` — routing configuration and `basename` (`/tracker`).
- `src/layouts/main-layout` & `src/layouts/auth-layout` — global shells (topbar, sidebar, footer).
- `src/theme/*` — theme tokens and MUI component overrides. Register per-component overrides in `src/theme/theme.ts` (example: `src/theme/components/Button.tsx`).
- `src/components/sections/*` — feature pages and section components (dashboard, transactions, etc.).
- `src/data/*` and `src/dtos/*` — demo data and DTO/type shapes.

## Conventions & gotchas
- Path aliases are used (imports like `import router from 'routes/router.tsx'`) — `vite-tsconfig-paths` is enabled in `vite.config.ts`.
- Theme customization: edit tokens in `src/theme/palette.ts`, `src/theme/typography.ts`, and `src/theme/shadows.ts`; override components in `src/theme/components` and register them in `src/theme/theme.ts`.
- Lazy loading: `React.lazy` + `Suspense` is used in `src/routes/router.tsx` with small artificial delays; follow this pattern for large routes.
- Router basename: the app expects to run at `/tracker`. When testing locally, open `http://localhost:3000/tracker` to avoid 404s.

## License

Distributed under the MIT License. See `LICENSE.txt` for details.

