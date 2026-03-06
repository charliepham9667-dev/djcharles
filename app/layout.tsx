import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DJ Charle$',
  description: 'Where Every Set Tells a Story',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
