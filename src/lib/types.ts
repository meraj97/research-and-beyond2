import type { InquiryStatus } from './options';

// ---------- Database rows (both languages) ----------
export type Service = {
  id: number;
  title: string;
  summary_bn: string;
  summary_en: string;
  features_bn: string[];
  features_en: string[];
  starting_price: number | null; // in BDT; null = "priced per project"
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export type Testimonial = {
  id: number;
  name: string;
  role_bn: string;
  role_en: string;
  content_bn: string;
  content_en: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
};

export type Faq = {
  id: number;
  question_bn: string;
  question_en: string;
  answer_bn: string;
  answer_en: string;
  sort_order: number;
  is_active: boolean;
};

export type Inquiry = {
  id: number;
  ref_code: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
  service_id: number | null;
  service_title: string;
  budget_range: string;
  deadline: string | null;
  description: string;
  lang: string;
  status: InquiryStatus;
  admin_note: string;
  ip_address: string | null;
  created_at: Date;
  updated_at: Date;
};

export type InquiryFile = {
  id: number;
  inquiry_id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size_bytes: string | number;
  created_at: Date;
};

// ---------- What the public page receives (already in one language) ----------
export type LandingService = {
  id: number;
  title: string;
  summary: string;
  features: string[];
  price: number | null;
  icon: string;
};

export type LandingTestimonial = { id: number; name: string; role: string; content: string; rating: number };
export type LandingFaq = { id: number; question: string; answer: string };
export type LandingStat = { value: string; label: string };

export type LandingData = {
  services: LandingService[];
  testimonials: LandingTestimonial[];
  faqs: LandingFaq[];
  settings: Record<string, string>;
  aboutText: string;
  responseTime: string;
  stats: LandingStat[];
};
