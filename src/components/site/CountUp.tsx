'use client';

import { useEffect, useRef } from 'react';
import { groupDigits, localizeDigits, parseStat } from '@/lib/format';
import type { Lang } from '@/lib/i18n';

/** Shows a figure such as "150+" and counts up to it the first time it scrolls into view. */
export default function CountUp({ value, lang }: { value: string; lang: Lang }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { prefix, number, suffix } = parseStat(value);
  const text = (n: number) => localizeDigits(`${prefix}${groupDigits(n)}${suffix}`, lang);
  const finalText = number === null ? localizeDigits(value, lang) : text(number);

  useEffect(() => {
    const el = ref.current;
    if (!el || number === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = text(Math.round(number * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    // start from zero only while the figure is still below the screen, so nothing visibly jumps
    if (el.getBoundingClientRect().top > window.innerHeight) el.textContent = text(0);
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = finalText;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, lang]);

  return (
    <span ref={ref} className="tabular-nums">
      {finalText}
    </span>
  );
}
