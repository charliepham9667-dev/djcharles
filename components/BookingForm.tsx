'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const inputClass =
  'w-full bg-transparent border-b border-white/30 text-white font-inter py-3 focus:outline-none focus:border-white transition-colors duration-200 placeholder:text-white/20'
const labelClass = 'block font-mono text-xs text-white/40 uppercase tracking-widest mb-2'

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

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12"
        >
          <p
            className="font-bebas text-white uppercase leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 80px)' }}
          >
            Inquiry Received
          </p>
          <p className="font-mono text-xs text-white/40 mt-4 uppercase tracking-widest">
            Check your inbox — I&apos;ll be in touch within 24 hours.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <select name="eventType" value={form.eventType} onChange={handleChange} required className={`${inputClass} bg-black`}>
                <option value="">Select event type</option>
                {['Club Night', 'Private Party', 'Wedding', 'Corporate', 'Festival', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Event Date</label>
              <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className={`${inputClass} [color-scheme:dark]`} />
            </div>
            <div>
              <label className={labelClass}>Location / City</label>
              <input name="location" value={form.location} onChange={handleChange} required className={inputClass} placeholder="Oslo, Norway" />
            </div>
            <div>
              <label className={labelClass}>Expected Guest Count</label>
              <select name="guestCount" value={form.guestCount} onChange={handleChange} required className={`${inputClass} bg-black`}>
                <option value="">Select guest count</option>
                {['Under 50', '50–100', '100–250', '250–500', '500+'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Package Interest</label>
              <select name="package" value={form.package} onChange={handleChange} required className={`${inputClass} bg-black`}>
                <option value="">Select a package</option>
                {['Basic Set', 'Extended Set', 'Full Night', 'Custom'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Additional Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={4} className={inputClass} placeholder="Tell me about your event..." />
          </div>

          {status === 'error' && (
            <p className="font-mono text-xs text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-black font-bebas uppercase tracking-widest px-12 py-4 text-lg hover:bg-white/80 transition-colors duration-300 disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
