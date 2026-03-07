import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'
import NoiseTexture from '@/components/NoiseTexture'
import { getSiteConfig } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function BookingPage() {
  const { bookingImage } = await getSiteConfig()

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen overflow-hidden">
        {bookingImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bookingImage} alt="Booking" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <NoiseTexture id="booking-noise" />
        )}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(0,0,0,0.80)' }} />
        <span className="absolute right-8 top-1/2 -translate-y-1/2 z-20 [writing-mode:vertical-rl] rotate-180 font-mono text-xs text-white/20 uppercase tracking-widest">
          Inquiries
        </span>
        <div className="relative z-20 px-8 md:px-16 pt-32 pb-16">
          <h1 className="font-bebas text-white uppercase leading-none mb-10" style={{ fontSize: 'clamp(4rem, 10vw, 120px)' }}>
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
