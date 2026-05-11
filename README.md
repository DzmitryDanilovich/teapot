# Teapot

A tea tracking app — log teas you've tried, rate them, and link to the store pages where you bought them. Think Untappd, but for tea.

Built as a learning project while picking up Next.js 16 (App Router) coming from a React + ASP.NET background.

## Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **Prisma 7** — ORM with PostgreSQL
- **Tailwind CSS** — styling
- **zod** — form validation
- **TypeScript**

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- Docker (for local Postgres)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the local database:
   ```bash
   docker run -d \
     --name teapot-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=teapot \
     -p 5432:5432 \
     postgres:16
   ```

3. Copy the environment file and set your database URL:
   ```bash
   cp .env.example .env
   ```
   The default `DATABASE_URL` in `.env.example` matches the Docker setup above.

4. Run migrations and seed:
   ```bash
   pnpm exec prisma migrate dev
   pnpm exec tsx prisma/seed.ts
   ```

5. Start the dev server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Notes

This is also a hands-on Next.js learning project — built incrementally while exploring the App Router, Server Components, Server Actions, and Prisma. `HANDBOOK.md` in the root contains running notes on everything covered so far.
