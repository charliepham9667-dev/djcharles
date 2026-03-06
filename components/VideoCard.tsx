'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Video } from '@/types'

interface VideoCardProps {
  video: Video
  onClick: () => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <motion.div
      className="relative cursor-pointer group border border-white/10 overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-surface">
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Gold border on hover */}
        <div className="absolute inset-0 border border-transparent group-hover:border-gold transition-colors duration-300" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A84C">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Metadata overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <p className="font-spartan font-black text-white text-sm uppercase leading-tight">{video.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs text-white/50">{video.location}</span>
            <span className="font-mono text-xs text-gold/70">{video.date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
