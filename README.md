# TeamHub Frontend

A modern project management dashboard built with Next.js 14, TypeScript, and Tailwind CSS. TeamHub helps teams organize projects, track tasks, manage members, and view analytics in a clean, responsive interface.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State/Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Internationalization**: next-i18next
- **Testing**: Jest + React Testing Library

## Project Structure

```
src/
  components/
    layout/          # Sidebar, AppLayout
    pages/           # Feature pages (dashboard, projects, tasks, members)
    ui/              # Reusable UI primitives (button, input, table, dialog, etc.)
  hooks/             # useAuth, useCurrentOrg
  lib/               # Utils, constants, auth, API request helpers
  pages/             # Next.js pages + BFF API routes
  types/             # Shared TypeScript type definitions
  i18n/              # Translation files
tests/               # Jest test suites
```

## Getting Started

```bash
npm install
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build
npm test          # Run test suite
npm run lint      # ESLint
```

## BFF API Routes

The frontend includes Backend-for-Frontend API routes under `src/pages/api/` that proxy requests to the backend service:

| Route | Description |
|-------|-------------|
| `/api/projects/*` | Project CRUD and archival |
| `/api/tasks/*` | Task management and status updates |
| `/api/members/*` | Member listing and invitations |
| `/api/analytics/*` | Dashboard statistics |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080` |
| `NEXT_PUBLIC_APP_ENV` | App environment | `development` |

## Contributing

1. Create a feature branch from `main`
2. Make your changes and ensure tests pass (`npm test`)
3. Ensure the build succeeds (`npm run build`)
4. Open a pull request
