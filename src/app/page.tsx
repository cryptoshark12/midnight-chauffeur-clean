import Hero from "@/components/hero";
import FleetSection from "@/components/fleet-section";
import BookingCTA from "@/components/booking-cta";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-midnight text-white relative">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[900px] h-[900px] rounded-full bg-gold/10 blur-[180px]" />
      </div>

      <div className="relative z-10">
        <Hero />
        <FleetSection />
        <BookingCTA />
      </div>
    </main>
  );
}
