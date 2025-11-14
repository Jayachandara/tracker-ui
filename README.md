# Tracker UI - Admin Dashboard

A modern, responsive admin dashboard built with **React 18**, **Vite**, **TypeScript**, **Material UI**, and **Redux Toolkit**.

![Tracker UI Dashboard](public/homepage.png)

## 🚀 Quick Start

### Install & Run
```bash
npm install
npm run dev
# Open: http://localhost:3000/tracker
```

### Build & Deploy
```bash
npm run build    # Production build
npm run preview  # Preview locally
npm run deploy   # Deploy to GitHub Pages
```

## 📚 Documentation

- **[PROJECT_GUIDE.md](PROJECT_GUIDE.md)** — Complete project guide, architecture, and workflows
- [Copilot Instructions](.github/copilot-instructions.md) — AI assistant setup

## 🏗️ Project Structure

```
src/
├── core/              # Shared infrastructure (store, API, utils, types)
├── domain/            # Feature-specific logic (hooks, services, types)
├── components/        # React UI components
├── layouts/           # Page shells (main, auth)
├── pages/             # Page containers
├── routes/            # Router config
├── theme/             # MUI theme & component overrides
├── providers/         # Context providers
└── main.tsx          # App entry point
```

## 🎯 Key Features

✅ **4-Layer Architecture** — Clean separation of concerns (UI → Domain → API → Core)  
✅ **Redux + RTK Query** — Modern state management with mock data  
✅ **MUI Customization** — Fully themed Material UI components  
✅ **Path Aliases** — Fast imports with `tsconfig` paths  
✅ **Lazy Loading** — Code-split routes for performance  
✅ **TypeScript** — Full type safety  

## 📦 Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| Vite | 5.x | Build tool |
| TypeScript | Latest | Type safety |
| MUI | 7.x | Component library |
| Redux Toolkit | Latest | State management |
| RTK Query | Latest | Data fetching |
| React Router | Latest | Client routing |
| ECharts | Latest | Charts & visualization |

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000/tracker) |
| `npm run build` | Production build |
| `npm run preview` | Preview build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy to GitHub Pages |

## 📋 Development Notes

- **Router basename:** All routes use `/tracker` prefix
- **Path aliases:** Use `import from 'core/...'` instead of relative paths
- **Theme:** Edit `src/theme/` for styling; component overrides in `src/theme/components/`
- **Mock data:** Located in `src/core/api/mock/` for easy development
- **Redux hooks:** Use typed hooks from `core/store/hooks`

## 🎨 Customization

### Update Theme
1. Edit global tokens: `src/theme/palette.ts`, `src/theme/typography.ts`
2. Override components: `src/theme/components/[Component].tsx`
3. Register in: `src/theme/theme.ts`

### Add a Route
1. Create page in `src/pages/[feature]/`
2. Add to router in `src/routes/router.tsx`
3. Update paths in `src/routes/paths.ts`

**Full guide:** See [PROJECT_GUIDE.md](PROJECT_GUIDE.md)

## 📝 License

MIT License — See `LICENSE.txt` for details

---

**Need help?** Check [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for detailed documentation.

