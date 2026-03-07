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
      <div className="columns-1 md:columns-2 lg:columns-3 gap-1 space-y-1">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="relative break-inside-avoid cursor-pointer group overflow-hidden bg-[#111]"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative" style={{ minHeight: '240px' }}>
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                onError={() => {}}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <p className="font-bebas text-white text-2xl uppercase leading-tight">{img.event}</p>
                  <p className="font-mono text-white/40 text-xs mt-1 uppercase tracking-widest">{img.date}</p>
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
        onPrev={() => setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null))}
        onNext={() => setLightboxIndex((i) => (i !== null ? (i + 1) % total : null))}
      />
    </>
  )
}
