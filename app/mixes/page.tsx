import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MixCard from '@/components/MixCard'
import NoiseTexture from '@/components/NoiseTexture'
import mixesData from '@/data/mixes.json'
import type { Mix } from '@/types'

const mixes = mixesData as Mix[]

export default function MixesPage() {
  return (
    <>
      <Navbar />

      {/* Editorial header panel */}
      <div className="relative h-[60vh] overflow-hidden">
        <NoiseTexture id="mixes-noise" />
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75))' }}
        />
        <div className="relative z-20 h-full flex items-end px-8 md:px-16 pb-12">
          <h1
            className="font-bebas text-white uppercase leading-none"
            style={{ fontSize: 'clamp(4rem, 12vw, 140px)' }}
          >
            Mixes
          </h1>
        </div>
        <span className="absolute left-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/25 uppercase tracking-widest">
          Audio
        </span>
      </div>

      <main className="px-8 md:px-16 py-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mixes.map((mix) => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
