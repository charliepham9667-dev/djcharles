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
