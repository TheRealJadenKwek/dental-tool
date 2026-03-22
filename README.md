# Dr. Kwek's Practice Tool

A mobile-first web app for managing a dental practice: patient records, expense tracking, and automated follow-up reminders.

---

## What It Is

A lightweight practice management tool for Dr. Kwek at New Hamburg Dental. It handles:

- **Patient records** with LocalStorage persistence — add, search, and delete patients
- **Expense tracking** with category breakdowns and CSV export
- **Follow-up management** — a prioritized queue of patients who need recall messages, with SMS template copying and one-click status updates

The UI is mobile-first (max-width 428px centered layout) with a bottom tab navigation bar.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (latest, App Router) |
| UI | React (latest), Tailwind CSS 4 |
| Icons | lucide-react |
| Auth | Supabase Auth (@supabase/auth-helpers-nextjs) |
| Payments | Stripe (stripe npm package) |
| Data | LocalStorage for patients and expenses; Supabase planned for persistence |
| Data | In-memory mock data for follow-up patients (MOCK array) |

---

## Pages

### `/` — Dashboard (Home)

Landing page after opening the app. Shows four quick-action cards:

| Card | Action |
|---|---|
| Send Follow-Ups | Navigates to /follow-up |
| Patient List | Navigates to /patients |
| Expenses | Navigates to /expenses |
| Quick Add | Opens an inline add form (UI only, non-functional) |

Below the cards: a **Recent Follow-Ups** list showing three hardcoded patients with name, message type, timestamp, and sent/replied status. A View all link navigates to /follow-up.

Bottom section: **This Month** summary with two tiles — patients seen in the last 30 days (mocked: 34) and current month expenses (hardcoded: $1,240).

Bottom tab bar with four tabs: Home, Follow-Up, Expenses, Patients.

### `/patients` — Patient List

Full CRUD for patients with LocalStorage persistence under the key `dental-patients`.

Each patient record stores:
- id (Date.now() string)
- name (required)
- phone (optional)
- email (optional)
- lastVisit (ISO date string, defaults to today)

Features:
- **Add Patient form** — toggled by the Add Patient button; fields for name, phone, email, last visit date; validates name is non-empty
- **Search** — real-time filter on name, phone, and email
- **Patient cards** — show initials avatar, name, phone, email, last visit date; delete via trash icon
- **Toast notifications** — appear at bottom of screen for add/remove actions (2.2s auto-dismiss)

### `/expenses` — Expense Tracker

Tracks dental practice expenses with LocalStorage persistence under the key `dental-expenses`.

Each expense record stores:
- id (Date.now() string)
- date (ISO date string)
- category (supplies | lab fees | equipment | staff | utilities | other)
- amount (number, stored as dollars)
- notes (optional string)

Features:
- **Add Expense form** — toggled by the Add button; fields for date, amount (required), category dropdown, notes
- **Category breakdown** — grid of cards showing total per category with color-coded badges
- **Grand total** — shown in header
- **Sort** — toggle sort by date or amount, ascending or descending
- **CSV Export** — downloads a CSV file named `expenses-YYYY-MM-DD.csv` with Date, Category, Amount, Notes columns
- **Delete** — per-row Remove link
- **Toast notifications** — for add and remove actions

### `/follow-up` — Patient Follow-Up

A prioritized recall queue for patients due or overdue for appointments.

Data source: a `MOCK` array of 10 hardcoded patients (not from LocalStorage). Each patient has id, name, phone, lastVisit date, and status (overdue | due-soon | contacted).

Status badges:
| Status | Color | Meaning |
|---|---|---|
| Overdue | Red | Past typical recall window |
| Due Soon | Yellow | Approaching recall window |
| Contacted | Green | Already reached out |

Features:
- **Filter pills** — show counts for overdue, due-soon, and contacted patients
- **Search** — real-time filter on name and phone
- **Tab filter bar** — All / Overdue / Due Soon / Contacted
- **Select all / bulk select** — checkbox per patient; Select All toggles full selection
- **Mark Contacted** — bulk action button marks all selected patients as contacted
- **Per-patient Copy Reminder SMS** — copies a pre-written SMS template to the clipboard
- **Per-patient Done button** — marks a single patient as contacted
- **Toast notifications** — for SMS copy and status update actions

The SMS template reads:
`Hi {firstName}, this is New Hamburg Dental. You're due for a checkup. Call us at 519-662-2273 to book.`

---

## LocalStorage Keys

| Key | Data |
|---|---|
| `dental-patients` | Patient[] — array of patient records |
| `dental-expenses` | Expense[] — array of expense records |

Data is loaded on component mount and re-persisted on every mutation. No server sync.

---

## API Routes

### POST /api/auth

Supabase Auth handler for login and registration.

POST body: `{ email, password, action }`
- `action = "login"`: calls `supabase.auth.signInWithPassword`; returns `{ user, session }`
- `action = "register"`: calls `supabase.auth.signUp`; returns `{ user }`

DELETE: calls `supabase.auth.signOut`; returns `{ ok: true }`

### POST /api/stripe

Creates a Stripe PaymentIntent for a dental service charge.

POST body: `{ patientId, amount, description }`
- `amount` is in dollars (converted to cents internally: `amount * 100`)
- `currency`: CAD
- `metadata` includes `patientId` and `description`
- Returns: `{ clientSecret }` or `{ error }`

Requires `STRIPE_SECRET_KEY` environment variable.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe API key for payment intent creation |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (client-side) key |

---

## How to Run

```bash
cd projects/dental-tool
npm install
npm run dev
# Open http://localhost:3000
```

For production:
```bash
npm run build
npm start
```

---

## What is Missing or Incomplete

- **Supabase persistence** — patients and expenses are LocalStorage-only; a real Supabase schema and API integration is needed to sync across devices and sessions
- **Auth flow UI** — /api/auth is wired but there is no login/signup page in the app; the dashboard is accessible without authentication
- **Quick Add button** — the Quick Add card on the dashboard has no functional implementation
- **Follow-up data is mock** — the MOCK array is hardcoded; needs a real Supabase query to fetch patients past their recall date
- **SMS sending** — Copy Reminder SMS only copies to clipboard; a real integration with Twilio or a dental SMS provider is needed for actual sending
- **Stripe checkout UI** — the API route creates a PaymentIntent but there is no payment form component to collect card details
- **Appointment booking** — no calendar or scheduling component exists
- **Real recall logic** — follow-up status is manually set; no automatic status transition based on last visit date
- **Supabase database schema** — no migration files or schema documentation for the expected tables
- **Error handling for Supabase/Stripe** — API routes return raw error messages; no structured error responses or retry logic
