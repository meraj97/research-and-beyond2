import Link from 'next/link';
import Flash from '@/components/admin/Flash';
import { ActiveBadge, Card, EmptyState, PageTitle } from '@/components/admin/ui';
import { query } from '@/lib/db';
import type { Testimonial } from '@/lib/types';

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const flash = await searchParams;
  const testimonials = await query<Testimonial>('SELECT * FROM testimonials ORDER BY sort_order, id');

  return (
    <>
      <PageTitle
        title="Testimonials"
        description="Client reviews shown on the website. Only add reviews real clients gave you."
        action={
          <Link href="/admin/testimonials/new" className="btn-primary">
            Add testimonial
          </Link>
        }
      />
      <Flash {...flash} />

      <Card className="overflow-hidden">
        {testimonials.length === 0 ? (
          <EmptyState
            title="No testimonials yet"
            hint="The reviews section stays hidden on the website until you add one."
            href="/admin/testimonials/new"
            cta="Add testimonial"
          />
        ) : (
          <ul className="divide-y divide-line">
            {testimonials.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900">
                    {t.name} <span className="font-normal text-muted">· {t.rating}/5</span>
                  </p>
                  <p className="mt-0.5 truncate text-[0.9rem] text-muted">{t.content_bn || t.content_en}</p>
                </div>
                <div className="flex items-center gap-4">
                  <ActiveBadge active={t.is_active} />
                  <Link href={`/admin/testimonials/${t.id}`} className="font-semibold text-signal hover:text-signal-600">
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
