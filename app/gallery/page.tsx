import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'
import galleryData from '@/data/gallery.json'
import type { GalleryImage } from '@/types'

const images = galleryData as GalleryImage[]

export default function GalleryPage() {
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
