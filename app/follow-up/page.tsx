'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, CheckSquare, Square, MessageSquare, Phone, Clock, X } from 'lucide-react'

type Status = 'overdue' | 'due-soon' | 'contacted'
interface Patient { id: number; name: string; phone: string; lastVisit: string; status: Status }

const MOCK: Patient[] = [
  { id: 1,  name: 'Sarah Jenkins',    phone: '519-555-0101', lastVisit: '2025-12-10', status: 'overdue' },
  { id: 2,  name: 'Tom Haverford',    phone: '519-555-0102', lastVisit: '2025-12-22', status: 'overdue' },
  { id: 3,  name: 'Priya Patel',      phone: '519-555-0103', lastVisit: '2026-01-05', status: 'overdue' },
  { id: 4,  name: 'Marcus Webb',      phone: '519-555-0104', lastVisit: '2026-01-18', status: 'due-soon' },
  { id: 5,  name: 'Linda Tran',       phone: '519-555-0105', lastVisit: '2026-01-30', status: 'due-soon' },
  { id: 6,  name: 'Kevin Osei',       phone: '519-555-0106', lastVisit: '2026-02-03', status: 'due-soon' },
  { id: 7,  name: 'Fatima Al-Hassan', phone: '519-555-0107', lastVisit: '2026-02-14', status: 'due-soon' },
  { id: 8,  name: 'Connor Blake',     phone: '519-555-0108', lastVisit: '2026-02-20', status: 'contacted' },
  { id: 9,  name: 'Yuki Tanaka',      phone: '519-555-0109', lastVisit: '2026-03-01', status: 'contacted' },
  { id: 10, name: 'Diana Morin',      phone: '519-555-0110', lastVisit: '2026-03-10', status: 'contacted' },
]

const sms = (name: string) =>
  `Hi ${name}, this is New Hamburg Dental. You're due for a checkup. Call us at 519-662-2273 to book.`

const CFG = {
  'overdue':   { label: 'Overdue',   bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
  'due-soon':  { label: 'Due Soon',  bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'contacted': { label: 'Contacted', bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
} as const

export default function FollowUpPage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() =>
    patients.filter((p) => {
      const q = search.toLowerCase()
      return (filter === 'all' || p.status === filter) &&
             (p.name.toLowerCase().includes(q) || p.phone.includes(q))
    }), [patients, search, filter])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const copyReminder = async (p: Patient) => {
    const first = p.name.split(' ')[0]
    try { await navigator.clipboard.writeText(sms(first)); showToast('Copied SMS for ' + first) }
    catch { showToast('Copy failed') }
  }

  const toggleSelect = (id: number) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const toggleAll = () =>
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)))

  const markBulk = () => {
    setPatients((prev) => prev.map((p) => selected.has(p.id) ? { ...p, status: 'contacted' as Status } : p))
    showToast(selected.size + ' patient' + (selected.size !== 1 ? 's' : '') + ' marked contacted')
    setSelected(new Set())
  }

  const markOne = (id: number) => {
    setPatients((prev) => prev.map((p) => p.id === id ? { ...p, status: 'contacted' as Status } : p))
    showToast((patients.find((p) => p.id === id)?.name.split(' ')[0] ?? '') + ' marked as contacted')
  }

  const counts = {
    'overdue': patients.filter((p) => p.status === 'overdue').length,
    'due-soon': patients.filter((p) => p.status === 'due-soon').length,
    'contacted': patients.filter((p) => p.status === 'contacted').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="font-bold text-slate-900">Patient Follow-Up</h1>
            <p className="text-xs text-slate-500">{patients.length} patients</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl px-3 py-2">
          <strong>Demo data:</strong> this page shows sample patients. Hook up your own list via Supabase or swap in localStorage.
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['overdue', 'due-soon', 'contacted'] as Status[]).map((s) => {
            const c = CFG[s]
            return (
              <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />{c.label}: {counts[s]}
              </div>
            )
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search name or phone..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(['all', 'overdue', 'due-soon', 'contacted'] as const).map((v) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${filter === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {v === 'all' ? 'All' : v === 'due-soon' ? 'Due Soon' : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={toggleAll} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
            {selected.size > 0 && selected.size === filtered.length
              ? <CheckSquare className="w-4 h-4 text-blue-600" />
              : <Square className="w-4 h-4" />}
            {selected.size > 0 ? selected.size + ' selected' : 'Select all'}
          </button>
          {selected.size > 0 && (
            <button onClick={markBulk} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700">
              Mark Contacted
            </button>
          )}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No patients found</p>}
          {filtered.map((p) => {
            const c = CFG[p.status]; const isSel = selected.has(p.id)
            return (
              <div key={p.id} className={`bg-white rounded-2xl border transition-colors ${isSel ? 'border-blue-400 ring-1 ring-blue-300' : 'border-slate-200'}`}>
                <div className="px-4 py-3 flex items-center gap-3">
                  <button onClick={() => toggleSelect(p.id)} className="shrink-0">
                    {isSel ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                  </button>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 truncate">{p.name}</div>
                    <div className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-slate-400" /><span className="text-xs text-slate-500">{p.phone}</span></div>
                    <div className="flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3 text-slate-400" /><span className="text-xs text-slate-500">Last visit: {p.lastVisit}</span></div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>
                </div>
                <div className="px-4 pb-3 flex gap-2">
                  <button onClick={() => copyReminder(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-2 rounded-xl transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />Copy Reminder SMS
                  </button>
                  {p.status !== 'contacted' && (
                    <button onClick={() => markOne(p.id)}
                      className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium px-3 py-2 rounded-xl transition-colors">
                      <CheckSquare className="w-3.5 h-3.5" />Done
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-2xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
