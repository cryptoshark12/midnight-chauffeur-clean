"use client";

interface Props {
  service: string;
  setService: (v: string) => void;
}

export default function ServiceSelect({ service, setService }: Props) {
  const active = "border-gold text-gold bg-gold/10";
  const inactive = "border-white/10 text-gray-300 bg-white/[0.02]";

  const items = [
    { id: "one-way", label: "One Way" },
    { id: "round-trip", label: "Round Trip" },
    { id: "livery", label: "Livery Service" }
  ];

  return (
    <div>
      <label className="block mb-3 text-gray-300">Service</label>
      <div className="flex flex-wrap gap-3">
        {items.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setService(s.id)}
            className={`px-4 py-2 rounded-xl border transition ${service === s.id ? active : inactive}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
