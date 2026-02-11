# TeamHub Frontend

## Project Overview
TeamHub is a modern project management dashboard for organizing projects, tracking tasks, managing team members, and viewing analytics. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form + Zod for validation
- **Charts**: Recharts for data visualization
- **Internationalization**: next-i18next
- **Testing**: Jest + React Testing Library

## Project Structure
```
src/
  components/
    layout/          # Sidebar, AppLayout
    pages/           # Feature pages (dashboard, projects, tasks, members)
    ui/              # Reusable UI components (button, input, table, dialog)
  hooks/             # useAuth, useCurrentOrg
  lib/               # Utilities, constants, auth, API helpers
  pages/             # Next.js pages + BFF API routes
  types/             # TypeScript type definitions
  i18n/              # Translation files
tests/               # Jest test suites
```

## Architecture Patterns

### Backend-for-Frontend (BFF)
API routes in `src/pages/api/` proxy requests to the backend service. All client-side requests go through these BFF endpoints for security and data transformation.

### Authentication
Mock authentication system using hardcoded JWT tokens for development. Auth state managed via `useAuth` hook with localStorage persistence.

### Data Fetching
TanStack Query manages all server state with automatic caching, revalidation, and optimistic updates. Mutations invalidate related queries to keep UI in sync.

### Form Handling
All forms use React Hook Form with Zod schemas for type-safe validation. Validation happens on both client (immediate feedback) and server (security).

## Important Conventions

### TypeScript
- Strict mode enabled - no implicit `any`, strict null checks
- All API responses must be typed
- Prefer interfaces over types for object shapes
- Use `unknown` instead of `any` when type is truly unknown

### React Patterns
- Functional components with hooks only (no class components)
- `useCallback` for functions passed to child components
- `useMemo` for expensive computations
- Proper dependency arrays in `useEffect` and `useCallback`

### Async Operations
- All API calls use async/await with proper error handling
- Loading and error states managed via TanStack Query
- Optimistic updates for better UX on mutations

### Security Considerations
- All user input must be sanitized before display
- BFF routes handle authentication and authorization
- Sensitive data never stored in localStorage (use httpOnly cookies)
- CSRF protection on state-changing operations
