// Starting content for the website, in Bangla and English.
// `npm run db:seed` inserts this only into EMPTY tables, so it never overwrites edits made in the admin panel.
// After launch, edit everything from the admin panel (/admin).

export const services = [
  {
    title: 'Academic Research & Thesis Consultancy',
    summary_bn: 'রিসার্চ পেপার, থিসিস/ব্ল্যাক বুক ও ম্যানুস্ক্রিপ্টের জন্য মেথডোলজি গাইডেন্স, রিভিউ ও এডিটিং সাপোর্ট।',
    summary_en: 'Methodology guidance, review and editing support for research papers, theses (black books) and manuscripts.',
    features_bn: [
      'রিসার্চ প্রপোজাল ও মেথডোলজি ডিজাইন',
      'লিটারেচার রিভিউ গাইডেন্স',
      'ম্যানুস্ক্রিপ্ট রিভিউ, এডিটিং ও ফরম্যাটিং',
      'জার্নাল সাবমিশন সাপোর্ট',
    ],
    features_en: [
      'Research proposal and methodology design',
      'Literature review guidance',
      'Manuscript review, editing and formatting',
      'Journal submission support',
    ],
    starting_price: null,
    icon: 'research',
  },
  {
    title: 'Quantitative & Statistical Data Analysis',
    summary_bn: 'সার্ভে ডেটা ক্লিনিং থেকে শুরু করে SPSS ও Python দিয়ে পূর্ণাঙ্গ স্ট্যাটিস্টিক্যাল অ্যানালিসিস এবং ফলাফলের ব্যাখ্যা।',
    summary_en: 'From cleaning survey data to full statistical analysis in SPSS and Python, with the results explained.',
    features_bn: [
      'ডেটা ক্লিনিং ও কোডিং',
      'ডেসক্রিপটিভ ও ইনফারেনশিয়াল টেস্ট',
      'রিগ্রেশন, ফ্যাক্টর অ্যানালিসিস ও SEM',
      'টেবিল, চার্ট ও রেজাল্ট ইন্টারপ্রিটেশন',
    ],
    features_en: [
      'Data cleaning and coding',
      'Descriptive and inferential tests',
      'Regression, factor analysis and SEM',
      'Tables, charts and interpretation of results',
    ],
    starting_price: null,
    icon: 'analysis',
  },
  {
    title: 'Machine Learning Model Development',
    summary_bn: 'প্রেডিক্টিভ মডেল, এআই/এমএল পাইপলাইন এবং SHAP দিয়ে ব্যাখ্যাযোগ্য (Explainable) এআই সলিউশন।',
    summary_en: 'Predictive models, AI/ML pipelines and explainable AI solutions with SHAP.',
    features_bn: [
      'ডেটা প্রিপ্রসেসিং ও ফিচার ইঞ্জিনিয়ারিং',
      'মডেল ট্রেনিং, টিউনিং ও ইভ্যালুয়েশন',
      'SHAP / Explainable AI রিপোর্ট',
      'রিপ্রোডিউসিবল কোড ও ডকুমেন্টেশন',
    ],
    features_en: [
      'Data preprocessing and feature engineering',
      'Model training, tuning and evaluation',
      'SHAP / explainable AI report',
      'Reproducible code and documentation',
    ],
    starting_price: null,
    icon: 'ml',
  },
  {
    title: 'Behavioral & Market Research',
    summary_bn: 'কোয়ান্টিটেটিভ স্টাডি ডিজাইন, প্রশ্নপত্র তৈরি ও ডেটা মডেলিংয়ের মাধ্যমে মানুষের আচরণ ও বাজার বোঝা।',
    summary_en: 'Understand people and markets through quantitative study design, questionnaires and data modeling.',
    features_bn: [
      'স্টাডি ও স্যাম্পলিং ডিজাইন',
      'প্রশ্নপত্র তৈরি ও ভ্যালিডেশন',
      'কনজিউমার বিহেভিয়ার অ্যানালিসিস',
      'সিদ্ধান্ত নেওয়ার উপযোগী রিপোর্ট',
    ],
    features_en: [
      'Study and sampling design',
      'Questionnaire design and validation',
      'Consumer behavior analysis',
      'Decision-ready reports',
    ],
    starting_price: null,
    icon: 'behavior',
  },
];

// SAMPLE reviews so the section is visible while you set up the site.
// Replace them with real client reviews (or delete them) in Admin → Testimonials before launch.
export const testimonials = [
  {
    name: 'নমুনা রিভিউ ১ / Sample review 1',
    role_bn: 'মাস্টার্স শিক্ষার্থী (নমুনা)',
    role_en: "Master's student (sample)",
    content_bn: 'এটি একটি নমুনা রিভিউ। অ্যাডমিন প্যানেল থেকে আপনার ক্লায়েন্টের আসল রিভিউ দিয়ে এটি বদলে দিন।',
    content_en: 'This is a sample review. Replace it with a real client review from the admin panel.',
    rating: 5,
  },
  {
    name: 'নমুনা রিভিউ ২ / Sample review 2',
    role_bn: 'পিএইচডি গবেষক (নমুনা)',
    role_en: 'PhD researcher (sample)',
    content_bn: 'এটি একটি নমুনা রিভিউ। ক্লায়েন্টের নাম, বিশ্ববিদ্যালয় বা পদবি এবং তাঁর মতামত এখানে দেখাবে।',
    content_en: "This is a sample review. The client's name, university or job title and their feedback appear here.",
    rating: 5,
  },
  {
    name: 'নমুনা রিভিউ ৩ / Sample review 3',
    role_bn: 'মার্কেটিং ম্যানেজার (নমুনা)',
    role_en: 'Marketing manager (sample)',
    content_bn: 'এটি একটি নমুনা রিভিউ। আসল রিভিউ যোগ করার পর নমুনাগুলো ডিলিট বা Hidden করে দিন।',
    content_en: 'This is a sample review. After adding real reviews, delete the samples or hide them.',
    rating: 4,
  },
  {
    name: 'নমুনা রিভিউ ৪ / Sample review 4',
    role_bn: 'রিসার্চ অ্যাসিস্ট্যান্ট (নমুনা)',
    role_en: 'Research assistant (sample)',
    content_bn: 'এটি একটি নমুনা রিভিউ। একটি রিভিউ শুধু এক ভাষায় লিখলে অন্য ভাষার পেজেও সেটিই দেখাবে।',
    content_en: 'This is a sample review. A review written in only one language is shown on both language pages.',
    rating: 5,
  },
];

export const faqs = [
  {
    question_bn: 'প্রজেক্টের খরচ কীভাবে নির্ধারণ করা হয়?',
    question_en: 'How is the project cost decided?',
    answer_bn:
      'কাজের পরিধি, জটিলতা ও ডেডলাইনের উপর ভিত্তি করে খরচ ঠিক হয়। রিকোয়ারমেন্ট পাওয়ার পর আমরা নির্দিষ্ট কোটেশন দিই। কোটেশন পাওয়ার আগে কোনো পেমেন্ট লাগে না।',
    answer_en:
      'The cost depends on the scope, complexity and deadline. After we receive your requirement, we send a specific quotation. No payment is needed before the quotation.',
  },
  {
    question_bn: 'আমার ডেটা ও ফাইল কি নিরাপদ থাকবে?',
    question_en: 'Will my data and files be safe?',
    answer_bn:
      'হ্যাঁ। আপলোড করা ফাইলের কোনো পাবলিক লিংক থাকে না, শুধু আমাদের টিম অ্যাডমিন প্যানেল থেকে দেখতে পারে। আপনার ডেটা বা পরিচয় কোনো তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।',
    answer_en:
      'Yes. Uploaded files have no public link; only our team can open them from the admin panel. We do not share your data or identity with any third party.',
  },
  {
    question_bn: 'আপনারা কি থিসিস লিখে দেন?',
    question_en: 'Do you write the thesis for me?',
    answer_bn:
      'আমরা মেথডোলজি গাইডেন্স, ডেটা অ্যানালিসিস, রিভিউ ও এডিটিং সাপোর্ট দিই। একাডেমিক নীতিমালা মেনে কাজ করা হয়, যাতে গবেষণাটি আপনারই থাকে এবং আপনি প্রতিটি অংশ ব্যাখ্যা করতে পারেন।',
    answer_en:
      'We provide methodology guidance, data analysis, review and editing support. We work within academic rules, so the research stays yours and you can explain every part of it.',
  },
  {
    question_bn: 'কাজ শেষ হতে কত দিন লাগে?',
    question_en: 'How long does a project take?',
    answer_bn:
      'ছোট অ্যানালিসিস সাধারণত কয়েক দিনে এবং বড় প্রজেক্ট কয়েক সপ্তাহে শেষ হয়। আপনার ডেডলাইন অনুযায়ী সঠিক টাইমলাইন কোটেশনের সাথে জানিয়ে দেওয়া হয়।',
    answer_en:
      'A small analysis usually takes a few days and a larger project a few weeks. The exact timeline for your deadline comes with the quotation.',
  },
  {
    question_bn: 'ডেলিভারির পর সংশোধন করা যাবে?',
    question_en: 'Can I ask for revisions after delivery?',
    answer_bn: 'হ্যাঁ। কোটেশনে উল্লেখিত স্কোপের মধ্যে প্রয়োজনীয় সংশোধন করে দেওয়া হয় এবং ফলাফল বুঝিয়ে দেওয়া হয়।',
    answer_en: 'Yes. We make the necessary revisions within the scope stated in the quotation and walk you through the results.',
  },
  {
    question_bn: 'পেমেন্ট কীভাবে করব?',
    question_en: 'How do I pay?',
    answer_bn: 'কোটেশনের সাথে পেমেন্টের মাধ্যম ও ধাপগুলো (যেমন অগ্রিম ও ডেলিভারির সময়ের পেমেন্ট) বিস্তারিত জানিয়ে দেওয়া হয়।',
    answer_en: 'The quotation explains the payment methods and stages, such as an advance and a payment on delivery.',
  },
];
