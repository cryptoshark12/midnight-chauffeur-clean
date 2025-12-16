import Link from "next/link";

export default function BookingCTA() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto rounded-3xl border border-gold/30 bg-gold/5 p-10 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full bg-gold/20 blur-[120px]" />
        <div className="relative z-10">
          <h3 className="text-3xl font-light tracking-wide">Ready to ride?</h3>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Get an instant quote and book your ride with a refundable 10% deposit (refundable with 24+ hours notice).
          </p>

          <div className="mt-8">
            <Link
              href="/booking"
              className="inline-flex px-8 py-4 rounded-full bg-gold text-black font-medium hover:brightness-110 transition shadow-glow"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
