'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import NoiseTexture from './NoiseTexture'

export default function About({ aboutImage }: { aboutImage?: string | null }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background: photo if set, noise texture otherwise */}
      {aboutImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={aboutImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      ) : (
        <NoiseTexture id="about-noise" />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
      />

      {/* Vertical label — left edge */}
      <span className="absolute left-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest">
        DJ Charle$
      </span>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-between px-8 md:px-16 py-20">
        {/* Section header — top */}
        <motion.h2
          className="font-bebas text-white uppercase leading-none"
          style={{ fontSize: 'clamp(4rem, 12vw, 120px)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          About
        </motion.h2>

        {/* Body text — right half */}
        <motion.div
          className="md:ml-auto md:w-1/2 space-y-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <p className="font-inter text-white/80 text-base md:text-lg leading-relaxed">
            Haugesund, Norway. A coastal city of grey skies and stubborn weather, where everyone
            knows everyone and difference is noticed before it&apos;s understood. I grew up here,
            the son of Vietnamese immigrants, a family who crossed oceans for a better life and
            landed in one of the world&apos;s most homogeneous societies.
          </p>
          <p className="font-inter text-white/80 text-base md:text-lg leading-relaxed">
            That upbringing shaped everything. East meets west, tradition meets modernity, silence meets noise.
            Whether it&apos;s a rooftop in Bergen or a club in Oslo,
            I arrive with the same intention: to make everyone in the room feel like they belong.
          </p>
          <p className="font-bebas text-white text-2xl md:text-3xl uppercase leading-tight">
            The music is not the background to the night.<br />
            The music is the night.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
