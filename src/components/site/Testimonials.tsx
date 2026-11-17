'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay, IconQuote, IconStar } from '@/components/icons';
import { localizeDigits } from '@/lib/format';
import { getDict, type Lang } from '@/lib/i18n';
import type { LandingTestimonial } from '@/lib/types';
import SectionHeading from './SectionHeading';

const AUTO_MS = 5500;

/** Review slider: swipe or use the arrows; it also moves on its own and stops while you hover, focus or press pause. */
export default function Testimonials({ lang, testimonials }: { lang: Lang; testimonials: LandingTestimonial[] }) {
  const t = getDict(lang).reviews;
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(1);
  const [playing, setPlaying] = useState(true);
  const hold = useRef(false); // hovering or focused

  const step = () => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>('[data-card]');
    if (!el || !card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
  };

  const goTo = useCallback((target: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: target * step(), behavior: 'smooth' });
  }, []);

  // how many positions the slider has at this screen size, and which one is showing
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const size = step();
      if (!size) return;
      setPages(Math.max(1, Math.round((el.scrollWidth - el.clientWidth) / size) + 1));
      setIndex(Math.round(el.scrollLeft / size));
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [testimonials.length]);

  // move on its own
  useEffect(() => {
    if (!playing || pages < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (hold.current || document.hidden) return;
      const el = track.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step(), behavior: 'smooth' });
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [playing, pages]);

  if (testimonials.length === 0) return null;
  const many = pages > 1;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading id="reviews-heading" title={t.title} />
          {many && (
            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                aria-label={playing ? t.pause : t.play}
                title={playing ? t.pause : t.play}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading transition-colors hover:border-signal hover:text-signal"
              >
                {playing ? <IconPause size={18} /> : <IconPlay size={18} />}
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.max(0, index - 1))}
                aria-label={t.prev}
                disabled={index === 0}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
              >
                <IconArrowLeft />
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(pages - 1, index + 1))}
                aria-label={t.next}
                disabled={index >= pages - 1}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
              >
                <IconArrowRight />
              </button>
            </div>
          )}
        </div>

        <div data-reveal>
          <div
            ref={track}
            tabIndex={0}
            role="region"
            aria-label={t.region}
            onPointerEnter={() => (hold.current = true)}
            onPointerLeave={() => (hold.current = false)}
            onFocus={() => (hold.current = true)}
            onBlur={() => (hold.current = false)}
            className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 pt-2 sm:mx-0 sm:px-0"
          >
            {testimonials.map((item) => (
              <figure
                key={item.id}
                data-card
                className="lift relative flex w-[86%] shrink-0 snap-start flex-col rounded-2xl border border-line bg-surface p-6 sm:w-[calc(50%-0.75rem)] sm:p-7 lg:w-[calc(33.333%-1rem)]"
              >
                <IconQuote size={34} className="absolute right-6 top-6 text-signal/15" />
                <div className="flex gap-0.5 text-brand-amber" role="img" aria-label={t.rating(localizeDigits(item.rating, lang))}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <IconStar key={n} size={18} filled={n <= item.rating} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.99rem] text-ink">{item.content}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan via-brand-blue to-brand-violet font-display text-[1.05rem] font-semibold text-white"
                  >
                    {Array.from(item.name.trim())[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-heading">{item.name}</span>
                    {item.role && <span className="block truncate text-sm text-muted">{item.role}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {many && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t.goTo(localizeDigits(i + 1, lang))}
                aria-current={i === index ? 'true' : undefined}
                className="flex h-6 items-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-7 bg-brand-orange' : 'w-2 bg-line hover:bg-muted'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
