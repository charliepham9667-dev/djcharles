import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Footer from '@/components/Footer'
import { getSiteConfig } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'DJ Charle$ — Where Every Set Tells a Story',
  description: "DJ Charle$ is a Haugesund-born DJ of Vietnamese heritage, blending cultures and genres across Norway's club scene.",
}

export default async function HomePage() {
  const { heroImage, aboutImage } = await getSiteConfig()
  return (
    <>
      <Navbar />
      <main>
        <Hero heroImage={heroImage} />
        <About aboutImage={aboutImage} />
      </main>
      <Footer />
    </>
  )
}
