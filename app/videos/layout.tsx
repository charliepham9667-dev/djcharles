import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Past Gigs',
  description: 'Watch DJ Charle$ perform live at clubs, festivals, and private events across Norway.',
}

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
