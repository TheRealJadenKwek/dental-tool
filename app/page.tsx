'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Users, DollarSign, ChevronRight, Plus } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface PatientCount { total: number; last30: number }
interface ExpenseMonth { month: string; total: number }

// ─── Mock Data (in production, from Supabase) ─────────────────────────────────
const patientStats: PatientCount = { total: 847, last30: 34 }
const recentExpenses: ExpenseMonth[] = [
  { month: 'Feb 2026', total: 1240 },
  { month: 'Jan 2026', total: 890 },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'followup' | 'expenses' | 'patients'>('home')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-slate-900">Dr. Kwek&apos;s Practice</h1>
          <p className="text-sm text-slate-500">New Hamburg Dental</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/follow-up" className="block">
            <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl p-5 text-left transition-colors min-h-[100px] flex flex-col justify-between">
              <MessageSquare className="w-7 h-7 mb-2" />
              <div>
                <div className="font-semibold text-base">Send Follow-Ups</div>
                <div className="text-blue-100 text-sm">Draft & send messages</div>
              </div>
            </button>
          </Link>

          <Link href="/patients" className="block">
            <button className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 rounded-2xl p-5 text-left border border-slate-200 transition-colors min-h-[100px] flex flex-col justify-between">
              <Users className="w-7 h-7 mb-2 text-slate-600" />
              <div>
                <div className="font-semibold text-base">Patient List</div>
                <div className="text-slate-500 text-sm">{patientStats.total} patients</div>
              </div>
            </button>
          </Link>

          <Link href="/expenses" className="block">
            <button className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 rounded-2xl p-5 text-left border border-slate-200 transition-colors min-h-[100px] flex flex-col justify-between">
              <DollarSign className="w-7 h-7 mb-2 text-slate-600" />
              <div>
                <div className="font-semibold text-base">Expenses</div>
                <div className="text-slate-500 text-sm">Track receipts</div>
              </div>
            </button>
          </Link>

          <button className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 rounded-2xl p-5 text-left border border-slate-200 transition-colors min-h-[100px] flex flex-col justify-between">
            <Plus className="w-7 h-7 mb-2 text-slate-600" />
            <div>
              <div className="font-semibold text-base">Quick Add</div>
              <div className="text-slate-500 text-sm">Patient or expense</div>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 text-sm">Recent Follow-Ups</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Sarah Jenkins', msg: 'Cleaning follow-up', time: '2h ago', status: 'sent' },
              { name: 'Tom Haverford', msg: 'Extraction check-in', time: 'Yesterday', status: 'sent' },
              { name: 'Priya Patel', msg: 'Root canal day 7', time: '3 days ago', status: 'replied' },
            ].map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.msg}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{item.time}</div>
                  <div className={`text-xs mt-0.5 font-medium ${item.status === 'replied' ? 'text-green-600' : 'text-slate-400'}`}>
                    {item.status === 'replied' ? 'Replied' : 'Sent'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/follow-up" className="block">
            <div className="px-4 py-3 text-center text-sm text-blue-600 font-medium border-t border-slate-100 hover:bg-blue-50 transition-colors">
              View all
            </div>
          </Link>
        </div>

        {/* Monthly Summary */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 px-4 py-4">
          <h2 className="font-semibold text-slate-900 text-sm mb-3">This Month</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-slate-900">{patientStats.last30}</div>
              <div className="text-xs text-slate-500 mt-0.5">Patients seen</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-slate-900">$1,240</div>
              <div className="text-xs text-slate-500 mt-0.5">Practice expenses</div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-white border-t border-slate-200 px-4 py-2">
        <div className="max-w-md mx-auto flex justify-around">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'followup', label: 'Follow-Up', icon: '💬' },
            { id: 'expenses', label: 'Expenses', icon: '💰' },
            { id: 'patients', label: 'Patients', icon: '👥' },
          ].map((tab) => (
            <Link key={tab.id} href={tab.id === 'home' ? '/' : `/${tab.id === 'followup' ? 'follow-up' : tab.id}`}>
              <button
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl text-xs transition-colors ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="mt-0.5">{tab.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
