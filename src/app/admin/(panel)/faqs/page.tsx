import Link from 'next/link';
import Flash from '@/components/admin/Flash';
import { ActiveBadge, Card, EmptyState, PageTitle } from '@/components/admin/ui';
import { query } from '@/lib/db';
import type { Faq } from '@/lib/types';

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const flash = await searchParams;
  const faqs = await query<Faq>('SELECT * FROM faqs ORDER BY sort_order, id');

  return (
    <>
      <PageTitle
        title="FAQs"
        description="Questions and answers shown above the request form."
        action={
          <Link href="/admin/faqs/new" className="btn-primary">
            Add question
          </Link>
        }
      />
      <Flash {...flash} />

      <Card className="overflow-hidden">
        {faqs.length === 0 ? (
          <EmptyState
            title="No questions yet"
            hint="The FAQ section stays hidden on the website until you add one."
            href="/admin/faqs/new"
            cta="Add question"
          />
        ) : (
          <ul className="divide-y divide-line">
            {faqs.map((faq) => (
              <li key={faq.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900">{faq.question_bn || faq.question_en}</p>
                  <p className="mt-0.5 truncate text-[0.9rem] text-muted">{faq.question_bn && faq.question_en ? faq.question_en : faq.answer_bn || faq.answer_en}</p>
                </div>
                <div className="flex items-center gap-4">
                  <ActiveBadge active={faq.is_active} />
                  <Link href={`/admin/faqs/${faq.id}`} className="font-semibold text-signal hover:text-signal-600">
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
