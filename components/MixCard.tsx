'use client'

import { motion } from 'framer-motion'
import type { Mix } from '@/types'

const PLATFORM_CONFIG = {
  soundcloud: { label: 'SoundCloud', color: '#FF5500' },
  youtube: { label: 'YouTube', color: '#FF0000' },
}

export default function MixCard({ mix }: { mix: Mix }) {
  const platform = PLATFORM_CONFIG[mix.platform]

  return (
    <motion.div
      className="bg-surface border border-white/10 hover:border-gold transition-colors duration-300 overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div>
          <h3 className="font-spartan font-black text-white text-sm uppercase">{mix.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs text-white/40">{mix.date}</span>
            <span className="font-mono text-xs text-white/40">{mix.duration}</span>
          </div>
        </div>
        <span
          className="font-mono text-xs font-bold px-2 py-1 border rounded shrink-0 ml-3"
          style={{ color: platform.color, borderColor: `${platform.color}44` }}
        >
          {platform.label}
        </span>
      </div>
      <div
        className="relative"
        style={{ height: mix.platform === 'soundcloud' ? '166px' : '315px' }}
      >
        <iframe
          src={mix.embedUrl}
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
