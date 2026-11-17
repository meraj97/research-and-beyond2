// All fixed text of the public website, in Bangla and English.
// Content that changes often (services, testimonials, FAQs, contact details, About text)
// is edited in the admin panel instead — see src/lib/settings.ts and the database.

export const LANGS = ['bn', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'bn';

export const LANG_NAMES: Record<Lang, string> = { bn: 'বাংলা', en: 'English' };

export function isLang(value: unknown): value is Lang {
  return value === 'bn' || value === 'en';
}

/** URL of the home page in a language: Bangla lives at "/", English at "/en". */
export function homePath(lang: Lang): string {
  return lang === 'bn' ? '/' : '/en';
}

/** Returns the text in the wanted language, or the other language when that one is empty. */
export function pick(lang: Lang, bn: string | null | undefined, en: string | null | undefined): string {
  const first = (lang === 'bn' ? bn : en)?.trim();
  const second = (lang === 'bn' ? en : bn)?.trim();
  return first || second || '';
}

export function pickList(lang: Lang, bn: string[] | null | undefined, en: string[] | null | undefined): string[] {
  const first = (lang === 'bn' ? bn : en) ?? [];
  const second = (lang === 'bn' ? en : bn) ?? [];
  return first.length ? first : second;
}

const bn = {
  meta: {
    title: 'Research and Beyond — একাডেমিক রিসার্চ, ডেটা অ্যানালিসিস ও মেশিন লার্নিং',
    description:
      'গবেষক, শিক্ষার্থী ও প্রফেশনালদের জন্য রিসার্চ কনসালটেন্সি, স্ট্যাটিস্টিক্যাল ডেটা অ্যানালিসিস, মেশিন লার্নিং ও বিহেভিয়ারাল/মার্কেট রিসার্চ সলিউশন।',
    ogDescription: 'একাডেমিক রিসার্চ, ডেটা অ্যানালিসিস ও মেশিন লার্নিং সলিউশন এক ঠিকানায়।',
  },
  skipToForm: 'সরাসরি ফর্মে যান',
  nav: {
    services: 'সার্ভিস',
    process: 'যেভাবে কাজ হয়',
    about: 'আমাদের সম্পর্কে',
    reviews: 'মতামত',
    faq: 'সাধারণ প্রশ্ন',
    cta: 'Submit Project Requirement',
    ctaShort: 'রিকোয়ারমেন্ট পাঠান',
    home: 'Research and Beyond — শুরুতে ফিরে যান',
    main: 'প্রধান মেনু',
    mobile: 'মোবাইল মেনু',
    open: 'মেনু খুলুন',
    close: 'মেনু বন্ধ করুন',
  },
  switches: {
    language: 'ভাষা বদলান',
    theme: 'ডার্ক বা লাইট থিম বদলান',
  },
  hero: {
    pill: (responseTime: string) => `${responseTime} রিপ্লাই পাবেন`,
    titleA: 'একাডেমিক রিসার্চ, ডেটা অ্যানালিসিস এবং মেশিন লার্নিং সলিউশন',
    titleB: 'এখন এক ঠিকানায়',
    lead: 'গবেষক, শিক্ষার্থী এবং প্রফেশনালদের জন্য বিশ্বস্ত কনসালটেন্সি ও টেকনিক্যাল সলিউশন। রিকোয়ারমেন্ট পাঠান, কোটেশন ও টাইমলাইন বুঝে নিয়ে কাজ শুরু করুন।',
    primaryCta: 'Submit Project Requirement',
    secondaryCta: 'Explore Services',
    figureLabel: 'SHAP summary plot — কোন ফ্যাক্টর ফলাফলকে কতটা প্রভাবিত করে',
    figureCaption: 'Explainable AI: SHAP প্লটে দেখা যায়, কোন ফ্যাক্টর ফলাফলকে কতটা বাড়ায় বা কমায়।',
  },
  assurances: [
    {
      title: 'এক্সপার্ট টিম',
      text: 'গবেষক, স্ট্যাটিস্টিশিয়ান ও ডেটা সায়েন্টিস্ট — প্রতিটি প্রজেক্টে সঠিক মানুষটিই কাজ করেন।',
    },
    {
      title: 'শতভাগ ডেটা কনফিডেনশিয়ালিটি',
      text: 'আপনার ডেটা, ফাইল ও পরিচয় কোনো তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।',
    },
    {
      title: 'সময়মতো ডেলিভারি',
      text: 'কোটেশনের সাথে টাইমলাইন ঠিক হয়, আর সেই ডেডলাইন অনুযায়ীই ডেলিভারি হয়।',
    },
  ],
  services: {
    title: 'আমাদের সার্ভিস',
    lead: 'যে সার্ভিসটি দরকার সেটি বেছে নিন — ফর্মে সার্ভিসটি আগে থেকেই নির্বাচিত থাকবে।',
    request: 'Request This Service',
    priceFrom: (price: string) => `${price} থেকে`,
    pricePerProject: 'প্রজেক্ট অনুযায়ী মূল্য',
  },
  process: {
    title: 'যেভাবে কাজ হয়',
    lead: 'রিকোয়ারমেন্ট পাঠানো থেকে ডেলিভারি পর্যন্ত চারটি ধাপ।',
    steps: [
      {
        title: 'রিকোয়ারমেন্ট পাঠান',
        text: 'ফর্মে প্রজেক্টের ধরন, বাজেট, ডেডলাইন ও সংক্ষিপ্ত বিবরণ লিখুন। ডেটাসেট বা ডকুমেন্ট থাকলে যুক্ত করুন।',
      },
      {
        title: 'আলোচনা ও কোটেশন',
        text: 'আমরা রিকোয়ারমেন্ট রিভিউ করে যোগাযোগ করি এবং কাজের স্কোপ, মূল্য ও টাইমলাইন জানাই।',
      },
      {
        title: 'কাজ ও নিয়মিত আপডেট',
        text: 'সম্মতি পেলে কাজ শুরু হয়। প্রতিটি ধাপে অগ্রগতি জানানো হয়, যাতে আপনি সব সময় জানেন কাজ কোথায় আছে।',
      },
      {
        title: 'ডেলিভারি ও সংশোধন',
        text: 'ফলাফল ব্যাখ্যাসহ বুঝিয়ে দেওয়া হয় এবং স্কোপের মধ্যে প্রয়োজনীয় সংশোধন করা হয়।',
      },
    ],
  },
  about: {
    title: 'রিসার্চ অ্যান্ড বিয়ন্ড সম্পর্কে',
    qualityTitle: 'কোয়ালিটি অ্যাসিউরেন্স',
    quality: [
      'প্রতিটি অ্যানালিসিসের সাথে রিপ্রোডিউসিবল কোড ও ডকুমেন্টেশন',
      'ডেলিভারির আগে ফলাফল ক্রস-চেক ও রিভিউ',
      'সহজ ভাষায় ফলাফলের ব্যাখ্যাসহ রিপোর্ট',
    ],
  },
  reviews: {
    title: 'ক্লায়েন্ট ও গবেষকদের মতামত',
    prev: 'আগের রিভিউ',
    next: 'পরের রিভিউ',
    region: 'রিভিউ তালিকা — পাশে স্ক্রল করুন',
    rating: (n: string) => `রেটিং: ৫-এর মধ্যে ${n}`,
    goTo: (n: string) => `${n} নম্বর রিভিউ দেখুন`,
    pause: 'স্লাইড থামান',
    play: 'স্লাইড চালু করুন',
  },
  faq: {
    title: 'সাধারণ প্রশ্ন',
    lead: 'রিকোয়ারমেন্ট পাঠানোর আগে যে প্রশ্নগুলো সবচেয়ে বেশি আসে।',
    more: 'উত্তর পাননি? সরাসরি জিজ্ঞেস করুন।',
    moreCta: 'WhatsApp-এ প্রশ্ন করুন',
  },
  inquiry: {
    title: 'প্রজেক্ট রিকোয়ারমেন্ট পাঠান',
    lead: (responseTime: string) =>
      `ফর্মটি পূরণ করুন। আমাদের টিম ${responseTime} আপনার সাথে যোগাযোগ করে স্কোপ, মূল্য ও টাইমলাইন জানাবে। কোটেশন পাওয়ার আগে কোনো পেমেন্ট লাগবে না।`,
    pointFiles: 'আপলোড করা ফাইলের কোনো পাবলিক লিংক থাকে না — শুধু আমাদের টিম দেখতে পায়।',
    pointRef: 'রিকোয়ারমেন্ট পাঠানোর সাথে সাথেই আপনার ইমেইলে একটি রেফারেন্স নম্বর চলে যাবে।',
    whatsappPrompt: 'ফর্ম পূরণ করতে না চাইলে সরাসরি মেসেজ দিন।',
    whatsappCta: 'WhatsApp-এ কথা বলুন',
    name: 'আপনার নাম',
    email: 'ইমেইল',
    phone: 'ফোন / WhatsApp নম্বর',
    contactMethod: 'যোগাযোগের পছন্দের মাধ্যম',
    service: 'প্রজেক্টের ধরন',
    servicePlaceholder: 'সার্ভিস বেছে নিন',
    serviceOther: 'অন্য কিছু / নিশ্চিত নই',
    budget: 'আনুমানিক বাজেট',
    budgetPlaceholder: 'বাজেট রেঞ্জ বেছে নিন',
    deadline: 'কাঙ্ক্ষিত ডেডলাইন',
    description: 'প্রজেক্টের সংক্ষিপ্ত বিবরণ',
    descriptionPlaceholder: 'আপনার গবেষণার বিষয়, ডেটা কেমন, কী ধরনের সাহায্য দরকার — সংক্ষেপে লিখুন।',
    files: 'ডেটাসেট বা ডকুমেন্ট (ঐচ্ছিক)',
    filesHint: (maxFiles: string, maxMb: string) =>
      `ফাইল বেছে নিতে ক্লিক করুন — সর্বোচ্চ ${maxFiles}টি ফাইল, মোট ${maxMb} MB পর্যন্ত`,
    removeFile: (name: string) => `${name} বাদ দিন`,
    submit: 'Submit Project Requirement',
    sending: 'পাঠানো হচ্ছে…',
    note: 'রিকোয়ারমেন্ট পাঠালে কোনো পেমেন্ট বা চুক্তি হয় না — শুধু আলোচনা শুরু হয়।',
    successTitle: 'রিকোয়ারমেন্ট আমরা পেয়েছি',
    successBody: (responseTime: string) =>
      `নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে, আর আমাদের টিম ${responseTime} যোগাযোগ করবে।`,
    successRef: 'আপনার রেফারেন্স নম্বর',
    again: 'আরেকটি রিকোয়ারমেন্ট পাঠান',
    errorGeneric: 'রিকোয়ারমেন্ট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।',
    errorNetwork: 'ইন্টারনেট সংযোগে সমস্যা হচ্ছে। আবার চেষ্টা করুন অথবা WhatsApp-এ যোগাযোগ করুন।',
  },
  footer: {
    blurb: 'একাডেমিক রিসার্চ, ডেটা অ্যানালিসিস ও মেশিন লার্নিং সলিউশনে গবেষক ও প্রতিষ্ঠানের নির্ভরযোগ্য পার্টনার।',
    sections: 'পেজের অংশ',
    contact: 'যোগাযোগ',
    sendRequirement: 'রিকোয়ারমেন্ট পাঠান',
    rights: 'সর্বস্বত্ব সংরক্ষিত।',
    navLabel: 'ফুটার মেনু',
  },
  whatsapp: {
    fab: 'WhatsApp-এ মেসেজ দিন',
    prefill: 'আসসালামু আলাইকুম, আমি একটি প্রজেক্ট নিয়ে কথা বলতে চাই।',
  },
  validation: {
    name: 'আপনার নাম লিখুন',
    nameLong: 'নাম অনেক বড় হয়ে গেছে',
    email: 'সঠিক ইমেইল ঠিকানা লিখুন',
    phone: 'ফোন বা WhatsApp নম্বর লিখুন',
    phoneLong: 'নম্বরটি আবার দেখুন',
    phoneChars: 'নম্বরে শুধু সংখ্যা, +, - বা স্পেস ব্যবহার করুন',
    contactMethod: 'যোগাযোগের মাধ্যম বেছে নিন',
    service: 'সার্ভিস বেছে নিন',
    budget: 'আনুমানিক বাজেট বেছে নিন',
    deadline: 'সঠিক তারিখ দিন',
    descriptionShort: 'প্রজেক্ট সম্পর্কে অন্তত কয়েক লাইন লিখুন (২০ অক্ষরের বেশি)',
    descriptionLong: 'বিবরণ ৫০০০ অক্ষরের মধ্যে রাখুন',
  },
  api: {
    throttled: 'অল্প সময়ে অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
    unreadable: 'ফর্মটি পড়া যায়নি। আবার চেষ্টা করুন।',
    fixFields: 'ফর্মের কিছু তথ্য ঠিক করতে হবে।',
    saveFailed: 'রিকোয়ারমেন্ট জমা দেওয়া যায়নি। আবার চেষ্টা করুন অথবা WhatsApp-এ যোগাযোগ করুন।',
    tooManyFiles: (max: string) => `সর্বোচ্চ ${max}টি ফাইল যুক্ত করা যাবে`,
    tooBig: (mb: string) => `ফাইলগুলোর মোট সাইজ ${mb} MB-এর মধ্যে রাখুন`,
    badType: (name: string) => `"${name}" ফাইলের ধরন গ্রহণযোগ্য নয়`,
  },
  email: {
    subject: (ref: string) => `আপনার রিকোয়ারমেন্ট পেয়েছি — ${ref}`,
    greeting: (name: string) => `প্রিয় ${name},`,
    received: 'রিসার্চ অ্যান্ড বিয়ন্ডে আপনার প্রজেক্ট রিকোয়ারমেন্ট আমরা পেয়েছি। আপনার রেফারেন্স নম্বর:',
    next: (responseTime: string) =>
      `আমাদের টিম আপনার রিকোয়ারমেন্ট রিভিউ করে ${responseTime} আপনার সাথে যোগাযোগ করবে এবং স্কোপ, মূল্য ও টাইমলাইন জানাবে।`,
    service: 'সার্ভিস',
    budget: 'বাজেট',
    deadline: 'ডেডলাইন',
    reply: 'কিছু যোগ করতে চাইলে এই ইমেইলের রিপ্লাই দিন এবং রেফারেন্স নম্বরটি উল্লেখ করুন।',
    signoff: 'ধন্যবাদান্তে,',
    team: 'রিসার্চ অ্যান্ড বিয়ন্ড টিম',
  },
};

export type Dict = typeof bn;

const en: Dict = {
  meta: {
    title: 'Research and Beyond — Academic research, data analysis and machine learning',
    description:
      'Research consultancy, statistical data analysis, machine learning and behavioral/market research solutions for researchers, students and professionals.',
    ogDescription: 'Academic research, data analysis and machine learning solutions in one place.',
  },
  skipToForm: 'Skip to the form',
  nav: {
    services: 'Services',
    process: 'How it works',
    about: 'About us',
    reviews: 'Reviews',
    faq: 'FAQ',
    cta: 'Submit Project Requirement',
    ctaShort: 'Send requirement',
    home: 'Research and Beyond — back to top',
    main: 'Main menu',
    mobile: 'Mobile menu',
    open: 'Open menu',
    close: 'Close menu',
  },
  switches: {
    language: 'Change language',
    theme: 'Switch between dark and light theme',
  },
  hero: {
    pill: (responseTime: string) => `We reply ${responseTime}`,
    titleA: 'Academic research, data analysis and machine learning',
    titleB: 'all in one place',
    lead: 'Trusted consultancy and technical solutions for researchers, students and professionals. Send your requirement, agree the quotation and timeline, and get started.',
    primaryCta: 'Submit Project Requirement',
    secondaryCta: 'Explore Services',
    figureLabel: 'SHAP summary plot — how much each factor affects the result',
    figureCaption: 'Explainable AI: a SHAP plot shows how much each factor pushes the result up or down.',
  },
  assurances: [
    {
      title: 'Expert team',
      text: 'Researchers, statisticians and data scientists — the right person works on each project.',
    },
    {
      title: '100% data confidentiality',
      text: 'Your data, files and identity are never shared with a third party.',
    },
    {
      title: 'On-time delivery',
      text: 'The timeline is agreed with the quotation, and delivery follows that deadline.',
    },
  ],
  services: {
    title: 'Our services',
    lead: 'Choose the service you need — it will already be selected in the form.',
    request: 'Request This Service',
    priceFrom: (price: string) => `From ${price}`,
    pricePerProject: 'Priced per project',
  },
  process: {
    title: 'How it works',
    lead: 'Four steps from sending your requirement to delivery.',
    steps: [
      {
        title: 'Send your requirement',
        text: 'Tell us the project type, budget, deadline and a short description in the form. Attach a dataset or document if you have one.',
      },
      {
        title: 'Discussion and quotation',
        text: 'We review the requirement, get in touch and tell you the scope, price and timeline.',
      },
      {
        title: 'Work and regular updates',
        text: 'Work starts once you agree. You hear about progress at each stage, so you always know where things stand.',
      },
      {
        title: 'Delivery and revisions',
        text: 'We hand over the results with an explanation and make the necessary revisions within the scope.',
      },
    ],
  },
  about: {
    title: 'About Research and Beyond',
    qualityTitle: 'Quality assurance',
    quality: [
      'Reproducible code and documentation with every analysis',
      'Results cross-checked and reviewed before delivery',
      'Reports that explain the results in plain language',
    ],
  },
  reviews: {
    title: 'What clients and researchers say',
    prev: 'Previous review',
    next: 'Next review',
    region: 'Reviews — scroll sideways',
    rating: (n: string) => `Rating: ${n} out of 5`,
    goTo: (n: string) => `Show review ${n}`,
    pause: 'Pause slides',
    play: 'Play slides',
  },
  faq: {
    title: 'Frequently asked questions',
    lead: 'The questions we hear most before a requirement is sent.',
    more: 'Did not find your answer? Ask us directly.',
    moreCta: 'Ask on WhatsApp',
  },
  inquiry: {
    title: 'Send your project requirement',
    lead: (responseTime: string) =>
      `Fill in the form. Our team will contact you ${responseTime} with the scope, price and timeline. No payment is needed before you get a quotation.`,
    pointFiles: 'Uploaded files have no public link — only our team can see them.',
    pointRef: 'A reference number is emailed to you as soon as you send the requirement.',
    whatsappPrompt: 'Prefer not to fill in a form? Message us directly.',
    whatsappCta: 'Chat on WhatsApp',
    name: 'Your name',
    email: 'Email',
    phone: 'Phone / WhatsApp number',
    contactMethod: 'Preferred way to contact you',
    service: 'Project type',
    servicePlaceholder: 'Choose a service',
    serviceOther: 'Something else / not sure',
    budget: 'Estimated budget',
    budgetPlaceholder: 'Choose a budget range',
    deadline: 'Preferred deadline',
    description: 'Short description of the project',
    descriptionPlaceholder: 'Your research topic, what the data looks like and the kind of help you need — in brief.',
    files: 'Dataset or document (optional)',
    filesHint: (maxFiles: string, maxMb: string) => `Click to choose files — up to ${maxFiles} files, ${maxMb} MB in total`,
    removeFile: (name: string) => `Remove ${name}`,
    submit: 'Submit Project Requirement',
    sending: 'Sending…',
    note: 'Sending a requirement is not a payment or a contract — it only starts the conversation.',
    successTitle: 'We have received your requirement',
    successBody: (responseTime: string) =>
      `A confirmation email has been sent, and our team will contact you ${responseTime}.`,
    successRef: 'Your reference number',
    again: 'Send another requirement',
    errorGeneric: 'The requirement could not be sent. Try again.',
    errorNetwork: 'There is a problem with the internet connection. Try again or contact us on WhatsApp.',
  },
  footer: {
    blurb: 'A dependable partner for researchers and organizations in academic research, data analysis and machine learning.',
    sections: 'On this page',
    contact: 'Contact',
    sendRequirement: 'Send requirement',
    rights: 'All rights reserved.',
    navLabel: 'Footer menu',
  },
  whatsapp: {
    fab: 'Message us on WhatsApp',
    prefill: 'Hello, I would like to discuss a project.',
  },
  validation: {
    name: 'Enter your name',
    nameLong: 'The name is too long',
    email: 'Enter a valid email address',
    phone: 'Enter a phone or WhatsApp number',
    phoneLong: 'Check the number again',
    phoneChars: 'Use only digits, +, - or spaces in the number',
    contactMethod: 'Choose how we should contact you',
    service: 'Choose a service',
    budget: 'Choose an estimated budget',
    deadline: 'Enter a valid date',
    descriptionShort: 'Write at least a few lines about the project (more than 20 characters)',
    descriptionLong: 'Keep the description within 5000 characters',
  },
  api: {
    throttled: 'Too many attempts in a short time. Try again in a few minutes.',
    unreadable: 'The form could not be read. Try again.',
    fixFields: 'Some details in the form need fixing.',
    saveFailed: 'The requirement could not be sent. Try again or contact us on WhatsApp.',
    tooManyFiles: (max: string) => `You can attach up to ${max} files`,
    tooBig: (mb: string) => `Keep the total file size within ${mb} MB`,
    badType: (name: string) => `The file type of "${name}" is not accepted`,
  },
  email: {
    subject: (ref: string) => `We received your requirement — ${ref}`,
    greeting: (name: string) => `Dear ${name},`,
    received: 'We have received your project requirement at Research and Beyond. Your reference number:',
    next: (responseTime: string) =>
      `Our team will review your requirement and contact you ${responseTime} with the scope, price and timeline.`,
    service: 'Service',
    budget: 'Budget',
    deadline: 'Deadline',
    reply: 'To add anything, reply to this email and mention the reference number.',
    signoff: 'Regards,',
    team: 'The Research and Beyond team',
  },
};

const DICTS: Record<Lang, Dict> = { bn, en };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

/** Keywords in the moving strip under the hero. Tool and method names stay in English in both languages. */
export const MARQUEE_ITEMS = [
  'Thesis Consultancy',
  'SPSS',
  'Statistical Analysis',
  'Python',
  'Machine Learning',
  'Explainable AI',
  'Survey Research',
  'SHAP',
  'Market Research',
  'Manuscript Support',
];
