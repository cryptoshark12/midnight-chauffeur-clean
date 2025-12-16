export type PricingConfig = {
  perKm: {
    sedan: number;
    suv: number;
    luxSuv: number;
    stretch8: number;
    stretch14: number;
    stretch22: number;
    bus30: number;
  };
  minimum: {
    sedan: number;
    suv: number;
    luxSuv: number;
    stretch8: number;
    stretch14: number;
    stretch22: number;
    bus30: number;
  };
  stopFees: {
    standard: number; // sedan/suv/lux-suv
    premium: number; // stretch/bus
  };
  depositPercent: number; // 0.10 = 10%
  bufferMinutes: number; // 30 / 60 / 120
};

export const DEFAULT_PRICING: PricingConfig = {
  perKm: {
    sedan: 2,
    suv: 2.5,
    luxSuv: 3.5,
    stretch8: 4,
    stretch14: 5,
    stretch22: 8,
    bus30: 15,
  },
  minimum: {
    sedan: 50,
    suv: 65,
    luxSuv: 90,
    stretch8: 150,
    stretch14: 250,
    stretch22: 500,
    bus30: 750,
  },
  stopFees: {
    standard: 15,
    premium: 30,
  },
  depositPercent: 0.1,
  bufferMinutes: 60,
};
