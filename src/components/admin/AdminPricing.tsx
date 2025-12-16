"use client";

import { useState } from "react";
import { usePricing } from "@/hooks/usePricing";
import { savePricing, resetPricing } from "@/lib/pricingStorage";
import { DEFAULT_PRICING, PricingConfig } from "@/config/pricing";

const GOLD = "#C8A951";

export default function AdminPricing() {
  const { pricing, setPricing } = usePricing();
  const [message, setMessage] = useState("");

  function update(path: string, value: number) {
    const copy: PricingConfig = JSON.parse(JSON.stringify(pricing));
    const keys = path.split(".");
    let obj: any = copy;

    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;

    setPricing(copy);
  }

  function handleSave() {
    savePricing(pricing);
    setMessage("Saved ✓");
    setTimeout(() => setMessage(""), 2000);
  }

  function handleReset() {
    resetPricing();
    setPricing(DEFAULT_PRICING);
    setMessage("Reset ✓");
    setTimeout(() => setMessage(""), 2000);
  }

  return (
    <main className="min-h-screen bg-[#05070A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-6">
          <div>
  <h1 className="text-3xl font-light">Admin Pricing & Rules</h1>

  <p className="text-gray-400 mt-2">
    Update rates, minimums, stop fees, deposit %, and booking rules.
  </p>

  <div className="mt-3">
    <a
      href="/admin/bookings"
      className="text-sm underline"
      style={{ color: GOLD }}
    >
      → View Bookings
    </a>
  </div>
</div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-3 rounded-2xl font-medium text-black"
              style={{ backgroundColor: GOLD }}
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl border border-white/10 hover:border-white/20 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-4 text-sm" style={{ color: GOLD }}>
            {message}
          </div>
        )}

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          <Section title="Per KM Rates">
            <Field label="Sedan ($/km)" value={pricing.perKm.sedan} onChange={(v) => update("perKm.sedan", v)} />
            <Field label="SUV ($/km)" value={pricing.perKm.suv} onChange={(v) => update("perKm.suv", v)} />
            <Field label="Luxury SUV ($/km)" value={pricing.perKm.luxSuv} onChange={(v) => update("perKm.luxSuv", v)} />
            <Field label="Stretch 8 ($/km)" value={pricing.perKm.stretch8} onChange={(v) => update("perKm.stretch8", v)} />
            <Field label="Stretch 14 ($/km)" value={pricing.perKm.stretch14} onChange={(v) => update("perKm.stretch14", v)} />
            <Field label="Stretch 22 ($/km)" value={pricing.perKm.stretch22} onChange={(v) => update("perKm.stretch22", v)} />
            <Field label="Limo Bus 30 ($/km)" value={pricing.perKm.bus30} onChange={(v) => update("perKm.bus30", v)} />
          </Section>

          <Section title="Minimum Charges">
            <Field label="Sedan (min $)" value={pricing.minimum.sedan} onChange={(v) => update("minimum.sedan", v)} />
            <Field label="SUV (min $)" value={pricing.minimum.suv} onChange={(v) => update("minimum.suv", v)} />
            <Field label="Luxury SUV (min $)" value={pricing.minimum.luxSuv} onChange={(v) => update("minimum.luxSuv", v)} />
            <Field label="Stretch 8 (min $)" value={pricing.minimum.stretch8} onChange={(v) => update("minimum.stretch8", v)} />
            <Field label="Stretch 14 (min $)" value={pricing.minimum.stretch14} onChange={(v) => update("minimum.stretch14", v)} />
            <Field label="Stretch 22 (min $)" value={pricing.minimum.stretch22} onChange={(v) => update("minimum.stretch22", v)} />
            <Field label="Limo Bus 30 (min $)" value={pricing.minimum.bus30} onChange={(v) => update("minimum.bus30", v)} />
          </Section>

          <Section title="Stop Fees">
            <Field
              label="Sedan/SUV/Lux ($ per stop)"
              value={pricing.stopFees.standard}
              onChange={(v) => update("stopFees.standard", v)}
            />
            <Field
              label="Stretch/Bus ($ per stop)"
              value={pricing.stopFees.premium}
              onChange={(v) => update("stopFees.premium", v)}
            />
          </Section>

          <Section title="Deposit & Rules">
            <Field
              label="Deposit percent (0.10 = 10%)"
              value={pricing.depositPercent}
              step="0.01"
              onChange={(v) => update("depositPercent", v)}
            />

            <div className="mt-2" />

            <SelectField
              label="Minimum buffer time"
              value={pricing.bufferMinutes}
              onChange={(v) => update("bufferMinutes", v)}
              options={[
                { label: "30 minutes", value: 30 },
                { label: "1 hour", value: 60 },
                { label: "2 hours", value: 120 },
              ]}
            />

            <p className="text-xs text-gray-500 mt-3">
              Airport trips enforce a minimum of <span style={{ color: GOLD }}>2 hours</span> even if buffer is lower.
              Pickups <span style={{ color: GOLD }}>2:00–5:00 AM</span> are blocked unless admin override is enabled later.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
      <h2 className="text-lg text-gray-100 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <input
        type="number"
        step={step ?? "0.1"}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-white/10 bg-[#05070A] px-4 py-3 text-white outline-none focus:border-white/30"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: { label: string; value: number }[];
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-white/10 bg-[#05070A] px-4 py-3 text-white outline-none focus:border-white/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
