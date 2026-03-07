/**
 * Unified data access layer.
 * Reads from Upstash KV first (set by admin), falls back to bundled JSON files.
 * Writes always go to KV so changes persist on Vercel serverless.
 */
import { kv } from '@vercel/kv'
import type { GalleryImage, Video, Mix } from '@/types'

import galleryJson from '@/data/gallery.json'
import videosJson from '@/data/videos.json'
import mixesJson from '@/data/mixes.json'
import siteJson from '@/data/site.json'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  heroImage: string | null
  aboutImage: string | null
  videosImage: string | null
  mixesImage: string | null
  bookingImage: string | null
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const K = {
  gallery: 'djcharles:gallery',
  videos:  'djcharles:videos',
  mixes:   'djcharles:mixes',
  site:    'djcharles:site',
} as const

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function getGallery(): Promise<GalleryImage[]> {
  try {
    const data = await kv.get<GalleryImage[]>(K.gallery)
    return data ?? (galleryJson as GalleryImage[])
  } catch {
    return galleryJson as GalleryImage[]
  }
}

export async function setGallery(data: GalleryImage[]): Promise<void> {
  await kv.set(K.gallery, data)
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<Video[]> {
  try {
    const data = await kv.get<Video[]>(K.videos)
    return data ?? (videosJson as Video[])
  } catch {
    return videosJson as Video[]
  }
}

export async function setVideos(data: Video[]): Promise<void> {
  await kv.set(K.videos, data)
}

// ─── Mixes ────────────────────────────────────────────────────────────────────

export async function getMixes(): Promise<Mix[]> {
  try {
    const data = await kv.get<Mix[]>(K.mixes)
    return data ?? (mixesJson as Mix[])
  } catch {
    return mixesJson as Mix[]
  }
}

export async function setMixes(data: Mix[]): Promise<void> {
  await kv.set(K.mixes, data)
}

// ─── Site config ──────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig> {
  const defaults: SiteConfig = {
    heroImage: null,
    aboutImage: null,
    videosImage: null,
    mixesImage: null,
    bookingImage: null,
    ...siteJson,
  }
  try {
    const data = await kv.get<SiteConfig>(K.site)
    return data ?? defaults
  } catch {
    return defaults
  }
}

export async function setSiteConfig(data: SiteConfig): Promise<void> {
  await kv.set(K.site, data)
}

export async function patchSiteConfig(patch: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await getSiteConfig()
  const updated = { ...current, ...patch }
  await setSiteConfig(updated)
  return updated
}
