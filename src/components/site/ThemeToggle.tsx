'use client';

import { IconMoon, IconSun } from '@/components/icons';

/**
 * Switches between the dark and light theme and remembers the choice on this device.
 * The first theme a visitor sees is decided in src/lib/boot-script.ts (THEME_DEFAULT).
 */
export default function ThemeToggle({ label, className = '' }: { label: string; className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains('dark');
    root.classList.add('theme-switching');
    root.classList.toggle('dark', dark);
    try {
      localStorage.setItem('rb-theme', dark ? 'dark' : 'light');
    } catch {
      // private browsing: the theme still changes, it just is not remembered
    }
    window.setTimeout(() => root.classList.remove('theme-switching'), 450);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`group flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-current/50 ${className}`}
    >
      {/* the icon shows the theme you will get */}
      <IconSun size={19} className="hidden transition-transform duration-500 group-hover:rotate-90 dark:block" />
      <IconMoon size={19} className="transition-transform duration-500 group-hover:-rotate-12 dark:hidden" />
    </button>
  );
}
