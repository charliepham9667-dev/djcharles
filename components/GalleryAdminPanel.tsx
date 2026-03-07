'use client'

import { useState, useRef } from 'react'
import type { GalleryImage } from '@/types'

function ItemCard({
  item,
  onUpdate,
  onDelete,
}: {
  item: GalleryImage
  onUpdate: (id: string, updates: Partial<GalleryImage>) => void
  onDelete: (id: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [replacing, setReplacing] = useState(false)

  const replace = async (file: File) => {
    setReplacing(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', 'gallery')
    fd.append('replaceId', item.id)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) onUpdate(item.id, { src: data.path + '?t=' + Date.now() })
    setReplacing(false)
  }

  return (
    <div className="space-y-2">
      {/* Thumbnail — click to replace */}
      <div
        className="relative overflow-hidden border border-white/10 cursor-pointer group"
        style={{ aspectRatio: '4/3' }}
        onClick={() => inputRef.current?.click()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="font-mono text-xs text-white uppercase tracking-widest">
            {replacing ? 'Uploading…' : 'Replace'}
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) replace(f) }}
        />
      </div>

      {/* Event */}
      <input
        type="text"
        value={item.event}
        onChange={e => onUpdate(item.id, { event: e.target.value })}
        placeholder="Event name"
        className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none font-inter text-xs text-white py-1 placeholder:text-white/20"
      />

      {/* Date */}
      <input
        type="date"
        value={item.date}
        onChange={e => onUpdate(item.id, { date: e.target.value })}
        className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none font-mono text-xs text-white py-1 [color-scheme:dark]"
      />

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="font-mono text-[10px] text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-widest"
      >
        Remove
      </button>
    </div>
  )
}

export default function GalleryAdminPanel({ initialItems }: { initialItems: GalleryImage[] }) {
  const [items, setItems] = useState<GalleryImage[]>(initialItems)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [newPreview, setNewPreview] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [adding, setAdding] = useState(false)
  const addInputRef = useRef<HTMLInputElement>(null)

  const updateItem = (id: string, updates: Partial<GalleryImage>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const deleteItem = async (id: string) => {
    if (!window.confirm('Remove this photo from the gallery?')) return
    const next = items.filter(item => item.id !== id)
    setItems(next)
    await fetch('/api/admin/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
  }

  const saveAll = async () => {
    setSaving(true)
    await fetch('/api/admin/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addPhoto = async () => {
    if (!newFile || adding) return
    setAdding(true)
    const fd = new FormData()
    fd.append('file', newFile)
    fd.append('dest', 'gallery')
    fd.append('event', newEvent || 'Event')
    fd.append('date', newDate)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const galleryRes = await fetch('/api/admin/gallery')
      const gallery: GalleryImage[] = await galleryRes.json()
      setItems(gallery)
      setShowAdd(false)
      setNewFile(null)
      setNewPreview(null)
      setNewEvent('')
      setNewDate(new Date().toISOString().split('T')[0])
    }
    setAdding(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
          Gallery — {items.length} photos
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdd(s => !s)}
            className="font-mono text-xs text-white/50 hover:text-white border border-white/15 hover:border-white/40 px-4 py-2 uppercase tracking-widest transition-colors"
          >
            + Add Photo
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="font-mono text-xs bg-white text-black px-4 py-2 uppercase tracking-widest hover:bg-white/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Add new photo */}
      {showAdd && (
        <div className="border border-white/15 p-5 space-y-4 bg-white/[0.02]">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">New Photo</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Drop zone */}
            <div
              className="relative border border-white/10 cursor-pointer hover:border-white/30 transition-colors overflow-hidden"
              style={{ aspectRatio: '4/3' }}
              onClick={() => addInputRef.current?.click()}
            >
              {newPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={newPreview} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-mono text-xs text-white/20">Click to choose photo</span>
                </div>
              )}
              <input
                ref={addInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setNewFile(f)
                  setNewPreview(URL.createObjectURL(f))
                }}
              />
            </div>

            {/* Metadata */}
            <div className="space-y-5 flex flex-col justify-center">
              <div className="space-y-2">
                <label className="font-mono text-xs text-white/30 uppercase tracking-widest block">Event Name</label>
                <input
                  type="text"
                  value={newEvent}
                  onChange={e => setNewEvent(e.target.value)}
                  placeholder="e.g. Club Jaeger, Oslo"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none font-inter text-sm text-white py-1.5 placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-white/30 uppercase tracking-widest block">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none font-inter text-sm text-white py-1.5 [color-scheme:dark]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={addPhoto}
                  disabled={!newFile || adding}
                  className="font-mono text-xs bg-white text-black px-5 py-2 uppercase tracking-widest hover:bg-white/90 disabled:opacity-30 transition-colors"
                >
                  {adding ? 'Uploading…' : 'Upload'}
                </button>
                <button
                  onClick={() => { setShowAdd(false); setNewFile(null); setNewPreview(null); setNewEvent('') }}
                  className="font-mono text-xs text-white/30 hover:text-white px-3 py-2 uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing items grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        ))}
      </div>
    </div>
  )
}
