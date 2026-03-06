import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="font-spartan font-black text-5xl md:text-7xl uppercase text-white">Book DJ Charle$</h1>
          <div className="w-16 h-px bg-gold mt-4 mb-6" />
          <p className="font-inter text-white/50 text-lg">Tell me about your event and I'll send you everything you need.</p>
        </div>
        <BookingForm />
      </main>
      <Footer />
    </>
  )
}
