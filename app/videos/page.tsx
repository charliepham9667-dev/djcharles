'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
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
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white">
            Past Gigs
          </h1>
          <div className="w-16 h-px bg-gold mt-4" />
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-6 mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="relative font-mono text-sm whitespace-nowrap pb-1 transition-colors duration-200"
              style={{ color: activeFilter === cat ? '#C9A84C' : 'rgba(255,255,255,0.5)' }}
            >
              {cat}
              {activeFilter === cat && (
                <motion.span
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
