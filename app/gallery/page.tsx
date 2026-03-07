import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'
import { getGallery } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const images = await getGallery()
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <GalleryGrid images={images} />
      </main>
      <Footer />
    </>
  )
}
