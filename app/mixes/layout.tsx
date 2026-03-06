import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mixes',
  description: 'Listen to DJ Charle$ mixes on SoundCloud and YouTube.',
}

export default function MixesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
