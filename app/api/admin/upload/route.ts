import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getGallery, setGallery, getVideos, setVideos, getSiteConfig, setSiteConfig } from '@/lib/data'
import type { GalleryImage, Video } from '@/types'

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

async function saveFile(file: File, folder: string, name: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '-')

  if (USE_BLOB) {
    const blob = await put(`${folder}/${safeName}`, buffer, { access: 'public' })
    return blob.url
  } else {
    // Local dev fallback — write to public/
    const dir = path.join(process.cwd(), 'public', folder)
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, safeName), buffer)
    return `/${folder}/${safeName}`
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  if (!session || !verifySession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const dest = formData.get('dest') as string

  if (!file || !file.size) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // ── Page background images ─────────────────────────────────────────────────
  if (['hero', 'about', 'videos', 'mixes', 'booking'].includes(dest)) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const publicPath = await saveFile(file, 'images', `${dest}.${ext}`)
    const site = await getSiteConfig()
    ;(site as unknown as Record<string, string | null>)[`${dest}Image`] = publicPath
    await setSiteConfig(site)
    return NextResponse.json({ path: publicPath })
  }

  // ── Gallery ────────────────────────────────────────────────────────────────
  if (dest === 'gallery') {
    const replaceId = formData.get('replaceId') as string | null
    const event = (formData.get('event') as string) || 'Event'
    const date = (formData.get('date') as string) || new Date().toISOString().split('T')[0]
    const publicPath = await saveFile(file, 'images/gallery', file.name)
    const gallery = await getGallery()
    if (replaceId) {
      const idx = gallery.findIndex((i: GalleryImage) => i.id === replaceId)
      if (idx !== -1) gallery[idx] = { ...gallery[idx], src: publicPath }
    } else {
      gallery.push({ id: String(Date.now()), src: publicPath, alt: 'DJ Charle$', event, date })
    }
    await setGallery(gallery)
    return NextResponse.json({ path: publicPath })
  }

  // ── Video file ─────────────────────────────────────────────────────────────
  if (dest === 'video') {
    const videoId = formData.get('videoId') as string | null
    const publicPath = await saveFile(file, 'videos', file.name)
    if (videoId) {
      const videos = await getVideos()
      const idx = videos.findIndex((v: Video) => v.id === videoId)
      if (idx !== -1) videos[idx] = { ...videos[idx], videoUrl: publicPath }
      await setVideos(videos)
    }
    return NextResponse.json({ path: publicPath })
  }

  // ── Video thumbnail ────────────────────────────────────────────────────────
  if (dest === 'thumbnail') {
    const videoId = formData.get('videoId') as string | null
    const publicPath = await saveFile(file, 'images/thumbnails', file.name)
    if (videoId) {
      const videos = await getVideos()
      const idx = videos.findIndex((v: Video) => v.id === videoId)
      if (idx !== -1) videos[idx] = { ...videos[idx], thumbnailUrl: publicPath }
      await setVideos(videos)
    }
    return NextResponse.json({ path: publicPath })
  }

  return NextResponse.json({ error: 'Invalid destination' }, { status: 400 })
}
