'use client'

import { motion } from 'framer-motion'
import type { Mix } from '@/types'

const PLATFORM_LABEL: Record<string, string> = {
  soundcloud: 'SoundCloud',
  youtube: 'YouTube',
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
