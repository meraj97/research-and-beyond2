import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/admin/DeleteButton';
import { Card, FormMessage, PageTitle, StatusBadge } from '@/components/admin/ui';
import { query, queryOne } from '@/lib/db';
import { formatBytes, formatDate, formatDateTime, whatsappLink } from '@/lib/format';
import { isLang, LANG_NAMES } from '@/lib/i18n';
import { BUDGET_RANGES, CONTACT_METHODS, INQUIRY_STATUSES, labelOf } from '@/lib/options';
import type { Inquiry, InquiryFile } from '@/lib/types';
import { deleteInquiry, updateInquiry } from '../../../actions';

export default async function InquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const inquiryId = Number(id) || 0;

  const inquiry = await queryOne<Inquiry>('SELECT * FROM inquiries WHERE id = $1', [inquiryId]);
  if (!inquiry) notFound();
  const files = await query<InquiryFile>('SELECT * FROM inquiry_files WHERE inquiry_id = $1 ORDER BY id', [inquiryId]);

  const details: [string, React.ReactNode][] = [
    ['Name', inquiry.name],
    [
      'Email',
      <a key="e" href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Your project request ${inquiry.ref_code}`)}`} className="text-signal hover:underline">
        {inquiry.email}
      </a>,
    ],
    [
      'Phone / WhatsApp',
      <span key="p">
        {inquiry.phone}{' '}
        <a href={whatsappLink(inquiry.phone)} target="_blank" rel="noopener noreferrer" className="ml-2 text-signal hover:underline">
          Open WhatsApp ↗
        </a>
      </span>,
    ],
    ['Preferred contact', labelOf(CONTACT_METHODS, inquiry.contact_method)],
    ['Service', inquiry.service_title],
    ['Budget', labelOf(BUDGET_RANGES, inquiry.budget_range)],
    ['Deadline', formatDate(inquiry.deadline)],
    ['Site language', isLang(inquiry.lang) ? LANG_NAMES[inquiry.lang] : inquiry.lang],
    ['Received', formatDateTime(inquiry.created_at)],
  ];

  return (
    <>
      <p className="mb-3 text-[0.93rem]">
        <Link href="/admin/inquiries" className="text-signal hover:underline">
          ← All project requests
        </Link>
      </p>
      <PageTitle title={`Request ${inquiry.ref_code}`} action={<StatusBadge status={inquiry.status} />} />

      {saved && (
        <p role="status" className="mb-5 rounded-lg bg-[#e6f6ec] px-4 py-3 text-[0.95rem] text-[#1a7f45]">
          Changes saved.
        </p>
      )}
      <FormMessage error={error} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-[1.1rem] font-semibold text-navy-900">Client and project</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-[0.95rem] sm:grid-cols-[10rem_1fr]">
              {details.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-muted">{label}</dt>
                  <dd className="break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-[1.1rem] font-semibold text-navy-900">Project description</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-[0.97rem]">{inquiry.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-[1.1rem] font-semibold text-navy-900">Uploaded files</h2>
            {files.length === 0 ? (
              <p className="mt-3 text-[0.95rem] text-muted">The client did not attach any files.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {files.map((file) => (
                  <li key={file.id} className="flex items-center justify-between gap-4 py-2.5 text-[0.95rem]">
                    <span className="min-w-0 truncate">{file.original_name}</span>
                    <span className="flex shrink-0 items-center gap-4">
                      <span className="text-sm text-muted">{formatBytes(file.size_bytes)}</span>
                      <a href={`/api/admin/files/${file.id}`} className="font-semibold text-signal hover:underline">
                        Download
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-[1.1rem] font-semibold text-navy-900">Status and notes</h2>
            <form action={updateInquiry} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={inquiry.id} />
              <div>
                <label htmlFor="status" className="field-label">
                  Status
                </label>
                <select id="status" name="status" defaultValue={inquiry.status} className="field-input">
                  {INQUIRY_STATUSES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="admin_note" className="field-label">
                  Internal note
                </label>
                <textarea
                  id="admin_note"
                  name="admin_note"
                  rows={6}
                  defaultValue={inquiry.admin_note}
                  placeholder="Quoted price, agreed timeline, follow-up reminders…"
                  className="field-input resize-y"
                />
                <p className="mt-1 text-sm text-muted">Only admins see this note.</p>
              </div>
              <button type="submit" className="btn-primary w-full">
                Save changes
              </button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-[1.1rem] font-semibold text-navy-900">Delete request</h2>
            <p className="mt-2 text-[0.93rem] text-muted">
              Removes this request and its uploaded files permanently. Use this when a client asks for their data to be deleted.
            </p>
            <form action={deleteInquiry} className="mt-4">
              <input type="hidden" name="id" value={inquiry.id} />
              <DeleteButton label="Delete request" confirmText={`Delete request ${inquiry.ref_code} and its files? This cannot be undone.`} />
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
