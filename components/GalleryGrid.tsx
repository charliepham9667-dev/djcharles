'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from './Lightbox'
import type { GalleryImage } from '@/types'

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const total = images.length

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="relative break-inside-avoid cursor-pointer group border border-white/10 hover:border-gold transition-colors duration-300 overflow-hidden bg-surface"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative" style={{ minHeight: '220px' }}>
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                onError={() => {}}
              />
              {/* Hover info overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="font-spartan text-white text-xs uppercase tracking-wide">{img.event}</p>
                  <p className="font-mono text-gold/60 text-xs mt-0.5">{img.date}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null))
        }
        onNext={() =>
          setLightboxIndex((i) => (i !== null ? (i + 1) % total : null))
        }
      />
    </>
  )
}
