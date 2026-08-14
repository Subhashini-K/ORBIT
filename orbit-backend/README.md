# Orbit API — Backend (Phase 2, Part 1: Foundation)

A real Express + TypeScript + MongoDB server implementing every endpoint the
Orbit frontend's mock layer was already written against — real signup/login
with bcrypt + JWT, real CRUD for Sources/Automations/Activities/Memories, and
real aggregation for Dashboard stats and Insights charts.

**What this is not:** there is no AI, LLM, vector search, Neo4j, embeddings,
retrieval, or Context Fusion Engine logic anywhere in this codebase. That is
intentional — this is Phase 2's foundation layer (per the development plan),
not the AI layer. A couple of metrics that will eventually be AI-derived
(`contextUnderstanding` on the dashboard) are computed here as an honest,
clearly-commented heuristic rather than faked.

---

## 1. Prerequisites

- Node.js 18+
- A MongoDB Atlas account (free tier is enough) — [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

## 2. Get a MongoDB connection string

1. Create a free Atlas cluster (M0 tier).
2. Under **Database Access**, create a database user with a username/password.
3. Under **Network Access**, add your current IP (or `0.0.0.0/0` for local dev only — not for production).
4. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
5. Add a database name before the `?`, e.g. `.../orbit?retryWrites=true...`.

## 3. Configure and run

```bash
cp .env.example .env
# edit .env: paste your MONGODB_URI, set a real JWT_SECRET (any long random string)

npm install
npm run seed   # creates a demo account with realistic pre-populated data
npm run dev    # starts the API on http://localhost:4000
```

The seed script prints a demo login:
```
email:    demo@orbit.app
password: OrbitDemo123!
```
Use it to log in and see the app fully populated (connected sources, active
automations, activity history, memories) without manually connecting anything.

```bash
npm run build   # type-check + compile to dist/
npm run start   # run the compiled build
```

---

## 4. API surface

All routes are prefixed with the base URL (`http://localhost:4000` by default). Every route except `/health` and `/auth/*` requires `Authorization: Bearer <token>`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | No | Liveness check |
| POST | `/auth/signup` | No | Creates a user + seeds default (disconnected) sources/automations |
| POST | `/auth/login` | No | Returns `{ user, token }` |
| POST | `/auth/forgot-password` | No | Always returns a generic success message (does not leak account existence) |
| GET | `/profile` | Yes | Current user |
| GET | `/sources` | Yes | All sources for the current user |
| PATCH | `/sources/:id` | Yes | Body: `{ status }` — one of `connected \| disconnected \| error \| syncing` |
| GET | `/activities` | Yes | Most recent 10 activity entries, with pre-formatted relative timestamps |
| GET | `/automations` | Yes | All automations for the current user |
| PATCH | `/automations/:id` | Yes | Body: `{ enabled }` |
| GET | `/dashboard` | Yes | Aggregate stats (connected sources, indexed data points, context understanding %, active automations) |
| GET | `/memories` | Yes | Most recent 30 memory entries |
| GET | `/insights` | Yes | Weekly activity by day, source distribution %, and a summary block — all computed from real `Activity` documents |

Every response shape is intentionally identical to what the frontend's mock
functions already returned, so wiring the frontend to this server (Phase 2's
next step) means only editing each feature's `api/*.ts` file to call `fetch`
instead of returning canned data — no component, hook, or type should need
to change.

---

## 5. Architecture

Feature-based, mirroring the frontend's structure:

```
src/
  app.ts                Express app assembly: middleware, routers, error handling
  server.ts              Entry point: connects to Mongo, starts the HTTP server
  config/
    env.ts                Loads and validates environment variables
    db.ts                 Mongoose connection
  middleware/
    requireAuth.ts         Verifies the JWT, attaches req.userId
    errorHandler.ts        Central error handler (Zod validation errors, ApiError, unexpected errors)
    notFound.ts             404 handler
  models/                 Mongoose schemas: User, Source, Activity, Automation, Memory
  features/
    auth/                   signup / login / forgot-password
    sources/                list + update connection status
    activities/             list recent activity
    automations/            list + toggle enabled
    dashboard/              aggregate stats
    profile/                current user
    memories/               timeline entries
    insights/               real aggregation over Activity documents
  utils/
    ApiError.ts             Structured HTTP errors
    asyncHandler.ts          Wraps async controllers for Express's error handling
    jwt.ts / password.ts     Auth primitives (jsonwebtoken, bcryptjs)
    relativeTime.ts          "2 min ago" formatting, matching the frontend's original mock strings
    sourceLabels.ts           Single source of truth for source display names
    seedUserDefaults.ts       What a brand-new signup starts with
  scripts/
    seed.ts                 Populates a rich demo account for local dev/demos
  types/
    index.ts                 Shared response shapes (kept identical to the frontend's types)
    express.d.ts              Augments Express's Request with `userId`
```

Each feature follows the same three-file pattern: `*.service.ts` (business
logic + DB access), `*.controller.ts` (HTTP request/response glue),
`*.routes.ts` (route wiring). `*.validation.ts` (Zod schemas) appears wherever
a route accepts a request body.

---

## 6. What's real vs. what's a placeholder

| Feature | Status |
|---|---|
| Signup / login | Real — bcrypt password hashing, real JWT issuance and verification |
| Sources connect/disconnect | Real CRUD, but the "connection" itself doesn't call any real Gmail/Calendar/etc. API yet — that's Phase 2, Part 2 (OAuth connectors) |
| Automations toggle | Real CRUD; automations don't actually *do* anything yet (no scheduler/worker) |
| Activities / Memories | Real CRUD and real read endpoints; nothing currently writes new activity/memory documents automatically — that will happen once real data connectors exist |
| Dashboard `connectedSources`, `automationsActive`, `dataPointsIndexed` | Real counts from the database |
| Dashboard `contextUnderstanding` | Explicit placeholder heuristic (`connected sources ÷ total sources`), clearly commented in `dashboard.service.ts` — not a real comprehension score, since there's no Context Fusion Engine yet |
| Insights (weekly activity, source distribution) | Real aggregation over `Activity` documents — genuinely computed, not mocked |

---

## 7. Next steps (per the development plan)

1. ~~Point the frontend at this server~~ — **done.** The `orbit` frontend project's
   `api/*.ts` files now call this server via a shared `apiFetch` client
   (`src/lib/apiClient.ts`), for everything except AI Chat (which stays mock by
   design). Run both projects side by side: this server on `:4000`, the frontend's
   `npm run dev` on `:5173`.
2. **Real OAuth data connectors** (Gmail, Calendar, Drive, GitHub) — register OAuth apps, implement the consent flow, and have connector jobs write real `Activity` and `Memory` documents instead of relying on the seed script.
3. **Knowledge Processing Engine, Hybrid Retrieval, Context Fusion Engine, AI Reasoning Engine** — the AI layer, entirely separate from this server's current scope.
