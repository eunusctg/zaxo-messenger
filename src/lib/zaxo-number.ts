// Zaxo Number Generation Utility
// Generates unique 9-digit numbers in format XXX-XXX-XXX

export function generateZaxoNumber(): string {
  const part1 = Math.floor(Math.random() * 900 + 100);
  const part2 = Math.floor(Math.random() * 900 + 100);
  const part3 = Math.floor(Math.random() * 900 + 100);
  return `${part1}-${part2}-${part3}`;
}

export function formatZaxoNumber(num: string): string {
  const digits = num.replace(/\D/g, '');
  if (digits.length !== 9) return num;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
}

export function isValidZaxoNumber(num: string): boolean {
  const digits = num.replace(/\D/g, '');
  return digits.length === 9;
}
