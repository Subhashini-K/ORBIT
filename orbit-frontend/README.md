# Orbit — AI Workspace (Frontend)

Orbit's frontend: authentication, app shell/navigation, and every planned
feature surface, now wired to the real **orbit-backend** API server (see that
project's README) instead of mock data. **No AI, LLM, vector search, Neo4j,
or Context Fusion logic lives in this codebase** — that is explicitly out of
scope for this layer and belongs to a later phase.

## Getting started

Requires Node.js 18+, and the `orbit-backend` server running (see its README —
`npm install && npm run seed && npm run dev`, default `http://localhost:4000`).

```bash
cp .env.example .env.local   # only needed if your backend runs somewhere non-default
npm install
npm run dev
```

> **If `npm install` errors on peer dependencies:** `recharts` (used on the
> Insights page) may not yet declare React 19 in its peer range depending on
> the exact version npm resolves. If you hit an `ERESOLVE` error, re-run with
> `npm install --legacy-peer-deps`. This does not affect anything else in the
> project — it's isolated to that one package.

The app runs at `http://localhost:5173`. If the backend was seeded
(`npm run seed` in orbit-backend), log in with:
```
email:    demo@orbit.app
password: OrbitDemo123!
```
Or sign up with any name, valid-looking email, and 8+ character password to
create a fresh (empty) account for real.

```bash
npm run build     # type-check + production build
npm run preview   # preview the production build locally
npm run lint       # eslint
```

## What's fully implemented in this delivery

- **Authentication** — Login, Signup, and Forgot Password, each with client-side
  validation, loading states, inline + form-level error handling, a password
  strength meter, and mock social buttons (Google/GitHub — not wired to real OAuth).
  Talks to the real `orbit-backend` server for actual account creation/login.
- **Dashboard** — the "Your Universe" orbit visualization (8 sources ringed around a
  central "Orbit AI" core, positioned with a fixed-angle layout), a stats bar (real
  `GET /dashboard`), a mocked AI Assistant panel with suggested prompts that hand off
  to `/chat`, and a Recent Activity feed (real `GET /activities`) — all backed by
  TanStack Query with real loading-skeleton states.
- **Sources** — a real card grid (Gmail, Calendar, Drive, GitHub, Photos, Notes,
  Spotify, WhatsApp) with brand icon, live status badge, meta text, and a working
  Connect/Disconnect flow backed by real `PATCH /sources/:id` — mutations invalidate
  the shared TanStack Query cache, so toggling a source here updates the Dashboard's
  Universe view too. Includes a summary bar, per-card loading skeletons, and an
  error/retry state.
- **AI Chat** — a real chat interface: message bubbles, an animated typing
  indicator, auto-scroll, suggested-prompt chips on an empty conversation, and a
  working input (Enter to send, Shift+Enter for a new line). Replies are
  keyword-matched, honestly-labeled placeholder copy — there is no model call
  anywhere, and this stays mock-only by design (see orbit-backend's README).
  Arriving here from the Dashboard's AI Assistant panel auto-sends the question
  you typed there.
- **Automations** — a card grid (8 automations spanning every connected source)
  with a working enable/disable `Switch`, frequency + last-run metadata, and a
  summary bar ("X of Y active"). Toggling is backed by real `PATCH /automations/:id`.
- **Memory** — a day-grouped timeline ("Today", "Yesterday", then full dates) of
  real events across every source, each entry showing its brand icon, a short
  description, and a time — backed by real `GET /memories`.
- **Insights** — summary cards, a weekly-activity bar chart, and a source-distribution
  donut chart, built with Recharts on real `GET /insights` data — genuine MongoDB
  aggregation on the backend, not mock numbers. The busiest day in the bar chart is
  highlighted in a different color; the donut's legend list doubles as a readable
  fallback for anyone who prefers numbers over shapes.
- **Settings** — four tabs (Profile, Security, Theme, Connected Apps) using a
  shared `Tabs` primitive. Profile editing writes back to the real `AuthContext`
  session; Security includes a mock password-change flow (reusing the auth
  feature's `PasswordInput`/`PasswordStrengthMeter`), a 2FA toggle, and a mock
  session list; Theme presents the (currently dark-only) appearance options
  honestly rather than pretending a light mode exists; Connected Apps reuses
  `useSources()`/`useUpdateSource()` directly — no new data layer needed.
- **App shell** — responsive sidebar + topbar layout, mobile bottom nav, route guards
  (`RequireAuth` / `GuestOnly`), 404 page, and the full navigation structure for all
  eight planned pages.
- **Design system** — dark, space-themed, glassmorphic Tailwind theme; a small set of
  shadcn/ui-style primitives (Button, Input, Card, Checkbox, Switch, Avatar, Skeleton,
  Progress, Alert, Tabs) that every feature reuses, plus a shared `BrandIcon` component
  for source identity (Gmail, Calendar, Drive, Photos, Notes, Spotify, WhatsApp, GitHub).

**All eight pages from the original brief are now built** — Authentication,
Dashboard, Sources, AI Chat, Memory, Insights, Automations, and Settings.
Everything except AI Chat's replies (mock by design) and Settings' Security/Theme
tabs (not backed by real endpoints yet) now reads and writes real data through
`orbit-backend`.

## Backend integration

Every feature's `api/` file calls the real API server via a shared client
(`src/lib/apiClient.ts`), which attaches the bearer token from
`src/features/auth/store/authStorage.ts` and normalizes errors into a single
`ApiError` class that every form/mutation's error handling already expects.

| Endpoint | File |
|---|---|
| `POST /auth/login` | `src/features/auth/api/authApi.ts` |
| `POST /auth/signup` | `src/features/auth/api/authApi.ts` |
| `POST /auth/forgot-password` | `src/features/auth/api/authApi.ts` |
| `GET /dashboard` | `src/features/dashboard/api/dashboardApi.ts` |
| `GET /activities` | `src/features/dashboard/api/dashboardApi.ts` |
| `GET /sources` | `src/features/sources/api/sourcesApi.ts` |
| `PATCH /sources/:id` | `src/features/sources/api/sourcesApi.ts` |
| `GET /automations` | `src/features/automations/api/automationsApi.ts` |
| `PATCH /automations/:id` | `src/features/automations/api/automationsApi.ts` |
| `GET /memories` | `src/features/memory/api/memoryApi.ts` |
| `GET /insights` | `src/features/insights/api/insightsApi.ts` |

`src/features/chat/api/chatApi.ts` is the one deliberate exception — it still
uses `src/lib/mockApi.ts`'s `delay()` helper and returns static, keyword-matched
placeholder replies. That's by design (see the original brief's "no AI/LLM
integration" constraint), not an oversight.

The original mock fixture files (`src/mocks/*.ts`) are no longer imported by
anything — they're kept in place as a reference for what shape the seed data
used to be, and would be a reasonable starting point for writing tests later,
but nothing in the app depends on them anymore.

Session state (`token` + `user`) is persisted to `localStorage` via
`src/features/auth/store/authStorage.ts`, unchanged from before.

## Architecture

Feature-based, not type-based: each feature owns its own `api/`, `components/`,
`hooks/`, `pages/`, and `types.ts`, and only exports what other features need
through an `index.ts` barrel (see `src/features/auth/index.ts`).

```
src/
  app/                  Router, providers, route guards — app-wide wiring
  components/
    ui/                 shadcn/ui-style primitives (Button, Input, Card, ...)
    layout/             AppShell, Sidebar, Topbar, MobileNav
    common/             Cross-feature building blocks (EmptyState, Starfield, ...)
  features/
    auth/                Fully implemented this phase
      api/                mock POST /auth/* calls
      components/         AuthShell, LoginForm, SignupForm, ForgotPasswordForm, ...
      hooks/               useLogin, useSignup, useForgotPassword (TanStack Query)
      pages/               LoginPage, SignupPage, ForgotPasswordPage
      store/               AuthContext + localStorage persistence
      types.ts
    dashboard/               Fully implemented this phase
      api/                    mock GET /dashboard, GET /activities
      components/             OrbitUniverse, UniverseNode, StatsBar, AIAssistantPanel, RecentActivityPanel
      hooks/                  useDashboardStats, useActivities (TanStack Query)
      pages/                  DashboardPage
    sources/                 Fully implemented this phase
      api/                    mock GET /sources, PATCH /sources/:id (in-memory store)
      components/             SourceCard, SourceCardSkeleton, SourcesSummaryBar
      hooks/                  useSources, useUpdateSource (TanStack Query)
      pages/                  SourcesPage
    chat/                    Fully implemented this phase
      api/                    mock keyword-matched reply generator (chatApi.ts)
      components/             ChatMessageBubble, TypingIndicator, ChatInput, ChatSuggestions
      hooks/                  useChatSession (in-memory message state + mock "send")
      pages/                  ChatPage
      types.ts
    automations/             Fully implemented this phase
      api/                    mock GET /automations, PATCH /automations/:id (in-memory store)
      components/             AutomationCard, AutomationCardSkeleton, AutomationsSummaryBar
      hooks/                  useAutomations, useToggleAutomation (TanStack Query)
      pages/                  AutomationsPage
      types.ts
    settings/                Fully implemented this phase
      components/             ProfileTab, SecurityTab, ThemeTab, ConnectedAppsTab
      pages/                  SettingsPage (uses the new ui/tabs.tsx primitive)
    memory/                  Fully implemented this phase
      api/                    mock GET /memories (day-grouped timeline)
      components/             MemoryTimeline, MemoryTimelineSkeleton
      hooks/                  useMemories (TanStack Query)
      pages/                  MemoryPage
      types.ts
    insights/                Fully implemented this phase
      api/                    mock GET /insights
      components/             InsightSummaryCards, ActivityBarChart, SourceDistributionChart (Recharts)
      hooks/                  useInsights (TanStack Query)
      pages/                  InsightsPage
      types.ts
  lib/                   cn() helper, TanStack Query client, mock API infra
  mocks/                 Static JSON-shaped fixtures for future GET endpoints
  types/                 Shared cross-feature types (Source, ActivityItem, ...)
```

**Why feature-based:** every feature is independently testable, and a new
contributor can open `src/features/sources/` and find everything about
Sources in one place, rather than hunting across `components/`, `hooks/`,
and `pages/` folders that mix every feature together.

## Design system notes

- Colors, radii, and the dark-mode-only token set live in `src/index.css`
  (`:root` CSS variables, shadcn convention) and `tailwind.config.ts` (the
  `orbit` and `space` palettes, plus `gradient-orbit` utilities).
- `OrbitLogo`, `StarfieldBackground`, and the animated rings in `AuthShell`
  are the only "branded" visual components — everything else is built from
  the shared `ui/` primitives so the whole app stays visually consistent
  as new features are added.
- Motion is deliberately restrained: page-entry fades/slides and the sidebar's
  active-item indicator (Framer Motion `layoutId`) are the only animations in
  this phase — more will layer in naturally as real content replaces placeholders.

## Next phase (not in this delivery)

The frontend from the original brief is complete, and now wired to a real
backend for everything except AI Chat (mock by design). What's next is out
of frontend scope entirely: real OAuth-based data connectors (Gmail,
Calendar, Drive, GitHub) so `Activity`/`Memory`/`Source` documents reflect a
user's actual accounts instead of the seed script, and the AI/Context Fusion
Engine layer (Knowledge Processing Engine, Hybrid Retrieval, Context Fusion
Engine, AI Reasoning Engine) — see `orbit-backend`'s README for the same
roadmap from the server side.
