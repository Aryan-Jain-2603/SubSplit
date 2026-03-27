# AGENTS.md

## Project Context
CraveCart is being upgraded from a server-rendered `Express + EJS + Bootstrap` app to a separate `Vite + React` frontend using `Tailwind CSS` and `Headless UI`, while preserving the current Node/Express backend, MongoDB models, Passport session auth, and Razorpay integration.

This file exists to keep implementation work consistent, fast, and decision-safe for Codex and other agents working in this repository.

## Primary Goal
Implement the frontend migration described in [docs/frontend-upgrade-plan.md](/C:/Users/Aryan%20jain/Desktop/desktop/delta/projects/CraveCart/docs/frontend-upgrade-plan.md) with the smallest necessary backend compatibility changes.

The target outcome is:

- a separate React app under `frontend/`
- a modern Tailwind + Headless UI interface
- preserved backend business behavior
- preserved session/cookie auth
- minimal backend changes limited to integration needs

## Non-Negotiable Constraints

### Keep backend scope tight
Do not redesign the backend architecture in this phase.

Allowed backend changes:
- CORS for the React dev origin
- cookie/session compatibility for local development
- small JSON endpoints or response-shape adjustments needed by React
- optional current-user bootstrap endpoint such as `/me`

Not allowed unless explicitly requested:
- schema redesign
- auth redesign to JWT
- payment flow rewrite
- moving business logic to a new backend framework
- unrelated refactors

### Frontend rewrite is in scope
The old EJS frontend does not need to be preserved stylistically. Replace it completely at the UI level. EJS files may remain temporarily as fallback during migration, but React becomes the main frontend.

### Preserve current product behavior
These flows must continue to work:
- signup
- login
- logout
- browse plans
- search
- category filtering
- create plan
- edit plan
- delete plan
- join plan
- wallet top-up
- prediction request

## Repository Working Areas

### Backend
- Root Express app lives in the repository root
- Main entry point: `app.js`
- Existing templates: `views/`
- Static assets: `public/`
- Controllers/models remain the backend source of truth

### Frontend
- New frontend lives in `frontend/`
- Treat `frontend/` as the primary implementation area for UI work

## Required Architecture Decisions
Use these decisions consistently. Do not reopen them during implementation unless the user explicitly changes scope.

- Frontend stack: `Vite + React`
- Styling: `Tailwind CSS`
- Accessible primitives: `Headless UI`
- Routing: `react-router-dom`
- Server state: `@tanstack/react-query`
- HTTP layer: `axios` with credentials enabled
- Auth model: existing session/cookie auth from Express
- Serving model: separate frontend app and backend app

## Implementation Order
Work in this sequence unless blocked:

1. `frontend` foundation and configuration
2. Vite proxy and backend CORS/session compatibility
3. app shell and shared UI primitives
4. auth flows
5. browse/plans page
6. create/edit plan flows
7. subscriptions dashboard
8. profile and wallet flow
9. about page
10. final polish, accessibility, and verification

Do not jump into isolated page styling before the shell, tokens, and shared primitives exist.

## Frontend Standards

### UI direction
The UI should feel modern, premium, and intentional.

Expected characteristics:
- light-first interface
- strong spacing and hierarchy
- clean card-based layouts
- restrained accent palette
- clear loading, error, and empty states
- mobile-first responsiveness

Do not recreate the Bootstrap look in React.

### Component-first approach
Before building pages, establish reusable primitives and compose pages from them.

Expected shared components include:
- `AppShell`
- `Navbar`
- `MobileNavDialog`
- `Footer`
- `FlashBanner`
- `PageHeader`
- `SearchBar`
- `FilterPanel`
- `CategoryChips`
- `PlanCard`
- `EmptyState`
- `LoadingState`
- `AuthForm`
- `SectionTabs`
- `ConfirmDialog`
- `CredentialRevealCard`
- `PaymentButton`

### Styling rules
- Prefer Tailwind utility classes over ad hoc CSS files
- Keep any custom CSS centralized and minimal
- Use `clsx` and `tailwind-merge` for class composition
- Define reusable layout and state patterns early
- Avoid one-off styling that cannot be reused

### Interaction rules
Use Headless UI for:
- mobile menus
- drawers
- tabs
- dropdown menus
- dialogs

All interactive components must:
- support keyboard navigation
- expose visible focus styles
- keep semantic structure intact

## Backend Integration Rules

### API and data access
- Centralize frontend HTTP calls under `frontend/src/api/`
- Default to `axios` with `withCredentials: true`
- Avoid scattering direct fetch logic across components

### Session auth
- Reuse backend cookies and Passport session behavior
- Do not add client-side token storage
- If current-user bootstrap is needed, add a minimal backend endpoint rather than guessing auth state in the client

### Redirect-oriented backend flows
Some existing Express routes are built for server-rendered redirects. If React cannot consume them cleanly:
- prefer adding a small JSON variant
- keep the original backend behavior intact where possible
- avoid broad controller rewrites

## File and Code Organization

### Recommended frontend structure
Use this shape unless a better equivalent clearly improves clarity:

```text
frontend/src/
  api/
  app/
  components/
  features/
  hooks/
  layouts/
  lib/
  pages/
  routes/
  styles/
```

### Naming
- Use clear, domain-based names
- Prefer `PascalCase` for React component files
- Prefer route/page names that match product concepts, not implementation details

## Quality Bar

### Every implemented page should have
- loading state
- empty state where relevant
- error state where relevant
- mobile layout
- keyboard-usable interactions
- consistent spacing and typography

### Every backend compatibility change should be
- minimal
- localized
- clearly justified by the frontend migration

## Testing and Verification

### Minimum verification after meaningful changes
Check these flows regularly:
- login
- signup
- session persistence after refresh
- plans listing
- search and category filtering
- create plan
- edit plan
- delete plan
- join plan
- wallet top-up
- prediction request

### Before considering the migration complete
Verify:
- protected routes behave correctly
- cookies work between frontend and backend in dev
- dialogs/drawers/tabs are keyboard accessible
- no page depends on legacy inline EJS scripts
- UI is consistent across all main pages

## Risk Management

### High-risk areas
- cookie/session behavior across separate frontend/backend origins
- Razorpay flow after moving logic into React
- redirect-based backend actions used by the React app
- current credential reveal behavior

When touching these areas:
- keep changes minimal
- verify immediately
- avoid bundling unrelated refactors into the same step

## Documentation Rule
If implementation decisions materially deviate from [docs/frontend-upgrade-plan.md](/C:/Users/Aryan%20jain/Desktop/desktop/delta/projects/CraveCart/docs/frontend-upgrade-plan.md), update the document so the repo stays decision-consistent.

## Default Execution Behavior
When uncertain:
- prefer the smaller backend change
- prefer the more reusable frontend abstraction
- prefer consistency over cleverness
- prefer finishing one vertical slice cleanly over scattering partial work

The main job is not to experiment. The main job is to ship the React frontend migration cleanly and quickly without destabilizing the backend.
