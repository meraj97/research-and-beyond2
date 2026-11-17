import { IconArrowRight, IconClock, IconShield, IconTeam } from '@/components/icons';
import { getDict, type Lang } from '@/lib/i18n';
import ShapFigure from './ShapFigure';
import Tilt from './Tilt';

const ASSURANCE_ICONS = [IconTeam, IconShield, IconClock];

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

export default function Hero({ lang, responseTime }: { lang: Lang; responseTime: string }) {
  const t = getDict(lang);

  return (
    <>
      <section id="top" className="dark-band">
        <div aria-hidden className="grid-lines" />
        <div aria-hidden className="aurora -left-40 -top-40 h-[30rem] w-[30rem] bg-brand-blue" />
        <div aria-hidden className="aurora -right-32 top-10 h-[26rem] w-[26rem] bg-brand-violet" style={{ animationDelay: '-6s' }} />
        <div aria-hidden className="aurora bottom-[-10rem] left-1/3 h-[18rem] w-[18rem] bg-brand-cyan !opacity-25" style={{ animationDelay: '-11s' }} />

        <div className="mx-auto grid max-w-6xl gap-14 px-4 pb-36 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-44 lg:pt-40">
          <div>
            {responseTime && (
              <p className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-white/85 backdrop-blur">
                <span className="ping relative block h-2 w-2 rounded-full bg-[#3ddc84] text-[#3ddc84]" />
                {t.hero.pill(responseTime)}
              </p>
            )}

            <h1 className="hero-rise mt-6 text-[2rem] font-bold [text-wrap:wrap] sm:text-[2.6rem] lg:text-[3rem]" style={delay(90)}>
              {t.hero.titleA}
              <span className="text-hero-gradient block pb-1">{t.hero.titleB}</span>
            </h1>

            <p className="hero-rise mt-5 max-w-xl text-lg text-white/75" style={delay(180)}>
              {t.hero.lead}
            </p>

            <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={delay(270)}>
              <a href="#inquiry" className="btn-primary">
                {t.hero.primaryCta}
                <IconArrowRight size={18} className="btn-arrow" />
              </a>
              <a href="#services" className="btn-ghost-light">
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>

          {/* live-looking analysis figure with floating result chips */}
          <figure className="hero-pop relative" style={delay(200)}>
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-cyan/25 via-brand-blue/20 to-brand-violet/30 blur-2xl" />
            <Tilt className="relative">
              <div className="rounded-[18px] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]">
                <ShapFigure label={t.hero.figureLabel} />
              </div>

              {/* chips sit on the card's empty corners so they never cover the chart */}
              <div aria-hidden className="float absolute -bottom-7 -left-3 hidden rounded-xl border border-white/15 bg-navy-900/90 px-3.5 py-2.5 backdrop-blur sm:block lg:-left-8">
                <span className="flex items-end gap-1" style={{ height: '1.6rem' }}>
                  {[45, 70, 55, 100].map((h, i) => (
                    <span key={i} className="block w-1.5 rounded-sm bg-gradient-to-t from-brand-blue to-brand-cyan" style={{ height: `${h}%` }} />
                  ))}
                </span>
                <span className="mt-1.5 block font-display text-xs font-semibold text-white/85">Regression</span>
              </div>

              <div
                aria-hidden
                className="float absolute -top-4 right-4 rounded-full border border-white/15 bg-navy-900/90 px-3.5 py-1.5 font-display text-xs font-semibold text-white/90 backdrop-blur lg:-right-5"
                style={delay(-2000)}
              >
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-orange align-middle" />
                SHAP values
              </div>

              <div
                aria-hidden
                className="float absolute -right-3 top-[40%] hidden rounded-xl border border-white/15 bg-navy-900/90 px-3.5 py-2 font-display text-sm font-semibold text-white backdrop-blur sm:block lg:-right-9"
                style={delay(-4000)}
              >
                p <span className="text-brand-cyan">&lt;</span> 0.05
              </div>
            </Tilt>
            <figcaption className="mt-10 text-sm text-white/60 sm:pl-28 lg:pl-24">{t.hero.figureCaption}</figcaption>
          </figure>
        </div>
      </section>

      {/* three promises, overlapping the bottom of the hero */}
      <div className="relative z-10 mx-auto -mt-24 max-w-6xl px-4 sm:px-6">
        <ul className="grid gap-5 md:grid-cols-3">
          {t.assurances.map((item, i) => {
            const Icon = ASSURANCE_ICONS[i];
            return (
              <li key={item.title} className="hero-rise" style={delay(450 + i * 110)}>
                <div className="lift card-shadow group h-full rounded-2xl border border-line bg-surface p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan via-brand-sky to-brand-blue text-white transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon size={24} />
                  </span>
                  <h2 className="mt-4 font-display text-[1.1rem] font-semibold text-heading">{item.title}</h2>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
