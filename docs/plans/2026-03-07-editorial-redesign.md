# Editorial Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign all public-facing pages to a full-bleed editorial documentary aesthetic — Bebas Neue headers, monochrome palette, photography panels with text overlaid.

**Architecture:** Pure visual overhaul of existing components. No API or logic changes. No new routes. Admin dashboard untouched. All existing tests continue to pass unchanged.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, Framer Motion, `next/font/google` (Bebas Neue replaces League Spartan)

---

## Phase 1: Design System Foundation

### Task 1: Swap font + remove gold from globals

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Update `app/globals.css`**

Replace the entire file with:

```css
@import "tailwindcss";

@theme {
  --color-surface: #111111;

  --font-family-bebas: var(--font-bebas), sans-serif;
  --font-family-inter: var(--font-inter), sans-serif;
  --font-family-mono: var(--font-dm-mono), monospace;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: #000000;
    color: #ffffff;
    font-family: var(--font-inter), sans-serif;
  }
}
```

Key changes: removed `--color-gold`, removed `--font-family-spartan`, added `--font-family-bebas`.

**Step 2: Update `app/layout.tsx`**

Replace the entire file with:

```tsx
import type { Metadata } from 'next'
import { Bebas_Neue, Inter, DM_Mono } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: '400',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: { default: 'DJ Charle$', template: '%s | DJ Charle$' },
  description: 'DJ Charle$ — Where Every Set Tells a Story. Book DJ Charle$ for club nights, private events, festivals and more.',
  openGraph: {
    title: 'DJ Charle$',
    description: 'Where Every Set Tells a Story',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${bebas.variable} ${inter.variable} ${dmMono.variable} bg-black text-white font-inter antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

**Step 3: Verify it compiles**

```bash
cd /Users/charliepham/djcharles && npm run build 2>&1 | tail -20
```

Expected: build succeeds (or only has pre-existing warnings, not new errors from this change).

**Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: swap League Spartan → Bebas Neue, remove gold from design system"
```

---

### Task 2: Create shared NoiseTexture component

Used in 5 panels (Hero, About, Videos, Mixes, Booking). One component avoids repetition.

**Files:**
- Create: `components/NoiseTexture.tsx`

**Step 1: Create `components/NoiseTexture.tsx`**

```tsx
export default function NoiseTexture({ id }: { id: string }) {
  return (
    <div className="absolute inset-0 bg-[#111]">
      <svg
        className="w-full h-full pointer-events-none"
        style={{ opacity: 0.06 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  )
}
```

Note: `id` prop is required because SVG filter IDs must be unique per page — each panel passes a different string (e.g. `"hero-noise"`, `"about-noise"`).

**Step 2: Commit**

```bash
git add components/NoiseTexture.tsx
git commit -m "feat: add shared NoiseTexture placeholder component"
```

---

## Phase 2: Navbar

### Task 3: Redesign Navbar

**Files:**
- Modify: `components/Navbar.tsx`

**Step 1: Replace `components/Navbar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/videos', label: 'Videos' },
  { href: '/mixes', label: 'Mixes' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/booking', label: 'Booking' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* Gradient behind nav for readability over photos */}
      <div className="fixed top-0 left-0 right-0 h-28 z-[59] pointer-events-none bg-gradient-to-b from-black/70 to-transparent" />

      <nav className="fixed top-0 left-0 right-0 z-[60] px-6 md:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="font-bebas text-2xl text-white uppercase tracking-wide">
          DJ Charle$
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-inter text-xs text-white/50 hover:text-white transition-colors duration-200 uppercase tracking-widest"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-white transition-transform duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-transform duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-bebas text-5xl uppercase text-white hover:text-white/50 transition-colors tracking-widest"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

Key changes: removed `scrolled` state + `useScroll` (always transparent), removed gold from logo and links, `font-bebas` logo, `font-inter` desktop links, `font-bebas` mobile links.

**Step 2: Run tests to confirm no regressions**

```bash
npm test 2>&1 | tail -10
```

Expected: `15 passed, 15 total`

**Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: navbar — always transparent, Bebas Neue logo, monochrome"
```

---

## Phase 3: Homepage

### Task 4: Redesign Hero

**Files:**
- Modify: `components/Hero.tsx`

**Step 1: Replace `components/Hero.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import NoiseTexture from './NoiseTexture'

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Photo placeholder — replace div with next/image when photos are ready */}
      <NoiseTexture id="hero-noise" />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
      />

      {/* Main content — anchored bottom-left */}
      <div className="relative z-20 h-full flex flex-col justify-end px-8 md:px-16 pb-14">
        <motion.h1
          className="font-bebas text-white uppercase leading-none"
          style={{ fontSize: 'clamp(5rem, 16vw, 160px)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          DJ Charle$
        </motion.h1>

        <motion.p
          className="font-mono text-xs text-white/40 uppercase tracking-widest mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Where Every Set Tells a Story
        </motion.p>
      </div>

      {/* Vertical label — right edge */}
      <motion.span
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Portfolio
      </motion.span>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: hero — full-bleed editorial panel, Bebas Neue, photo placeholder"
```

---

### Task 5: Redesign About

**Files:**
- Modify: `components/About.tsx`

**Step 1: Replace `components/About.tsx`**

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import NoiseTexture from './NoiseTexture'

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Photo placeholder */}
      <NoiseTexture id="about-noise" />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
      />

      {/* Vertical label — left edge */}
      <span className="absolute left-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest">
        DJ Charle$
      </span>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-between px-8 md:px-16 py-20">
        {/* Section header — top */}
        <motion.h2
          className="font-bebas text-white uppercase leading-none"
          style={{ fontSize: 'clamp(4rem, 12vw, 120px)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          About
        </motion.h2>

        {/* Body text — right half */}
        <motion.div
          className="md:ml-auto md:w-1/2 space-y-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <p className="font-inter text-white/80 text-base md:text-lg leading-relaxed">
            Haugesund, Norway. A coastal city of grey skies and stubborn weather, where everyone
            knows everyone and difference is noticed before it&apos;s understood. I grew up here,
            the son of Vietnamese immigrants — a family who crossed oceans for a better life and
            landed in one of the world&apos;s most homogeneous societies.
          </p>
          <p className="font-inter text-white/80 text-base md:text-lg leading-relaxed">
            That upbringing — east meets west, tradition meets modernity, silence meets noise —
            became my musical compass. Whether it&apos;s a rooftop in Bergen or a club in Oslo,
            I arrive with the same intention: to make everyone in the room feel like they belong.
          </p>
          <p className="font-bebas text-white text-2xl md:text-3xl uppercase leading-tight">
            The music is not the background to the night.<br />
            The music is the night.
          </p>
        </motion.div>

        {/* Bottom-right meta */}
        <motion.p
          className="font-mono text-xs text-white/25 uppercase tracking-widest self-end"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          Oslo, Norway · Est. 2018
        </motion.p>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add components/About.tsx
git commit -m "feat: about — full-bleed editorial panel, text overlaid right-half"
```

---

## Phase 4: Videos Page

### Task 6: Redesign VideoCard

**Files:**
- Modify: `components/VideoCard.tsx`

**Step 1: Replace `components/VideoCard.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Video } from '@/types'

interface VideoCardProps {
  video: Video
  onClick: () => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <motion.div
      className="relative cursor-pointer group overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-[#111]">
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />

        {/* Overlay — lightens on hover */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/25 transition-colors duration-300" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Category — top right */}
        <span className="absolute top-4 right-4 font-mono text-xs text-white/50 uppercase tracking-widest">
          {video.category}
        </span>

        {/* Title + location — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <p className="font-bebas text-white text-xl uppercase leading-tight">{video.title}</p>
          <p className="font-mono text-xs text-white/40 mt-0.5">{video.location}</p>
        </div>
      </div>
    </motion.div>
  )
}
```

Key changes: removed gold border/play icon, category label top-right, `font-bebas` title.

**Step 2: Commit**

```bash
git add components/VideoCard.tsx
git commit -m "feat: VideoCard — monochrome overlay, Bebas Neue title, category label"
```

---

### Task 7: Redesign Videos page

**Files:**
- Modify: `app/videos/page.tsx`

**Step 1: Replace `app/videos/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import NoiseTexture from '@/components/NoiseTexture'
import videosData from '@/data/videos.json'
import type { Video } from '@/types'

const CATEGORIES = ['All', 'Club', 'Private', 'Festival', 'Other'] as const
type Category = (typeof CATEGORIES)[number]

const videos = videosData as Video[]

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('All')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const filtered =
    activeFilter === 'All' ? videos : videos.filter((v) => v.category === activeFilter)

  return (
    <>
      <Navbar />

      {/* Editorial header panel */}
      <div className="relative h-[60vh] overflow-hidden">
        <NoiseTexture id="videos-noise" />
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
        />
        <div className="relative z-20 h-full flex items-end px-8 md:px-16 pb-12">
          <h1
            className="font-bebas text-white uppercase leading-none"
            style={{ fontSize: 'clamp(4rem, 12vw, 140px)' }}
          >
            Videos
          </h1>
        </div>
        <span className="absolute right-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest">
          Sets &amp; Shows
        </span>
      </div>

      {/* Filter bar */}
      <div className="bg-black px-8 md:px-16 py-5 flex items-center gap-8 overflow-x-auto border-b border-white/10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`relative font-mono text-xs uppercase tracking-widest whitespace-nowrap pb-1 transition-colors duration-200 ${
              activeFilter === cat ? 'text-white' : 'text-white/35 hover:text-white/70'
            }`}
          >
            {cat}
            {activeFilter === cat && (
              <motion.span
                layoutId="filter-underline"
                className="absolute bottom-0 left-0 right-0 h-px bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="px-8 md:px-16 py-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <VideoCard video={video} onClick={() => setSelectedVideo(video)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  )
}
```

**Step 2: Commit**

```bash
git add app/videos/page.tsx
git commit -m "feat: Videos page — editorial header panel, monochrome filter bar"
```

---

## Phase 5: Mixes Page

### Task 8: Redesign MixCard

**Files:**
- Modify: `components/MixCard.tsx`

**Step 1: Replace `components/MixCard.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import type { Mix } from '@/types'

const PLATFORM_LABEL: Record<string, string> = {
  soundcloud: 'SoundCloud',
  youtube: 'YouTube',
}

export default function MixCard({ mix }: { mix: Mix }) {
  return (
    <motion.div
      className="bg-[#111] border border-white/10 hover:border-white/30 transition-colors duration-300 overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div>
          <h3 className="font-bebas text-white text-xl uppercase tracking-wide leading-none">
            {mix.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs text-white/35">{mix.date}</span>
            <span className="font-mono text-xs text-white/35">{mix.duration}</span>
          </div>
        </div>
        <span className="font-mono text-xs text-white/35 uppercase tracking-widest shrink-0 ml-3">
          {PLATFORM_LABEL[mix.platform] ?? mix.platform}
        </span>
      </div>

      <div
        className="relative"
        style={{ height: mix.platform === 'soundcloud' ? '166px' : '315px' }}
      >
        <iframe
          src={mix.embedUrl}
          width="100%"
          height="100%"
          allow="autoplay"
          className="absolute inset-0"
          title={mix.title}
        />
      </div>
    </motion.div>
  )
}
```

Key changes: removed colored platform badge → monochrome DM Mono label, `font-bebas` title, white hover border instead of gold.

**Step 2: Commit**

```bash
git add components/MixCard.tsx
git commit -m "feat: MixCard — monochrome, Bebas Neue title, platform label"
```

---

### Task 9: Redesign Mixes page

**Files:**
- Modify: `app/mixes/page.tsx`

**Step 1: Replace `app/mixes/page.tsx`**

```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MixCard from '@/components/MixCard'
import NoiseTexture from '@/components/NoiseTexture'
import mixesData from '@/data/mixes.json'
import type { Mix } from '@/types'

const mixes = mixesData as Mix[]

export default function MixesPage() {
  return (
    <>
      <Navbar />

      {/* Editorial header panel */}
      <div className="relative h-[60vh] overflow-hidden">
        <NoiseTexture id="mixes-noise" />
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
        />
        <div className="relative z-20 h-full flex items-end px-8 md:px-16 pb-12">
          <h1
            className="font-bebas text-white uppercase leading-none"
            style={{ fontSize: 'clamp(4rem, 12vw, 140px)' }}
          >
            Mixes
          </h1>
        </div>
        <span className="absolute left-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest">
          Audio
        </span>
      </div>

      <main className="px-8 md:px-16 py-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mixes.map((mix) => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
```

**Step 2: Commit**

```bash
git add app/mixes/page.tsx
git commit -m "feat: Mixes page — editorial header panel, monochrome"
```

---

## Phase 6: Gallery Page

### Task 10: Redesign Gallery

**Files:**
- Modify: `app/gallery/page.tsx`
- Modify: `components/GalleryGrid.tsx`

**Step 1: Replace `app/gallery/page.tsx`**

Remove container padding — grid goes edge to edge, no header panel (photos ARE the header).

```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'
import galleryData from '@/data/gallery.json'
import type { GalleryImage } from '@/types'

const images = galleryData as GalleryImage[]

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <GalleryGrid images={images} />
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Replace `components/GalleryGrid.tsx`**

Remove gold border, zero-gap columns, Bebas Neue hover overlay.

```tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from './Lightbox'
import type { GalleryImage } from '@/types'

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const total = images.length

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-1 space-y-1">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="relative break-inside-avoid cursor-pointer group overflow-hidden bg-[#111]"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative" style={{ minHeight: '240px' }}>
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                onError={() => {}}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <p className="font-bebas text-white text-2xl uppercase leading-tight">{img.event}</p>
                  <p className="font-mono text-white/40 text-xs mt-1 uppercase tracking-widest">{img.date}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null))}
        onNext={() => setLightboxIndex((i) => (i !== null ? (i + 1) % total : null))}
      />
    </>
  )
}
```

**Step 3: Commit**

```bash
git add app/gallery/page.tsx components/GalleryGrid.tsx
git commit -m "feat: Gallery — edge-to-edge masonry, Bebas Neue hover overlay, no gold"
```

---

## Phase 7: Booking Page

### Task 11: Redesign BookingForm

**Files:**
- Modify: `components/BookingForm.tsx`

**Step 1: Replace `components/BookingForm.tsx`**

Underline-only inputs, white submit button, Bebas Neue success state.

```tsx
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
```

Note: selects get `bg-black` so option dropdowns are readable. Date input gets `[color-scheme:dark]` so the browser-native date picker renders dark.

**Step 2: Commit**

```bash
git add components/BookingForm.tsx
git commit -m "feat: BookingForm — underline inputs, white submit, Bebas Neue success state"
```

---

### Task 12: Redesign Booking page

**Files:**
- Modify: `app/booking/page.tsx`

**Step 1: Replace `app/booking/page.tsx`**

```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'
import NoiseTexture from '@/components/NoiseTexture'

export default function BookingPage() {
  return (
    <>
      <Navbar />

      <div className="relative min-h-screen overflow-hidden">
        {/* Photo placeholder */}
        <NoiseTexture id="booking-noise" />

        {/* Heavy overlay for form legibility */}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(0,0,0,0.80)' }} />

        {/* Vertical label — right edge */}
        <span className="absolute right-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/20 uppercase tracking-widest">
          Inquiries
        </span>

        {/* Content */}
        <div className="relative z-20 px-8 md:px-16 pt-32 pb-16">
          <h1
            className="font-bebas text-white uppercase leading-none mb-10"
            style={{ fontSize: 'clamp(4rem, 10vw, 120px)' }}
          >
            Booking
          </h1>
          <div className="max-w-2xl md:ml-auto">
            <BookingForm />
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
```

**Step 2: Commit**

```bash
git add app/booking/page.tsx
git commit -m "feat: Booking page — full-bleed panel, form right-aligned, heavy overlay"
```

---

## Phase 8: Footer

### Task 13: Update Footer to monochrome

**Files:**
- Modify: `components/Footer.tsx`

**Step 1: In `components/Footer.tsx`, change only the gold references**

- Logo: `font-spartan font-black text-xl text-gold` → `font-bebas text-2xl text-white tracking-wide`
- Social icons: `text-gold/70 hover:text-gold` → `text-white/35 hover:text-white`

The exact lines to change:

```tsx
// Line 46 — logo
// OLD:
<span className="font-spartan font-black text-xl text-gold uppercase tracking-tight">
// NEW:
<span className="font-bebas text-2xl text-white uppercase tracking-wide">

// Lines 57-58 — social link className
// OLD:
className="text-gold/70 hover:text-gold transition-colors duration-200"
// NEW:
className="text-white/35 hover:text-white transition-colors duration-200"
```

**Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: Footer — monochrome, Bebas Neue logo, white social icons"
```

---

## Phase 9: Final Verification

### Task 14: Run tests + visual check

**Step 1: Run full test suite**

```bash
npm test 2>&1 | tail -15
```

Expected: `15 passed, 15 total` — all existing tests pass unchanged.

**Step 2: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` and check each page:
- `/` — Hero: large Bebas Neue title bottom-left, no gold, vertical label right
- `/` scroll — About: editorial panel, text right-half, no gold divider
- `/videos` — 60vh header panel + filter bar + card grid
- `/mixes` — 60vh header panel + card grid
- `/gallery` — edge-to-edge masonry, hover shows event name
- `/booking` — full-bleed dark panel, underline inputs, white submit button

**Step 3: Final commit if any tweaks made**

```bash
git add -A
git commit -m "fix: editorial redesign visual tweaks"
```
