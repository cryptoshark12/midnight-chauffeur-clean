"use client";

import { useState } from "react";
import { CONTACT } from "@/config/contact";

export default function RequestCallbackModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 text-sm text-gold underline hover:opacity-80"
      >
        Request a callback
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#0B0F14] border border-gold/30 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-light text-white">
              Request a Callback
            </h3>

            <p className="text-gray-300 mt-2 text-sm">
              Enter your number and we’ll call you shortly.
            </p>

            <input
              type="tel"
              placeholder="Your phone number"
              className="w-full mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none focus:border-gold/50"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  window.location.href = `tel:${CONTACT.phone}`;
                }}
                className="flex-1 py-3 rounded-xl bg-gold text-black font-medium"
              >
                Call Now
              </button>

              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
