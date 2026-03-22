# Dental Practice Tool — Dr. Kwek's Practice App

A mobile-first web app built for Dr. Kwek (solo dentist, New Hamburg ON), now operating under True North (DSO). Designed for phone-first use, manual triggers, and no backend required for the core features.

**Status:** MVP complete. Three pages built and deployed. No backend, no auth, all data persists in localStorage.

## What It Does

Three tools in one mobile-friendly app:

**1. Follow-Up Manager (`/follow-up`)**
View patients by follow-up status (overdue, due soon, contacted). Search by name or phone. Select patients individually or in bulk. Copy a pre-filled SMS reminder to clipboard with one tap. Mark patients as contacted individually or in bulk. All state resets on refresh since data is mock/in-memory.

**2. Expense Tracker (`/expenses`)**
Log practice expenses (date, category, amount, notes). Categories: supplies, lab fees, equipment, staff, utilities, other. Sort by date or amount. View breakdown by category with totals. Export all expenses as a CSV file for the accountant. Data persists in localStorage between sessions.

**3. Patient List (`/patients`)**
Add, search, and remove patients (name, phone, email, last visit date). Full-text search across name, phone, and email. Data persists in localStorage between sessions.

**Home Dashboard (`/`)**
Overview with quick-action tiles linking to each section, a recent follow-ups summary feed (mock data), and a monthly summary tile showing patients seen and expenses.

## How to Run Locally

```bash
cd projects/dental-tool
npm install
npm run dev
```

App runs at `http://localhost:3000`. No environment variables needed. Works entirely in-browser.

## Tech Stack

- **Framework:** Next.js (App Router, latest)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Data:** localStorage (client-side only, no backend)
- **No auth, no database, no API routes**

## LocalStorage Data Persistence Model

Two localStorage keys are used:

| Key | Page | What's Stored |
|---|---|---|
| `dental-expenses` | `/expenses` | Array of `{id, date, category, amount, notes}` objects |
| `dental-patients` | `/patients` | Array of `{id, name, phone, email, lastVisit}` objects |

The follow-up page uses in-memory state only (mock data for 10 patients). Data resets on page refresh. In production, this would be replaced with a Supabase table or API call to the DSO's patient management system.

**Important:** localStorage is device-specific. Data entered on a phone won't appear on a desktop. No sync. This was intentional for the MVP.

## What's Built

- Home dashboard with navigation tiles and activity feed
- Follow-up manager with search, filter, bulk select, copy-to-clipboard SMS, mark-as-contacted
- Expense tracker with add/remove, category breakdown, CSV export, date/amount sorting, localStorage persistence
- Patient list with add/remove/search and localStorage persistence
- Mobile-optimized layout with sticky headers, bottom nav bar, toast notifications
- Clean design using slate color palette, rounded-2xl cards, large touch targets

## What's Missing

**Stripe / Payment processing:** Not implemented. The tool is currently free to use. Future versions might add a Stripe checkout for the setup fee.

**Real SMS sending:** The follow-up tool generates SMS text and copies it to clipboard. Dr. Kwek manually opens his SMS app and pastes. There is no Twilio integration or automated sending. This was a deliberate design choice: he uses his personal cell, wants messages to feel personal, and PIPEDA compliance adds friction to automated health-related SMS in Ontario.

**Real backend:** All data lives in localStorage. There is no Supabase, no PostgreSQL, no auth. A production deployment would need user auth (NextAuth.js), a Supabase database for patients and expenses, and API routes for CRUD operations.

**Integration with True North's patient DB:** The patient list and follow-up lists are manually managed. There is no API connection to the DSO's practice management software (Dentrix, etc.). This would require True North approval and API credentials.

**Receipt photo capture:** The expense tracker accepts text notes only. There is no camera integration or file upload for receipt photos. The CSV export lists notes but not images.

**Multi-user / multi-location:** Single user, single location. No role-based access.
