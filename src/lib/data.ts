import { query } from './db';
import { pick, pickList, type Lang } from './i18n';
import { withDefaults, type SiteSettings } from './settings';
import type { Faq, LandingData, Service, Testimonial } from './types';

export async function getSettings(): Promise<SiteSettings> {
  const rows = await query<{ key: string; value: string }>('SELECT key, value FROM settings');
  return withDefaults(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

/** Picks the two-language settings (about text, reply time, stats) for one language. */
export function localizeSettings(settings: SiteSettings, lang: Lang) {
  const stats = [1, 2, 3]
    .map((n) => ({
      value: (settings[`stat_${n}_value`] ?? '').trim(),
      label: pick(lang, settings[`stat_${n}_label_bn`], settings[`stat_${n}_label_en`]),
    }))
    .filter((s) => s.value && s.label);
  return {
    aboutText: pick(lang, settings.about_text_bn, settings.about_text_en),
    responseTime: pick(lang, settings.response_time_bn, settings.response_time_en),
    stats,
  };
}

/** Everything the public page shows, in one language. Empty translations fall back to the other language. */
export async function getLandingData(lang: Lang): Promise<LandingData> {
  const [services, testimonials, faqs, settings] = await Promise.all([
    query<Service>(
      `SELECT id, title, summary_bn, summary_en, features_bn, features_en, starting_price, icon
         FROM services WHERE is_active ORDER BY sort_order, id`,
    ),
    query<Testimonial>(
      `SELECT id, name, role_bn, role_en, content_bn, content_en, rating
         FROM testimonials WHERE is_active ORDER BY sort_order, id`,
    ),
    query<Faq>(
      `SELECT id, question_bn, question_en, answer_bn, answer_en
         FROM faqs WHERE is_active ORDER BY sort_order, id`,
    ),
    getSettings(),
  ]);

  return {
    services: services.map((s) => ({
      id: s.id,
      title: s.title,
      summary: pick(lang, s.summary_bn, s.summary_en),
      features: pickList(lang, s.features_bn, s.features_en),
      price: s.starting_price,
      icon: s.icon,
    })),
    testimonials: testimonials
      .map((t) => ({
        id: t.id,
        name: t.name,
        role: pick(lang, t.role_bn, t.role_en),
        content: pick(lang, t.content_bn, t.content_en),
        rating: t.rating,
      }))
      .filter((t) => t.content),
    faqs: faqs
      .map((f) => {
        // Keep a question and its answer in the same language: use the wanted language only when both exist.
        const complete = (l: Lang) => Boolean(f[`question_${l}`]?.trim() && f[`answer_${l}`]?.trim());
        const other: Lang = lang === 'bn' ? 'en' : 'bn';
        const use = complete(lang) ? lang : other;
        return { id: f.id, question: f[`question_${use}`].trim(), answer: f[`answer_${use}`].trim() };
      })
      .filter((f) => f.question && f.answer),
    settings,
    ...localizeSettings(settings, lang),
  };
}
