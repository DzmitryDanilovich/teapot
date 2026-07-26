# Teapot — Next.js Handbook

Personal reference built alongside this project. Covers what was learned, not what can be read in the official docs.

---

## Project scaffold

```
npx create-next-app@latest teapot
# TypeScript, ESLint, Tailwind, src/ dir, App Router, Turbopack — all yes
```

---

## Project structure

| Path | Purpose |
|---|---|
| `src/app/` | All routes and UI live here (App Router) |
| `public/` | Static files served as-is at `/filename`. E.g. `public/logo.png` → `/logo.png` |
| `.next/` | Build output and dev cache. Never touch. Equivalent to `bin/obj` in .NET |
| `next.config.ts` | Next.js + Turbopack configuration |
| `postcss.config.mjs` | Configures PostCSS plugins (used here only for Tailwind processing) |
| `eslint.config.mjs` | ESLint flat config |
| `tsconfig.json` | TypeScript config |

---

## App Router — file conventions

Next.js uses **filename-based conventions** inside `src/app/`. No route registration, no imports needed.

| File | Role |
|---|---|
| `layout.tsx` | Wraps all routes in the same folder and below. Root one contains `<html>` and `<body>`. |
| `page.tsx` | Makes a folder a publicly accessible route. Without it, the folder is invisible to the browser. |
| `loading.tsx` | Shown automatically while the page is fetching (React Suspense boundary). |
| `error.tsx` | Error boundary for the segment. Must be `"use client"`. |
| `not-found.tsx` | Rendered when `notFound()` is called or no route matches. |

### Routing by folder structure

```
src/app/
  page.tsx              → /
  layout.tsx            → wraps everything
  teas/
    page.tsx            → /teas
    layout.tsx          → wraps /teas and /teas/[id] only
    [id]/
      page.tsx          → /teas/123, /teas/abc, etc.
  log/
    page.tsx            → /log
```

### Dynamic segments

`[id]` in a folder name = a dynamic URL segment. In Next.js 15+, `params` is a **Promise** — the component must be `async`:

```tsx
// src/app/teas/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeaPage({ params }: Props) {
  const { id } = await params;
  return <h1>Tea {id}</h1>
}
```

Many tutorials still show the old synchronous form — it's outdated. Always await params.

### Reading route params — which API to use

| Situation | API |
|---|---|
| Server Component, needs route param | `params` prop (async, awaited) |
| Client Component, needs route param | `useParams()` hook |
| Client Component, needs to navigate programmatically | `useRouter()` hook |

`useRouter` does **not** give you route params. It's for navigation only (push, back, replace).

### Nested layouts

Each folder can have its own `layout.tsx`. It wraps only that folder's routes, while the root layout still wraps everything. Good for section-specific navigation without duplicating the page shell.

---

## Server Components vs Client Components

This is the core mental model shift from plain React.

### Server Components (default)

- Run **only on the server**. Their code never reaches the browser.
- Can query a database directly (no API layer needed, no credentials exposed).
- Cannot use: `useState`, `useEffect`, any React hook, event handlers (`onClick` etc.), or browser APIs (`window`, `localStorage`).
- Zero JavaScript bundle cost on the client.

### Client Components (`"use client"`)

- Add `"use client"` as the first line of the file.
- Run in the browser (also server-rendered on first load for hydration).
- Can use: hooks, event handlers, browser APIs — everything you know from standard React.
- Their code ships to the browser as JS bundle.

### Practical rule

Push `"use client"` **as far down the tree as possible**. Keep pages and layouts as Server Components. Only interactive leaf nodes (buttons, forms, dropdowns) need to be client.

```
Page (Server) → Layout (Server) → TeaCard (Server) → RatingButton (Client ← "use client" here)
```

### ASP.NET analogy

A Server Component is like a Razor page or MVC View — it runs on the server, has full access to your data layer, and sends HTML. A Client Component is like injecting a React SPA widget into that page for interactivity.

---

## Bundler — Turbopack

Next.js's built-in Rust-based bundler. Enabled via `--turbopack` flag in the `dev` script in `package.json`. Config lives in `next.config.ts` under the `turbopack` key if needed — no separate config file.

**Cannot be swapped for Vite or Rsbuild** with the App Router. The server/client bundle splitting and RSC protocol are tightly coupled to the Next.js build pipeline. The bundler is not negotiable with Next.js — that's part of the trade-off.

---

## PostCSS

A CSS transformation pipeline. In this project it exists solely to process Tailwind. Next.js runs it automatically — you configure plugins in `postcss.config.mjs`, never invoke it directly.

---

## Data fetching in Server Components

Server Components can import data directly — no `useEffect`, no `fetch` to your own API. Just import and use:

```ts
// src/lib/teas.ts — plain data module, later replaced by a DB query
const teas = [{ id: "1", name: "Green Tea", type: "green", origin: "China" }];
export default teas;
```

```tsx
// src/app/teas/page.tsx — Server Component, no "use client"
import teas from "@/lib/teas";

export default function TeasPage() {
  return <ul>{teas.map(t => <li key={t.id}>{t.name}</li>)}</ul>;
}
```

This works because the component runs on the server — the import never reaches the browser.

---

## `notFound()`

Call `notFound()` when a resource doesn't exist. It throws internally (return type is `never`), so no `return` is needed after it. Execution stops immediately.

```tsx
const tea = teas.find(t => t.id === id);
if (!tea) notFound();
// TypeScript knows tea is defined here — notFound() narrows the type
tea.name; // safe, no ! needed
```

- Must be called in a **Server Component** or a server-side function. Calling it in a Client Component won't be caught correctly by the framework.
- Renders `src/app/not-found.tsx` (or the nearest one up the tree). Without that file, Next.js shows its default 404 page.

---

## `next/link` vs `<a>`

Always use `<Link>` for internal navigation.

### What actually happens on navigation

- **Initial navigation** (direct URL, refresh): server sends full HTML + RSC payload embedded in `<script>` tags.
- **Subsequent navigation via `<Link>`** (in production, on static routes): server sends only the RSC payload — not full HTML. The browser never reloads; Next.js patches only the changed segment.
- **Subsequent navigation via `<Link>`** (in dev mode, or dynamic routes without `loading.tsx`): server returns full HTML, same as initial load. Client-side transition optimizations don't apply here.

So whether you see a full HTML response or an RSC payload on link click depends on: production vs dev, and static vs dynamic route.

### Prefetching

Automatic prefetching **only runs in production**. In dev mode there is no prefetching regardless of route type.

For dynamic routes (`/teas/[id]`), prefetching is skipped unless you add a `loading.tsx` file — which enables partial prefetching (layout + loading skeleton).

| Route type | Prefetched | Server roundtrip on click |
|---|---|---|
| Static | Yes, full route | No |
| Dynamic + `loading.tsx` | Yes, partial (layout + skeleton) | Yes, streamed |
| Dynamic, no `loading.tsx` | No | Yes, full response |

### `<a>` vs `<Link>` difference

Even when the network response is full HTML (dev mode, dynamic route), `<Link>` still differs from `<a>`:

| | `<a>` | `<Link>` |
|---|---|---|
| Browser behavior | Full navigation — unloads document, re-executes all scripts, resets scroll | JavaScript intercepts click, no browser navigation event |
| Shared layouts | Destroyed and rebuilt | Stay in DOM, untouched |
| JS state | Lost | Preserved |
| Prefetching | None | Automatic in production |

```tsx
import Link from "next/link";
<Link href={`/teas/${tea.id}`}>{tea.name}</Link>
```

---

## Database — Prisma 7 + PostgreSQL

### Local dev setup

Docker is the standard way to run Postgres locally:

```bash
docker run -d \
  --name teapot-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=teapot \
  -p 5432:5432 \
  postgres:16
```

`.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/teapot"
```

### Prisma 7 config pattern

Prisma 7 removed `url` from `schema.prisma`. Connection config lives in `prisma.config.ts`:

```ts
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  datasource: { url: process.env["DATABASE_URL"] },
});
```

The `datasource` block in schema only needs `provider`:
```prisma
datasource db {
    provider = "postgresql"
}
```

### PrismaClient — singleton pattern

In Next.js dev mode, HMR re-evaluates modules on every file save. Without a singleton, each save creates a new `PrismaClient` with a new connection pool — you exhaust Postgres's connection limit quickly.

The fix: store the client on `globalThis`, which survives HMR:

```ts
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg(new pg.Pool({
  connectionString: process.env.DATABASE_URL,
}));

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

Prisma 7 requires an `adapter` — `PrismaClient` cannot be constructed without one.

### Schema and migrations

```prisma
model Tea {
    id        String   @id @default(uuid())
    name      String
    type      String
    origin    String?
    storeUrl  String?
    createdAt DateTime @default(now())
}
```

```bash
pnpm exec prisma migrate dev --name init   # create migration + apply
pnpm exec tsx prisma/seed.ts               # run seed directly
```

`prisma migrate dev` requires a shadow database (created automatically with standard Postgres). `prisma db push` skips migration files — useful for prototyping, not for production.

### Querying from Server Components

No API layer needed — import the client and query directly:

```tsx
import prisma from "@/lib/prisma";

export default async function TeasPage() {
  const teas = await prisma.tea.findMany();
  return <ul>{teas.map(t => <li key={t.id}>{t.name}</li>)}</ul>;
}
```

---

## Server Actions

A Server Action is a function that runs on the server, called directly from a React form or Client Component — no API endpoint needed.

```ts
// src/app/actions.ts
'use server';

export const myAction = async (prevState: FormState, formData: FormData) => {
  // runs on server — can query DB, redirect, etc.
  redirect('/somewhere');
};
```

### vs Route Handlers

| | Server Action | Route Handler |
|---|---|---|
| Callable from | React forms / Client Components | Anywhere (browser, mobile, third-party) |
| Public HTTP endpoint | No | Yes |
| Receives | `FormData` | `Request` |
| Best for | Internal mutations | Public APIs |

### Pattern with `useActionState`

```tsx
'use client';
import { useActionState } from 'react';
import { myAction } from '../actions';

export default function MyForm() {
  const [state, formAction, isPending] = useActionState(myAction, { errors: {} });

  return (
    <form action={formAction}>
      <input name="name" defaultValue={state.values?.name} />
      {state.errors?.name && <span>{state.errors.name}</span>}
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

- `useActionState` wires the action to the form and gives you pending state
- `defaultValue` preserves field values when the action returns an error
- `isPending` disables the submit button while the action runs

### Type-safe FormData extraction

`formData.get()` returns `FormDataEntryValue | null` (includes `File`). Use a helper to narrow safely without casting:

```ts
const getString = (fd: FormData, key: string): string | undefined => {
  const val = fd.get(key);
  return typeof val === 'string' && val.length > 0 ? val : undefined;
};
```

- `typeof val === 'string'` excludes `File` and `null`
- `val.length > 0` converts empty strings to `undefined` — so optional inputs aren't saved as `""`

### Calling a Server Action — which API to use

| Need | Approach |
|---|---|
| No feedback needed | `await action()` directly in async handler |
| Loading state only | `useTransition` → `startTransition(() => action())` |
| Loading state + return value | `useActionState(action, initialState)` |
| No JS needed, simple submit | `<form action={action.bind(null, arg)}>` in Server Component |

`useActionState` is only needed when the action returns something the component needs to render (errors, updated data). If the action always redirects, there is nothing to handle — call it directly.

### Server Action vs Server Component — not the same thing

A **Server Component** runs once during rendering to produce HTML. A **Server Action** is a function exposed as an HTTP endpoint, called later in response to user interactions.

`'use server'` is not "this code runs on the server" — server component code already does. `'use server'` tells the bundler: *expose this as a callable endpoint and give the client an RPC proxy*.

```ts
// File-level: all exports in this file are server actions
'use server';
export const deleteTea = async (id: string) => { ... };
```

```tsx
// Function-level: just this one function, inside a .tsx file
const deleteAction = async () => {
    'use server';
    await prisma.tea.delete(...);
};
<form action={deleteAction}> ... </form>
```

Server Components cannot have `onClick`. If you need an event handler, the component must be `'use client'`. The action itself stays in `actions.ts` with `'use server'` — only the button needs to be a client component.

### Per-field validation errors with zod

```ts
type FormValues = z.infer<typeof schema>;
type FormState = {
  errors?: Partial<Record<keyof FormValues, string>>;
  values?: FormValues;
};

if (!parsedData.success) {
  const fieldErrors = parsedData.error.flatten().fieldErrors;
  return {
    errors: { name: fieldErrors.name?.[0], type: fieldErrors.type?.[0] },
    values: raw,
  };
}
```

Use `z.infer<typeof schema>` for form-related types — not the Prisma model, which has `id`, `createdAt`, etc. that the form doesn't know about.

---

## Authentication — Better Auth + Next.js 16

### Setup

```ts
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"]!,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"]!,
    },
  },
  plugins: [nextCookies()],
});
```

### Accessing the session

**In a Server Component:**
```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
```

**In Proxy (`src/proxy.ts`):**
```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// In Next.js 16+, headers() works in proxy and full session validation is recommended
const session = await auth.api.getSession({ headers: await headers() });
```

Better Auth docs: for Next.js 16+ proxy, full session validation via `auth.api.getSession` is correct. Cookie-only checks (`getSessionCookie`) are an optimistic alternative but are explicitly marked as insecure — use them only as a quick redirect hint, never as the sole auth gate.

### Protecting routes with Proxy

```ts
// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const proxy = async (request: NextRequest) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
};

export const config = {
  matcher: ["/log"],
};
```

Proxy runs before any component renders — the protected page never executes if the user is not authenticated. This is better than checking auth inside `page.tsx`, where the render pipeline has already started.

### Multiple proxy rules

Only one `proxy.ts` is supported. Split logic into modules and import:

```ts
// src/proxy.ts
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/log")) return authProxy(request);
  if (request.nextUrl.pathname.startsWith("/admin")) return adminProxy(request);
}

export const config = { matcher: ["/log/:path*", "/admin/:path*"] };
```

### Session in layout (sign in/out UI)

```tsx
// src/app/layout.tsx — Server Component
const session = await auth.api.getSession({ headers: await headers() });
// render sign-in link or sign-out button based on !!session
```

---

## Scoping data to the authenticated user

Session is available in Server Components, Server Actions, and Proxy the same way — `auth.api.getSession({ headers: await headers() })`. There is no difference between these contexts for session access.

### Pattern: read session, filter data

```tsx
// Server Component
const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect('/login');

const teas = await prisma.tea.findMany({
  where: { userId: session.user.id },
});
```

### Pattern: attach user to created records

```ts
// Server Action
const session = await auth.api.getSession({ headers: await headers() });
if (!session) return { error: 'Not authenticated' };

await prisma.tea.create({
  data: { ...parsedData.data, userId: session.user.id },
});
```

### Ownership check on detail pages

Don't rely on the list filtering alone — always verify ownership on the detail page too:

```ts
const tea = await prisma.tea.findUnique({ where: { id } });
if (!tea || tea.userId !== session.user.id) notFound();
```

This prevents users from accessing other users' resources by guessing IDs.

### Prisma relation for user-owned records

```prisma
model Tea {
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

`onDelete: Cascade` — when a user is deleted, their teas are deleted too. Without this, deleting a user would leave orphaned records and violate the foreign key constraint.

---

## Code organisation in Next.js

### Actions — co-locate by feature

One global `actions.ts` grows into a mess. Split by feature, placed next to the route that owns it:

```
src/app/log/actions.ts       ← logTea
src/app/login/actions.ts     ← logIn, signUp, logOffAction
```

`'use server'` at the top of each file makes all exports server actions.

### Zod schemas — module-level, not inline

Define schemas once at module level, not inside the function body. Defining inside the function recreates the schema object on every call:

```ts
// ✗ recreated on every request
export const myAction = async (_, formData) => {
  const schema = z.object({ ... });
};

// ✓ defined once
const schema = z.object({ ... });
export const myAction = async (_, formData) => { ... };
```

### Session helper — avoid repetition

```ts
// src/lib/session.ts
import { auth } from "./auth";
import { headers } from "next/headers";

export const getSession = async () =>
  auth.api.getSession({ headers: await headers() });
```

Every call site becomes `await getSession()`.

---

## Pre-filled forms (edit pages)

Pass the existing record as the initial state of `useActionState`. The form fields use `defaultValue` — not `value` — so they're uncontrolled and don't fight React on re-render.

```tsx
const [state, formAction, isPending] = useActionState(
    editTea.bind(null, tea.id),
    { error: '', values: tea }   // tea pre-fills the form on first render
);

<input name="name" defaultValue={state.values?.name} />
```

### Passing extra args to a Server Action via `.bind()`

When an action needs an argument that isn't part of the form (like a record ID), use `.bind()` to pre-fill it. This is the idiomatic approach — not a hidden `<input>`.

```ts
// action signature: first arg is bound, last arg is FormData
export const editTea = async (teaId: string, prevState: State, formData: FormData) => { ... };

// in the component:
const boundAction = editTea.bind(null, tea.id);
const [state, formAction] = useActionState(boundAction, initialState);
```

Hidden inputs are worse: the value is in the HTML and can be tampered with by the user before submission. `.bind()` keeps the value in the server-side action closure — the client never controls it.

### Auth-before-DB ordering

Always check auth before hitting the database. An unauthenticated request has no business touching Prisma:

```ts
// ✓ correct order
const session = await getSession();
if (!session?.user.id) redirect('/login');
const tea = await prisma.tea.findUnique({ where: { id } });

// ✗ wasteful — queries DB even when user isn't logged in
const tea = await prisma.tea.findUnique({ where: { id } });
const session = await getSession();
if (!session?.user.id) redirect('/login');
```

### Double ownership check (page + action)

The page check prevents rendering the form for unauthorised users. The action check prevents the actual database write. Both are required — the action can be called directly via HTTP POST, bypassing the page entirely.

---

## Developer tooling

### Prettier

Formatter for consistent code style. Config in `.prettierrc`:

```json
{
  "trailingComma": "all",
  "tabWidth": 4,
  "singleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`prettier-plugin-tailwindcss` automatically sorts Tailwind classes into a canonical order on every format — prevents class order drift across the codebase.

### Husky + lint-staged

Husky manages git hooks. lint-staged runs linters only on staged files (not the whole codebase) — keeps pre-commit checks fast.

Pre-commit hook (`.husky/pre-commit`) calls `pnpm lint-staged`, which runs the `lint-staged` script from `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": "eslint --cache --fix",
  "*.{ts,tsx,css,md}": "prettier --write"
}
```

ESLint auto-fixes what it can; Prettier formats in place. Both run only on staged files.

The `prepare` lifecycle script (`"prepare": "husky"`) runs automatically after `pnpm install` and sets `core.hooksPath = .husky` in git config — so hooks work for any new contributor who clones the repo. Safe to omit for a solo project since hooks are already in place.

---

## shadcn/ui

shadcn/ui is not a traditional npm component library. Running `pnpm dlx shadcn@latest add button` copies the component's source code into `src/components/ui/` — you own it completely and can modify it freely. Nothing is locked behind a package version.

Built on **Radix UI**, which provides headless primitives: behavior-only components (focus trapping, ARIA attributes, keyboard navigation, accessible state) with zero styling. shadcn layers Tailwind classes on top. This is why you get correct accessibility on `Dialog`, `Select`, `DropdownMenu` etc. for free — Radix owns that layer.

### `cn()` utility

Combines `clsx` and `tailwind-merge`. Use it wherever class names need to be conditionally combined or when consumer classes should override defaults without conflicts:

```ts
import { cn } from '@/lib/utils';
<div className={cn('base-class', condition && 'conditional-class', className)} />
```

### `asChild` pattern

Passes the behavior and styling of a shadcn component onto its child element instead of rendering its own DOM node:

```tsx
// Renders an <a> tag with Button styling — not a <button> wrapping an <a>
<Button asChild variant='outline'>
    <Link href='/teas'>View Teas</Link>
</Button>
```

### ThemeProvider

Wraps the app in `next-themes` for system/light/dark mode. Goes in the root layout. `suppressHydrationWarning` is required on `<html>` to suppress the mismatch between server-rendered class and client-applied theme class.

### next/font

Load Google Fonts at build time — no runtime stylesheet request, no FOUT. The font variable is injected as a CSS custom property:

```ts
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });
<html className={cn('font-sans', montserrat.variable)}>
```

### Tabs — state lives in Radix

shadcn `Tabs` (built on Radix Tabs primitive) manages the active-tab state internally. You give it `defaultValue` for uncontrolled mode; no `useState` in your own component needed. Each `TabsTrigger`/`TabsContent` pair is linked by a matching `value`.

```tsx
<Tabs defaultValue='login'>
    <TabsList>
        <TabsTrigger value='login'>Log In</TabsTrigger>
        <TabsTrigger value='signup'>Sign Up</TabsTrigger>
    </TabsList>
    <TabsContent value='login'><LogInForm /></TabsContent>
    <TabsContent value='signup'><SignUpForm /></TabsContent>
</Tabs>
```

For controlled mode (syncing the active tab to URL or external state), use `value` + `onValueChange` instead of `defaultValue`.

---

## Testing — Vitest + React Testing Library

### Why `jsdom`

Vitest runs on Node, which has no DOM — no `document`, `window`, or element APIs. `jsdom` (set via `test.environment: 'jsdom'`) provides a simulated browser DOM so React components can render and be queried in tests. `happy-dom` is a lighter, faster alternative with slightly less complete API coverage.

### Path aliases — native resolution

Vitest resolves the `@/` alias from `tsconfig.json` natively via `resolve.tsconfigPaths: true` — no `vite-tsconfig-paths` plugin needed in current versions. The plugin is the older approach; prefer the built-in option.

### What can and can't be tested

- **Pure functions** (e.g. `collectErrors`) — trivial, no environment needed.
- **Client Components** — render with RTL, mock Server Actions with `vi.mock`, drive interactions with `@testing-library/user-event`.
- **Async Server Components** — cannot be unit tested with Vitest yet. Cover their behavior with Playwright E2E instead.

### Mocking a Server Action

```ts
vi.mock('./actions', () => ({ logIn: vi.fn() }));
const mockLogIn = vi.mocked(logIn);

// drive the form, then assert the action was called with the right FormData
expect(mockLogIn).toHaveBeenCalledWith(null, expectedFormData);
```

`clearMocks` + `restoreMocks` in the config reset mock state between tests automatically.

### Query by accessible role/label

RTL encourages querying the way a user perceives the UI: `getByRole('button', { name: 'Log In' })`, `getByLabelText('Email')`. This is why the accessible `htmlFor`/`id` pairing on form fields matters — it makes the component both accessible and testable.

---

## E2E testing — Playwright

E2E tests live in a top-level `e2e/` directory, not co-located: they cross pages/actions/DB in one flow (no single "right" neighbour), use a different runner, and can't import app internals anyway. Naming convention: `*.spec.ts` for Playwright vs `*.test.ts(x)` for Vitest keeps the runners apart.

### Test data isolation

A dedicated throwaway database, wiped on every run:

- Separate Docker Postgres on port **5433** (`teapot-test-db`), dev DB on 5432 stays untouched
- `.env.e2e` (gitignored) points `DATABASE_URL` at 5433; loaded in `playwright.config.ts` with `override: true`
- `globalSetup` runs `prisma migrate reset --force` — but first **guards** that `DATABASE_URL` ends with `5433/teapot`, so it can never nuke the wrong DB
- Separate build dir (`distDir: process.env.NEXT_DIST_DIR`) so the e2e production build doesn't clobber the dev `.next` cache
- Per-test dedicated seed records (`SEED_TEA` read-only, `EDITABLE_TEA`, `DELETABLE_TEA`) so `fullyParallel` tests don't race each other

### Auth via storageState

Better Auth's session cookie is HTTP-only — client JS can't read it, but Playwright's `storageState` captures the whole browser cookie jar:

```ts
// auth.setup.ts — runs once as a dependency project
await request.post('/api/auth/sign-up/email', { data: SEED_USER });
await request.storageState({ path: 'e2e/.auth/user.json' });  // gitignored!
```

```ts
// playwright.config.ts — every test in this project starts logged in
projects: [
    { name: 'auth seed', testMatch: 'auth.setup.ts' },
    { name: 'chromium', use: { storageState: seedUserStorageStatePath },
      dependencies: ['auth seed'] },
]
```

Project `dependencies` chain setup before tests (auth seed → data seed → tests). Tests that need a logged-out state override per-file: `test.use({ storageState: { cookies: [], origins: [] } })`.

### Page Object Model + fixtures

Page objects encapsulate selectors/interactions per page (`e2e/pages/*.page.ts`); custom fixtures inject them into tests via `base.extend`:

```ts
const test = base.extend<{ teaListPage: TeaListPage }>({
    teaListPage: async ({ page }, use) => { await use(new TeaListPage(page)); },
});
```

Tests then read as user flows: `await teaListPage.openTeaListItemByName(...)`. Note: ESLint mistakes Playwright's `use` for React's hook — disable `react-hooks/rules-of-hooks` for `e2e/**` in the config, not inline.

### webServer

Playwright starts the app itself — a production build, not dev mode:

```ts
webServer: {
    command: `pnpm build && pnpm start --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
}
```

E2E against the prod build catches build-only issues and matches what ships. This is also where async Server Components get their test coverage — Vitest can't unit test them.

---

## CI — GitHub Actions

Workflow in `.github/workflows/ci.yml`, triggered on `push` **and** `pull_request` to `main` — PR validation before merge is the point of CI gating.

### Job structure — parallel gates, gated e2e

Cheap checks (`lint`, `check-types`, `test`) run as parallel jobs. The expensive e2e job declares `needs: [lint, check-types, test]` so it only starts once the fast gates are green. Trade-off: parallel-everything = fastest green run; `needs` on the expensive job = cheapest red run.

### Composite action for shared setup

Four jobs all need env + pnpm + Node + install. Extract into `.github/actions/setup/action.yml` (`runs: using: 'composite'`) and each job does `uses: ./.github/actions/setup`. DRY for workflows.

### Toolchain pinning

- `.nvmrc` — Node version, consumed by `setup-node` via `node-version-file`
- `packageManager` field in `package.json` — pnpm version, consumed by `pnpm/action-setup`
- `pnpm install --frozen-lockfile` — install exactly what the lockfile says, fail otherwise
- `postinstall: prisma generate` — the generated client is gitignored, so CI must regenerate it

### Postgres via service container

```yaml
services:
  postgres:
    image: postgres:18
    env: { POSTGRES_USER: ..., POSTGRES_DB: teapot-test }
    ports: ['5432:5432']
    options: >-
      --health-cmd pg_isready --health-interval 10s ...
```

GitHub runs the container alongside the job; `ports:` maps it to the runner host, so the app reaches it at `localhost:5432`. Health options make the job wait until Postgres actually accepts connections.

### Secrets vs plain env

Nothing in this pipeline needs `secrets.`: the DB is a throwaway container, `BETTER_AUTH_SECRET` is a dummy for an ephemeral instance, Google creds are fakes because no test exercises OAuth. Secrets are for credentials to *external* services — the day e2e does real Google OAuth, those move to `secrets.`.

### Caching

- pnpm store: `setup-node` with `cache: 'pnpm'`
- Playwright browsers: `actions/cache` on `~/.cache/ms-playwright`, keyed `playwright-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}`

### CI-aware Playwright config

```ts
retries: process.env.CI ? 2 : 0,
reporter: [[process.env.CI ? 'github' : 'list'], ['html']],
trace: process.env.CI ? 'on-first-retry' : 'on',
// CI builds in a separate step; webServer only starts:
command: `${process.env.CI ? '' : 'pnpm build && '}pnpm start --port ${port}`,
```

`github` reporter annotates failures inline on the PR. Upload `playwright-report/` as an artifact with `if: ${{ !cancelled() }}` so it survives failures.

---

## Deployment — Vercel via CI

### Taking deploys away from Vercel's Git integration

By default Vercel deploys on every push, *ungated* — it doesn't know or care whether your tests pass. To make deploys conditional on CI, disable the Git integration and deploy from the workflow instead:

```json
// vercel.json
{ "git": { "deploymentEnabled": false } }
```

Then the `deploy` job declares `needs: [e2e]`, so nothing reaches production unless lint, typecheck, unit tests, and e2e are all green.

### `vercel build` + `--prebuilt`

```bash
vercel build --target=preview|production    # build in CI, output to .vercel/output
vercel deploy --prebuilt                    # upload the built output, don't rebuild
```

Building in CI means the deploy step uploads artifacts rather than running a build on Vercel — you control the toolchain and the build is already verified.

### `migrate dev` vs `migrate deploy`

| | `migrate dev` | `migrate deploy` |
|---|---|---|
| Generates new migration files from schema diff | Yes | **No** |
| Applies pending migrations | Yes | Yes |
| Needs a shadow database | Yes | No |
| Can reset/drop the database on drift | **Yes** | Never |
| Interactive prompts | Yes | No |

Only `migrate deploy` may ever touch production: it applies committed migration files and nothing else. `migrate dev` is a development authoring tool — on detecting drift it will offer to reset the database, which against production means data loss.

### Per-PR database branching

A preview deployment pointed at the production database would let PR code mutate real data. Neon branches solve this — a copy-on-write branch per PR:

```yaml
- uses: neondatabase/create-branch-action@v6
  with:
    branch_name: preview/pr-${{ github.event.pull_request.number }}
    prisma: true
```

Run `prisma migrate deploy` against the branch, pass its URL to the deployment as `DATABASE_URL`, and delete the branch on PR close via a `pull_request: [closed]` workflow. Preview code then exercises real migrations against realistic data with zero risk to production.

### Pooled vs direct connection strings

Neon exposes two URLs, and they are **not** interchangeable:

- **Pooled** (`...-pooler...`) — PgBouncer in transaction mode. Use for the *application*.
- **Direct** — a real Postgres session. Use for *migrations*.

Migrations must use the direct URL because Prisma Migrate takes a session-level advisory lock, and PgBouncer's transaction mode multiplexes clients across backends so session state can't be relied on.

### Why `pg.Pool` is a serverless concern

A connection pool assumes **one long-lived process** serving many requests: it opens N connections once and reuses them for the process's lifetime. Serverless breaks that assumption — each function instance is its own process with its own module scope, so *each instance constructs its own `pg.Pool`*. Fifty concurrent instances means fifty independent pools, not one shared pool of fifty.

Note the singleton in `src/lib/prisma.ts` only guards `NODE_ENV !== 'production'` — it exists to survive dev HMR, and deliberately does nothing in production, where every cold start builds a fresh client and pool.

This is what a pooler fixes: the app's many short-lived pools all connect to PgBouncer, which multiplexes them onto a small number of real Postgres backends. Neon's "up to 10,000 connections" figure describes the *pooled* endpoint; direct Postgres connections are far more limited, because each one is a backend process with real memory cost.

### Better Auth on preview deployments

Preview URLs are unique per deployment, but `baseURL` is static config. Infer it from Vercel's injected env var:

```ts
baseURL: process.env['BETTER_AUTH_URL']
    ?? (process.env['VERCEL_URL'] && `https://${process.env['VERCEL_URL']}`),
```

That fixes email/password auth. **OAuth still breaks**, because Google requires an exact, pre-registered redirect URI and preview URLs are unknowable in advance. Better Auth ships `oAuthProxy()` for exactly this: register the production callback URL once with the provider, and preview deployments proxy their OAuth flow through it.

Its mechanism is a `baseURL` swap in a before-hook on social sign-in — the outgoing request advertises the *production* callback, while `callbackURL` points at the preview's `/oauth-proxy-callback`. Production then re-encrypts the profile and bounces it back to the preview.

The trap: the plugin has two independent notions of "production URL". `checkSkipProxy()` (am I production? then do nothing) falls back to `BETTER_AUTH_URL`, but the rewrite itself reads **only** `opts.productionURL` — no env fallback, despite the docstring. Omit the option and the proxy silently never engages.

```ts
plugins: [
    oAuthProxy({ productionURL: process.env['PRODUCTION_URL'] }),
    nextCookies(),   // must stay last
],
```

Use a *separate* env var from `BETTER_AUTH_URL`: that one is read first by `baseURL`, so setting it on previews would point them at production and break email/password auth there. Also note both environments must share `BETTER_AUTH_SECRET` — the proxied profile is symmetrically encrypted with it — and preview Deployment Protection must be bypassed for the bounce-back to land.

Local dev needs none of this. Register `http://localhost:3000/api/auth/callback/google` as a second authorized redirect URI (Google permits `http://localhost`), leave `PRODUCTION_URL` unset locally, and set `BETTER_AUTH_URL=http://localhost:3000`. `oAuthProxy` self-disables when the resolved production origin equals the current origin — so locally it skips and you get direct OAuth, keeping the production secret off developer laptops.

---

## Deploy → test → promote pipeline

### Test the artifact, not a rehearsal of it

The weaker pattern builds locally, tests that local build, then deploys — so the thing you tested and the thing you shipped are different processes. Stronger: deploy first, then run the e2e suite **against the real deployment URL**. Now the artifact under test is the artifact that ships.

Structure it as reusable workflows (`workflow_call`) with thin orchestrators — `composite-pr.yml` (on `pull_request`) and `composite-main.yml` (on `push` to `main`) — each wiring the same building blocks (`test`, `deploy`, `e2e`, `promote`) in a different order. Pass the deployment URL between jobs via `outputs`.

### Feeding the deployment URL to Playwright

The deploy job captures its URL (`vercel deploy … > url.txt`, `tail -n1` into `$GITHUB_OUTPUT`); the orchestrator passes it as an input to the e2e workflow, which exports it as an env var; `playwright.config.ts` reads it into `use.baseURL` when `CI` is set, and drops `webServer` entirely (nothing to start locally). `storageState` auth setup then runs against that deployed URL — signing in through the real app and capturing the real session cookie — so every test reuses a genuine session against the deployment.

### Staged production deploy + promote

```bash
vercel deploy --prod --skip-domain   # builds & deploys to prod, but domain still points at old build
# run smoke checks against the returned URL
vercel promote <url>                 # move the domain to the new build
```

`--skip-domain` is the safety valve: production is fully built and live at a URL, but real traffic stays on the previous build until `promote`. A failing smoke check simply means you never promote — broken **code** never reaches the domain.

What it does **not** protect: the database migration ran during the deploy step, before the smoke check. `migrate deploy` is forward-only; a failed smoke leaves the schema already migrated. So the guarantee is only as good as your migration discipline — every migration must be backward compatible (expand/contract) so the still-live old code keeps working against the new schema. For genuinely risky migrations, snapshot first: Neon's branching / point-in-time restore is the backstop, since code rolls back instantly but schema does not.

### Non-destructive smoke gate

The production e2e must not mutate prod. Split by Playwright tag: previews run the full CRUD suite against a throwaway Neon branch; production runs only `--grep @smoke` — read-only assertions plus logged-out redirects. Auth for the prod smoke uses a **persistent** account that is signed *in* (never signed up), so it creates no user rows; its session cookie is transient. The environment is selected in `playwright.config.ts` (`isProduction === 'true'` — a real boolean check, not string truthiness), which swaps the project list and, critically, drops `globalSetup` so `prisma migrate reset` can never run against a deployed database.

`migrate deploy` (apply committed migrations, safe, runs against prod) and `migrate reset` (wipe the DB, test-only, must never touch prod) are different commands — the prod config omits the reset by having no `globalSetup`.

### Docs-only pushes

`paths-ignore: ['**/*.md']` on the `main` push keeps a documentation change from triggering a production deploy. (Trade-off for later: with required status checks, `paths-ignore` produces *no* check at all, which a branch-protection rule can block on — a `changes`-filter job that runs but short-circuits the expensive steps avoids that.)

---

## Pipeline gotchas (hard-won)

Everything below cost a red run to learn. Symptom → cause → fix.

### Reusable workflows cross three boundaries, and nothing crosses by default

Splitting a monolithic workflow into `workflow_call` files (`composite-pr` calling `test`/`deploy`/`e2e`) is clean, but a called workflow does **not** inherit the caller's context. Three separate things must be handed over explicitly:

- **Secrets** — a called workflow sees no secrets unless the caller passes `secrets: inherit` (or maps them explicitly). Symptom: `${{ secrets.X }}` resolves to empty inside the callee, e.g. `Input required and not supplied: api_key`, or a blank `VERCEL_ORG_ID:` in the logged env.
- **Permissions** — the callee's `permissions:` are *capped by the caller's*. If the caller grants nothing, `pull-requests: write` in the callee is rejected as an **invalid workflow file** (`is requesting 'pull-requests: write', but is only allowed 'pull-requests: none'`). Fix: grant it on the calling job — or, better, remove the request from the callee if it never actually needed it (the prod deploy job asked for `pull-requests: write` but had no PR to comment on).
- **Env/context** — top-level `env:` and defaults don't flow down either.

These all worked in the monolithic version because there was no boundary. The moment you `uses:` a reusable workflow, each has to be threaded through.

### GitHub Actions outputs are strings — `!` on them lies

`if: ${{ !steps.x.outputs.created }}` never fires the way you expect. Step outputs are **strings**, and in GHA a non-empty string is truthy — so `!'false'` is `false` *and* `!'true'` is `false`. The step is skipped in both cases. Symptom here: the Neon branch reset silently never ran, so stale data persisted across pushes. Fix: compare explicitly — `if: ${{ steps.x.outputs.created == 'false' }}`.

### Vercel Deployment Protection blocks CI browsers

Preview deployments (and, under Standard Protection, *any* deployment reached by its deployment URL rather than a production custom domain) sit behind a "Log in to Vercel" wall. Playwright loads that SSO page instead of your app and every locator times out. Fix: enable **Protection Bypass for Automation**, store the secret, and send it on every request via Playwright `extraHTTPHeaders`:

```ts
extraHTTPHeaders: {
    'x-vercel-protection-bypass': process.env.vercelAutomationBypassSecret || '',
    'x-vercel-set-bypass-cookie': 'true',
},
```

The header names have no "automation" in them despite the feature/secret being named that way. `extraHTTPHeaders` applies to *both* the `request` context and the browser, so API-context setup calls get through too. Put this in the **shared** `ciConfig` — the staged production smoke needs it just as much as previews, because `--skip-domain` makes the smoke hit the protected deployment URL.

### Better Auth rejects Origin on request-context calls

Playwright's `APIRequestContext` (used in `*.setup.ts` to sign in/up via `/api/auth/*`) sends **no `Origin` header** — it's not a browser. Better Auth's CSRF protection then returns `403`. Two distinct failures:

- `MISSING_OR_NULL_ORIGIN` — no Origin at all. Fix: pass one from the `baseURL` fixture: `request.post(url, { data, headers: { origin: baseURL } })`. (Only the setup files need this; browser-driven specs reach Better Auth through Server Actions server-side, and the browser sends a real Origin anyway.)
- `INVALID_ORIGIN` — Origin present but untrusted. Happens on prod because `baseURL` is pinned to the stable production domain (from `BETTER_AUTH_URL`) while the smoke hits the *deployment* URL. Fix: trust the deployment's own URL — `trustedOrigins: process.env.VERCEL_URL ? ['https://' + process.env.VERCEL_URL] : []`.

Don't "fix" `INVALID_ORIGIN` by dropping `BETTER_AUTH_URL` so `baseURL` floats to `VERCEL_URL` — that breaks real production, because `VERCEL_URL` is the ephemeral per-deploy hash URL, not the stable domain real users and OAuth callbacks use.

### A `--prod --skip-domain` deploy has production *identity* before it has production *traffic*

"Production" means two things: the build target/env (which env vars, which canonical URL) and whether the domain routes to it. A staged deploy is production in the first sense immediately — it's the production build with production env, so its `baseURL` is correctly the stable domain even before `promote`. `promote` only flips *traffic*. This is blue-green: the staged deployment is the green slot (full production identity, tested via a side URL); `promote` is the load-balancer swap. So `baseURL` must already be the stable domain while staged, and the side-door deployment URL is handled via `trustedOrigins`, not by changing identity.

### Throwaway-per-PR ≠ throwaway-per-push

`neondatabase/create-branch-action` **reuses** an existing branch (it doesn't recreate or reset it). A Neon branch is created on first PR push and deleted on PR close — so on a *second* push to the same PR it still holds the previous run's data, and the seed collides (`409 user exists`). Fix: reset the branch to its parent when it was reused — `neondatabase/reset-branch-action` guarded by `if: steps.neon.outputs.created == 'false'`.

### Local dependency bins aren't on a workflow step's PATH

A bare `vercel promote …` in a `run:` step exits **127** even though `vercel` is an installed devDependency. Installing a dep puts its binary in `node_modules/.bin`, which is **not** on a raw shell step's `PATH` (only package *scripts* get that prepended). Resolve local bins through `pnpm exec vercel …` (or `npx`), the way the deploy jobs already do.

### `vitest/globals` in tsconfig masks missing imports across runtimes

`"types": ["vitest/globals"]` makes `expect`/`describe`/`vi` ambient for the *whole* project's type-checker — including Playwright files, where those globals don't exist at runtime. So a Playwright file using `expect` without importing it type-checks clean but throws `expect is not defined` at runtime; `no-undef` is off under typescript-eslint, and Vitest never runs e2e files, so every static gate misses it. The runtime-honest fix is to not use ambient test globals at all (import `expect` explicitly in both suites); scoping via a second tsconfig works but every extra config must be wired into the typecheck script by hand, or it's dead.

---

## SAST — CodeQL

### SAST vs a linter

CodeQL is **static application security testing** — it builds a queryable database of the code and runs **taint-tracking** queries that follow data from a **source** (untrusted input: request body, query param, form field) to a **sink** (a dangerous operation: `exec`, a raw SQL string, `dangerouslySetInnerHTML`, a filesystem path). The defining capability is that it tracks that flow **across function returns and file boundaries** — whole-program dataflow.

A linter (ESLint) works one file at a time on the syntax tree with no whole-program model, so it structurally cannot see that a value read in `route.ts` passes through two helpers in other files and reaches a shell call. That cross-boundary source→sink class — injection, path traversal, SSRF, unsafe deserialization — is what CodeQL catches and a linter can't. (Distinct again from **SCA** / Dependabot, which scans *dependency versions* against a vuln DB — not your own code.)

### Why the weekly `schedule`

CodeQL's query packs are updated continuously. A `schedule:` (cron) run re-analyzes **unchanged** code against **newer queries** — so a vulnerable pattern in code merged months ago, that no push or PR is touching, gets flagged when a query recognizing it ships later. Push/PR runs only ever see changed code with the rules that existed at merge time; the cron re-examines the whole existing codebase as CodeQL itself improves.

### No build step for JS/TS (`build-mode: none`)

Compiled languages need `autobuild` because the source alone doesn't reveal resolved relationships — CodeQL hooks the compiler to observe concrete overloads and instantiated generics (C# `List<T>` → real instantiated types the source doesn't spell out). JS/TS needs no build: imports name exactly what's used, and TS types are erased, so transpiled JS runs as written — CodeQL parses the source directly.

### Advanced setup + least-privilege permissions

Advanced setup = a workflow file you own (`codeql.yml`) rather than click-to-enable, so you control triggers and can add the `actions` language pack (which analyzes the workflow files themselves — that's what flags missing `permissions:` blocks). The analyze job needs `security-events: write` to upload SARIF to Security → Code scanning.

CodeQL's own "Workflow does not contain permissions" query is a hygiene rule: it flags **any** workflow/job with no explicit `permissions:` block (implicit = possibly write-all). Fix by giving every workflow an explicit block — `contents: read` as the baseline — then widening per-job only where needed (`security-events: write` for analyze, `pull-requests: write` for the PR-commenting deploy). `GITHUB_TOKEN` scope is **hierarchical**: workflow-level sets the default, job-level *replaces* it, and a called reusable workflow is *capped by its caller* — so an elevated scope like `pull-requests: write` must be granted on both the caller (to raise the ceiling) and the callee (to use it). Never silence the finding by flipping the repo default to write-all.

### Parallel steps (native, 2026)

`parallel:` is a step-level key (shipped 2026-06) that runs a group of steps concurrently **on the same runner** (one checkout + setup shared), converting them to background steps with an implicit wait. Cheaper than separate parallel *jobs* (which each re-run checkout + install on isolated runners). The trade-off matters for branch protection: parallel *steps* live under one job = **one** required status check; parallel *jobs* = separately-requireable checks. Choose by how granular you want required checks to be.

---

## Quality gate — SonarCloud

### Where it sits vs ESLint and CodeQL

Three analyzers, three depths — not redundant:
- **ESLint** — per-file style/correctness patterns, instant editor feedback.
- **CodeQL** — security via cross-boundary taint tracking (source→sink).
- **SonarCloud** — maintainability (code smells, cyclomatic complexity, **duplication**) plus its own bug/security rules, **and coverage**. Duplication % and coverage-on-new-code are the things *only* Sonar reports — neither ESLint nor CodeQL measures how much code the tests exercise.

Sonar's security rules overlap CodeQL; that's fine — teams run both because Sonar's strength is the maintainability + coverage quality gate, CodeQL's is deep dataflow security.

### Setup

- `sonar-project.properties` — `sonar.organization`, `sonar.projectKey`, `sonar.sources=src`, `sonar.tests=src,e2e`, `sonar.test.inclusions` for `*.test.*`/`*.spec.*`.
- **`sonar.exclusions=src/generated/**`** — exclude generated Prisma client, which `postinstall: prisma generate` recreates in CI even though it's gitignored; without this it floods the gate with non-issues. (The property is `sonar.exclusions` — `sonar.source.exclusions` is **not** a real property and is silently ignored.)
- Action: `SonarSource/sonarqube-scan-action` with only `SONAR_TOKEN` in env. **`SONAR_HOST_URL` is not needed for SonarCloud** — it's only for self-hosted SonarQube Server. Branch/PR identifiers auto-detect from the Actions event; don't pass them.
- **`fetch-depth: 0`** on the checkout — Sonar needs full git history for SCM blame and new-code detection. The default shallow clone degrades "Clean as You Code."

### Coverage is CI-generated, not run by Sonar

Sonar reads an `lcov` file **your CI produces** (`sonar.javascript.lcov.reportPaths=coverage/vitest/lcov.info`); it does not run your tests. Two consequences:
1. The scan must run **after** coverage exists — the `sonar` job `needs: test`, and coverage rides across as an artifact (test job runs `pnpm test:coverage`, uploads `coverage/vitest`; sonar downloads it). Scan-before-coverage → Sonar reports 0%.
2. Sonar's coverage % can differ from `vitest --coverage` locally because they count over **different denominators** — `sonar.exclusions`, the sources/tests split, and Sonar-side coverage exclusions mean Sonar's scope isn't identical to Vitest's. Same lcov, different files counted.

### Clean as You Code (default Quality Gate)

Sonar's default gate evaluates **new/changed code only**, not the whole codebase. The failure mode it avoids: gating on *total* coverage % on an existing project sitting at, say, 40% would block **every** PR until someone back-fills tests for untouched code — so teams just disable the gate. Gating on new code means each PR only cleans up what it changed, and the codebase ratchets upward organically without ever blocking delivery. It's what makes a quality gate survivable on a real, imperfect codebase.

---

## Key trade-offs to keep in mind

- **Next.js gives a lot for free** (SSR, routing, API layer, image optimization, bundler) but is opinionated. You work within its conventions.
- **App Router is the present and future.** The older Pages Router still works but is legacy. All new learning should target App Router.
- **Server Components shift your mental model** — the default is now "this runs on the server" not "this runs in the browser."
