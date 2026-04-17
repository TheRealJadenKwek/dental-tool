import Link from 'next/link'
import { MessageSquare, Users, DollarSign, ChevronRight, Github } from 'lucide-react'

const features = [
  {
    href: '/patients',
    title: 'Patient List',
    tagline: 'Roster with search & quick add',
    description: 'Add patients with name, phone, email, and last visit. Search instantly across all fields. Saved locally in your browser — no signup required.',
    icon: Users,
    color: 'bg-blue-600',
    accent: 'text-blue-600',
  },
  {
    href: '/expenses',
    title: 'Expense Tracker',
    tagline: 'Categorize, total, export CSV',
    description: 'Log supplies, lab fees, equipment, staff, utilities. See per-category totals at a glance and export the full ledger to CSV for your accountant.',
    icon: DollarSign,
    color: 'bg-emerald-600',
    accent: 'text-emerald-600',
  },
  {
    href: '/follow-up',
    title: 'Follow-Up Queue',
    tagline: 'SMS reminders for overdue patients',
    description: 'Flag patients as overdue, due soon, or contacted. Bulk-mark as contacted and copy a pre-written SMS reminder to your clipboard with one tap.',
    icon: MessageSquare,
    color: 'bg-violet-600',
    accent: 'text-violet-600',
  },
] as const

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live demo
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dental Practice Toolkit</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-2xl">
              A lightweight, mobile-first tool for patient records, expense tracking, and follow-up reminders. Built with Next.js, TypeScript, and Tailwind.
            </p>
          </div>
          <a
            href="https://github.com/TheRealJadenKwek/dental-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 hidden sm:inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
          >
            <Github className="w-4 h-4" />
            Source
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ href, title, tagline, description, icon: Icon, color, accent }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col"
              >
                <div className={`w-11 h-11 rounded-xl ${color} text-white flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:${accent} transition-colors`} />
                </div>
                <p className={`text-xs font-medium ${accent} mb-2`}>{tagline}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900 mb-3">How it works</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><span className="text-slate-400">•</span>Everything runs in your browser — patient and expense data is stored in <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">localStorage</code>, not on a server.</li>
            <li className="flex gap-2"><span className="text-slate-400">•</span>Export expenses to CSV any time for bookkeeping or tax filing.</li>
            <li className="flex gap-2"><span className="text-slate-400">•</span>Follow-up SMS is copied to your clipboard so you can paste it into your phone&apos;s messaging app.</li>
            <li className="flex gap-2"><span className="text-slate-400">•</span>Optional Supabase (auth) and Stripe (payments) integrations are wired up for when you outgrow single-device use.</li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Demo project · data stays in your browser · no account required.
          </p>
          <a
            href="https://github.com/TheRealJadenKwek/dental-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900"
          >
            <Github className="w-3.5 h-3.5" />
            View source on GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
