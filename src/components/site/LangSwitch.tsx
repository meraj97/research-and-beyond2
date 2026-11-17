'use client';

import { homePath, LANGS, type Lang } from '@/lib/i18n';

const SHORT: Record<Lang, string> = { bn: 'বাং', en: 'EN' };
const FULL: Record<Lang, string> = { bn: 'বাংলা', en: 'English' };

/** Bangla / English switch. Keeps the visitor at the same section of the page. */
export default function LangSwitch({ lang, label, className = '' }: { lang: Lang; label: string; className?: string }) {
  return (
    <div role="group" aria-label={label} className={`flex items-center rounded-full border border-current/20 p-0.5 text-[0.82rem] font-semibold ${className}`}>
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <a
            key={code}
            href={homePath(code)}
            hrefLang={code}
            lang={code}
            aria-current={active ? 'true' : undefined}
            title={FULL[code]}
            onClick={(event) => {
              if (active) {
                event.preventDefault();
                return;
              }
              // carry the current section (#services, #inquiry…) over to the other language
              event.currentTarget.href = homePath(code) + window.location.hash;
            }}
            className={`flex min-h-8 min-w-9 items-center justify-center rounded-full px-2.5 leading-none transition-colors ${
              active ? 'bg-brand-orange text-navy-950' : 'opacity-75 hover:opacity-100'
            }`}
          >
            <span aria-hidden>{SHORT[code]}</span>
            <span className="sr-only">{FULL[code]}</span>
          </a>
        );
      })}
    </div>
  );
}
