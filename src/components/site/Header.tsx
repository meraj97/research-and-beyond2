'use client';

import { useEffect, useRef, useState } from 'react';
import { IconClose, IconMenu } from '@/components/icons';
import { getDict, type Lang } from '@/lib/i18n';
import LangSwitch from './LangSwitch';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const SECTIONS = ['services', 'process', 'about', 'faq'] as const;

export default function Header({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const progress = useRef<HTMLSpanElement>(null);

  // solid bar after the first few pixels + reading-progress line
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // highlight the menu item of the section being read
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', ...SECTIONS, 'reviews', 'inquiry'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // the open mobile menu covers the page, so stop the page behind it from scrolling
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color,box-shadow] duration-300 ${
        open
          ? // no blur while the menu is open: a blurred bar would trap the full-screen menu inside itself
            'border-line bg-bg text-heading'
          : scrolled
            ? 'border-line bg-[var(--rb-header)] text-heading shadow-[0_8px_30px_-22px_rgb(0_0_0/0.6)] backdrop-blur-md'
            : 'border-transparent bg-transparent text-white'
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" aria-label={t.nav.home} className="shrink-0">
          <Logo onDark={!solid} stacked />
        </a>

        <nav aria-label={t.nav.main} className="hidden items-center gap-6 lg:flex">
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              className={`relative py-2 text-[0.95rem] transition-opacity after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-brand-orange after:transition-transform after:duration-300 hover:opacity-100 ${
                active === id ? 'opacity-100 after:scale-x-100' : 'opacity-75 after:scale-x-0 hover:after:scale-x-100'
              }`}
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} label={t.switches.language} />
          <ThemeToggle label={t.switches.theme} />
          <a href="#inquiry" className="btn-primary ml-1 hidden !px-5 !py-2.5 md:inline-flex">
            {t.nav.ctaShort}
          </a>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-current/20 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose size={21} /> : <IconMenu size={21} />}
          </button>
        </div>
      </div>

      {/* reading progress */}
      <span
        ref={progress}
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] block h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-orange"
      />

      {open && (
        <nav
          id="mobile-menu"
          aria-label={t.nav.mobile}
          className="fixed inset-x-0 bottom-0 top-[4.25rem] overflow-y-auto border-t border-line bg-bg px-4 pb-8 pt-2 text-heading lg:hidden"
        >
          {SECTIONS.map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              className="hero-rise block border-b border-line py-4 text-[1.05rem] font-medium"
              style={{ '--d': `${i * 50}ms` } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {t.nav[id]}
            </a>
          ))}
          <a
            href="#inquiry"
            className="btn-primary hero-rise mt-6 w-full"
            style={{ '--d': '220ms' } as React.CSSProperties}
            onClick={() => setOpen(false)}
          >
            {t.nav.cta}
          </a>
        </nav>
      )}
    </header>
  );
}
