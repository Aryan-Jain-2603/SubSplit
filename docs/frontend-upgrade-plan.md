# CraveCart Frontend Upgrade Plan

## Summary
This document defines the implementation plan for replacing the current EJS/Bootstrap frontend with a separate `Vite + React` application using `Tailwind CSS` and `Headless UI`, while keeping the existing Express backend, MongoDB models, Passport session authentication, and Razorpay/payment routes in place.

Locked decisions:

- Frontend stack: `Vite + React`
- UI system: `Tailwind CSS + Headless UI`
- Auth strategy: keep current backend session/cookie auth
- Serving model: separate frontend app, separate Express backend
- Migration scope: rewrite all main pages in one pass

This is a frontend platform migration, not a backend rewrite. The backend remains the source of truth. The React app consumes the current backend routes and any existing JSON endpoints, with only minimal backend adjustments allowed where React integration requires them.

## Current System Analysis

### Existing frontend
The current UI is built with:

- `EJS` templates
- `Bootstrap`
- page-level inline CSS
- page-level inline JavaScript
- server-rendered flows tightly coupled to Express routes

### Current limitations
- Styling is fragmented across templates instead of centralized.
- UI components are duplicated instead of reusable.
- Inline scripts tightly couple behavior to markup.
- The visual system is inconsistent across pages.
- Responsive behavior exists, but not as a system.
- Accessibility is partial and mostly incidental.
- The product does not present as a cohesive modern application.

### Current user-facing screens
- `/home`
- `/about`
- `/signup`
- `/login`
- `/newsub`
- `/mysub`
- `/mysub/:id`
- `/profile`

These screens already cover the core product flows, so the main requirement is rebuilding the presentation layer cleanly.

## Upgrade Objective
Rebuild the full frontend as a modern React application that:

- completely replaces the EJS-based user interface
- preserves the existing backend contract as much as possible
- improves usability, responsiveness, accessibility, and visual quality
- creates a maintainable component-driven frontend foundation
- is achievable within a short delivery window by keeping backend changes minimal

## Architecture Decision

### New frontend platform
Create a separate `frontend/` app using:

- `Vite`
- `React`
- `React Router`
- `Tailwind CSS`
- `Headless UI`
- `TanStack Query`
- `Axios`

### Why this approach
- `Vite` gives the fastest credible React setup.
- `React` enables reusable UI composition.
- `Tailwind` supports rapid, high-quality UI rebuilding.
- `Headless UI` gives accessible interaction primitives without locking the design.
- Keeping Express intact avoids unnecessary scope expansion.
- Frontend/backend separation creates a cleaner long-term structure.

### What stays unchanged
- Express backend
- MongoDB models
- Passport session authentication
- Razorpay backend flow
- core backend business logic

### Minimal backend changes allowed
- configure CORS for the frontend origin
- allow credentialed requests in development
- optionally expose a `/me` endpoint for current-user bootstrap
- return JSON for flows where redirects are not practical for React

## Proposed Frontend Structure

### App location
The new frontend lives in:

```text
frontend/
```

### Recommended source structure
```text
frontend/
  src/
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
    main.jsx
```

### Folder responsibilities
- `api/`: axios client and request wrappers
- `app/`: top-level providers and bootstrapping
- `components/`: shared UI components
- `features/`: feature-scoped UI and logic
- `hooks/`: custom hooks
- `layouts/`: page shells and wrappers
- `lib/`: helpers and utilities
- `pages/`: route-level pages
- `routes/`: route definitions and guards
- `styles/`: Tailwind entry and global UI styling

## Routing Plan

### React routes
The new frontend should expose:

- `/`
- `/about`
- `/login`
- `/signup`
- `/plans`
- `/plans/new`
- `/plans/:id/edit`
- `/dashboard/subscriptions`
- `/dashboard/profile`

### Backend mapping
Map the current backend flows as follows:

- current `/home` to React `/` or `/plans`
- current `/newsub` to `/plans/new`
- current `/mysub` to `/dashboard/subscriptions`
- current `/profile` to `/dashboard/profile`
- current `/mysub/:id` to `/plans/:id/edit`

The React route map should feel cleaner than the current URL structure, while documented backend translation remains explicit.

## UI/UX Direction

### Product feel
The new interface should feel:

- modern
- premium
- trustworthy
- clean
- fast
- mobile-first

### Visual system
Recommended direction:

- light-first interface
- neutral/slate base palette
- indigo or emerald primary accents
- strong spacing and card hierarchy
- subtle gradients only where they add emphasis
- rounded corners and soft shadows
- stronger typography hierarchy than the current Bootstrap UI

### UX principles
- clear primary actions
- reduced clutter
- better scanning of cards and forms
- explicit loading, empty, and error states
- keyboard-accessible interactions
- visible focus states
- responsive layouts designed intentionally, not patched in later

## Component System

### Shared components
Build and reuse these components:

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
- `PlanGrid`
- `EmptyState`
- `LoadingState`
- `StatCard`
- `AuthForm`
- `TextField`
- `SelectField`
- `DateField`
- `Button`
- `Badge`
- `SectionTabs`
- `ConfirmDialog`
- `CredentialRevealCard`
- `PaymentButton`

### Headless UI usage
Use Headless UI for:

- mobile navigation drawer
- filter drawer
- dashboard tabs
- dropdown menus
- confirmation dialogs

## State Management
- Use `TanStack Query` for server data and mutations.
- Use React local state for page-level interaction state.
- Use one lightweight auth/session provider for current-user state.
- Do not introduce Redux for this phase.

## Page-by-Page Upgrade Plan

### 1. Browse Plans
This is the highest-value page and should establish the design language.

Goals:

- improve discoverability
- improve scanability
- improve CTA clarity
- improve search and filtering UX
- clearly distinguish guest, owner, and buyer states

Structure:

- hero header
- search input
- category chips
- desktop filter sidebar
- mobile filter drawer via Headless UI
- responsive plan card grid

Each plan card should show:

- image/logo
- name
- category
- type
- price
- slots left
- owner name
- expiry date
- prediction section
- context-aware CTA

CTA states:

- guest: prompt to sign in or join
- owner: edit/delete
- logged-in non-owner: prediction and join
- unavailable: disabled state

### 2. Login and Signup
Goals:

- cleaner auth flow
- stronger trust and polish
- simpler layout
- better mobile usability

Structure:

- centered auth layout
- strong form card
- clear labels and helper text
- primary CTA
- link to alternate auth flow
- integrated validation and flash states

### 3. Create Plan
Goals:

- make plan creation structured and readable
- reduce visual clutter
- improve form hierarchy

Sections:

- basic info
- plan configuration
- pricing and slots
- access details
- expiry and image
- submit section

All field names must remain aligned with backend expectations.

### 4. Edit Plan
Use the same structure and design system as create plan, with prefilled values and a cleaner editing flow.

### 5. My Subscriptions Dashboard
Goals:

- replace collapse-based UI with a clearer dashboard experience
- separate hosted plans from joined plans
- surface actions more clearly

Structure:

- page header with summary
- Headless UI tabs or segmented switcher
- hosted plans tab
- joined plans tab

Hosted plans section should emphasize:

- hosted plan cards
- slot count
- type
- price
- expiry
- edit/delete actions

Joined plans section should emphasize:

- joined plan cards
- masked credentials by default
- explicit reveal action
- better treatment for sensitive data

### 6. Profile
Goals:

- present account data clearly
- make wallet state more legible
- make top-up action obvious

Structure:

- account summary card
- wallet card
- top-up action group
- optional quick actions
- clear payment feedback states

### 7. About
Goals:

- turn the current page into a lightweight product-marketing screen
- explain the product clearly
- provide a strong CTA into browsing or signup

Sections:

- hero
- value proposition
- how it works
- benefits/trust
- CTA

## Backend Integration Plan

### Integration rules
- Keep backend behavior intact wherever possible.
- Centralize frontend API access in one layer.
- Always send credentials for authenticated requests.

### Expected backend interaction areas
- current user/session bootstrap
- plans listing
- search
- category filtering
- create/update/delete plan
- join plan
- wallet top-up
- prediction

### Compatibility requirements
- configure CORS for `http://localhost:5173`
- allow `credentials: true`
- adjust session cookie settings if needed for local development
- add a minimal `/me` endpoint if session bootstrap is too awkward without it

## Implementation Plan

### Phase 1: Foundation
- set up the Vite React app
- configure Tailwind via the Vite plugin
- configure React Router
- configure TanStack Query
- configure the axios client
- define theme tokens and layout primitives

### Phase 2: App shell
- build navbar
- build mobile nav dialog
- build page container system
- build flash/error surface
- build footer
- create route scaffolding

### Phase 3: Shared primitives
- buttons
- inputs
- selects
- date fields
- badges
- cards
- tabs
- dialogs
- empty/loading/error states

### Phase 4: Auth pages
- signup page
- login page
- protected route handling
- current user session bootstrap

### Phase 5: Browse and plan management
- plans page
- search and filter UI
- create plan page
- edit plan page
- delete plan flow

### Phase 6: Dashboard and profile
- subscriptions dashboard
- profile page
- wallet top-up UI
- credential reveal UI

### Phase 7: Product polish
- about page
- loading skeletons
- error handling
- accessibility pass
- responsive pass

## Detailed Task Breakdown

### Foundation tasks
- create route structure under `frontend/src`
- define global stylesheet
- set typography, spacing, color, and shadow tokens
- create the provider tree
- create the API client

### Integration tasks
- configure Vite dev proxy
- configure Express CORS and session compatibility
- centralize API error handling
- implement auth bootstrap flow

### Shared component tasks
- button variants
- field wrappers
- card patterns
- tabs and dialogs
- navbar and footer

### Screen tasks
- build auth pages
- build browse page
- build create/edit pages
- build subscriptions dashboard
- build profile page
- build about page

### Cleanup tasks
- stop relying on EJS for the active frontend
- keep EJS as fallback until verification is complete
- verify frontend route and backend route alignment

## Risks and Constraints

### Time risk
This is a broad migration for a short timeline. Shared primitives must be built first or the UI will become inconsistent.

### Backend coupling risk
Some existing backend routes are redirect-oriented and not ideal for a React consumer. Small compatibility changes may be required.

### Auth/session risk
Session cookies may fail across the frontend and backend apps without correct CORS and cookie configuration.

### Payment risk
The Razorpay flow must be ported carefully because the current implementation assumes page-level script behavior.

### Sensitive data risk
The current backend still exposes plan credentials. The frontend should keep them masked by default and never surface them unnecessarily.

## Test Cases and Acceptance Criteria

### Functional validation
- signup works
- login works
- logout works
- authenticated session survives refresh
- protected screens behave correctly
- plans list renders correctly
- search works
- category filtering works
- create plan works
- edit plan works
- delete plan works
- join plan works
- wallet top-up works from the React profile page
- prediction works from React plan cards
- hosted and joined plans render correctly

### UX validation
- all pages are responsive
- mobile nav works
- filter drawer works
- tabs work
- dialogs are keyboard accessible
- loading states are visible
- empty states are intentional
- form validation is understandable
- focus states are visible

### Visual validation
- design is consistent across screens
- spacing and component patterns are unified
- buttons and forms follow one system
- the interface no longer resembles a default Bootstrap app

## Deliverables
By the end of this phase, the repo should have:

- a working `frontend/` React app
- a Tailwind-based UI system
- Headless UI interactions for drawers, tabs, menus, and dialogs
- migrated major user-facing pages
- backend compatibility for session auth and API usage
- old EJS frontend retained only as fallback until verified

## Assumptions and Defaults
- This phase is frontend-only in scope.
- Express remains the backend.
- MongoDB remains unchanged.
- Passport session auth remains unchanged.
- Minimal backend compatibility edits are allowed.
- The React app is separate under `frontend/`.
- Full route/page migration is in scope.

## Recommended Immediate Execution Order
1. Tailwind and Vite configuration
2. frontend route shell
3. backend CORS and session compatibility
4. shared UI primitives
5. auth pages
6. browse/plans page
7. create/edit flows
8. dashboard and profile
9. about page
10. final accessibility and responsive pass
