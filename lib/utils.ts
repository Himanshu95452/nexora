export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
