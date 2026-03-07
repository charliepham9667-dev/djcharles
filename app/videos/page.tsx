'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import NoiseTexture from '@/components/NoiseTexture'
import videosData from '@/data/videos.json'
import type { Video } from '@/types'

const CATEGORIES = ['All', 'Club', 'Private', 'Festival', 'Other'] as const
type Category = (typeof CATEGORIES)[number]

const videos = videosData as Video[]

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('All')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const filtered =
    activeFilter === 'All' ? videos : videos.filter((v) => v.category === activeFilter)

  return (
    <>
      <Navbar />

      {/* Editorial header panel */}
      <div className="relative h-[60vh] overflow-hidden">
        <NoiseTexture id="videos-noise" />
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
        />
        <div className="relative z-20 h-full flex items-end px-8 md:px-16 pb-12">
          <h1
            className="font-bebas text-white uppercase leading-none"
            style={{ fontSize: 'clamp(4rem, 12vw, 140px)' }}
          >
            Videos
          </h1>
        </div>
        <span className="absolute right-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest">
          Sets &amp; Shows
        </span>
      </div>

      {/* Filter bar */}
      <div className="bg-black px-8 md:px-16 py-5 flex items-center gap-8 overflow-x-auto border-b border-white/10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`relative font-mono text-xs uppercase tracking-widest whitespace-nowrap pb-1 transition-colors duration-200 ${
              activeFilter === cat ? 'text-white' : 'text-white/35 hover:text-white/70'
            }`}
          >
            {cat}
            {activeFilter === cat && (
              <motion.span
                layoutId="filter-underline"
                className="absolute bottom-0 left-0 right-0 h-px bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="px-8 md:px-16 py-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <VideoCard video={video} onClick={() => setSelectedVideo(video)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  )
}
