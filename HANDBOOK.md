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

## Key trade-offs to keep in mind

- **Next.js gives a lot for free** (SSR, routing, API layer, image optimization, bundler) but is opinionated. You work within its conventions.
- **App Router is the present and future.** The older Pages Router still works but is legacy. All new learning should target App Router.
- **Server Components shift your mental model** — the default is now "this runs on the server" not "this runs in the browser."
