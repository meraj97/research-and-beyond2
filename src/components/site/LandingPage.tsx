import type { Metadata } from 'next';
import { getLandingData } from '@/lib/data';
import { getDict, homePath, type Lang } from '@/lib/i18n';
import LandingView from './LandingView';

/** Page title, description and the "this page also exists in …" links for search engines. */
export function landingMetadata(lang: Lang): Metadata {
  const t = getDict(lang).meta;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: homePath(lang),
      languages: { bn: homePath('bn'), en: homePath('en'), 'x-default': homePath('bn') },
    },
    openGraph: {
      title: 'Research and Beyond',
      description: t.ogDescription,
      type: 'website',
      url: homePath(lang),
      locale: lang === 'bn' ? 'bn_BD' : 'en_US',
      images: [{ url: '/brand/og.png', width: 1200, height: 630, alt: 'Research and Beyond' }],
    },
  };
}

/** Loads the content for one language from the database and renders the page. Used by / (Bangla) and /en (English). */
export default async function LandingPage({ lang }: { lang: Lang }) {
  const data = await getLandingData(lang);
  return <LandingView lang={lang} data={data} maxUploadMb={Number(process.env.MAX_UPLOAD_MB || 25)} />;
}
