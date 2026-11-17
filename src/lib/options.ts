// Fixed choices used by the inquiry form and the admin panel.
import type { Lang } from './i18n';

type Option = { value: string; bn: string; en: string };

export const BUDGET_RANGES = [
  { value: 'under_5k', bn: '৳৫,০০০-এর কম', en: 'Under ৳5,000' },
  { value: '5k_15k', bn: '৳৫,০০০ – ৳১৫,০০০', en: '৳5,000 – ৳15,000' },
  { value: '15k_30k', bn: '৳১৫,০০০ – ৳৩০,০০০', en: '৳15,000 – ৳30,000' },
  { value: '30k_60k', bn: '৳৩০,০০০ – ৳৬০,০০০', en: '৳30,000 – ৳60,000' },
  { value: '60k_plus', bn: '৳৬০,০০০-এর বেশি', en: 'Over ৳60,000' },
  { value: 'not_sure', bn: 'এখনো নিশ্চিত নই', en: 'Not sure yet' },
] as const satisfies readonly Option[];

export const CONTACT_METHODS = [
  { value: 'whatsapp', bn: 'WhatsApp', en: 'WhatsApp' },
  { value: 'telegram', bn: 'Telegram', en: 'Telegram' },
  { value: 'email', bn: 'ইমেইল', en: 'Email' },
  { value: 'phone', bn: 'ফোন কল', en: 'Phone call' },
] as const satisfies readonly Option[];

export const INQUIRY_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
] as const;

export const SERVICE_ICONS = [
  { value: 'research', label: 'Research / document' },
  { value: 'analysis', label: 'Statistics / chart' },
  { value: 'ml', label: 'Machine learning / network' },
  { value: 'behavior', label: 'Behavior / people' },
  { value: 'general', label: 'General' },
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number]['value'];
export type ContactMethod = (typeof CONTACT_METHODS)[number]['value'];
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]['value'];
export type ServiceIcon = (typeof SERVICE_ICONS)[number]['value'];

/** Label of a budget range or contact method in the given language (English by default, for the admin panel). */
export function labelOf(list: readonly Option[], value: string | null | undefined, lang: Lang = 'en'): string {
  const option = list.find((o) => o.value === value);
  return option ? option[lang] : (value ?? '');
}

// Uploads
export const MAX_FILES = 5;
export const ALLOWED_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt',
  'xls', 'xlsx', 'csv', 'tsv', 'ods', 'json',
  'sav', 'dta', 'rds', 'rdata', 'sps',
  'py', 'ipynb', 'r', 'rmd',
  'ppt', 'pptx', 'png', 'jpg', 'jpeg',
  'zip', 'rar', '7z',
];
