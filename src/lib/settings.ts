// Editable site settings (Admin → Settings). Values are stored in the `settings` table;
// anything not saved yet falls back to the default below.
// Keys ending in _bn / _en are the Bangla and English versions of the same text.

export type SettingField = {
  key: string;
  label: string;
  group: 'contact' | 'social' | 'about' | 'stats';
  defaultValue: string;
  help?: string;
  multiline?: boolean;
};

const SAMPLE_HELP = 'Sample number — replace with your real figure, or leave empty to hide. Type digits in English (150+); the Bangla page shows ১৫০+ automatically.';

export const SETTING_FIELDS: SettingField[] = [
  { key: 'contact_email', group: 'contact', label: 'Official email (shown on the site)', defaultValue: 'info@example.com' },
  { key: 'phone', group: 'contact', label: 'Phone number (shown on the site)', defaultValue: '+880 1XXX-XXXXXX' },
  {
    key: 'whatsapp_number',
    group: 'contact',
    label: 'WhatsApp number',
    defaultValue: '8801XXXXXXXXX',
    help: 'Country code + number, digits only. Example: 8801712345678',
  },
  {
    key: 'telegram_username',
    group: 'contact',
    label: 'Telegram username',
    defaultValue: 'researchandbeyond',
    help: 'Without the @ sign',
  },
  {
    key: 'response_time_bn',
    group: 'contact',
    label: 'Reply time promise — Bangla',
    defaultValue: '২৪ ঘণ্টার মধ্যে',
    help: 'Shown in the hero, next to the form and in the confirmation email.',
  },
  {
    key: 'response_time_en',
    group: 'contact',
    label: 'Reply time promise — English',
    defaultValue: 'within 24 hours',
    help: 'Used in sentences such as "We reply within 24 hours".',
  },
  { key: 'facebook_url', group: 'social', label: 'Facebook page URL', defaultValue: '' },
  { key: 'linkedin_url', group: 'social', label: 'LinkedIn URL', defaultValue: '' },
  { key: 'youtube_url', group: 'social', label: 'YouTube URL', defaultValue: '' },
  {
    key: 'about_text_bn',
    group: 'about',
    label: 'About us text — Bangla',
    multiline: true,
    defaultValue:
      'রিসার্চ অ্যান্ড বিয়ন্ড একদল গবেষক, স্ট্যাটিস্টিশিয়ান ও ডেটা সায়েন্টিস্টের টিম। একাডেমিক ও প্রফেশনাল প্রজেক্টে সঠিক মেথড বেছে নেওয়া, ডেটা থেকে নির্ভরযোগ্য ফলাফল বের করা এবং সেই ফলাফল সহজ ভাষায় উপস্থাপন করতে আমরা সাহায্য করি।',
  },
  {
    key: 'about_text_en',
    group: 'about',
    label: 'About us text — English',
    multiline: true,
    defaultValue:
      'Research and Beyond is a team of researchers, statisticians and data scientists. We help academic and professional projects choose the right method, get reliable results from data and present those results in plain language.',
  },
  { key: 'stat_1_value', group: 'stats', label: 'Stat 1 — number', defaultValue: '150+', help: SAMPLE_HELP },
  { key: 'stat_1_label_bn', group: 'stats', label: 'Stat 1 — label, Bangla', defaultValue: 'সম্পন্ন প্রজেক্ট' },
  { key: 'stat_1_label_en', group: 'stats', label: 'Stat 1 — label, English', defaultValue: 'Projects completed' },
  { key: 'stat_2_value', group: 'stats', label: 'Stat 2 — number', defaultValue: '5+', help: SAMPLE_HELP },
  { key: 'stat_2_label_bn', group: 'stats', label: 'Stat 2 — label, Bangla', defaultValue: 'বছরের অভিজ্ঞতা' },
  { key: 'stat_2_label_en', group: 'stats', label: 'Stat 2 — label, English', defaultValue: 'Years of experience' },
  { key: 'stat_3_value', group: 'stats', label: 'Stat 3 — number', defaultValue: '20+', help: SAMPLE_HELP },
  { key: 'stat_3_label_bn', group: 'stats', label: 'Stat 3 — label, Bangla', defaultValue: 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের ক্লায়েন্ট' },
  { key: 'stat_3_label_en', group: 'stats', label: 'Stat 3 — label, English', defaultValue: 'University and company clients' },
];

export const SETTING_GROUPS: { id: SettingField['group']; title: string }[] = [
  { id: 'contact', title: 'Contact details' },
  { id: 'social', title: 'Social media' },
  { id: 'about', title: 'About section' },
  { id: 'stats', title: 'Numbers in the About section' },
];

export type SiteSettings = Record<string, string>;

export function withDefaults(saved: Record<string, string>): SiteSettings {
  const result: SiteSettings = {};
  for (const field of SETTING_FIELDS) {
    result[field.key] = field.key in saved ? saved[field.key] : field.defaultValue;
  }
  return result;
}
