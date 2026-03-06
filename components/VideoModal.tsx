'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { Video } from '@/types'

interface VideoModalProps {
  video: Video | null
  onClose: () => void
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-5xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-spartan font-black text-white uppercase">{video.title}</h3>
                <p className="font-mono text-xs text-gold/70">{video.location} · {video.date}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors text-3xl leading-none ml-4"
                aria-label="Close video"
              >
                ×
              </button>
            </div>
            <div className="relative aspect-video bg-surface">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
