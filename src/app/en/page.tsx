import LandingPage, { landingMetadata } from '@/components/site/LandingPage';

// English version of the website, at /en.
export const dynamic = 'force-dynamic';
export const metadata = landingMetadata('en');

export default function EnglishHomePage() {
  return <LandingPage lang="en" />;
}
