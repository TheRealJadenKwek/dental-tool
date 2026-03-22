'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, X, Trash2, User } from 'lucide-react'

interface Patient {
  id: string
  name: string
  phone: string
  email: string
  lastVisit: string
}

const KEY = 'dental-patients'

const blank = () => ({ name: '', phone: '', email: '', lastVisit: new Date().toISOString().split('T')[0] })

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(blank())
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setPatients(JSON.parse(r)) } catch {}
  }, [])

  const persist = (data: Patient[]) => { setPatients(data); localStorage.setItem(KEY, JSON.stringify(data)) }
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }

  const add = () => {
    if (!form.name.trim()) { showToast('Name is required'); return }
    persist([...patients, { id: Date.now().toString(), name: form.name.trim(), phone: form.phone, email: form.email, lastVisit: form.lastVisit }])
    setForm(blank()); setOpen(false); showToast('Patient added')
  }

  const remove = (id: string) => { persist(patients.filter((p) => p.id !== id)); showToast('Patient removed') }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return patients.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.email.toLowerCase().includes(q))
  }, [patients, search])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></Link>
            <div><h1 className="font-bold text-slate-900">Patient List</h1><p className="text-xs text-slate-500">{patients.length} patients</p></div>
          </div>
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
            <Plus className="w-3.5 h-3.5" />Add Patient
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-4">
        {open && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm">New Patient</h2>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Full Name *</label>
              <input type="text" placeholder="e.g. Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Phone</label>
                <input type="tel" placeholder="519-555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Last Visit</label>
                <input type="date" value={form.lastVisit} onChange={(e) => setForm({ ...form, lastVisit: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Email</label>
              <input type="email" placeholder="optional@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={add} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700">Add Patient</button>
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, phone, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-10">
            {patients.length === 0 ? 'No patients yet. Tap Add Patient to get started.' : 'No results for that search.'}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900">{p.name}</div>
                  {p.phone && <div className="text-xs text-slate-500">{p.phone}</div>}
                  {p.email && <div className="text-xs text-slate-400 truncate">{p.email}</div>}
                  {p.lastVisit && <div className="text-xs text-slate-400 mt-0.5">Last visit: {p.lastVisit}</div>}
                </div>
                <button onClick={() => remove(p.id)} className="shrink-0 p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-2xl shadow-lg z-50">{toast}</div>}
    </div>
  )
}
