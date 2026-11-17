import type { MetadataRoute } from 'next';

// Tells search engines about both language versions of the page (served at /sitemap.xml).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const languages = { bn: `${base}/`, en: `${base}/en` };
  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1, alternates: { languages } },
    { url: `${base}/en`, changeFrequency: 'monthly', priority: 0.9, alternates: { languages } },
  ];
}
