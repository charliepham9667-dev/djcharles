import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'
import NoiseTexture from '@/components/NoiseTexture'

export default function BookingPage() {
  return (
    <>
      <Navbar />

      <div className="relative min-h-screen overflow-hidden">
        {/* Photo placeholder */}
        <NoiseTexture id="booking-noise" />

        {/* Heavy overlay for form legibility */}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(0,0,0,0.80)' }} />

        {/* Vertical label — right edge */}
        <span className="absolute right-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/20 uppercase tracking-widest">
          Inquiries
        </span>

        {/* Content */}
        <div className="relative z-20 px-8 md:px-16 pt-32 pb-16">
          <h1
            className="font-bebas text-white uppercase leading-none mb-10"
            style={{ fontSize: 'clamp(4rem, 10vw, 120px)' }}
          >
            Booking
          </h1>
          <div className="max-w-2xl md:ml-auto">
            <BookingForm />
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
