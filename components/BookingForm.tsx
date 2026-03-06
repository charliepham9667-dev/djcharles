'use client'

import { useState } from 'react'

const inputClass = "w-full bg-surface border border-white/20 text-white font-inter px-4 py-3 rounded-none focus:outline-none focus:border-gold transition-colors duration-200 placeholder:text-white/30"
const labelClass = "block font-mono text-xs text-white/50 uppercase tracking-widest mb-2"

export default function BookingForm() {
  const [form, setForm] = useState({
    name: '', email: '', eventType: '', eventDate: '',
    location: '', guestCount: '', package: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-gold/40 bg-gold/5 p-8 text-center">
        <p className="font-spartan font-black text-2xl text-gold uppercase mb-2">Inquiry Sent</p>
        <p className="font-inter text-white/60 text-sm">Check your inbox — I've sent you a rate card and will be in touch within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="your@email.com" />
        </div>
        <div>
          <label className={labelClass}>Event Type</label>
          <select name="eventType" value={form.eventType} onChange={handleChange} required className={inputClass}>
            <option value="">Select event type</option>
            {['Club Night', 'Private Party', 'Wedding', 'Corporate', 'Festival', 'Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Event Date</label>
          <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Location / City</label>
          <input name="location" value={form.location} onChange={handleChange} required className={inputClass} placeholder="Oslo, Norway" />
        </div>
        <div>
          <label className={labelClass}>Expected Guest Count</label>
          <select name="guestCount" value={form.guestCount} onChange={handleChange} required className={inputClass}>
            <option value="">Select guest count</option>
            {['Under 50', '50–100', '100–250', '250–500', '500+'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Package Interest</label>
          <select name="package" value={form.package} onChange={handleChange} required className={inputClass}>
            <option value="">Select a package</option>
            {['Basic Set', 'Extended Set', 'Full Night', 'Custom'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Additional Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={5} className={inputClass} placeholder="Tell me about your event..." />
      </div>

      {status === 'error' && (
        <p className="font-mono text-xs text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full md:w-auto bg-gold text-black font-spartan font-black uppercase tracking-widest px-12 py-4 text-sm hover:bg-white transition-colors duration-300 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  )
}
