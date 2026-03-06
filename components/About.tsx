'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="w-16 h-px bg-gold mb-16" />
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          <FadeUp delay={0.1}>
            <div className="md:col-span-1">
              <div className="aspect-[3/4] bg-surface border border-white/10 w-full max-w-xs mx-auto md:mx-0 flex items-center justify-center">
                <div className="w-8 h-8 border border-gold/30" />
              </div>
            </div>
          </FadeUp>

          <div className="md:col-span-2 space-y-8">
            <FadeUp delay={0.15}>
              <h2 className="font-spartan font-black text-4xl md:text-6xl uppercase text-white leading-none">
                The Story
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="font-inter text-white/70 text-lg leading-relaxed">
                Haugesund, Norway. A coastal city of grey skies and stubborn weather, where everyone
                knows everyone and difference is noticed before it&apos;s understood. I grew up here,
                the son of Vietnamese immigrants — a family who crossed oceans for a better life and
                landed in one of the world&apos;s most homogeneous societies.
              </p>
            </FadeUp>

            <FadeUp delay={0.25}>
              <p className="font-inter text-white/70 text-lg leading-relaxed">
                I grew up with a target on my back. Not out of cruelty, but out of unfamiliarity.
                Being different in a place that prizes sameness teaches you things no classroom can.
                You learn to read a room before you enter it. You learn which energy is welcoming and
                which is not. You develop a skin thick enough to hold a storm, and a heart open enough
                to find beauty in the discomfort.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="font-inter text-white/70 text-lg leading-relaxed">
                That upbringing — east meets west, tradition meets modernity, silence meets noise —
                became my musical compass. I didn&apos;t just listen to music. I used it to understand
                the world around me. Hip-hop from America. Electronic from Berlin. Pop from Seoul.
                Traditional Vietnamese melodies my mother hummed in the kitchen. Every sound was a
                bridge between the world I was born into and the one I was trying to belong to.
              </p>
            </FadeUp>

            <FadeUp delay={0.35}>
              <p className="font-inter text-white/70 text-lg leading-relaxed">
                That&apos;s what I bring to every set. The ability to hold contradictions gracefully.
                To move between genres the way I moved between worlds. To read a crowd the way I once
                had to read a room — as a matter of survival, and now, as an art form. Whether it&apos;s
                a rooftop in Bergen or a club in Oslo, a festival stage or a private villa, I arrive
                with the same intention: to make everyone in the room feel like they belong.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <p className="font-spartan font-black text-2xl md:text-3xl uppercase text-gold leading-tight">
                The music is not the background to the night.<br />
                The music is the night.
              </p>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay={0.45}>
          <div className="w-full h-px bg-gradient-to-r from-gold/50 to-transparent mt-20" />
        </FadeUp>
      </div>
    </section>
  )
}
