import { localizeDigits } from '@/lib/format';
import { getDict, type Lang } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

export default function Process({ lang }: { lang: Lang }) {
  const t = getDict(lang).process;

  return (
    <section id="process" aria-labelledby="process-heading" className="dark-band">
      <div aria-hidden className="grid-lines" />
      <div aria-hidden className="aurora -bottom-48 -right-24 h-[24rem] w-[24rem] bg-brand-violet !opacity-40" />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading id="process-heading" onDark title={t.title} lead={t.lead} />

        <div data-reveal="none" className="relative mt-14">
          {/* line that draws itself through the four steps */}
          <span
            aria-hidden
            className="draw-line absolute left-0 right-0 top-[9px] hidden h-px bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-violet lg:block"
          />
          <ol className="relative grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, i) => (
            <li key={step.title} data-reveal style={{ '--d': `${i * 150}ms` } as React.CSSProperties} className="relative">
              <span aria-hidden className="relative block h-[19px] w-[19px] rounded-full border-2 border-brand-cyan bg-navy-950">
                <span className="absolute inset-[4px] rounded-full bg-brand-cyan" />
              </span>
              <span aria-hidden className="text-hero-gradient mt-6 block font-display text-[3.4rem] font-bold leading-none">
                {localizeDigits(`0${i + 1}`, lang)}
              </span>
              <h3 className="mt-4 font-display text-[1.12rem] font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-white/70">{step.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
