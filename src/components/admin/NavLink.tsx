'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex items-center whitespace-nowrap border-b-2 px-3 py-3 text-[0.93rem] transition-colors ${
        active ? 'border-signal font-semibold text-white' : 'border-transparent text-white/60 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}
