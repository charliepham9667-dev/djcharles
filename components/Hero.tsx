'use client'

import { motion } from 'framer-motion'
import NoiseTexture from './NoiseTexture'

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Photo placeholder — replace div with next/image when photos are ready */}
      <NoiseTexture id="hero-noise" />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
      />

      {/* Main content — anchored bottom-left */}
      <div className="relative z-20 h-full flex flex-col justify-end px-8 md:px-16 pb-14">
        <motion.h1
          className="font-bebas text-white uppercase leading-none"
          style={{ fontSize: 'clamp(5rem, 16vw, 160px)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          DJ Charle$
        </motion.h1>

        <motion.p
          className="font-mono text-xs text-white/40 uppercase tracking-widest mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Where Every Set Tells a Story
        </motion.p>
      </div>

      {/* Vertical label — right edge */}
      <motion.span
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Portfolio
      </motion.span>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
