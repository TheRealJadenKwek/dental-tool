# Dental Practice Toolkit

A small Next.js demo app: a mobile-first admin tool for a fictional dental practice. Built to showcase a full-stack stack in a single focused project — patient records, expense tracking, and follow-up reminders, plus optional Supabase auth and Stripe payments.

> **Not a real product.** This is a portfolio/demo project, not a replacement for real dental practice management software (Dentrix, Open Dental, etc.).

## What it demonstrates

- **Next.js 16 App Router** with a mix of static pages and dynamic route handlers
- **TypeScript** end-to-end with strict types
- **Tailwind CSS** responsive layout (mobile-first, scales to desktop)
- **Client state + persistence** via `localStorage` (no backend required for core features)
- **Supabase** server-client integration for auth (`/api/auth`)
- **Stripe** PaymentIntents for payments (`/api/stripe`)
- **CSV export** with client-side Blob generation
- Clean, lazy-initialized API routes so the app builds on Vercel with zero env vars

## Features

| Page | What it does | Data |
| --- | --- | --- |
| `/` | Feature-forward dashboard / landing page | — |
| `/patients` | Add / search / delete patient records (name, phone, email, last visit) | Browser `localStorage` |
| `/expenses` | Log expenses by category, see per-category totals, export CSV | Browser `localStorage` |
| `/follow-up` | Flag overdue / due-soon / contacted patients, bulk-update status, copy an SMS reminder to clipboard | Demo data (sample patients) |
| `/api/auth` | Supabase signup / signin / signout | Needs Supabase keys |
| `/api/stripe` | Create Stripe PaymentIntents | Needs Stripe key |

The three front-end pages work standalone. Supabase and Stripe routes return a 503 if their env vars aren't set, so the app still deploys cleanly.

## Run locally

```bash
git clone https://github.com/TheRealJadenKwek/dental-tool.git
cd dental-tool
cp .env.local.example .env.local   # optional: only needed for API routes
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheRealJadenKwek/dental-tool)

Or manually: push to your fork → import in [vercel.com/new](https://vercel.com/new) → deploy. No env vars needed for a first deploy.

## Environment variables

Optional. Only set these if you want to exercise the backend routes.

| Variable | Used by |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `/api/auth` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `/api/auth` |
| `STRIPE_SECRET_KEY` | `/api/stripe` |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase · Stripe · lucide-react
