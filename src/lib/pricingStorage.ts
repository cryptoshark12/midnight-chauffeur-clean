import { DEFAULT_PRICING, PricingConfig } from "@/config/pricing";

const KEY = "mc_pricing_v1";

export function loadPricing(): PricingConfig {
  if (typeof window === "undefined") return DEFAULT_PRICING;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PRICING;

    const parsed = JSON.parse(raw) as PricingConfig;
    return parsed ?? DEFAULT_PRICING;
  } catch {
    return DEFAULT_PRICING;
  }
}

export function savePricing(cfg: PricingConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
}

export function resetPricing() {
  localStorage.removeItem(KEY);
}
