import { redirect } from 'next/navigation';
import Shell from '@/components/admin/Shell';
import { endSession, requireAdmin } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export const metadata = { title: 'Admin — Research and Beyond', robots: { index: false } };
export const dynamic = 'force-dynamic';

async function logout() {
  'use server';
  await endSession();
  redirect('/admin/login');
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const row = await queryOne<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM inquiries WHERE status = 'pending'`,
  );

  return (
    <Shell admin={admin} pendingCount={row?.n ?? 0} logout={logout}>
      {children}
    </Shell>
  );
}
