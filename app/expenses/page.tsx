'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Download, ChevronUp, ChevronDown } from 'lucide-react'

type Category = 'supplies' | 'lab fees' | 'equipment' | 'staff' | 'utilities' | 'other'

interface Expense {
  id: string
  date: string
  category: Category
  amount: number
  notes: string
}

const CATS: Category[] = ['supplies', 'lab fees', 'equipment', 'staff', 'utilities', 'other']

const CAT_COLOR: Record<Category, string> = {
  'supplies':  'bg-blue-100 text-blue-700',
  'lab fees':  'bg-purple-100 text-purple-700',
  'equipment': 'bg-orange-100 text-orange-700',
  'staff':     'bg-pink-100 text-pink-700',
  'utilities': 'bg-teal-100 text-teal-700',
  'other':     'bg-slate-100 text-slate-700',
}

const KEY = 'dental-expenses'
const blank = () => ({ date: new Date().toISOString().split('T')[0], category: 'supplies' as Category, amount: '', notes: '' })

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [form, setForm] = useState(blank())
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [toast, setToast] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setExpenses(JSON.parse(r)) } catch {}
  }, [])

  const persist = (data: Expense[]) => { setExpenses(data); localStorage.setItem(KEY, JSON.stringify(data)) }
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }

  const add = () => {
    if (!form.date || !form.amount || isNaN(parseFloat(form.amount))) { showToast('Date and amount required'); return }
    persist([...expenses, { id: Date.now().toString(), date: form.date, category: form.category, amount: parseFloat(parseFloat(form.amount).toFixed(2)), notes: form.notes }])
    setForm(blank()); setOpen(false); showToast('Expense added')
  }

  const remove = (id: string) => { persist(expenses.filter((e) => e.id !== id)); showToast('Removed') }

  const sorted = useMemo(() => [...expenses].sort((a, b) => {
    const v = sortBy === 'date' ? a.date.localeCompare(b.date) : a.amount - b.amount
    return sortDir === 'asc' ? v : -v
  }), [expenses, sortBy, sortDir])

  const toggleSort = (col: 'date' | 'amount') => {
    if (sortBy === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const totals = useMemo(() => {
    const m: Partial<Record<Category, number>> = {}
    for (const e of expenses) m[e.category] = (m[e.category] ?? 0) + e.amount
    return m
  }, [expenses])

  const grand = expenses.reduce((s, e) => s + e.amount, 0)

  const exportCSV = () => {
    const rows = [['Date', 'Category', 'Amount', 'Notes'], ...sorted.map((e) => [e.date, e.category, e.amount.toFixed(2), e.notes])]
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></Link>
            <div><h1 className="font-bold text-slate-900">Expense Tracker</h1><p className="text-xs text-slate-500">${grand.toFixed(2)} total</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1 text-xs text-slate-600 border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50"><Download className="w-3.5 h-3.5" />CSV</button>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"><Plus className="w-3.5 h-3.5" />Add</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        {open && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm">New Expense</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Amount ($)</label>
                <input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
                {CATS.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Notes</label>
              <input type="text" placeholder="Optional..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={add} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700">Add Expense</button>
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl text-sm text-slate-600 border border-slate-200 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        )}

        {Object.keys(totals).length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">By Category</h2>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(totals) as [Category, number][]).map(([cat, total]) => (
                <div key={cat} className="bg-white rounded-xl border border-slate-200 px-3 py-2.5">
                  <div className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 capitalize ${CAT_COLOR[cat]}`}>{cat}</div>
                  <div className="text-lg font-bold text-slate-900">${total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 text-sm">All Expenses</h2>
            <div className="flex gap-2 text-xs text-slate-500">
              <button onClick={() => toggleSort('date')} className="flex items-center gap-0.5 hover:text-slate-800">
                Date{sortBy === 'date' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>
              <span>|</span>
              <button onClick={() => toggleSort('amount')} className="flex items-center gap-0.5 hover:text-slate-800">
                Amount{sortBy === 'amount' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>
            </div>
          </div>
          {sorted.length === 0
            ? <div className="px-4 py-10 text-center text-slate-400 text-sm">No expenses yet. Tap Add to get started.</div>
            : <div className="divide-y divide-slate-100">
                {sorted.map((e) => (
                  <div key={e.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${CAT_COLOR[e.category]}`}>{e.category}</span>
                        <span className="text-xs text-slate-400">{e.date}</span>
                      </div>
                      {e.notes && <p className="text-xs text-slate-500 truncate">{e.notes}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-slate-900 text-sm">${e.amount.toFixed(2)}</div>
                      <button onClick={() => remove(e.id)} className="text-xs text-red-400 hover:text-red-600 mt-0.5">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </main>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-2xl shadow-lg z-50">{toast}</div>}
    </div>
  )
}
