"use client";

interface Props {
  vehicle: string;
  setVehicle: (v: string) => void;
  stretchSize: string;
  setStretchSize: (v: string) => void;
}

export default function VehicleSelect({ vehicle, setVehicle, stretchSize, setStretchSize }: Props) {
  const active = "border-gold text-gold bg-gold/10";
  const inactive = "border-white/10 text-gray-300 bg-white/[0.02]";

  const vehicles = [
    { id: "sedan", label: "Black Sedan" },
    { id: "suv", label: "Black SUV" },
    { id: "lux-suv", label: "Luxury SUV" },
    { id: "stretch", label: "Stretch Limo" },
    { id: "bus", label: "Limo Bus" }
  ];

  return (
    <div className="mt-2">
      <label className="block mb-3 text-gray-300">Vehicle Type</label>
      <div className="grid md:grid-cols-3 gap-3">
        {vehicles.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVehicle(v.id)}
            className={`px-4 py-3 rounded-xl border transition text-left ${vehicle === v.id ? active : inactive}`}
          >
            <div className="font-medium">{v.label}</div>
          </button>
        ))}
      </div>

      {vehicle === "stretch" && (
        <div className="mt-6">
          <label className="block mb-3 text-gray-300">Stretch Size</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "8", label: "8 Passenger" },
              { id: "14", label: "14 Passenger" },
              { id: "22", label: "22 Passenger" }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStretchSize(s.id)}
                className={`px-4 py-2 rounded-xl border transition ${stretchSize === s.id ? active : inactive}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
