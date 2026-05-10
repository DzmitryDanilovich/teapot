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

## Key trade-offs to keep in mind

- **Next.js gives a lot for free** (SSR, routing, API layer, image optimization, bundler) but is opinionated. You work within its conventions.
- **App Router is the present and future.** The older Pages Router still works but is legacy. All new learning should target App Router.
- **Server Components shift your mental model** — the default is now "this runs on the server" not "this runs in the browser."
