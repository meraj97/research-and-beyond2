import { IconCheck } from '@/components/icons';
import { getDict, type Lang } from '@/lib/i18n';
import type { LandingStat } from '@/lib/types';
import CountUp from './CountUp';
import SectionHeading from './SectionHeading';

export default function About({ lang, aboutText, stats }: { lang: Lang; aboutText: string; stats: LandingStat[] }) {
  const t = getDict(lang).about;

  return (
    <section id="about" aria-labelledby="about-heading" className="bg-bg">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <SectionHeading id="about-heading" title={t.title} />
          {aboutText && (
            <p data-reveal className="mt-6 max-w-xl whitespace-pre-line text-[1.06rem] text-ink">
              {aboutText}
            </p>
          )}

          <h3 data-reveal className="mt-9 font-display text-[1.12rem] font-semibold text-heading">
            {t.qualityTitle}
          </h3>
          <ul className="mt-4 space-y-3">
            {t.quality.map((point, i) => (
              <li key={point} data-reveal="left" style={{ '--d': `${i * 110}ms` } as React.CSSProperties} className="flex gap-3 text-[0.99rem]">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-navy-950">
                  <IconCheck size={13} strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {stats.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((stat, i) => (
              <li key={stat.label} data-reveal="right" style={{ '--d': `${i * 130}ms` } as React.CSSProperties}>
                <div className="lift card-shadow relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7">
                  <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-cyan via-brand-blue to-brand-violet" />
                  <p className="text-brand-gradient font-display text-[2.7rem] font-bold leading-none">
                    <CountUp value={stat.value} lang={lang} />
                  </p>
                  <p className="mt-2.5 text-[1.02rem] text-muted">{stat.label}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
