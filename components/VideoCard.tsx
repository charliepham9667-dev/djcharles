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
      className="relative cursor-pointer group overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-[#111]">
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />

        {/* Overlay — lightens on hover */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/25 transition-colors duration-300" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Category — top right */}
        <span className="absolute top-4 right-4 font-mono text-xs text-white/50 uppercase tracking-widest">
          {video.category}
        </span>

        {/* Title + location — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <p className="font-bebas text-white text-xl uppercase leading-tight">{video.title}</p>
          <p className="font-mono text-xs text-white/40 mt-0.5">{video.location}</p>
        </div>
      </div>
    </motion.div>
  )
}
