export type DisplayCurrency = 'USD' | 'INR';
export const INR_PER_USD = 84;
export function toDisplayMinorUnits(usdCents: number, currency: DisplayCurrency): number {
  return currency === 'INR' ? Math.round(usdCents * INR_PER_USD) : usdCents;
}
export function formatMoney(usdCents: number, currency: DisplayCurrency): string {
  const amount = toDisplayMinorUnits(usdCents, currency) / 100;
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency', currency, minimumFractionDigits: currency === 'INR' ? 0 : 2,
    maximumFractionDigits: currency === 'INR' ? 0 : 2
  }).format(amount);
}
