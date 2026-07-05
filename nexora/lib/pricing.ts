// Server-side price calculation for the booking engine's "Price Calculation"
// step. All amounts are in paise (₹1 = 100 paise) to avoid float rounding.

export const VISIT_FEE = 4900; // ₹49
export const EMERGENCY_SURCHARGE_MULTIPLIER = 1.5;

export interface PriceBreakdown {
  basePrice: number;
  visitFee: number;
  emergencySurcharge: number;
  total: number;
}

export function calculatePrice(basePrice: number, emergency = false): PriceBreakdown {
  const emergencySurcharge = emergency ? Math.round(basePrice * (EMERGENCY_SURCHARGE_MULTIPLIER - 1)) : 0;
  const total = basePrice + VISIT_FEE + emergencySurcharge;
  return { basePrice, visitFee: VISIT_FEE, emergencySurcharge, total };
}
