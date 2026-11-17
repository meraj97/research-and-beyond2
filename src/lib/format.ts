import type { Lang } from './i18n';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

export function fromBanglaDigits(input: string): string {
  return input.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

/** Shows digits in the reader's script: "150+" becomes "১৫০+" in Bangla and stays "150+" in English. */
export function localizeDigits(input: string | number, lang: Lang): string {
  return lang === 'bn' ? toBanglaDigits(input) : fromBanglaDigits(String(input));
}

/** Groups digits the Bangladeshi way: 5,000 · 15,000 · 1,50,000 */
export function groupDigits(n: number): string {
  const digits = String(Math.round(Math.abs(n)));
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${last3}`;
}

export function formatPrice(amount: number, lang: Lang): string {
  return `৳${localizeDigits(groupDigits(amount), lang)}`;
}

export function formatBytes(bytes: number | string): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDateTime(value: Date | string): string {
  const d = new Date(value);
  return d.toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(value: Date | string | null): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(`${value.slice(0, 10)}T00:00:00Z`) : value;
  return d.toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' });
}

export function whatsappLink(number: string, text?: string): string {
  const digits = number.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telegramLink(username: string): string {
  return `https://t.me/${username.replace(/^@/, '').trim()}`;
}

export function makeRefCode(id: number, date = new Date()): string {
  const yy = String(date.getUTCFullYear()).slice(2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `RB-${yy}${mm}-${String(id).padStart(4, '0')}`;
}

/** Splits "150+" (or "১৫০+") into the number to count up to and the text around it. */
export function parseStat(value: string): { prefix: string; number: number | null; suffix: string } {
  const ascii = fromBanglaDigits(value.trim());
  const match = ascii.match(/^([^\d]*)(\d[\d,]*)(.*)$/);
  if (!match) return { prefix: ascii, number: null, suffix: '' };
  return { prefix: match[1], number: Number(match[2].replace(/,/g, '')), suffix: match[3] };
}
