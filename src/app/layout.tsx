import type { Metadata, Viewport } from 'next';
import { Hind_Siliguri, Sora } from 'next/font/google';
import { bootScript } from '@/lib/boot-script';
import './globals.css';

const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
});

const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

// Page titles and descriptions are set per language in src/components/site/metadata.ts.
// The tab icon comes from src/app/icon.png and apple-icon.png (made from the logo).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Research and Beyond',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#050c26' },
    { media: '(prefers-color-scheme: dark)', color: '#050c26' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${hind.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        {/* sets the dark/light theme and the page language before the first paint — see src/lib/boot-script.ts */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
