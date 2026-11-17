'use client';

import { useEffect } from 'react';

/**
 * Scroll animations for the whole page. Any element with a data-reveal attribute fades and slides in
 * the first time it scrolls into view (the CSS is in globals.css, section 4).
 *
 * Elements already on screen when the page loads are shown at once, and the "motion-ready" class is
 * added only after this code runs, so nothing is ever hidden if JavaScript fails to load.
 */
export default function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.setAttribute('data-revealed', ''));
      return;
    }

    const viewport = window.innerHeight;
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < viewport * 0.95) el.setAttribute('data-revealed', '');
    });
    root.classList.add('motion-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    items.forEach((el) => {
      if (!el.hasAttribute('data-revealed')) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      root.classList.remove('motion-ready');
    };
  }, []);

  return null;
}
