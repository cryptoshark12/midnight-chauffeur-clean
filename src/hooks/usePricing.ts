"use client";

import { useEffect, useState } from "react";
import { DEFAULT_PRICING, PricingConfig } from "@/config/pricing";
import { loadPricing } from "@/lib/pricingStorage";

export function usePricing() {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);

  useEffect(() => {
    setPricing(loadPricing());
  }, []);

  return { pricing, setPricing };
}
