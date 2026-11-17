import Link from 'next/link';
import Logo from '@/components/site/Logo';
import type { Admin } from '@/lib/auth';
import NavLink from './NavLink';

const LINKS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/inquiries', label: 'Project requests' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/faqs', label: 'FAQs' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function Shell({
  admin,
  pendingCount,
  logout,
  children,
}: {
  admin: Admin;
  pendingCount: number;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <div className="theme-light min-h-screen bg-paper text-ink">
      <header className="bg-navy-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Link href="/admin" aria-label="Admin dashboard">
            <Logo onDark />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-white/65 hover:text-white">
              View website ↗
            </a>
            <span className="hidden text-white/45 sm:inline">{admin.email}</span>
            <form action={logout}>
              <button type="submit" className="rounded-full border border-white/25 px-4 py-1.5 text-white/85 hover:border-white hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Admin sections" className="border-t border-white/10">
          <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 sm:px-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} exact={link.exact}>
                  {link.label}
                  {link.href === '/admin/inquiries' && pendingCount > 0 && (
                    <span className="ml-2 rounded-full bg-signal px-2 py-0.5 text-xs font-semibold text-white">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
