import Link from 'next/link';
import { Card, EmptyState, PageTitle, StatusBadge } from '@/components/admin/ui';
import { query, queryOne } from '@/lib/db';
import { formatDateTime } from '@/lib/format';
import { BUDGET_RANGES, labelOf } from '@/lib/options';

type Counts = { total: number; pending: number; in_review: number; completed: number; last7: number };
type RecentRow = {
  id: number;
  ref_code: string;
  name: string;
  service_title: string;
  budget_range: string;
  status: string;
  created_at: Date;
};

export default async function DashboardPage() {
  const [counts, recent] = await Promise.all([
    queryOne<Counts>(`
      SELECT
        COUNT(*)::int                                                   AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::int                 AS pending,
        COUNT(*) FILTER (WHERE status = 'in_review')::int               AS in_review,
        COUNT(*) FILTER (WHERE status = 'completed')::int               AS completed,
        COUNT(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS last7
      FROM inquiries
    `),
    query<RecentRow>(
      `SELECT id, ref_code, name, service_title, budget_range, status, created_at
         FROM inquiries ORDER BY created_at DESC LIMIT 8`,
    ),
  ]);

  const tiles = [
    { label: 'Total requests', value: counts?.total ?? 0, href: '/admin/inquiries' },
    { label: 'Pending', value: counts?.pending ?? 0, href: '/admin/inquiries?status=pending' },
    { label: 'In review', value: counts?.in_review ?? 0, href: '/admin/inquiries?status=in_review' },
    { label: 'Completed', value: counts?.completed ?? 0, href: '/admin/inquiries?status=completed' },
    { label: 'Last 7 days', value: counts?.last7 ?? 0, href: '/admin/inquiries' },
  ];

  return (
    <>
      <PageTitle title="Dashboard" description="Project requests at a glance." />

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="rounded-xl border border-line bg-white p-5 transition-colors hover:border-signal">
            <span className="block font-display text-[2rem] font-semibold leading-none text-navy-900">{tile.value}</span>
            <span className="mt-2 block text-[0.9rem] text-muted">{tile.label}</span>
          </Link>
        ))}
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-[1.1rem] font-semibold text-navy-900">Latest requests</h2>
          <Link href="/admin/inquiries" className="text-[0.93rem] font-semibold text-signal hover:text-signal-600">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState title="No project requests yet" hint="New requests from the website form appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[0.93rem]">
              <thead className="bg-paper text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Budget</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recent.map((row) => (
                  <tr key={row.id} className="hover:bg-paper/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/inquiries/${row.id}`} className="font-semibold text-signal hover:text-signal-600">
                        {row.ref_code}
                      </Link>
                    </td>
                    <td className="px-5 py-3">{row.name}</td>
                    <td className="max-w-[16rem] truncate px-5 py-3">{row.service_title}</td>
                    <td className="px-5 py-3">{labelOf(BUDGET_RANGES, row.budget_range)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted">{formatDateTime(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
