# DJ Charle$ — Editorial Redesign Design Document

**Date:** 2026-03-06
**Scope:** Public-facing pages only (`/`, `/videos`, `/mixes`, `/gallery`, `/booking`)
**Admin dashboard untouched.**

---

## Design Direction

Full editorial overhaul. Inspired by documentary film treatment layouts: full-bleed photography as the canvas, massive condensed uppercase type overlaid directly on images, pure monochrome, vertical rotated section labels. Raw, cinematic, premium nightlife.

---

## Design System

### Typography

| Role | Font | Size / Weight |
|---|---|---|
| Display / Section headers | `Bebas Neue` (Google Fonts) | 80–160px, normal (font is inherently bold) |
| Body | `Inter` | 400–600, 14–18px |
| Labels / Meta / Vertical text | `DM Mono` | 400, 10–12px uppercase |

**Remove:** `League Spartan` — replaced entirely by Bebas Neue for display.

### Color Palette — Full Monochrome

| Token | Value |
|---|---|
| Background | `#000000` |
| Primary Text | `#FFFFFF` |
| Muted Text | `rgba(255,255,255,0.5)` |
| Surface (inputs, admin rows) | `#111111` |
| Gold accent | **Removed entirely** |

### Core Layout Pattern

Every public section is a full-bleed photo panel:

```
<section> position: relative, overflow: hidden
  <img> object-fit: cover, position: absolute, inset: 0, w-full, h-full
  <div> gradient overlay: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))
  <div> content: position: absolute, inset: 0, flex layout, text anchored to edges
```

**Photo placeholder** (before real images are added): `bg-[#111111]` with SVG noise texture overlay at 6% opacity.

### Gradient Overlay

Standard: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))`
Heavy (booking form): `rgba(0,0,0,0.75)` flat

### Vertical Side Labels

```tsx
<span className="[writing-mode:vertical-rl] rotate-180 text-white/40 font-mono text-xs uppercase tracking-widest">
  LABEL TEXT
</span>
```
Positioned absolute on left or right edge, vertically centered.

---

## Navbar

- Always transparent (no scroll-to-solid behavior)
- Subtle top gradient: `linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)` behind nav for readability
- Logo: `DJ CHARLE$` in Bebas Neue
- Links: Inter, uppercase, white, `tracking-widest`
- Mobile: full-screen black overlay, Bebas Neue links with staggered fade-in (Framer Motion)

---

## Homepage (`/`)

### Hero Panel
- Height: `100vh`
- Photo: full-bleed background (placeholder: `#111` + noise)
- `DJ CHARLE$` — Bebas Neue, ~140px, white, anchored bottom-left (`absolute bottom-12 left-8`)
- Tagline `WHERE EVERY SET TELLS A STORY` — DM Mono, 12px, white/60, below name
- Vertical label `PORTFOLIO` — right edge, DM Mono
- Scroll indicator: centered arrow at bottom, `animate-bounce`

### About Panel
- Height: `100vh`
- Photo: second full-bleed photo (different from hero)
- `ABOUT` — Bebas Neue ~120px, white, top-left (`absolute top-12 left-8`)
- Body text — Inter, white, right half of panel (`w-1/2 ml-auto`), mid-height
- Vertical label `DJ CHARLE$` — left edge
- Bottom-right: DM Mono small `OSLO, NORWAY · EST. 2018`

---

## Videos Page (`/videos`)

### Header Panel
- Height: `60vh`
- `VIDEOS` — Bebas Neue ~140px, bottom-left
- Vertical label `SETS & SHOWS` — right edge

### Filter Bar
- Sits between header panel and grid
- Pills: `Club | Private | Festival | Other | All`
- Active: white text + white bottom border
- Inactive: white/40 text
- Black background strip

### Video Grid
- Each card: YouTube thumbnail as full-bleed `<img>` (existing `youtubeId` pattern)
- Title + location — white, Inter, bottom-left, overlaid
- Category — DM Mono, top-right, overlaid
- Hover: `scale-[1.02]`, darker overlay
- Click: opens existing YouTube modal (unchanged)

---

## Mixes Page (`/mixes`)

### Header Panel
- Height: `60vh`
- `MIXES` — Bebas Neue ~140px, bottom-left
- Vertical label `AUDIO` — left edge

### Mix Cards
- Full-bleed photo placeholder background
- Title + duration — white, overlaid bottom-left
- Platform badge `SOUNDCLOUD` / `YOUTUBE` — DM Mono, top-right
- Click: embed expands inline below card (accordion)

---

## Gallery Page (`/gallery`)

- No header panel — masonry grid fills the entire page, edge-to-edge, zero padding
- CSS columns masonry (existing approach)
- Hover: dark overlay fades in (`opacity-0 → opacity-100`), event name + date appear in white Bebas Neue
- Lightbox: unchanged

---

## Booking Page (`/booking`)

- Full page: full-bleed photo background, heavy overlay (`rgba(0,0,0,0.75)`)
- `BOOKING` — Bebas Neue ~120px, top-left
- Vertical label `INQUIRIES` — right edge
- Form: right half on desktop, full-width on mobile
- Input style: no box/card — `border-b border-white/40` only, transparent background, white text
- Labels: DM Mono uppercase, white/50
- Submit: `bg-white text-black` full-width, Bebas Neue
- Success state: form fades out, `INQUIRY RECEIVED` in large Bebas Neue replaces it

---

## Animation System (Framer Motion — unchanged patterns)

| Pattern | Spec |
|---|---|
| Page entry `fadeUp` | `opacity: 0→1`, `y: 24→0`, `duration: 0.6`, `ease: easeOut` |
| Scroll reveals | `useInView` on section headers and grid cards |
| Card hover overlay | `opacity` fade via Framer Motion or Tailwind transition |
| Mobile nav links | Staggered `fadeUp` with `staggerChildren: 0.08` |
| Booking success | Form `opacity: 1→0` then success text `opacity: 0→1` |

---

## Image Handling

- All photos: `next/image` with `fill` prop + `sizes` attribute
- Photo placeholders: `bg-[#111111]` + inline SVG noise texture (no broken images)
- Alt text: descriptive per image from JSON data

---

## Files Affected

| File | Change |
|---|---|
| `app/globals.css` | Add Bebas Neue import, remove League Spartan, update CSS vars |
| `app/layout.tsx` | Update font imports, remove gold references |
| `components/Navbar.tsx` | Transparent only, Bebas Neue logo, Inter links |
| `components/Hero.tsx` | Full-bleed panel, editorial layout |
| `components/About.tsx` | Full-bleed panel, editorial layout |
| `components/VideoCard.tsx` | Thumbnail overlay card, no card border |
| `app/videos/page.tsx` | Header panel + filter bar |
| `components/MixCard.tsx` | Photo overlay card, accordion embed |
| `app/mixes/page.tsx` | Header panel |
| `components/GalleryGrid.tsx` | Edge-to-edge, hover overlay |
| `app/gallery/page.tsx` | Remove padding/container |
| `components/BookingForm.tsx` | Underline inputs, monochrome |
| `app/booking/page.tsx` | Full-bleed panel wrapper |
| `components/Footer.tsx` | Remove gold, monochrome |
