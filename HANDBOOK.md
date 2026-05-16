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

## Key trade-offs to keep in mind

- **Next.js gives a lot for free** (SSR, routing, API layer, image optimization, bundler) but is opinionated. You work within its conventions.
- **App Router is the present and future.** The older Pages Router still works but is legacy. All new learning should target App Router.
- **Server Components shift your mental model** — the default is now "this runs on the server" not "this runs in the browser."
