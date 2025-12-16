import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-visible">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gold/10 blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-3xl text-center">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/logo/midnight-chauffeur-logo.png"
            alt="Midnight Chauffeur"
            className="w-28 h-28 drop-shadow-[0_0_30px_rgba(212,175,55,0.25)]"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-light tracking-wide">
          Midnight Chauffeur
        </h1>

        <p className="mt-5 text-gray-300 text-lg leading-relaxed">
          Luxury black car, stretch limo, and limo bus service — built for punctuality, discretion,
          and a premium experience across Toronto & the GTA.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/booking"
            className="px-8 py-4 rounded-full bg-gold text-black font-medium hover:brightness-110 transition shadow-glow"
          >
            Get a Quote
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition"
          >
            About
          </Link>
        </div>
      </div>
    </section>
  );
}
