<!-- Copilot instructions for the tracker-ui (Tracker) project -->

Purpose
- Help AI coding assistants be immediately productive in this codebase: what to change, where to look, and how to run it.

Big picture
- This is a Vite + React + TypeScript dashboard scaffold using Material UI and ECharts.
- Entry point: `src/main.tsx` mounts `ThemeProvider` -> `BreakpointsProvider` -> `RouterProvider`.
-- Routing is client-side (`react-router-dom`) with a `basename` of `/tracker` (see `src/routes/router.tsx` and `vite.config.ts`).

Where to start (key files)
- `src/main.tsx` — app bootstrapping and global providers.
- `src/routes/router.tsx` & `src/routes/paths.ts` — route structure and `basename` (`/tracker`).
- `src/layouts/main-layout` and `src/layouts/auth-layout` — global page shells (topbar, sidebar, footer).
- `src/theme/*` — all theme tokens and component overrides. See `src/theme/theme.ts` and per-component overrides under `src/theme/components` (example: `Button.tsx`).
- `src/components/sections/*` — feature pages and micro UI pieces organized by section (dashboard, transactions, etc.).
- `src/data/*` and `src/dtos/*` — local fixture data and DTO shapes used by UI components.

Conventions & patterns
- Path aliases are used (imports like `import router from 'routes/router.tsx'`) — `vite-tsconfig-paths` is enabled in `vite.config.ts`.
- Theme customization is centralized: add/adjust MUI overrides in `src/theme/components/*` and register them in `src/theme/theme.ts`.
- Lazy loading pattern: `React.lazy` + `Suspense` is used in `src/routes/router.tsx` with small artificial delays; follow the same pattern when adding large routes.
- Folder-by-feature: pages and their components live under `src/components/sections/<feature>/...` or `src/pages/<feature>/`.

Build / run / lint
- Install: `npm install` (or `yarn`).
- Dev server: `npm run dev` — Vite server configured to `port: 3000` and `base: '/tracker'`. Open `http://localhost:3000/tracker`.
- Build: `npm run build` (runs `tsc && vite build`).
- Preview: `npm run preview` (serves built `dist`).
- Lint: `npm run lint` (ESLint with TypeScript rules).
- Deploy: `npm run deploy` (uses `gh-pages -d dist`, see `predeploy` script that copies `index.html` to `404.html`).

Debugging & common gotchas
- Router basename: during development use the `base` path — routes are registered under `/tracker`. If you get 404s locally, verify you opened `http://localhost:3000/tracker`.
- Vite server config: `vite.config.ts` sets `server.port` to `3000` and `preview.port` to `5000` — tests / scripts referencing other ports may be out of date.
- TypeScript path aliases depend on `vite-tsconfig-paths`; editing `tsconfig.json` paths requires plugin-consideration.

How to modify UI theme or components
- To change global styles: edit tokens in `src/theme/palette.ts`, `src/theme/typography.ts`, and `src/theme/shadows.ts`.
- To tweak a single component's MUI defaults/overrides: edit or add a file under `src/theme/components/` (example: `Button.tsx`) and ensure it's exported in `src/theme/theme.ts`.

When adding routes/pages
- Add a route entry in `src/routes/paths.ts` and wire it in `src/routes/router.tsx` following the lazy+Suspense pattern.
- Place page UI under `src/pages/...` or `src/components/sections/...` depending on whether it is a full page or a section component.

Data and fixtures
- Small data is stored under `src/data/*.ts` (e.g., `transactions-data.ts`, `products.ts`) and consumed directly by components for demo content.
- DTO/shape definitions live under `src/dtos/` (e.g., `transactions-dtos.ts`) — prefer using these types in new components.

Examples (quick links)
- Change button styles: `src/theme/components/Button.tsx` -> registered in `src/theme/theme.ts`.
- Root router and basename: `src/routes/router.tsx` and `vite.config.ts` (look for `base: '/tracker'`).
- App bootstrap: `src/main.tsx`.

If something is missing
- Ask for which area you need: build, theme, routing, or a specific feature folder. Point to files and I will update or extend these rules.

End