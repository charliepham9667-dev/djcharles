import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MixCard from '@/components/MixCard'
import mixesData from '@/data/mixes.json'
import type { Mix } from '@/types'

const mixes = mixesData as Mix[]

export default function MixesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white">
            Mixes
          </h1>
          <div className="w-16 h-px bg-gold mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mixes.map((mix) => (
            <MixCard key={mix.id} mix={mix} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
