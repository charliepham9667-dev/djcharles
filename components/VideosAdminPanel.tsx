'use client'

import { useRef, useState } from 'react'
import type { Video } from '@/types'

const CATEGORIES: Video['category'][] = ['Club', 'Private', 'Festival', 'Other']

const INPUT = 'w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none font-inter text-sm text-white py-1 placeholder:text-white/20'
const SELECT = 'w-full bg-black border-b border-white/15 focus:border-white/50 outline-none font-inter text-sm text-white py-1'
const LABEL = 'font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1'

function extractYouTubeId(input: string): string {
  const watchMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]
  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  return input.trim()
}

function VideoCard({ item, onUpdate, onDelete }: {
  item: Video
  onUpdate: (id: string, updates: Partial<Video>) => void
  onDelete: (id: string) => void
}) {
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const uploadThumbnail = async (file: File) => {
    setUploadingThumb(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', 'thumbnail')
    fd.append('videoId', item.id)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) onUpdate(item.id, { thumbnailUrl: data.path })
    setUploadingThumb(false)
  }

  const extractFrameFromSrc = (src: string, isObjectUrl = false): Promise<Blob | null> =>
    new Promise((resolve) => {
      const video = document.createElement('video')
      video.src = src
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.playsInline = true
      const cleanup = () => { if (isObjectUrl) URL.revokeObjectURL(src) }
      const timeout = setTimeout(() => { cleanup(); resolve(null) }, 15000)
      video.addEventListener('loadeddata', () => {
        video.currentTime = Math.min(1, video.duration * 0.1)
      })
      video.addEventListener('seeked', () => {
        clearTimeout(timeout)
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) { cleanup(); resolve(null); return }
        ctx.drawImage(video, 0, 0)
        canvas.toBlob((blob) => { cleanup(); resolve(blob) }, 'image/jpeg', 0.85)
      })
      video.addEventListener('error', () => { clearTimeout(timeout); cleanup(); resolve(null) })
    })

  const generateThumbnailFromUploaded = async () => {
    if (!item.videoUrl) return
    setUploadingThumb(true)
    const blob = await extractFrameFromSrc(item.videoUrl)
    if (blob) {
      const name = item.videoUrl.split('/').pop()?.replace(/\.[^.]+$/, '') + '-thumb.jpg'
      const thumbFile = new File([blob], name ?? 'thumb.jpg', { type: 'image/jpeg' })
      const tfd = new FormData()
      tfd.append('file', thumbFile)
      tfd.append('dest', 'thumbnail')
      tfd.append('videoId', item.id)
      const tres = await fetch('/api/admin/upload', { method: 'POST', body: tfd })
      const tdata = await tres.json()
      if (tres.ok) onUpdate(item.id, { thumbnailUrl: tdata.path })
    }
    setUploadingThumb(false)
  }

  const uploadVideo = async (file: File) => {
    setUploadingVideo(true)
    // Upload video file
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', 'video')
    fd.append('videoId', item.id)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) onUpdate(item.id, { videoUrl: data.path })
    // Auto-extract thumbnail from video frame
    const objUrl = URL.createObjectURL(file)
    const blob = await extractFrameFromSrc(objUrl, true)
    if (blob) {
      const thumbFile = new File([blob], file.name.replace(/\.[^.]+$/, '') + '-thumb.jpg', { type: 'image/jpeg' })
      const tfd = new FormData()
      tfd.append('file', thumbFile)
      tfd.append('dest', 'thumbnail')
      tfd.append('videoId', item.id)
      const tres = await fetch('/api/admin/upload', { method: 'POST', body: tfd })
      const tdata = await tres.json()
      if (tres.ok) onUpdate(item.id, { thumbnailUrl: tdata.path })
    }
    setUploadingVideo(false)
  }

  // Thumbnail: custom > YouTube auto
  const thumbnail = item.thumbnailUrl
    ?? (item.youtubeId && !item.youtubeId.startsWith('http')
      ? `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`
      : null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 border border-white/10 p-4">
      {/* Thumbnail upload zone */}
      <div
        className="relative overflow-hidden bg-white/5 cursor-pointer group"
        style={{ aspectRatio: '16/9' }}
        onClick={() => thumbInputRef.current?.click()}
        title="Click to upload a thumbnail image"
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">No thumbnail</span>
          </div>
        )}
        {/* Upload hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="font-mono text-[10px] text-white uppercase tracking-widest">
            {uploadingThumb ? 'Uploading…' : 'Upload thumbnail'}
          </span>
        </div>
        <input
          ref={thumbInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadThumbnail(f) }}
        />
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Title</label>
            <input type="text" value={item.title} onChange={e => onUpdate(item.id, { title: e.target.value })} placeholder="Event title" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Location</label>
            <input type="text" value={item.location} onChange={e => onUpdate(item.id, { location: e.target.value })} placeholder="City, Country" className={INPUT} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Date</label>
            <input type="date" value={item.date} onChange={e => onUpdate(item.id, { date: e.target.value })} className={INPUT + ' [color-scheme:dark]'} />
          </div>
          <div>
            <label className={LABEL}>Category</label>
            <select value={item.category} onChange={e => onUpdate(item.id, { category: e.target.value as Video['category'] })} className={SELECT}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={LABEL}>YouTube URL or ID {item.videoUrl && <span className="text-white/20 normal-case">(optional — file uploaded)</span>}</label>
          <input
            type="text"
            value={item.youtubeId}
            onChange={e => onUpdate(item.id, { youtubeId: extractYouTubeId(e.target.value) })}
            placeholder="https://youtube.com/watch?v=... or paste ID"
            className={INPUT}
          />
        </div>
        {/* Video file upload */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => videoInputRef.current?.click()}
            className="font-mono text-[10px] text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 uppercase tracking-widest transition-colors"
          >
            {uploadingVideo ? 'Uploading…' : item.videoUrl ? '✓ Video uploaded' : 'Upload video file'}
          </button>
          {item.videoUrl && !item.thumbnailUrl && (
            <button
              onClick={generateThumbnailFromUploaded}
              disabled={uploadingThumb}
              className="font-mono text-[10px] text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 uppercase tracking-widest transition-colors disabled:opacity-40"
            >
              {uploadingThumb ? 'Generating…' : 'Generate thumbnail'}
            </button>
          )}
          {item.videoUrl && (
            <button
              onClick={() => onUpdate(item.id, { videoUrl: undefined })}
              className="font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
            >
              Clear
            </button>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadVideo(f) }}
          />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onDelete(item.id)} className="font-mono text-[10px] text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-widest">
            Remove
          </button>
          {item.thumbnailUrl && (
            <button
              onClick={() => onUpdate(item.id, { thumbnailUrl: undefined })}
              className="font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
            >
              Clear thumbnail
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const EMPTY_VIDEO = (): Omit<Video, 'id'> => ({
  title: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  category: 'Club',
  youtubeId: '',
})

export default function VideosAdminPanel({ initialItems }: { initialItems: Video[] }) {
  const [items, setItems] = useState<Video[]>(initialItems)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState(EMPTY_VIDEO())

  const updateItem = (id: string, updates: Partial<Video>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const deleteItem = async (id: string) => {
    if (!window.confirm('Remove this video?')) return
    const next = items.filter(item => item.id !== id)
    setItems(next)
    await fetch('/api/admin/videos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) })
  }

  const saveAll = async () => {
    setSaving(true)
    await fetch('/api/admin/videos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addVideo = async () => {
    if (!newItem.title) return
    const next = [...items, { ...newItem, id: String(Date.now()), youtubeId: extractYouTubeId(newItem.youtubeId) }]
    setItems(next)
    await fetch('/api/admin/videos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) })
    setShowAdd(false)
    setNewItem(EMPTY_VIDEO())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Videos — {items.length} entries</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAdd(s => !s)} className="font-mono text-xs text-white/50 hover:text-white border border-white/15 hover:border-white/40 px-4 py-2 uppercase tracking-widest transition-colors">
            + Add Video
          </button>
          <button onClick={saveAll} disabled={saving} className="font-mono text-xs bg-white text-black px-4 py-2 uppercase tracking-widest hover:bg-white/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="border border-white/15 p-5 space-y-4 bg-white/[0.02]">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">New Video</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Title</label>
              <input type="text" value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} placeholder="Event title" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Location</label>
              <input type="text" value={newItem.location} onChange={e => setNewItem(p => ({ ...p, location: e.target.value }))} placeholder="City, Country" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Date</label>
              <input type="date" value={newItem.date} onChange={e => setNewItem(p => ({ ...p, date: e.target.value }))} className={INPUT + ' [color-scheme:dark]'} />
            </div>
            <div>
              <label className={LABEL}>Category</label>
              <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value as Video['category'] }))} className={SELECT}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={LABEL}>YouTube URL or ID <span className="text-white/20 normal-case">(or upload a file after adding)</span></label>
              <input type="text" value={newItem.youtubeId} onChange={e => setNewItem(p => ({ ...p, youtubeId: e.target.value }))} placeholder="https://youtube.com/watch?v=... or paste ID" className={INPUT} />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={addVideo} disabled={!newItem.title} className="font-mono text-xs bg-white text-black px-5 py-2 uppercase tracking-widest hover:bg-white/90 disabled:opacity-30 transition-colors">
              Add
            </button>
            <button onClick={() => { setShowAdd(false); setNewItem(EMPTY_VIDEO()) }} className="font-mono text-xs text-white/30 hover:text-white px-3 py-2 uppercase tracking-widest transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map(item => (
          <VideoCard key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />
        ))}
      </div>
    </div>
  )
}
