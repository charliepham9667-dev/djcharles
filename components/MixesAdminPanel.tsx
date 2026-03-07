'use client'

import { useState } from 'react'
import type { Mix } from '@/types'

const INPUT = 'w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none font-inter text-sm text-white py-1 placeholder:text-white/20'
const SELECT = 'w-full bg-black border-b border-white/15 focus:border-white/50 outline-none font-inter text-sm text-white py-1'
const LABEL = 'font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1'

function MixCard({ item, onUpdate, onDelete }: {
  item: Mix
  onUpdate: (id: string, updates: Partial<Mix>) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="border border-white/10 p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border ${item.platform === 'soundcloud' ? 'border-orange-400/40 text-orange-400/70' : 'border-red-400/40 text-red-400/70'}`}>
          {item.platform}
        </span>
        <span className="font-mono text-xs text-white/30">{item.duration}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Title</label>
          <input type="text" value={item.title} onChange={e => onUpdate(item.id, { title: e.target.value })} placeholder="Mix title" className={INPUT} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Date</label>
            <input type="date" value={item.date} onChange={e => onUpdate(item.id, { date: e.target.value })} className={INPUT + ' [color-scheme:dark]'} />
          </div>
          <div>
            <label className={LABEL}>Duration</label>
            <input type="text" value={item.duration} onChange={e => onUpdate(item.id, { duration: e.target.value })} placeholder="1:02:14" className={INPUT} />
          </div>
        </div>
      </div>

      <div>
        <label className={LABEL}>Platform</label>
        <select value={item.platform} onChange={e => onUpdate(item.id, { platform: e.target.value as Mix['platform'] })} className={SELECT}>
          <option value="soundcloud">SoundCloud</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>

      <div>
        <label className={LABEL}>Embed URL</label>
        <input type="text" value={item.embedUrl} onChange={e => onUpdate(item.id, { embedUrl: e.target.value })} placeholder="Paste embed URL from SoundCloud or YouTube" className={INPUT} />
      </div>

      <button onClick={() => onDelete(item.id)} className="font-mono text-[10px] text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-widest">
        Remove
      </button>
    </div>
  )
}

const EMPTY_MIX = (): Omit<Mix, 'id'> => ({
  title: '',
  date: new Date().toISOString().split('T')[0],
  duration: '',
  platform: 'soundcloud',
  embedUrl: '',
})

export default function MixesAdminPanel({ initialItems }: { initialItems: Mix[] }) {
  const [items, setItems] = useState<Mix[]>(initialItems)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState(EMPTY_MIX())

  const updateItem = (id: string, updates: Partial<Mix>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const deleteItem = async (id: string) => {
    if (!window.confirm('Remove this mix?')) return
    const next = items.filter(item => item.id !== id)
    setItems(next)
    await fetch('/api/admin/mixes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) })
  }

  const saveAll = async () => {
    setSaving(true)
    await fetch('/api/admin/mixes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addMix = async () => {
    if (!newItem.title || !newItem.embedUrl) return
    const next = [...items, { ...newItem, id: String(Date.now()) }]
    setItems(next)
    await fetch('/api/admin/mixes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) })
    setShowAdd(false)
    setNewItem(EMPTY_MIX())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Mixes — {items.length} entries</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAdd(s => !s)} className="font-mono text-xs text-white/50 hover:text-white border border-white/15 hover:border-white/40 px-4 py-2 uppercase tracking-widest transition-colors">
            + Add Mix
          </button>
          <button onClick={saveAll} disabled={saving} className="font-mono text-xs bg-white text-black px-4 py-2 uppercase tracking-widest hover:bg-white/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="border border-white/15 p-5 space-y-4 bg-white/[0.02]">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">New Mix</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={LABEL}>Title</label>
              <input type="text" value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} placeholder="Mix title" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Date</label>
              <input type="date" value={newItem.date} onChange={e => setNewItem(p => ({ ...p, date: e.target.value }))} className={INPUT + ' [color-scheme:dark]'} />
            </div>
            <div>
              <label className={LABEL}>Duration</label>
              <input type="text" value={newItem.duration} onChange={e => setNewItem(p => ({ ...p, duration: e.target.value }))} placeholder="1:02:14" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Platform</label>
              <select value={newItem.platform} onChange={e => setNewItem(p => ({ ...p, platform: e.target.value as Mix['platform'] }))} className={SELECT}>
                <option value="soundcloud">SoundCloud</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={LABEL}>Embed URL</label>
              <input type="text" value={newItem.embedUrl} onChange={e => setNewItem(p => ({ ...p, embedUrl: e.target.value }))} placeholder="Paste embed URL from SoundCloud or YouTube" className={INPUT} />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={addMix} disabled={!newItem.title || !newItem.embedUrl} className="font-mono text-xs bg-white text-black px-5 py-2 uppercase tracking-widest hover:bg-white/90 disabled:opacity-30 transition-colors">
              Add
            </button>
            <button onClick={() => { setShowAdd(false); setNewItem(EMPTY_MIX()) }} className="font-mono text-xs text-white/30 hover:text-white px-3 py-2 uppercase tracking-widest transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map(item => (
          <MixCard key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />
        ))}
      </div>
    </div>
  )
}
