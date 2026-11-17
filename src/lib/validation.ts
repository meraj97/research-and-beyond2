import { z } from 'zod';
import { getDict, type Lang } from './i18n';
import { BUDGET_RANGES, CONTACT_METHODS, INQUIRY_STATUSES, SERVICE_ICONS } from './options';

const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];

// ---------- Public inquiry form (messages in the visitor's language) ----------
export function makeInquirySchema(lang: Lang) {
  const m = getDict(lang).validation;
  return z.object({
    name: z.string().trim().min(2, m.name).max(120, m.nameLong),
    email: z.string().trim().toLowerCase().email(m.email).max(200),
    phone: z
      .string()
      .trim()
      .min(6, m.phone)
      .max(30, m.phoneLong)
      .regex(/^[+\d\s()-]+$/, m.phoneChars),
    contact_method: z.enum(values(CONTACT_METHODS), { errorMap: () => ({ message: m.contactMethod }) }),
    service: z.string().trim().min(1, m.service), // service id or "other"
    budget_range: z.enum(values(BUDGET_RANGES), { errorMap: () => ({ message: m.budget }) }),
    deadline: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : null))
      .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), m.deadline),
    description: z.string().trim().min(20, m.descriptionShort).max(5000, m.descriptionLong),
  });
}

export type InquiryInput = z.infer<ReturnType<typeof makeInquirySchema>>;

// ---------- Admin: content ----------
const checkbox = z
  .union([z.literal('on'), z.literal('true'), z.literal(''), z.undefined(), z.null()])
  .transform((v) => v === 'on' || v === 'true');

const sortOrder = z.coerce.number().int().min(0).max(9999).default(0);

const text = (max: number) => z.string().trim().max(max).default('');

const lines = z
  .string()
  .default('')
  .transform((v) =>
    v
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 10),
  );

/** Empty input means "no price"; otherwise a whole number of taka. */
const optionalPrice = z
  .string()
  .trim()
  .default('')
  .refine((v) => v === '' || /^\d{1,9}$/.test(v), 'Starting price must be a whole number, without commas or symbols')
  .transform((v) => (v === '' ? null : Number(v)));

export const serviceSchema = z.object({
  title: z.string().trim().min(2, 'Service name is required').max(150),
  summary_bn: text(500),
  summary_en: text(500),
  features_bn: lines,
  features_en: lines,
  starting_price: optionalPrice,
  icon: z.enum(values(SERVICE_ICONS)).default('general'),
  sort_order: sortOrder,
  is_active: checkbox,
});

export const testimonialSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is required').max(120),
    role_bn: text(160),
    role_en: text(160),
    content_bn: text(1200),
    content_en: text(1200),
    rating: z.coerce.number().int().min(1).max(5).default(5),
    sort_order: sortOrder,
    is_active: checkbox,
  })
  .refine((d) => d.content_bn.length >= 10 || d.content_en.length >= 10, {
    message: 'Write the review in Bangla or English (at least 10 characters)',
    path: ['content_bn'],
  });

export const faqSchema = z
  .object({
    question_bn: text(300),
    question_en: text(300),
    answer_bn: text(2000),
    answer_en: text(2000),
    sort_order: sortOrder,
    is_active: checkbox,
  })
  .refine((d) => (d.question_bn.length >= 5 && d.answer_bn.length >= 5) || (d.question_en.length >= 5 && d.answer_en.length >= 5), {
    message: 'Write the question and its answer in at least one language',
    path: ['question_bn'],
  });

export const inquiryUpdateSchema = z.object({
  status: z.enum(values(INQUIRY_STATUSES)),
  admin_note: z.string().max(5000).default(''),
});

export const passwordChangeSchema = z
  .object({
    current_password: z.string().min(1, 'Enter your current password'),
    new_password: z.string().min(8, 'New password must be at least 8 characters').max(200),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'New passwords do not match',
    path: ['confirm_password'],
  });

/** Convert FormData into a plain object (first value per key). */
export function formToObject(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string' && !(key in out)) out[key] = value;
  }
  return out;
}

export function firstErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
