'use client'

import { motion } from 'framer-motion'
import type { Mix } from '@/types'

const PLATFORM_LABEL: Record<string, string> = {
  soundcloud: 'SoundCloud',
  youtube: 'YouTube',
}

function toEmbedUrl(url: string, platform: string): string {
  if (platform === 'soundcloud') {
    if (url.includes('w.soundcloud.com/player')) return url
    // Convert any SoundCloud share/track URL to the iframe embed format
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23000000&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&visual=false`
  }
  if (platform === 'youtube') {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
    return url
  }
  return url
}

export default function MixCard({ mix }: { mix: Mix }) {
  return (
    <motion.div
      className="bg-[#111] border border-white/10 hover:border-white/30 transition-colors duration-300 overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div>
          <h3 className="font-bebas text-white text-xl uppercase tracking-wide leading-none">
            {mix.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs text-white/35">{mix.date}</span>
            <span className="font-mono text-xs text-white/35">{mix.duration}</span>
          </div>
        </div>
        <span className="font-mono text-xs text-white/35 uppercase tracking-widest shrink-0 ml-3">
          {PLATFORM_LABEL[mix.platform] ?? mix.platform}
        </span>
      </div>

      <div
        className="relative"
        style={{ height: mix.platform === 'soundcloud' ? '166px' : '315px' }}
      >
        <iframe
          src={toEmbedUrl(mix.embedUrl, mix.platform)}
          width="100%"
          height="100%"
          allow="autoplay"
          className="absolute inset-0"
          title={mix.title}
        />
      </div>
    </motion.div>
  )
}
