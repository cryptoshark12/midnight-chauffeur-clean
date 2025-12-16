"use client";

import { CONTACT } from "@/config/contact";
import { isMobileDevice } from "@/lib/isMobile";

export default function QuickContactButtons() {
  const isMobile = isMobileDevice();

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {/* Call */}
      <a
        href={`tel:${CONTACT.phone}`}
        className="px-4 py-2 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition"
      >
        Call
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${CONTACT.whatsapp.replace("+", "")}`}
        target="_blank"
        className="px-4 py-2 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition"
      >
        WhatsApp
      </a>

      {/* SMS (mobile only) */}
      {isMobile && (
        <a
          href={`sms:${CONTACT.sms}`}
          className="px-4 py-2 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition"
        >
          SMS
        </a>
      )}
    </div>
  );
}
