// Settlement math for the booking engine's final "Payment Settlement" step.
// Commission rate comes from the service's Category (see Category.commissionRate).

export interface Settlement {
  amount: number;
  commissionRate: number;
  platformCommission: number;
  professionalPayout: number;
}

export function calculateSettlement(amount: number, commissionRatePercent: number): Settlement {
  const platformCommission = Math.round((amount * commissionRatePercent) / 100);
  const professionalPayout = amount - platformCommission;
  return { amount, commissionRate: commissionRatePercent, platformCommission, professionalPayout };
}
