import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Book DJ Charle$',
  description: 'Book DJ Charle$ for your club night, private party, wedding, corporate event or festival.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
