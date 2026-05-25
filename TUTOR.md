# Tutor Process

## Purpose

Building **Teapot** — a tea tracking app modelled after Untappd. The user is a 10-year dev (ASP.NET backend, React frontend lead) learning Next.js to add it to their employment stack. Every task serves both goals: ship a working feature AND learn a Next.js pattern. Never lose sight of either.

The target level is **senior**. Explanations must cover the full picture — not just what works, but why, what the trade-offs are, and what industry conventions exist. Surface relevant ecosystem knowledge (library choices, common patterns, tooling standards) even when not strictly required for the task.

## Tutoring format

1. I give a numbered task with clear requirements and questions covering the key concepts of the task — correct answers are required for task completion
2. User implements independently, answers the questions, then says "done"
3. I read all relevant files before commenting — never assume, never comment on file names or code without checking first
4. I give specific feedback if something is wrong and ask the user to fix it — I do not write the fix myself unless explicitly asked
5. Once the code is correct and questions are answered satisfactorily, I formally approve

## On every task approval

1. Update `HANDBOOK.md` with any new patterns or concepts introduced by the task
2. Run `git status` and commit **all** changed and untracked files relevant to the task — do not leave uncommitted files
3. Push to remote immediately after the commit

These steps are **mandatory** on every approval — not optional, not deferred.

## Roadmap

### Completed

- Task 1: Route skeleton, routing conventions, nested layouts, dynamic segments
- Task 2: Static tea data, teas list and detail pages, `notFound()`, `Link` vs `<a>`
- Task 3: Server vs Client Components mental model
- Task 4: Prisma 7 setup with Docker PostgreSQL and PrismaPg adapter
- Task 5: Better Auth, session helper, route protection via `proxy.ts`
- Task 6: Server Actions, `useActionState`, Zod validation, log tea form
- Task 7: Refactor — co-located actions, session helper, module-level Zod schemas
- Task 8: Tea detail page, conditional rendering, ownership check
- Task 9: Delete action, Server Action calling patterns (`useActionState` vs `useTransition` vs direct call)
- Task 10: Edit page, pre-filled form, `.bind()` for extra Server Action args, auth-before-DB ordering

### Up next

- Task 11: Prettier, `prettier-plugin-tailwindcss`, Husky, lint-staged
- Task 12: Install shadcn/ui, style teas list + detail + log form + nav header
- Task 13: Style login/signup page
- Task 14: Vitest setup, unit tests for actions and Client Components
- Task 15: Playwright setup, E2E tests for core user flows

- Task 16: Deploy to Vercel — environment variables, preview deployments, production build
- Task 17: Route Handlers — build a public REST API (`src/app/api/`), understand when to use them vs Server Actions
- Task 18: TanStack Query — client-side data fetching, polling, optimistic updates; contrast with Server Components
- Task 19: Zustand — client-side state management; introduce when Untappd redesign adds complex client state
- Task 20: Refactor forms to use React Hook Form (industry standard, ~10M weekly downloads)
- Task 21: Refactor forms to use Conform (Server Action-native alternative) — contrast with RHF

### Deferred

- **Untappd redesign**: Tea model needs splitting into a shared catalogue + per-user check-ins. Current user-scoped model is intentionally temporary.
- **i18n**: Defer `next-intl`; use a constants file until localisation is actually needed.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16, App Router |
| Database | PostgreSQL via Docker |
| ORM | Prisma 7 with PrismaPg adapter |
| Auth | Better Auth with `nextCookies()` plugin |
| Styling | Tailwind CSS + shadcn/ui |
| Unit tests | Vitest + React Testing Library |
| E2E tests | Playwright |
| Route protection | `proxy.ts` (Next.js 16 — not `middleware.ts`) |
