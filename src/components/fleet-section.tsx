const fleet = [
  { title: "Black Sedan", subtitle: "Lexus ES / BMW 7 Series / S-Class", img: "/fleet/sedan.png" },
  { title: "Black SUV", subtitle: "Suburban / Yukon / Escalade / Navigator", img: "/fleet/suv.png" },
  { title: "Luxury SUV", subtitle: "Escalade / Navigator", img: "/fleet/lux-suv.png" },
  { title: "Stretch Limo", subtitle: "8 / 14 / 22 Passenger Options", img: "/fleet/stretch.png" },
  { title: "Limo Bus", subtitle: "30 Passenger", img: "/fleet/bus.png" }
];

export default function FleetSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-light tracking-wide mb-10">Fleet</h2>

        <div className="grid md:grid-cols-5 gap-4">
          {fleet.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-gold/40 transition"
            >
              <img src={v.img} alt={v.title} className="w-full h-24 mb-4 opacity-90" />
              <div className="text-lg font-medium text-gold">{v.title}</div>
              <div className="text-sm text-gray-400 mt-1">{v.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
