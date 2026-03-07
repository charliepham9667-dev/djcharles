'use client'

import React, { useState } from 'react'
import type { Inquiry, InquiryStatus } from '@/types'

const STATUS_COLORS: Record<InquiryStatus, string> = {
  'New': 'text-gold border-gold/40',
  'In Progress': 'text-blue-400 border-blue-400/40',
  'Confirmed': 'text-green-400 border-green-400/40',
  'Declined': 'text-red-400 border-red-400/40',
}
const STATUSES: InquiryStatus[] = ['New', 'In Progress', 'Confirmed', 'Declined']

export default function AdminTable({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [expanded, setExpanded] = useState<string | null>(null)

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gold/30">
            {['Name', 'Email', 'Event Type', 'Date', 'Location', 'Guests', 'Package', 'Submitted', 'Status'].map(h => (
              <th key={h} className="text-left font-mono text-xs text-gold uppercase tracking-widest px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq, i) => (
            <React.Fragment key={inq.id}>
              <tr
                className={`cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
              >
                <td className="px-4 py-3 font-inter text-sm text-white">{inq.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/60">{inq.email}</td>
                <td className="px-4 py-3 font-inter text-sm text-white/80">{inq.eventType}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/60">{inq.eventDate}</td>
                <td className="px-4 py-3 font-inter text-sm text-white/80">{inq.location}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/60">{inq.guestCount}</td>
                <td className="px-4 py-3 font-inter text-sm text-white/80">{inq.package}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/40">{new Date(inq.submittedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <select
                    value={inq.status}
                    onChange={e => updateStatus(inq.id, e.target.value as InquiryStatus)}
                    className={`bg-transparent border rounded px-2 py-1 font-mono text-xs cursor-pointer focus:outline-none ${STATUS_COLORS[inq.status]}`}
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                  </select>
                </td>
              </tr>
              {expanded === inq.id && (
                <tr key={`${inq.id}-expanded`} className="bg-surface">
                  <td colSpan={9} className="px-4 py-4">
                    <p className="font-mono text-xs text-gold uppercase mb-2">Message</p>
                    <p className="font-inter text-sm text-white/70">{inq.message}</p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {inquiries.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center font-mono text-xs text-white/30">No inquiries yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
