'use client'

import { useRef, useState } from 'react'
import GalleryAdminPanel from './GalleryAdminPanel'
import type { GalleryImage } from '@/types'

type PageDest = 'hero' | 'about' | 'videos' | 'mixes' | 'booking'

interface UploadZoneProps {
  label: string
  dest: PageDest
  currentSrc: string | null
}

function UploadZone({ label, dest, currentSrc }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentSrc)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const upload = async (file: File) => {
    setStatus('uploading')
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', dest)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setPreview(data.path + '?t=' + Date.now())
      setStatus('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setStatus('error')
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files?.[0]) return
    upload(files[0])
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-white/40 uppercase tracking-widest">{label}</p>

      <div
        className={`relative border border-white/10 overflow-hidden transition-colors duration-200 ${dragging ? 'border-white/40 bg-white/5' : 'hover:border-white/20'}`}
        style={{ aspectRatio: '16/9' }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover cursor-pointer" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-mono text-xs text-white/20">Drop or click to upload</span>
          </div>
        )}

        {status === 'uploading' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">Uploading…</span>
          </div>
        )}

        {status === 'done' && preview && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-xs text-white uppercase tracking-widest">✓ Saved</span>
          </div>
        )}

        {preview && status === 'idle' && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
            <span className="font-mono text-xs text-white uppercase tracking-widest">Replace</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {status === 'error' && (
        <p className="font-mono text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}

interface ImageUploadPanelProps {
  heroImage: string | null
  aboutImage: string | null
  videosImage: string | null
  mixesImage: string | null
  bookingImage: string | null
  galleryItems: GalleryImage[]
}

export default function ImageUploadPanel({
  heroImage,
  aboutImage,
  videosImage,
  mixesImage,
  bookingImage,
  galleryItems,
}: ImageUploadPanelProps) {
  return (
    <div className="space-y-12">
      <div>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-6">Page Backgrounds</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UploadZone label="Home — Hero" dest="hero" currentSrc={heroImage} />
          <UploadZone label="Home — About" dest="about" currentSrc={aboutImage} />
          <UploadZone label="Videos Page" dest="videos" currentSrc={videosImage} />
          <UploadZone label="Mixes Page" dest="mixes" currentSrc={mixesImage} />
          <UploadZone label="Booking Page" dest="booking" currentSrc={bookingImage} />
        </div>
      </div>

      <div className="border-t border-white/10 pt-10">
        <GalleryAdminPanel initialItems={galleryItems} />
      </div>
    </div>
  )
}
