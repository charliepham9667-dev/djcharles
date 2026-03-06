'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { GalleryImage } from '@/types'

interface LightboxProps {
  images: GalleryImage[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const image = index !== null ? images[index] : null

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Prev */}
          <button
            className="absolute left-4 md:left-8 text-white/50 hover:text-gold transition-colors text-5xl z-10 leading-none"
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Image */}
          <motion.div
            className="relative max-w-5xl w-full mx-16 md:mx-24"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] border border-gold/30 bg-surface overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                onError={() => {}}
              />
            </div>
            <div className="mt-3 text-center">
              <p className="font-spartan text-white text-sm uppercase tracking-wide">{image.event}</p>
              <p className="font-mono text-xs text-gold/60 mt-1">{image.date}</p>
            </div>
          </motion.div>

          {/* Next */}
          <button
            className="absolute right-4 md:right-8 text-white/50 hover:text-gold transition-colors text-5xl z-10 leading-none"
            onClick={(e) => { e.stopPropagation(); onNext() }}
            aria-label="Next image"
          >
            ›
          </button>

          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-3xl z-10 leading-none"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            ×
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <p className="font-mono text-xs text-white/30">
              {(index ?? 0) + 1} / {images.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
