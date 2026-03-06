# DJ Charle$ Website — Design Document

**Date:** 2026-03-06
**Project:** Personal DJ Portfolio & Booking Website
**Stack:** Next.js 14+ (App Router) · Tailwind CSS · Framer Motion · Vercel KV · Resend · @react-pdf/renderer

---

## Brand Identity

| Property | Value |
|---|---|
| Name | DJ Charle$ |
| Tagline | "Where Every Set Tells a Story" |
| Background | `#000000` |
| Primary Text | `#FFFFFF` |
| Accent | `#C9A84C` (Gold / Champagne) |
| Surface | `#111111` (cards, inputs, table rows) |
| Aesthetic | Cinematic, minimal, editorial, premium nightlife |

**Typography:**
- Display / Hero: `League Spartan` (700–900) — uppercase, dramatic
- Body: `Inter` (400–600) — clean, modern
- Labels / Meta: `DM Mono` — technical, precise

---

## Routes

| Route | Description |
|---|---|
| `/` | Hero + About (single scrolling page) |
| `/videos` | YouTube gig grid with modal |
| `/mixes` | SoundCloud + YouTube embed grid |
| `/gallery` | Masonry photo grid with lightbox |
| `/booking` | Inquiry form → PDF + email |
| `/admin/login` | Password form → sets session cookie |
| `/admin` | Protected inquiry dashboard |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/booking` | POST | Validate → KV write → PDF → Resend ×2 |
| `/api/admin/inquiries` | GET | Read all inquiries (cookie-protected) |
| `/api/admin/inquiries/[id]` | PATCH | Update inquiry status (cookie-protected) |
| `/api/admin/logout` | POST | Clear session cookie |

---

## Data Models

### videos.json
```json
{
  "id": "1",
  "title": "Babel Oslo — New Year's Eve",
  "location": "Oslo, Norway",
  "date": "2025-12-31",
  "category": "Club",
  "youtubeId": "PLACEHOLDER_ID"
}
```
> Thumbnails auto-generated: `https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg`
> Categories: `Club | Private | Festival | Other`

### mixes.json
```json
{
  "id": "1",
  "title": "Summer Vibes Mix Vol. 1",
  "date": "2025-08-01",
  "duration": "1:02:30",
  "platform": "soundcloud",
  "embedUrl": "https://w.soundcloud.com/player/?url=..."
}
```
> Platforms: `soundcloud | youtube`

### gallery.json
```json
{
  "id": "1",
  "src": "/images/gallery/gig-01.jpg",
  "alt": "DJ Charle$ at Babel Oslo",
  "event": "Babel Oslo",
  "date": "2025-12-31"
}
```

### Vercel KV — Inquiry Schema
```json
{
  "id": "uuid-v4",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "eventType": "Club Night",
  "eventDate": "2026-06-15",
  "location": "Bergen, Norway",
  "guestCount": "100–250",
  "package": "Full Night",
  "message": "...",
  "submittedAt": "2026-03-06T10:00:00Z",
  "status": "New"
}
```

**Redis keys:**
- `inquiry:{uuid}` — hash of all inquiry fields
- `inquiries:all` — sorted set (score = submittedAt Unix timestamp)

**Status values:** `New | In Progress | Confirmed | Declined`

---

## Component Architecture

```
/components
  Navbar.tsx          useScroll → transparent → solid black at scrollY > 80
  Hero.tsx            Full-viewport, gold title, tagline, CTA, scroll indicator
  About.tsx           Long-form manifesto, portrait placeholder, gold divider
  VideoCard.tsx       YouTube thumbnail (next/image), hover gold border, opens modal
  VideoModal.tsx      YouTube iframe, backdrop fade, keyboard close
  MixCard.tsx         Embed iframe (SoundCloud/YouTube), platform badge
  GalleryGrid.tsx     CSS columns masonry, next/image, gold border hover
  Lightbox.tsx        Fullscreen overlay, ←/→/Esc navigation
  BookingForm.tsx     Controlled form, optimistic UI, success banner
  Footer.tsx          Logo, social SVG icons, copyright
  AdminTable.tsx      Inline status dropdown, expandable rows
```

---

## Animation System (Framer Motion)

| Pattern | Spec |
|---|---|
| Page entry `fadeUp` | `opacity: 0→1`, `y: 24→0`, `duration: 0.6`, `ease: easeOut` |
| Scroll reveals | `useInView` triggers `fadeUp` on cards and text blocks |
| Navbar fill | `useScroll` → background crossfade at `scrollY > 80` |
| Card hover | `border-color` gold + `scale: 1.01` |
| Filter pill | Shared `layoutId` sliding gold underline |
| Modal open | Backdrop `opacity` fade + content `scale: 0.95→1` |
| Mobile nav | Full-screen overlay, staggered link fade-ins |

---

## Hero Background

No video file — cinematic dark gradient with noise texture:
```css
background: radial-gradient(ellipse at center, #1a1209 0%, #000000 70%);
/* + SVG noise texture overlay at 4% opacity */
```

---

## Booking Form → Data Flow

```
User submits form
  → POST /api/booking
  → Server-side field validation
  → Write inquiry to Vercel KV (status: "New")
  → Generate PDF buffer via @react-pdf/renderer
  → Resend: email to client (subject: "DJ Charle$ — Your Rate Card", PDF attached)
  → Resend: email to ADMIN_EMAIL (subject: "New Booking Inquiry — {eventType}")
  → Return { success: true }
  → Form shows success banner
```

**PDF Rate Card contents:** DJ Charle$ branding, tagline, package descriptions & placeholder pricing tiers (Basic Set / Extended Set / Full Night / Custom), contact info placeholder, customization note.

---

## Admin Auth Flow

```
POST /api/admin/login
  → compare plaintext password to ADMIN_PASSWORD env var
  → set httpOnly cookie: admin_session = HMAC(password, ADMIN_SESSION_SECRET)

Next.js middleware on /admin/*
  → verify cookie HMAC → allow or redirect to /admin/login
```

---

## Environment Variables

```bash
RESEND_API_KEY            # Resend email API key
ADMIN_EMAIL               # Receives inquiry notification emails
ADMIN_PASSWORD            # Admin dashboard password
ADMIN_SESSION_SECRET      # HMAC signing secret for session cookie
KV_REST_API_URL           # Vercel KV (auto-injected when KV linked)
KV_REST_API_TOKEN         # Vercel KV (auto-injected when KV linked)
NEXT_PUBLIC_SITE_URL      # Used for OG tags (e.g. https://djcharles.com)
```

---

## Key Implementation Notes

- **Videos page:** YouTube only. `youtubeId` in videos.json, thumbnail from YouTube CDN, iframe in modal.
- **Mobile nav:** Hamburger → full-screen overlay, closes on route change via `usePathname`.
- **All images:** `next/image` with explicit `width`/`height` or `fill` + `sizes`.
- **SEO:** `generateMetadata` per page, OG tags, `<meta name="description">` in root layout.
- **TypeScript:** Strict throughout. Types defined in `/types/index.ts`.
- **No external table/modal libraries** — all built from scratch with Tailwind + Framer Motion.
