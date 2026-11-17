import LandingPage, { landingMetadata } from '@/components/site/LandingPage';

// Bangla version of the website (the default). The English version is src/app/en/page.tsx.
// Content comes from the database, so the page is rendered on each request.
export const dynamic = 'force-dynamic';
export const metadata = landingMetadata('bn');

export default function HomePage() {
  return <LandingPage lang="bn" />;
}
