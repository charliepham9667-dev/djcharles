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
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white">
            Gallery
          </h1>
          <div className="w-16 h-px bg-gold mt-4" />
        </div>
        <GalleryGrid images={images} />
      </main>
      <Footer />
    </>
  )
}
