import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/admin/DeleteButton';
import { Card, Field, FormMessage, LangColumns, LangNote, PageTitle, SortActiveFields } from '@/components/admin/ui';
import { queryOne } from '@/lib/db';
import { SERVICE_ICONS } from '@/lib/options';
import type { Service } from '@/lib/types';
import { deleteService, saveService } from '../../../actions';

export default async function ServiceEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === 'new';
  const service = isNew ? null : await queryOne<Service>('SELECT * FROM services WHERE id = $1', [Number(id) || 0]);
  if (!isNew && !service) notFound();

  return (
    <>
      <p className="mb-3 text-[0.93rem]">
        <Link href="/admin/services" className="text-signal hover:underline">
          ← All services
        </Link>
      </p>
      <PageTitle title={isNew ? 'Add service' : 'Edit service'} />
      <FormMessage error={error} />

      <Card className="max-w-4xl p-6">
        <form action={saveService} className="space-y-5">
          {service && <input type="hidden" name="id" value={service.id} />}

          <Field label="Service name" name="title" required hint="Shown as written on both the Bangla and the English page.">
            <input id="title" name="title" required maxLength={150} defaultValue={service?.title ?? ''} className="field-input" />
          </Field>

          <LangNote />
          <LangColumns
            bn={
              <>
                <Field label="Short description" name="summary_bn">
                  <textarea id="summary_bn" name="summary_bn" lang="bn" rows={3} maxLength={500} defaultValue={service?.summary_bn ?? ''} className="field-input resize-y" />
                </Field>
                <Field label="Bullet points" name="features_bn" hint="One point per line, up to 10.">
                  <textarea id="features_bn" name="features_bn" lang="bn" rows={5} defaultValue={(service?.features_bn ?? []).join('\n')} className="field-input resize-y" />
                </Field>
              </>
            }
            en={
              <>
                <Field label="Short description" name="summary_en">
                  <textarea id="summary_en" name="summary_en" lang="en" rows={3} maxLength={500} defaultValue={service?.summary_en ?? ''} className="field-input resize-y" />
                </Field>
                <Field label="Bullet points" name="features_en" hint="One point per line, up to 10.">
                  <textarea id="features_en" name="features_en" lang="en" rows={5} defaultValue={(service?.features_en ?? []).join('\n')} className="field-input resize-y" />
                </Field>
              </>
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Starting price (BDT)"
              name="starting_price"
              hint='Numbers only, for example 5000. The site shows "৳৫,০০০ থেকে" / "From ৳5,000". Leave empty to show "priced per project".'
            >
              <input
                id="starting_price"
                name="starting_price"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={9}
                defaultValue={service?.starting_price ?? ''}
                className="field-input"
              />
            </Field>
            <Field label="Icon" name="icon">
              <select id="icon" name="icon" defaultValue={service?.icon ?? 'general'} className="field-input">
                {SERVICE_ICONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <SortActiveFields sortOrder={service?.sort_order ?? 0} isActive={service?.is_active ?? true} />

          <button type="submit" className="btn-primary">
            {isNew ? 'Add service' : 'Save changes'}
          </button>
        </form>
      </Card>

      {service && (
        <form action={deleteService} className="mt-6">
          <input type="hidden" name="id" value={service.id} />
          <DeleteButton
            label="Delete service"
            confirmText={`Delete "${service.title}"? Past requests keep the service name. To only hide it, untick "Show on the website" instead.`}
          />
        </form>
      )}
    </>
  );
}
