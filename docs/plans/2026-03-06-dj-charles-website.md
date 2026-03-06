# DJ Charle$ Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full Next.js 14 App Router website for DJ Charle$ — portfolio, booking, admin dashboard.

**Architecture:** Next.js App Router with Tailwind CSS + Framer Motion for UI; Vercel KV (Redis) for inquiry storage; Resend for email; @react-pdf/renderer for server-side PDF generation; HMAC cookie for admin auth.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Vercel KV, Resend, @react-pdf/renderer, uuid, Jest (API/logic tests only)

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js project

**Files:**
- Create: all project files via CLI

**Step 1: Run create-next-app**
```bash
cd /Users/charliepham/djcharles
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --no-git
```
Answer prompts: accept all defaults.

**Step 2: Verify structure exists**
```bash
ls app/ components/ public/ package.json tailwind.config.ts tsconfig.json
```
Expected: all paths exist.

**Step 3: Remove boilerplate**
- Delete `app/page.tsx` content (replace later)
- Delete `app/globals.css` content except Tailwind directives
- Delete `public/vercel.svg`, `public/next.svg`

**Step 4: Commit**
```bash
git add -A
git commit -m "chore: scaffold Next.js project"
```

---

### Task 2: Install dependencies and configure Jest

**Files:**
- Modify: `package.json`
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

**Step 1: Install runtime deps**
```bash
npm install framer-motion @vercel/kv resend @react-pdf/renderer uuid
npm install -D @types/uuid
```

**Step 2: Install test deps**
```bash
npm install -D jest @types/jest ts-jest jest-environment-node
```

**Step 3: Create `jest.config.ts`**
```typescript
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathPattern: ['__tests__/'],
  setupFilesAfterFramework: [],
}

export default config
```

**Step 4: Add test script to `package.json`**
In the `"scripts"` section, add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

**Step 5: Update `next.config.ts`**
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
}

export default nextConfig
```

**Step 6: Commit**
```bash
git add -A
git commit -m "chore: install deps, configure Jest and next.config"
```

---

### Task 3: Tailwind design tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: Update `tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        surface: '#111111',
      },
      fontFamily: {
        spartan: ['var(--font-spartan)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 2: Update `app/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-black text-white font-inter;
  }
}

@layer utilities {
  .text-gold { color: #C9A84C; }
  .border-gold { border-color: #C9A84C; }
  .bg-gold { background-color: #C9A84C; }
}
```

**Step 3: Commit**
```bash
git add tailwind.config.ts app/globals.css
git commit -m "chore: configure Tailwind design tokens"
```

---

### Task 4: TypeScript types

**Files:**
- Create: `types/index.ts`

**Step 1: Create `types/index.ts`**
```typescript
export interface Video {
  id: string
  title: string
  location: string
  date: string
  category: 'Club' | 'Private' | 'Festival' | 'Other'
  youtubeId: string
}

export interface Mix {
  id: string
  title: string
  date: string
  duration: string
  platform: 'soundcloud' | 'youtube'
  embedUrl: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  event: string
  date: string
}

export type InquiryStatus = 'New' | 'In Progress' | 'Confirmed' | 'Declined'

export interface Inquiry {
  id: string
  name: string
  email: string
  eventType: string
  eventDate: string
  location: string
  guestCount: string
  package: string
  message: string
  submittedAt: string
  status: InquiryStatus
}

export type BookingFormData = Omit<Inquiry, 'id' | 'submittedAt' | 'status'>
```

**Step 2: Commit**
```bash
git add types/
git commit -m "chore: add TypeScript types"
```

---

### Task 5: JSON data files

**Files:**
- Create: `data/videos.json`
- Create: `data/mixes.json`
- Create: `data/gallery.json`

**Step 1: Create `data/videos.json`**
```json
[
  {
    "id": "1",
    "title": "Babel Oslo — New Year's Eve",
    "location": "Oslo, Norway",
    "date": "2025-12-31",
    "category": "Club",
    "youtubeId": "dQw4w9WgXcQ"
  },
  {
    "id": "2",
    "title": "Private Rooftop — Summer Gala",
    "location": "Bergen, Norway",
    "date": "2025-07-12",
    "category": "Private",
    "youtubeId": "dQw4w9WgXcQ"
  },
  {
    "id": "3",
    "title": "Øya Festival — Electronic Stage",
    "location": "Oslo, Norway",
    "date": "2025-08-09",
    "category": "Festival",
    "youtubeId": "dQw4w9WgXcQ"
  }
]
```

**Step 2: Create `data/mixes.json`**
```json
[
  {
    "id": "1",
    "title": "Late Night Frequencies Vol. 1",
    "date": "2025-11-01",
    "duration": "1:02:14",
    "platform": "soundcloud",
    "embedUrl": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1234567&color=%23C9A84C&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
  },
  {
    "id": "2",
    "title": "East Meets West — Global House",
    "date": "2025-09-15",
    "duration": "58:30",
    "platform": "soundcloud",
    "embedUrl": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2345678&color=%23C9A84C&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
  },
  {
    "id": "3",
    "title": "Midnight in Haugesund",
    "date": "2025-06-21",
    "duration": "1:15:00",
    "platform": "youtube",
    "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
]
```

**Step 3: Create `data/gallery.json`**
```json
[
  { "id": "1", "src": "/images/gallery/gig-01.jpg", "alt": "DJ Charle$ at Babel Oslo", "event": "Babel Oslo", "date": "2025-12-31" },
  { "id": "2", "src": "/images/gallery/gig-02.jpg", "alt": "Rooftop set in Bergen", "event": "Bergen Rooftop Gala", "date": "2025-07-12" },
  { "id": "3", "src": "/images/gallery/gig-03.jpg", "alt": "Øya Festival crowd", "event": "Øya Festival", "date": "2025-08-09" },
  { "id": "4", "src": "/images/gallery/gig-04.jpg", "alt": "Club set in Stavanger", "event": "Club Stavanger", "date": "2025-05-03" },
  { "id": "5", "src": "/images/gallery/gig-05.jpg", "alt": "Corporate event Oslo", "event": "Oslo Corporate Gala", "date": "2025-03-18" }
]
```

**Step 4: Create placeholder gallery images directory**
```bash
mkdir -p public/images/gallery
```
For each placeholder image, we'll use a dark SVG. Create `public/images/gallery/placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#111111"/>
  <rect x="380" y="280" width="40" height="40" fill="#C9A84C" opacity="0.3"/>
</svg>
```
> Note: Gallery images will show as broken until real photos are added. The Lightbox handles missing images gracefully.

**Step 5: Commit**
```bash
git add data/ public/images/
git commit -m "chore: add JSON data files and gallery placeholder"
```

---

## Phase 2: Layout Shell

### Task 6: Root layout with fonts and metadata

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update `app/layout.tsx`**
```tsx
import type { Metadata } from 'next'
import { League_Spartan, Inter, DM_Mono } from 'next/font/google'
import './globals.css'

const spartan = League_Spartan({
  subsets: ['latin'],
  variable: '--font-spartan',
  weight: ['700', '800', '900'],
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
      <body className={`${spartan.variable} ${inter.variable} ${dmMono.variable} bg-black text-white font-inter antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

**Step 2: Commit**
```bash
git add app/layout.tsx
git commit -m "feat: root layout with Google Fonts and metadata"
```

---

### Task 7: Navbar component

**Files:**
- Create: `components/Navbar.tsx`

**Step 1: Create `components/Navbar.tsx`**
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/videos', label: 'Videos' },
  { href: '/mixes', label: 'Mixes' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/booking', label: 'Booking' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 80))

  // Close menu on route change
  useState(() => { setMenuOpen(false) })

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between transition-colors duration-300"
        style={{ backgroundColor: scrolled ? '#000000' : 'transparent' }}
      >
        <Link href="/" className="font-spartan font-black text-xl text-gold tracking-tight uppercase">
          DJ Charle$
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-mono text-sm text-white/80 hover:text-gold transition-colors duration-200 relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
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
          <span className={`block w-6 h-px bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
        </button>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8"
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
                  className="font-spartan font-black text-3xl uppercase text-white hover:text-gold transition-colors"
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

**Step 2: Commit**
```bash
git add components/Navbar.tsx
git commit -m "feat: Navbar with scroll-aware background and mobile menu"
```

---

### Task 8: Footer component

**Files:**
- Create: `components/Footer.tsx`

**Step 1: Create `components/Footer.tsx`**
```tsx
import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: <InstagramIcon /> },
  { label: 'SoundCloud', href: 'https://soundcloud.com', icon: <SoundCloudIcon /> },
  { label: 'YouTube', href: 'https://youtube.com', icon: <YouTubeIcon /> },
  { label: 'TikTok', href: 'https://tiktok.com', icon: <TikTokIcon /> },
]

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function SoundCloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 12.225c-.054 0-.101.042-.101.1l-.233 2.154.233 2.105c0 .058.047.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.308c.013.06.045.094.104.094.053 0 .09-.034.104-.094l.197-1.308-.197-1.332c-.015-.057-.051-.094-.104-.094m1.81-.7c-.07 0-.12.05-.12.12l-.209 2.006.209 1.96c0 .07.05.12.12.12.063 0 .118-.05.12-.12l.237-1.96-.237-2.006c-.002-.07-.057-.12-.12-.12m.92-.3c-.08 0-.146.066-.146.146l-.183 2.306.183 2.24c0 .08.065.146.145.146.08 0 .146-.065.146-.146l.208-2.24-.208-2.306c0-.08-.066-.146-.146-.146m.93.156c-.09 0-.166.075-.166.166l-.159 2.15.159 2.187c0 .09.075.166.166.166.09 0 .166-.075.166-.166l.18-2.187-.18-2.15c0-.09-.075-.166-.165-.166m.938-.413c-.1 0-.182.083-.182.184l-.133 2.563.133 2.497c0 .1.082.184.182.184.1 0 .182-.083.182-.184l.152-2.497-.152-2.563c0-.1-.082-.184-.182-.184m.94-.063c-.11 0-.2.09-.2.2l-.107 2.626.107 2.568c0 .11.09.2.2.2.11 0 .2-.09.2-.2l.122-2.568-.122-2.626c0-.11-.09-.2-.2-.2m3.782-1.045c-.152-.062-.316-.097-.49-.097-.284 0-.548.082-.77.226-.104-1.207-1.12-2.15-2.355-2.15-.433 0-.838.127-1.18.345-.128.085-.162.172-.163.254v8.464c0 .087.07.158.158.165h6.002c.087-.007.158-.078.158-.165V13.3c0-.97-.658-1.784-1.52-2.056zM24 13.863c0-1.562-1.27-2.825-2.838-2.825-.365 0-.716.07-1.04.196--.215-2.006-1.887-3.568-3.94-3.568-.672 0-1.307.175-1.857.48v10.07c0 .09.07.16.162.165H24.162c.09-.006.162-.075.162-.165v-4.353z"/>
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-spartan font-black text-xl text-gold uppercase tracking-tight">
          DJ Charle$
        </span>

        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gold/70 hover:text-gold transition-colors duration-200"
            >
              {icon}
            </Link>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p className="font-mono text-xs text-white/40">placeholder@djcharles.com</p>
          <p className="font-mono text-xs text-white/30 mt-1">© 2026 DJ Charle$. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**
```bash
git add components/Footer.tsx
git commit -m "feat: Footer with social icons and copyright"
```

---

## Phase 3: Home Page

### Task 9: Hero section

**Files:**
- Create: `components/Hero.tsx`

**Step 1: Create `components/Hero.tsx`**
```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1209 0%, #000000 70%)',
        }}
      />
      {/* Noise texture overlay */}
      <svg className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          className="font-spartan font-black text-gold uppercase tracking-tight"
          style={{ fontSize: 'clamp(4rem, 15vw, 14rem)', lineHeight: 1 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          DJ Charle$
        </motion.h1>

        <motion.p
          className="mt-6 text-white/80 font-inter text-lg md:text-2xl tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Where Every Set Tells a Story
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/booking"
            className="inline-block bg-gold text-black font-spartan font-black uppercase tracking-widest px-10 py-4 text-sm hover:bg-white transition-colors duration-300"
          >
            Book Charle$
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="font-mono text-xs text-white/30 tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
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
git commit -m "feat: Hero section with cinematic gradient and gold typography"
```

---

### Task 10: About section

**Files:**
- Create: `components/About.tsx`

**Step 1: Create `components/About.tsx`**
```tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Gold divider */}
      <FadeUp>
        <div className="w-16 h-px bg-gold mb-16" />
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
        {/* Portrait placeholder */}
        <FadeUp delay={0.1}>
          <div className="md:col-span-1">
            <div className="aspect-[3/4] bg-surface border border-white/10 w-full max-w-xs mx-auto md:mx-0 flex items-center justify-center">
              <div className="w-8 h-8 border border-gold/30" />
            </div>
          </div>
        </FadeUp>

        {/* Text */}
        <div className="md:col-span-2 space-y-8">
          <FadeUp delay={0.15}>
            <h2 className="font-spartan font-black text-4xl md:text-6xl uppercase text-white leading-none">
              The Story
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              Haugesund, Norway. A coastal city of grey skies and stubborn weather, where everyone
              knows everyone and difference is noticed before it&apos;s understood. I grew up here,
              the son of Vietnamese immigrants — a family who crossed oceans for a better life and
              landed in one of the world&apos;s most homogeneous societies.
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              I grew up with a target on my back. Not out of cruelty, but out of unfamiliarity.
              Being different in a place that prizes sameness teaches you things no classroom can.
              You learn to read a room before you enter it. You learn which energy is welcoming and
              which is not. You develop a skin thick enough to hold a storm, and a heart open enough
              to find beauty in the discomfort.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              That upbringing — east meets west, tradition meets modernity, silence meets noise —
              became my musical compass. I didn&apos;t just listen to music. I used it to understand
              the world around me. Hip-hop from America. Electronic from Berlin. Pop from Seoul.
              Traditional Vietnamese melodies my mother hummed in the kitchen. Every sound was a
              bridge between the world I was born into and the one I was trying to belong to.
            </p>
          </FadeUp>

          <FadeUp delay={0.35}>
            <p className="font-inter text-white/70 text-lg leading-relaxed">
              That&apos;s what I bring to every set. The ability to hold contradictions gracefully.
              To move between genres the way I moved between worlds. To read a crowd the way I once
              had to read a room — as a matter of survival, and now, as an art form. Whether it&apos;s
              a rooftop in Bergen or a club in Oslo, a festival stage or a private villa, I arrive
              with the same intention: to make everyone in the room feel like they belong.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <p className="font-spartan font-black text-2xl md:text-3xl uppercase text-gold leading-tight">
              The music is not the background to the night.<br />
              The music is the night.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Bottom divider */}
      <FadeUp delay={0.45}>
        <div className="w-full h-px bg-gradient-to-r from-gold/50 to-transparent mt-20" />
      </FadeUp>
    </section>
  )
}
```

**Step 2: Commit**
```bash
git add components/About.tsx
git commit -m "feat: About section with manifesto copy and scroll animations"
```

---

### Task 11: Home page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update `app/page.tsx`**
```tsx
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DJ Charle$ — Where Every Set Tells a Story',
  description: 'DJ Charle$ is a Haugesund-born DJ of Vietnamese heritage, blending cultures and genres across Norway\'s club scene.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Verify dev server starts**
```bash
npm run dev
```
Open `http://localhost:3000` — should see gold "DJ Charle$" hero and About section below.

**Step 3: Commit**
```bash
git add app/page.tsx
git commit -m "feat: home page assembling Hero and About"
```

---

## Phase 4: Videos Page

### Task 12: VideoCard component

**Files:**
- Create: `components/VideoCard.tsx`

**Step 1: Create `components/VideoCard.tsx`**
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
      className="relative cursor-pointer group border border-white/10 overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-surface">
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Gold border on hover */}
        <div className="absolute inset-0 border border-transparent group-hover:border-gold transition-colors duration-300" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A84C">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Metadata overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <p className="font-spartan font-black text-white text-sm uppercase leading-tight">{video.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs text-white/50">{video.location}</span>
            <span className="font-mono text-xs text-gold/70">{video.date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
```

**Step 2: Commit**
```bash
git add components/VideoCard.tsx
git commit -m "feat: VideoCard with YouTube thumbnail and hover effects"
```

---

### Task 13: VideoModal component

**Files:**
- Create: `components/VideoModal.tsx`

**Step 1: Create `components/VideoModal.tsx`**
```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { Video } from '@/types'

interface VideoModalProps {
  video: Video | null
  onClose: () => void
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-5xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-spartan font-black text-white uppercase">{video.title}</h3>
                <p className="font-mono text-xs text-gold/70">{video.location} · {video.date}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="relative aspect-video bg-surface">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Step 2: Commit**
```bash
git add components/VideoModal.tsx
git commit -m "feat: VideoModal with YouTube iframe and keyboard close"
```

---

### Task 14: Videos page

**Files:**
- Create: `app/videos/page.tsx`

**Step 1: Create `app/videos/page.tsx`**
```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import videosData from '@/data/videos.json'
import type { Video } from '@/types'

const CATEGORIES = ['All', 'Club', 'Private', 'Festival', 'Other'] as const
type Category = typeof CATEGORIES[number]

const videos = videosData as Video[]

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('All')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const filtered = activeFilter === 'All' ? videos : videos.filter(v => v.category === activeFilter)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white mb-2">Past Gigs</h1>
          <div className="w-16 h-px bg-gold mt-4" />
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-6 mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="relative font-mono text-sm whitespace-nowrap transition-colors duration-200 pb-1"
              style={{ color: activeFilter === cat ? '#C9A84C' : 'rgba(255,255,255,0.5)' }}
            >
              {cat}
              {activeFilter === cat && (
                <motion.span layoutId="filter-underline" className="absolute bottom-0 left-0 right-0 h-px bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

> Note: This page uses `'use client'` because of filter state. Add `metadata` export by converting to a server/client split if SEO is critical (pass videos as props from a server component wrapper).

**Step 2: Add metadata — create `app/videos/layout.tsx`**
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Past Gigs',
  description: 'Watch DJ Charle$ perform live at clubs, festivals, and private events across Norway.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Step 3: Commit**
```bash
git add app/videos/
git commit -m "feat: Videos page with YouTube grid, filter bar, and modal"
```

---

## Phase 5: Mixes Page

### Task 15: MixCard component

**Files:**
- Create: `components/MixCard.tsx`

**Step 1: Create `components/MixCard.tsx`**
```tsx
'use client'

import { motion } from 'framer-motion'
import type { Mix } from '@/types'

const PLATFORM_CONFIG = {
  soundcloud: { label: 'SoundCloud', color: '#FF5500' },
  youtube: { label: 'YouTube', color: '#FF0000' },
}

export default function MixCard({ mix }: { mix: Mix }) {
  const platform = PLATFORM_CONFIG[mix.platform]
  return (
    <motion.div
      className="bg-surface border border-white/10 hover:border-gold transition-colors duration-300 overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div>
          <h3 className="font-spartan font-black text-white text-sm uppercase">{mix.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs text-white/40">{mix.date}</span>
            <span className="font-mono text-xs text-white/40">{mix.duration}</span>
          </div>
        </div>
        <span
          className="font-mono text-xs font-bold px-2 py-1 rounded"
          style={{ color: platform.color, border: `1px solid ${platform.color}33` }}
        >
          {platform.label}
        </span>
      </div>
      <div className="relative" style={{ height: mix.platform === 'soundcloud' ? '166px' : '315px' }}>
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

**Step 2: Commit**
```bash
git add components/MixCard.tsx
git commit -m "feat: MixCard with SoundCloud and YouTube embed support"
```

---

### Task 16: Mixes page

**Files:**
- Create: `app/mixes/page.tsx`
- Create: `app/mixes/layout.tsx`

**Step 1: Create `app/mixes/page.tsx`**
```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MixCard from '@/components/MixCard'
import mixesData from '@/data/mixes.json'
import type { Mix } from '@/types'

const mixes = mixesData as Mix[]

export default function MixesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white">Mixes</h1>
          <div className="w-16 h-px bg-gold mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mixes.map((mix) => <MixCard key={mix.id} mix={mix} />)}
        </div>
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Create `app/mixes/layout.tsx`**
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Mixes',
  description: 'Listen to DJ Charle$ mixes on SoundCloud and YouTube.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Step 3: Commit**
```bash
git add app/mixes/
git commit -m "feat: Mixes page with embed grid"
```

---

## Phase 6: Gallery Page

### Task 17 & 18: GalleryGrid and Lightbox

**Files:**
- Create: `components/GalleryGrid.tsx`
- Create: `components/Lightbox.tsx`

**Step 1: Create `components/Lightbox.tsx`**
```tsx
'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { GalleryImage } from '@/types'

interface LightboxProps {
  images: GalleryImage[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const image = index !== null ? images[index] : null

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Prev */}
          <button
            className="absolute left-4 text-white/50 hover:text-gold transition-colors text-4xl z-10"
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            aria-label="Previous"
          >‹</button>

          {/* Image */}
          <motion.div
            className="relative max-w-5xl w-full max-h-[80vh] mx-16"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] border border-gold/30">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="font-spartan text-white text-sm uppercase">{image.event}</p>
              <p className="font-mono text-xs text-gold/60">{image.date}</p>
            </div>
          </motion.div>

          {/* Next */}
          <button
            className="absolute right-4 text-white/50 hover:text-gold transition-colors text-4xl z-10"
            onClick={(e) => { e.stopPropagation(); onNext() }}
            aria-label="Next"
          >›</button>

          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl z-10"
            onClick={onClose}
            aria-label="Close"
          >×</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Step 2: Create `components/GalleryGrid.tsx`**
```tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from './Lightbox'
import type { GalleryImage } from '@/types'

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="relative break-inside-avoid cursor-pointer group border border-white/10 hover:border-gold transition-colors duration-300 overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative bg-surface" style={{ minHeight: '200px' }}>
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="font-spartan text-white text-xs uppercase">{img.event}</p>
                  <p className="font-mono text-gold/60 text-xs">{img.date}</p>
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
        onPrev={() => setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : null)}
        onNext={() => setLightboxIndex(i => i !== null ? (i + 1) % images.length : null)}
      />
    </>
  )
}
```

**Step 3: Commit**
```bash
git add components/GalleryGrid.tsx components/Lightbox.tsx
git commit -m "feat: GalleryGrid with masonry layout and Lightbox"
```

---

### Task 19: Gallery page

**Files:**
- Create: `app/gallery/page.tsx`
- Create: `app/gallery/layout.tsx`

**Step 1: Create `app/gallery/page.tsx`**
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
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white">Gallery</h1>
          <div className="w-16 h-px bg-gold mt-4" />
        </div>
        <GalleryGrid images={images} />
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Create `app/gallery/layout.tsx`**
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from DJ Charle$ past events and performances.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Step 3: Commit**
```bash
git add app/gallery/
git commit -m "feat: Gallery page with masonry grid"
```

---

## Phase 7: Booking

### Task 20: PDF rate card

**Files:**
- Create: `lib/pdf.tsx`

**Step 1: Create `lib/pdf.tsx`**
```tsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { backgroundColor: '#000000', color: '#FFFFFF', padding: 48, fontFamily: 'Helvetica' },
  gold: { color: '#C9A84C' },
  header: { marginBottom: 32, borderBottom: '1px solid #C9A84C', paddingBottom: 16 },
  title: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 4 },
  tagline: { fontSize: 11, color: '#FFFFFF', marginTop: 6, letterSpacing: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10, borderBottom: '0.5px solid rgba(201,168,76,0.3)', paddingBottom: 6 },
  packageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '0.5px solid rgba(255,255,255,0.08)' },
  packageName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' },
  packageDesc: { fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  packagePrice: { fontSize: 11, color: '#C9A84C', fontFamily: 'Helvetica-Bold' },
  note: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginTop: 6 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, borderTop: '0.5px solid rgba(201,168,76,0.3)', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: 'rgba(255,255,255,0.3)' },
})

const PACKAGES = [
  { name: 'Basic Set', desc: '2 hours · Standard equipment · 1 consultation call', price: 'From NOK 5,000' },
  { name: 'Extended Set', desc: '4 hours · Premium equipment · Sound system coordination', price: 'From NOK 9,000' },
  { name: 'Full Night', desc: '6+ hours · All-inclusive · Lighting input · Full production support', price: 'From NOK 15,000' },
  { name: 'Custom', desc: 'Bespoke package tailored to your event · Contact for details', price: 'On request' },
]

interface RateCardProps {
  clientName: string
  eventType: string
  eventDate: string
  selectedPackage: string
}

export function RateCardPDF({ clientName, eventType, eventDate, selectedPackage }: RateCardProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DJ Charle$</Text>
          <Text style={styles.tagline}>WHERE EVERY SET TELLS A STORY</Text>
        </View>

        {/* Prepared for */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prepared For</Text>
          <Text style={{ fontSize: 12, color: '#FFFFFF' }}>{clientName}</Text>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{eventType} · {eventDate}</Text>
        </View>

        {/* Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Packages & Rates</Text>
          {PACKAGES.map((pkg) => (
            <View key={pkg.name} style={[styles.packageRow, pkg.name === selectedPackage ? { backgroundColor: 'rgba(201,168,76,0.06)', padding: 6 } : {}]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.packageName}>{pkg.name}{pkg.name === selectedPackage ? '  ✓ Selected' : ''}</Text>
                <Text style={styles.packageDesc}>{pkg.desc}</Text>
              </View>
              <Text style={styles.packagePrice}>{pkg.price}</Text>
            </View>
          ))}
          <Text style={styles.note}>* All rates are starting prices and are customized based on event details, location, duration, and technical requirements.</Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>placeholder@djcharles.com</Text>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>I'll be in touch within 24 hours to discuss your event in detail.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>© 2026 DJ Charle$ · Confidential Rate Card</Text>
          <Text style={styles.footerText}>djcharles.com</Text>
        </View>
      </Page>
    </Document>
  )
}
```

**Step 2: Commit**
```bash
git add lib/pdf.tsx
git commit -m "feat: PDF rate card template with @react-pdf/renderer"
```

---

### Task 21: Auth helpers with tests

**Files:**
- Create: `lib/auth.ts`
- Create: `__tests__/lib/auth.test.ts`

**Step 1: Write the failing test first**
```typescript
// __tests__/lib/auth.test.ts
import { signSession, verifySession } from '@/lib/auth'

process.env.ADMIN_PASSWORD = 'testpassword'
process.env.ADMIN_SESSION_SECRET = 'testsecret'

describe('auth helpers', () => {
  it('signSession returns a hex string', () => {
    const token = signSession('testpassword')
    expect(typeof token).toBe('string')
    expect(token).toMatch(/^[0-9a-f]+$/)
  })

  it('verifySession returns true for valid cookie', () => {
    const token = signSession('testpassword')
    expect(verifySession(token)).toBe(true)
  })

  it('verifySession returns false for invalid cookie', () => {
    expect(verifySession('bad-token')).toBe(false)
  })

  it('verifySession returns false for empty string', () => {
    expect(verifySession('')).toBe(false)
  })
})
```

**Step 2: Run test to verify it fails**
```bash
npx jest __tests__/lib/auth.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/auth'`

**Step 3: Create `lib/auth.ts`**
```typescript
import { createHmac, timingSafeEqual } from 'crypto'

export function signSession(password: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET!
  return createHmac('sha256', secret).update(password).digest('hex')
}

export function verifySession(cookie: string): boolean {
  if (!cookie) return false
  try {
    const expected = signSession(process.env.ADMIN_PASSWORD!)
    const a = Buffer.from(cookie, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
```

**Step 4: Run test to verify it passes**
```bash
npx jest __tests__/lib/auth.test.ts
```
Expected: PASS (4 tests)

**Step 5: Commit**
```bash
git add lib/auth.ts __tests__/
git commit -m "feat: auth helpers with HMAC session signing (tested)"
```

---

### Task 22: Vercel KV inquiry helpers with tests

**Files:**
- Create: `lib/kv.ts`
- Create: `__tests__/lib/kv.test.ts`

**Step 1: Write the failing test**
```typescript
// __tests__/lib/kv.test.ts
// Mock @vercel/kv
jest.mock('@vercel/kv', () => {
  const store: Record<string, Record<string, string>> = {}
  const sorted: { score: number; member: string }[] = []
  return {
    kv: {
      hset: jest.fn(async (key: string, data: Record<string, string>) => { store[key] = data }),
      hgetall: jest.fn(async (key: string) => store[key] ?? null),
      zadd: jest.fn(async (_key: string, item: { score: number; member: string }) => { sorted.push(item) }),
      zrange: jest.fn(async () => sorted.map(i => i.member)),
      hmset: jest.fn(),
    },
  }
})

import { saveInquiry, getInquiries, updateInquiryStatus } from '@/lib/kv'
import type { BookingFormData } from '@/types'

const sampleData: BookingFormData = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  eventType: 'Club Night',
  eventDate: '2026-06-15',
  location: 'Oslo, Norway',
  guestCount: '100–250',
  package: 'Full Night',
  message: 'Looking forward to it!',
}

describe('kv helpers', () => {
  it('saveInquiry returns an inquiry with id and status New', async () => {
    const inquiry = await saveInquiry(sampleData)
    expect(inquiry.id).toBeDefined()
    expect(inquiry.status).toBe('New')
    expect(inquiry.name).toBe('Jane Smith')
  })

  it('getInquiries returns an array', async () => {
    const result = await getInquiries()
    expect(Array.isArray(result)).toBe(true)
  })
})
```

**Step 2: Run to verify it fails**
```bash
npx jest __tests__/lib/kv.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/kv'`

**Step 3: Create `lib/kv.ts`**
```typescript
import { kv } from '@vercel/kv'
import { v4 as uuidv4 } from 'uuid'
import type { Inquiry, BookingFormData, InquiryStatus } from '@/types'

export async function saveInquiry(data: BookingFormData): Promise<Inquiry> {
  const inquiry: Inquiry = {
    ...data,
    id: uuidv4(),
    submittedAt: new Date().toISOString(),
    status: 'New',
  }
  await kv.hset(`inquiry:${inquiry.id}`, inquiry as unknown as Record<string, unknown>)
  await kv.zadd('inquiries:all', { score: Date.now(), member: inquiry.id })
  return inquiry
}

export async function getInquiries(): Promise<Inquiry[]> {
  const ids = await kv.zrange('inquiries:all', 0, -1, { rev: true })
  if (!ids || ids.length === 0) return []
  const results = await Promise.all(
    ids.map((id) => kv.hgetall(`inquiry:${id}`))
  )
  return results.filter(Boolean) as Inquiry[]
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  await kv.hset(`inquiry:${id}`, { status } as unknown as Record<string, unknown>)
}
```

**Step 4: Run test to verify it passes**
```bash
npx jest __tests__/lib/kv.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add lib/kv.ts __tests__/lib/kv.test.ts
git commit -m "feat: Vercel KV inquiry helpers (tested)"
```

---

### Task 23: Email helpers

**Files:**
- Create: `lib/email.ts`

**Step 1: Create `lib/email.ts`**
```typescript
import { Resend } from 'resend'
import type { Inquiry } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendClientEmail(inquiry: Inquiry, pdfBuffer: Buffer): Promise<void> {
  await resend.emails.send({
    from: 'DJ Charle$ <noreply@djcharles.com>',
    to: [inquiry.email],
    subject: 'DJ Charle$ — Your Rate Card',
    html: `
      <div style="background:#000;color:#fff;font-family:sans-serif;padding:32px;max-width:600px">
        <h1 style="color:#C9A84C;font-size:28px;margin-bottom:8px">DJ Charle$</h1>
        <p style="color:rgba(255,255,255,0.6);margin-bottom:24px">Where Every Set Tells a Story</p>
        <p>Hi ${inquiry.name},</p>
        <p>Thank you for reaching out about your <strong>${inquiry.eventType}</strong> on <strong>${inquiry.eventDate}</strong> in <strong>${inquiry.location}</strong>.</p>
        <p>I've attached a rate card with package details. All rates are starting points — I'll be in touch within 24 hours to discuss your event in detail.</p>
        <p style="margin-top:32px;color:rgba(255,255,255,0.4);font-size:12px">© 2026 DJ Charle$</p>
      </div>
    `,
    attachments: [{
      filename: 'DJCharles-RateCard.pdf',
      content: pdfBuffer.toString('base64'),
    }],
  })
}

export async function sendAdminEmail(inquiry: Inquiry): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL!
  await resend.emails.send({
    from: 'DJ Charle$ Bookings <noreply@djcharles.com>',
    to: [adminEmail],
    subject: `New Booking Inquiry — ${inquiry.eventType}`,
    html: `
      <div style="font-family:sans-serif;padding:24px">
        <h2>New Inquiry from ${inquiry.name}</h2>
        <table style="border-collapse:collapse;width:100%">
          ${Object.entries({
            Name: inquiry.name,
            Email: inquiry.email,
            'Event Type': inquiry.eventType,
            'Event Date': inquiry.eventDate,
            Location: inquiry.location,
            'Guest Count': inquiry.guestCount,
            Package: inquiry.package,
            Submitted: new Date(inquiry.submittedAt).toLocaleString(),
          }).map(([k, v]) => `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">${k}</td><td style="padding:8px;border:1px solid #ddd">${v}</td></tr>`).join('')}
        </table>
        <h3>Message:</h3>
        <p>${inquiry.message}</p>
      </div>
    `,
  })
}
```

**Step 2: Commit**
```bash
git add lib/email.ts
git commit -m "feat: Resend email helpers for client and admin emails"
```

---

### Task 24: Booking API route with tests

**Files:**
- Create: `app/api/booking/route.ts`
- Create: `__tests__/api/booking.test.ts`

**Step 1: Write failing test**
```typescript
// __tests__/api/booking.test.ts
jest.mock('@/lib/kv', () => ({ saveInquiry: jest.fn(async (d: unknown) => ({ ...d, id: 'test-id', submittedAt: new Date().toISOString(), status: 'New' })) }))
jest.mock('@/lib/email', () => ({ sendClientEmail: jest.fn(), sendAdminEmail: jest.fn() }))
jest.mock('@react-pdf/renderer', () => ({ renderToBuffer: jest.fn(async () => Buffer.from('pdf')) }))
jest.mock('@/lib/pdf', () => ({ RateCardPDF: () => null }))

import { POST } from '@/app/api/booking/route'

const validBody = {
  name: 'Jane', email: 'jane@test.com', eventType: 'Club Night',
  eventDate: '2026-06-15', location: 'Oslo', guestCount: '100–250',
  package: 'Full Night', message: 'Hi',
}

describe('POST /api/booking', () => {
  it('returns 400 for missing required fields', async () => {
    const req = new Request('http://localhost/api/booking', {
      method: 'POST', body: JSON.stringify({ name: '' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 for valid submission', async () => {
    const req = new Request('http://localhost/api/booking', {
      method: 'POST', body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
```

**Step 2: Run to verify it fails**
```bash
npx jest __tests__/api/booking.test.ts
```
Expected: FAIL

**Step 3: Create `app/api/booking/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { RateCardPDF } from '@/lib/pdf'
import { saveInquiry } from '@/lib/kv'
import { sendClientEmail, sendAdminEmail } from '@/lib/email'
import type { BookingFormData } from '@/types'
import React from 'react'

const REQUIRED_FIELDS: (keyof BookingFormData)[] = [
  'name', 'email', 'eventType', 'eventDate', 'location', 'guestCount', 'package', 'message',
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<BookingFormData>

    // Validate
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }

    const data = body as BookingFormData

    // Save to KV
    const inquiry = await saveInquiry(data)

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(RateCardPDF, {
        clientName: inquiry.name,
        eventType: inquiry.eventType,
        eventDate: inquiry.eventDate,
        selectedPackage: inquiry.package,
      })
    )

    // Send emails
    await Promise.all([
      sendClientEmail(inquiry, pdfBuffer),
      sendAdminEmail(inquiry),
    ])

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

**Step 4: Run test to verify it passes**
```bash
npx jest __tests__/api/booking.test.ts
```
Expected: PASS (2 tests)

**Step 5: Commit**
```bash
git add app/api/booking/ __tests__/api/
git commit -m "feat: POST /api/booking — validate, KV, PDF, email (tested)"
```

---

### Task 25: BookingForm component and Booking page

**Files:**
- Create: `components/BookingForm.tsx`
- Create: `app/booking/page.tsx`
- Create: `app/booking/layout.tsx`

**Step 1: Create `components/BookingForm.tsx`**
```tsx
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
```

**Step 2: Create `app/booking/page.tsx`**
```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white">Book DJ Charle$</h1>
          <div className="w-16 h-px bg-gold mt-4 mb-6" />
          <p className="font-inter text-white/50 text-lg">Tell me about your event and I'll send you everything you need.</p>
        </div>
        <BookingForm />
      </main>
      <Footer />
    </>
  )
}
```

**Step 3: Create `app/booking/layout.tsx`**
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Book DJ Charle$',
  description: 'Book DJ Charle$ for your club night, private party, wedding, corporate event or festival.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Step 4: Commit**
```bash
git add components/BookingForm.tsx app/booking/
git commit -m "feat: BookingForm component and Booking page"
```

---

## Phase 8: Admin

### Task 26: Admin inquiry API routes with tests

**Files:**
- Create: `app/api/admin/inquiries/route.ts`
- Create: `app/api/admin/inquiries/[id]/route.ts`
- Create: `app/api/admin/logout/route.ts`
- Create: `__tests__/api/admin.test.ts`

**Step 1: Write failing tests**
```typescript
// __tests__/api/admin.test.ts
process.env.ADMIN_PASSWORD = 'testpass'
process.env.ADMIN_SESSION_SECRET = 'testsecret'

jest.mock('@/lib/kv', () => ({
  getInquiries: jest.fn(async () => [{ id: '1', name: 'Test', status: 'New' }]),
  updateInquiryStatus: jest.fn(async () => {}),
}))

import { GET } from '@/app/api/admin/inquiries/route'
import { PATCH } from '@/app/api/admin/inquiries/[id]/route'
import { signSession } from '@/lib/auth'

function makeRequest(method: string, body?: unknown, withCookie = true) {
  const token = signSession('testpass')
  return new Request('http://localhost/api/admin/inquiries', {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(withCookie ? { cookie: `admin_session=${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
}

describe('GET /api/admin/inquiries', () => {
  it('returns 401 without cookie', async () => {
    const res = await GET(makeRequest('GET', undefined, false))
    expect(res.status).toBe(401)
  })

  it('returns 200 with valid cookie', async () => {
    const res = await GET(makeRequest('GET'))
    expect(res.status).toBe(200)
  })
})
```

**Step 2: Run to verify it fails**
```bash
npx jest __tests__/api/admin.test.ts
```

**Step 3: Create `app/api/admin/inquiries/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { getInquiries } from '@/lib/kv'

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value
  return !!cookie && verifySession(cookie)
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const inquiries = await getInquiries()
  return NextResponse.json(inquiries)
}
```

**Step 4: Create `app/api/admin/inquiries/[id]/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { updateInquiryStatus } from '@/lib/kv'
import type { InquiryStatus } from '@/types'

const VALID_STATUSES: InquiryStatus[] = ['New', 'In Progress', 'Confirmed', 'Declined']

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value
  if (!cookie || !verifySession(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { status } = await req.json() as { status: InquiryStatus }
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  await updateInquiryStatus(params.id, status)
  return NextResponse.json({ success: true })
}
```

**Step 5: Create `app/api/admin/logout/route.ts`**
```typescript
import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete(SESSION_COOKIE)
  return res
}
```

**Step 6: Create `app/api/admin/login/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password: string }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  const token = signSession(password)
  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
```

**Step 7: Run tests to verify they pass**
```bash
npx jest __tests__/api/admin.test.ts
```
Expected: PASS

**Step 8: Commit**
```bash
git add app/api/admin/ __tests__/api/admin.test.ts
git commit -m "feat: admin API routes (login, logout, inquiries GET/PATCH) — tested"
```

---

### Task 27: Admin middleware

**Files:**
- Create: `middleware.ts`

**Step 1: Create `middleware.ts`**

> Note: Next.js middleware runs on the Edge runtime where Node.js `crypto` is unavailable. Use Web Crypto API instead.

```typescript
import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'

async function verifyEdgeSession(cookie: string): Promise<boolean> {
  if (!cookie) return false
  try {
    const secret = process.env.ADMIN_SESSION_SECRET!
    const password = process.env.ADMIN_PASSWORD!
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(password))
    const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return cookie === expected
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const cookie = request.cookies.get(SESSION_COOKIE)?.value ?? ''
  const valid = await verifyEdgeSession(cookie)
  if (!valid) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
```

**Step 2: Commit**
```bash
git add middleware.ts
git commit -m "feat: admin middleware with Edge-compatible HMAC verification"
```

---

### Task 28: Admin login page

**Files:**
- Create: `app/admin/login/page.tsx`

**Step 1: Create `app/admin/login/page.tsx`**
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-spartan font-black text-3xl text-gold uppercase mb-8">Admin Access</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-gold transition-colors"
              required
            />
          </div>
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black font-spartan font-black uppercase tracking-widest py-3 hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

**Step 2: Commit**
```bash
git add app/admin/login/
git commit -m "feat: admin login page"
```

---

### Task 29: AdminTable component and Admin dashboard

**Files:**
- Create: `components/AdminTable.tsx`
- Create: `app/admin/page.tsx`

**Step 1: Create `components/AdminTable.tsx`**
```tsx
'use client'

import { useState } from 'react'
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
            <>
              <tr
                key={inq.id}
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
            </>
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
```

**Step 2: Create `app/admin/page.tsx`**
```tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'
import { getInquiries } from '@/lib/kv'
import AdminTable from '@/components/AdminTable'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  if (!session || !verifySession(session)) redirect('/admin/login')

  const inquiries = await getInquiries()

  return (
    <div className="min-h-screen bg-black px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-spartan font-black text-4xl text-white uppercase">Inquiries</h1>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="font-mono text-xs text-white/30 hover:text-white transition-colors">
              Log out
            </button>
          </form>
        </div>
        <AdminTable initialInquiries={inquiries} />
      </div>
    </div>
  )
}
```

**Step 3: Commit**
```bash
git add components/AdminTable.tsx app/admin/page.tsx
git commit -m "feat: Admin dashboard with inquiry table and inline status update"
```

---

## Phase 9: Polish & Deployment

### Task 30: Environment file and README

**Files:**
- Create: `.env.local.example`
- Create: `README.md`

**Step 1: Create `.env.local.example`**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=random-64-char-secret
NEXT_PUBLIC_SITE_URL=https://djcharles.com
KV_REST_API_URL=https://...upstash.io
KV_REST_API_TOKEN=...
```

**Step 2: Create `README.md`**
```markdown
# DJ Charle$ Website

## Local Development

1. Clone the repo and install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy env file and fill in values:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

3. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Adding Content

### Videos
Edit `data/videos.json`. Add an entry with the YouTube video ID:
\`\`\`json
{ "id": "4", "title": "Your Event", "location": "Oslo", "date": "2026-01-01", "category": "Club", "youtubeId": "YOUR_YOUTUBE_ID" }
\`\`\`
Categories: `Club`, `Private`, `Festival`, `Other`

### Mixes
Edit `data/mixes.json`. Paste the SoundCloud or YouTube embed URL:
\`\`\`json
{ "id": "4", "title": "Mix Title", "date": "2026-01-01", "duration": "1:00:00", "platform": "soundcloud", "embedUrl": "https://w.soundcloud.com/player/?url=..." }
\`\`\`

### Gallery
1. Add photos to `public/images/gallery/`
2. Edit `data/gallery.json` with the filename and metadata

## Deploying to Vercel

1. Push the repo to GitHub
2. Import into Vercel
3. Add a Vercel KV store (Storage → Create → KV)
4. Set all environment variables from `.env.local.example`
5. Deploy

## Admin Dashboard

Visit `/admin/login` and enter the `ADMIN_PASSWORD` you set.
```

**Step 3: Commit**
```bash
git add .env.local.example README.md
git commit -m "docs: add README and .env.local.example"
```

---

### Task 31: Run full test suite and final verification

**Step 1: Run all tests**
```bash
npm test
```
Expected: All tests pass (auth, kv, booking API, admin API)

**Step 2: Run build**
```bash
npm run build
```
Expected: Build completes with no type errors.

**Step 3: Fix any type errors or lint warnings**
Address anything flagged by the build output.

**Step 4: Final commit**
```bash
git add -A
git commit -m "chore: final cleanup and build verification"
```

---

## Summary

| Phase | Tasks | Key Output |
|---|---|---|
| Foundation | 1–5 | Scaffolded project, deps, tokens, types, data |
| Layout Shell | 6–8 | Root layout, Navbar, Footer |
| Home | 9–11 | Hero, About, Home page |
| Videos | 12–14 | VideoCard, VideoModal, Videos page |
| Mixes | 15–16 | MixCard, Mixes page |
| Gallery | 17–19 | GalleryGrid, Lightbox, Gallery page |
| Booking | 20–25 | PDF, email, auth, KV, BookingForm, API route |
| Admin | 26–29 | API routes, middleware, login, dashboard |
| Polish | 30–31 | README, env example, tests, build |

**Run tests throughout:** `npm test`
**Dev server:** `npm run dev` → http://localhost:3000
