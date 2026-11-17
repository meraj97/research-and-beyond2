import Link from 'next/link';
import { Card, EmptyState, PageTitle, StatusBadge } from '@/components/admin/ui';
import { query, queryOne } from '@/lib/db';
import { formatDate, formatDateTime } from '@/lib/format';
import { BUDGET_RANGES, INQUIRY_STATUSES, labelOf } from '@/lib/options';

const PAGE_SIZE = 20;

type Row = {
  id: number;
  ref_code: string;
  name: string;
  email: string;
  service_title: string;
  budget_range: string;
  deadline: string | null;
  status: string;
  created_at: Date;
  file_count: number;
};

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = INQUIRY_STATUSES.some((s) => s.value === params.status) ? params.status! : '';
  const search = (params.q ?? '').trim();
  const page = Math.max(1, Number(params.page) || 1);

  const where: string[] = [];
  const values: unknown[] = [];
  if (status) {
    values.push(status);
    where.push(`status = $${values.length}`);
  }
  if (search) {
    values.push(`%${search}%`);
    where.push(
      `(ref_code ILIKE $${values.length} OR name ILIKE $${values.length} OR email ILIKE $${values.length} OR phone ILIKE $${values.length})`,
    );
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const totalRow = await queryOne<{ n: number }>(`SELECT COUNT(*)::int AS n FROM inquiries ${whereSql}`, values);
  const total = totalRow?.n ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pages);

  const rows = await query<Row>(
    `SELECT i.id, i.ref_code, i.name, i.email, i.service_title, i.budget_range, i.deadline, i.status, i.created_at,
            (SELECT COUNT(*)::int FROM inquiry_files f WHERE f.inquiry_id = i.id) AS file_count
       FROM inquiries i ${whereSql}
      ORDER BY i.created_at DESC
      LIMIT ${PAGE_SIZE} OFFSET ${(current - 1) * PAGE_SIZE}`,
    values,
  );

  const linkFor = (overrides: Record<string, string>) => {
    const next = new URLSearchParams();
    if (status) next.set('status', status);
    if (search) next.set('q', search);
    for (const [key, value] of Object.entries(overrides)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    return qs ? `/admin/inquiries?${qs}` : '/admin/inquiries';
  };

  return (
    <>
      <PageTitle title="Project requests" description={`${total} request${total === 1 ? '' : 's'} found.`} />

      <Card className="mb-5 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href={linkFor({ status: '', page: '' })}
              className={`rounded-full px-3.5 py-1.5 text-[0.9rem] font-medium ${!status ? 'bg-navy-900 text-white' : 'bg-paper text-muted hover:text-navy-900'}`}
            >
              All
            </Link>
            {INQUIRY_STATUSES.map((option) => (
              <Link
                key={option.value}
                href={linkFor({ status: option.value, page: '' })}
                className={`rounded-full px-3.5 py-1.5 text-[0.9rem] font-medium ${
                  status === option.value ? 'bg-navy-900 text-white' : 'bg-paper text-muted hover:text-navy-900'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <form action="/admin/inquiries" className="ml-auto flex gap-2">
            {status && <input type="hidden" name="status" value={status} />}
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search name, email or reference"
              aria-label="Search project requests"
              className="field-input !py-2 sm:w-72"
            />
            <button type="submit" className="btn-outline !px-5 !py-2">
              Search
            </button>
          </form>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState
            title="No requests match this view"
            hint={search || status ? 'Try clearing the filter or search.' : 'New requests from the website form appear here.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-[0.93rem]">
              <thead className="bg-paper text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Budget</th>
                  <th className="px-5 py-3 font-semibold">Deadline</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-paper/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/inquiries/${row.id}`} className="font-semibold text-signal hover:text-signal-600">
                        {row.ref_code}
                      </Link>
                      {row.file_count > 0 && (
                        <span className="ml-2 text-xs text-muted">
                          {row.file_count} file{row.file_count === 1 ? '' : 's'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="block font-medium text-navy-900">{row.name}</span>
                      <span className="block text-xs text-muted">{row.email}</span>
                    </td>
                    <td className="max-w-[15rem] truncate px-5 py-3">{row.service_title}</td>
                    <td className="whitespace-nowrap px-5 py-3">{labelOf(BUDGET_RANGES, row.budget_range)}</td>
                    <td className="whitespace-nowrap px-5 py-3">{formatDate(row.deadline)}</td>
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

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-5 flex items-center justify-between text-[0.93rem]">
          <span className="text-muted">
            Page {current} of {pages}
          </span>
          <div className="flex gap-2">
            {current > 1 && (
              <Link href={linkFor({ page: String(current - 1) })} className="btn-outline !px-4 !py-2">
                Previous
              </Link>
            )}
            {current < pages && (
              <Link href={linkFor({ page: String(current + 1) })} className="btn-outline !px-4 !py-2">
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
