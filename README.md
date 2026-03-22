# Dental Practice Tool

A mobile-first single-user SaaS built for Dr. Kwek, a solo dentist in New Hamburg, Ontario whose practice was acquired by True North (a DSO). The tool runs entirely in the browser with no cloud backend. All data persists in browser localStorage. There is no login, no server, and no database. Dr. Kwek opens it on his phone and uses it throughout the day.

The tool has three features: a patient follow-up manager for sending SMS reminders, an expense tracker for logging receipts, and a patient list. A home dashboard ties them together with quick-access buttons and a summary of recent activity.

---

## Tech Stack

- Framework: Next.js (App Router, latest)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Icons: lucide-react
- Data persistence: browser localStorage (no backend, no database)

## How to Run Locally

npm install && npm run dev

App starts at http://localhost:3000. No environment variables required.

## Data Persistence

All data lives in the browser via localStorage:
- dental-expenses — array of Expense objects (id, date, category, amount, notes)
- dental-patients — array of Patient objects (id, name, phone, email, lastVisit)

The Follow-Up page uses hardcoded mock patient data (10 patients) and tracks state only in React state for the session. Status changes (marking patients as contacted) are lost on page refresh. This is a known MVP limitation.

---
## Pages

### / (Home Dashboard)

The app entry point. Shows practice name header and four quick-action tiles in a 2x2 grid:
- Send Follow-Ups (blue primary tile) — links to /follow-up
- Patient List — links to /patients, shows total patient count (hardcoded 847)
- Expenses — links to /expenses
- Quick Add — placeholder tile, not yet functional

Below the grid: a Recent Follow-Ups card with three hardcoded mock entries showing name, message type, time elapsed, and sent/replied status. A View all link goes to /follow-up.

Below that: a This Month summary with two stats (patients seen: 34, practice expenses: $1,240 — both hardcoded).

Bottom navigation bar with four tabs linking to /, /follow-up, /expenses, /patients.

### /follow-up (Patient Follow-Up Manager)

The core feature. Lets Dr. Kwek identify patients needing follow-up and copy a pre-written SMS reminder to send from his personal phone.

Data: 10 hardcoded mock patients with name, phone number (519-555-01xx), last visit date, and initial status. Statuses: overdue (last visit before Jan 2026), due-soon (Jan-Feb 2026), contacted.

Status summary: Three colored pills at the top showing counts for each status (overdue in red, due-soon in yellow, contacted in green).

Search: Real-time text filter by patient name or phone number, with a clear button.

Filter tabs: Segmented control for All / Overdue / Due Soon / Contacted. Combines with search.

Bulk selection: Each patient card has a checkbox. Select All toggle. When patients are selected, a Mark Contacted button batch-updates them to contacted status and shows a toast with the count.

Per-patient actions: Copy Reminder SMS copies a pre-filled message to clipboard using navigator.clipboard. Done button marks a single patient as contacted. Both show toast confirmations.

Pre-written SMS template: "Hi [FirstName], this is New Hamburg Dental. You are due for a checkup. Call us at 519-662-2273 to book."

Toast notifications: Temporary dark pill at bottom of screen (2.5 seconds) for copy success, mark actions, and errors.

Limitation: Patient data is hardcoded. Status changes are React state only and reset on page refresh. No real SMS sending — clipboard copy only. Patients cannot be added, edited, or removed here.

### /expenses (Expense Tracker)

A complete expense logging tool with full localStorage persistence.

Add Expense panel: Collapsible form toggled by the Add button in the header. Fields: Date (date picker, defaults to today), Amount (number, step 0.01), Category (dropdown), Notes (optional). Validates date and amount before saving. Shows toast on success.

Categories: supplies, lab fees, equipment, staff, utilities, other. Each has a distinct color chip (blue, purple, orange, pink, teal, slate).

Category summary: When expenses exist, a 2-column grid shows total spending per category.

Expense list: Sortable by date or amount (toggle asc/desc by clicking column headers). Each row shows category chip, date, optional notes (truncated), and dollar amount. Remove button deletes from localStorage with toast.

CSV export: Download button in the header generates a CSV file (Date, Category, Amount, Notes) and triggers a browser download named expenses-YYYY-MM-DD.csv.

Running total: Header subtitle shows current grand total.

### /patients (Patient List)

A localStorage-backed patient directory. Separate from the hardcoded follow-up data — this is a clean add/delete list.

Add Patient panel: Collapsible form. Fields: Full Name (required), Phone (optional), Last Visit date (defaults to today), Email (optional). Appends to localStorage on submit.

Search: Real-time filter by name, phone, or email with clear button.

Patient cards: Each shows a blue avatar circle, name, phone, email (truncated), and last visit date. Trash icon button deletes the entry.

Empty states: Separate messages for zero patients versus no search results.

---

## What Is Still Missing

Real SMS sending — Follow-up page copies text to clipboard only. No Twilio, no SMS API, no WhatsApp Business API. Dr. Kwek manually pastes and sends from his personal phone.

Follow-up persistence — Status changes on /follow-up reset on page refresh. 10 patients are hardcoded mock data. No connection to the /patients localStorage data.

Receipt capture — Expense tracker has no photo or receipt attachment. Camera capture is in the SPEC but not implemented. Text fields only.

Authentication — No login, no password, no session. Anyone with the URL can access all data.

Multi-user backend — Single-device, single-user. No Supabase, no API, no cross-device sync.

Dashboard real data — Home dashboard stats (847 patients, 34 seen this month, $1,240 expenses) and recent follow-ups list are all hardcoded mock values. They do not read from localStorage.

Quick Add tile — The fourth home screen tile exists but has no functionality.

Follow-up history log — No record of past messages sent or campaigns run.

Import from practice software — True North DSO system not integrated. Patient data is manual entry only.

Scheduled reminders — No push notifications, no cron-based follow-up nudges.
