import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'DJ Charle$ — Where Every Set Tells a Story',
  description: "DJ Charle$ is a Haugesund-born DJ of Vietnamese heritage, blending cultures and genres across Norway's club scene.",
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
