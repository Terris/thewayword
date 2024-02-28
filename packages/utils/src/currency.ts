export function convertAmountInputToCents(input: string): number {
  const value = parseFloat(input.replace(/[^0-9.]/g, ""));
  return Math.round(value * 100);
}

export function convertAmountInputToCentsString(input: string): string {
  const value = parseFloat(input.replace(/[^0-9.]/g, ""));
  return Math.round(value * 100).toString();
}

export function convertAmountInCentsToDollars(amount: number): string {
  return (amount / 100).toFixed(2);
}

export function displayDollarAmount(amount: number | string): string {
  return `$${amount}`;
}
