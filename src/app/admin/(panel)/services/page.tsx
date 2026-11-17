import Link from 'next/link';
import Flash from '@/components/admin/Flash';
import { ActiveBadge, Card, EmptyState, PageTitle } from '@/components/admin/ui';
import { query } from '@/lib/db';
import { formatPrice } from '@/lib/format';
import type { Service } from '@/lib/types';

function missingLanguage(s: Service): string {
  const bn = Boolean(s.summary_bn.trim());
  const en = Boolean(s.summary_en.trim());
  if (bn && en) return 'Bangla + English';
  if (bn) return 'Bangla only';
  if (en) return 'English only';
  return 'No description yet';
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const flash = await searchParams;
  const services = await query<Service>('SELECT * FROM services ORDER BY sort_order, id');

  return (
    <>
      <PageTitle
        title="Services"
        description="Service cards on the website and the choices in the request form."
        action={
          <Link href="/admin/services/new" className="btn-primary">
            Add service
          </Link>
        }
      />
      <Flash {...flash} />

      <Card className="overflow-hidden">
        {services.length === 0 ? (
          <EmptyState title="No services yet" hint="Add your first service to show it on the website." href="/admin/services/new" cta="Add service" />
        ) : (
          <ul className="divide-y divide-line">
            {services.map((service) => (
              <li key={service.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900">{service.title}</p>
                  <p className="mt-0.5 text-[0.9rem] text-muted">
                    Order {service.sort_order} · Price: {service.starting_price !== null ? `from ${formatPrice(service.starting_price, 'en')}` : 'per project'}
                    {' · '}
                    {missingLanguage(service)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <ActiveBadge active={service.is_active} />
                  <Link href={`/admin/services/${service.id}`} className="font-semibold text-signal hover:text-signal-600">
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
