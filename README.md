# Dental Practice Toolkit

A lightweight, mobile-first web app for small dental practices. Tracks patients, expenses, and follow-up reminders. Built with Next.js, TypeScript, and Tailwind.

## Features

| Feature | What it does | Storage |
| --- | --- | --- |
| **Patient List** (`/patients`) | Add, search, and delete patient records (name, phone, email, last visit) | Browser `localStorage` |
| **Expense Tracker** (`/expenses`) | Log expenses by category, see per-category totals, export CSV | Browser `localStorage` |
| **Follow-Up Queue** (`/follow-up`) | Flag overdue/due-soon/contacted patients, bulk-mark contacted, copy a pre-written SMS to clipboard | Demo data (swap for real source) |
| **Auth API** (`/api/auth`) | Supabase signup / signin / signout | Requires Supabase keys |
| **Payments API** (`/api/stripe`) | Create Stripe PaymentIntents | Requires Stripe key |

The three front-end pages work standalone in any browser — no signup or backend required. Supabase and Stripe are optional for when you outgrow single-device use.

## Run locally

```bash
git clone https://github.com/TheRealJadenKwek/dental-tool.git
cd dental-tool
cp .env.local.example .env.local   # fill in keys only if using the API routes
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

1. Push this repo to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. (Optional) Add the environment variables from `.env.local.example` if you want the Supabase or Stripe routes to work.
4. Click **Deploy**.

Or use the one-click button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheRealJadenKwek/dental-tool)

## Environment variables

Only required if you use the API routes. The front-end pages work without any of these.

| Variable | Used by |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `/api/auth` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `/api/auth` |
| `STRIPE_SECRET_KEY` | `/api/stripe` |

## Tech stack

Next.js · TypeScript · Tailwind CSS · Supabase · Stripe · lucide-react
