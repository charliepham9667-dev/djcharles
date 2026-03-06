'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1209 0%, #000000 70%)',
        }}
      />
      {/* Noise texture overlay */}
      <svg
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
        style={{ opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          className="font-spartan font-black text-gold uppercase tracking-tight"
          style={{ fontSize: 'clamp(4rem, 15vw, 14rem)', lineHeight: 1 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          DJ Charle$
        </motion.h1>

        <motion.p
          className="mt-6 text-white/80 font-inter text-lg md:text-2xl tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Where Every Set Tells a Story
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/booking"
            className="inline-block bg-gold text-black font-spartan font-black uppercase tracking-widest px-10 py-4 text-sm hover:bg-white transition-colors duration-300"
          >
            Book Charle$
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="font-mono text-xs text-white/30 tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
