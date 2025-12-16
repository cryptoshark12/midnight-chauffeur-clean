"use client";

import { useEffect, useRef } from "react";

interface Props {
  label: string;
  onSelect: (address: string) => void;
}

export default function AddressAutocomplete({ label, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps?.places) return;
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: ["ca"] },
        fields: ["formatted_address"],
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(43.5810, -79.6396), // GTA SW
          new window.google.maps.LatLng(43.8555, -79.1157)  // GTA NE
        ),
        strictBounds: false
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        onSelect(place.formatted_address);
        inputRef.current!.value = place.formatted_address;
      }
    });
  }, [onSelect]);

  return (
    <div>
      <label className="block mb-2 text-gray-300">{label}</label>

      {/* Airport shortcuts */}
      <div className="flex gap-3 mb-3">
        <button
          type="button"
          onClick={() => {
            const v = "Toronto Pearson International Airport (YYZ)";
            onSelect(v);
            if (inputRef.current) inputRef.current.value = v;
          }}
          className="px-3 py-1.5 rounded-full border border-gold/40 text-gold text-xs hover:bg-gold/10"
        >
          YYZ Airport
        </button>

        <button
          type="button"
          onClick={() => {
            const v = "Billy Bishop Toronto City Airport (YTZ)";
            onSelect(v);
            if (inputRef.current) inputRef.current.value = v;
          }}
          className="px-3 py-1.5 rounded-full border border-gold/40 text-gold text-xs hover:bg-gold/10"
        >
          YTZ Airport
        </button>
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Enter address"
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none focus:border-gold/50"
      />
    </div>
  );
}
