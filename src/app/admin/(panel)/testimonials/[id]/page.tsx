import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/admin/DeleteButton';
import { Card, Field, FormMessage, LangColumns, LangNote, PageTitle, SortActiveFields } from '@/components/admin/ui';
import { queryOne } from '@/lib/db';
import type { Testimonial } from '@/lib/types';
import { deleteTestimonial, saveTestimonial } from '../../../actions';

export default async function TestimonialEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === 'new';
  const item = isNew ? null : await queryOne<Testimonial>('SELECT * FROM testimonials WHERE id = $1', [Number(id) || 0]);
  if (!isNew && !item) notFound();

  return (
    <>
      <p className="mb-3 text-[0.93rem]">
        <Link href="/admin/testimonials" className="text-signal hover:underline">
          ← All testimonials
        </Link>
      </p>
      <PageTitle title={isNew ? 'Add testimonial' : 'Edit testimonial'} />
      <FormMessage error={error} />

      <Card className="max-w-4xl p-6">
        <form action={saveTestimonial} className="space-y-5">
          {item && <input type="hidden" name="id" value={item.id} />}

          <Field label="Client name" name="name" required>
            <input id="name" name="name" required maxLength={120} defaultValue={item?.name ?? ''} className="field-input sm:max-w-md" />
          </Field>

          <LangNote />
          <LangColumns
            bn={
              <>
                <Field label="University or designation" name="role_bn" hint="Example: পিএইচডি গবেষক, ঢাকা বিশ্ববিদ্যালয়">
                  <input id="role_bn" name="role_bn" lang="bn" maxLength={160} defaultValue={item?.role_bn ?? ''} className="field-input" />
                </Field>
                <Field label="Review" name="content_bn">
                  <textarea id="content_bn" name="content_bn" lang="bn" rows={6} maxLength={1200} defaultValue={item?.content_bn ?? ''} className="field-input resize-y" />
                </Field>
              </>
            }
            en={
              <>
                <Field label="University or designation" name="role_en" hint="Example: PhD researcher, University of Dhaka">
                  <input id="role_en" name="role_en" lang="en" maxLength={160} defaultValue={item?.role_en ?? ''} className="field-input" />
                </Field>
                <Field label="Review" name="content_en">
                  <textarea id="content_en" name="content_en" lang="en" rows={6} maxLength={1200} defaultValue={item?.content_en ?? ''} className="field-input resize-y" />
                </Field>
              </>
            }
          />

          <Field label="Rating" name="rating">
            <select id="rating" name="rating" defaultValue={String(item?.rating ?? 5)} className="field-input sm:w-40">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? '' : 's'}
                </option>
              ))}
            </select>
          </Field>

          <SortActiveFields sortOrder={item?.sort_order ?? 0} isActive={item?.is_active ?? true} />

          <button type="submit" className="btn-primary">
            {isNew ? 'Add testimonial' : 'Save changes'}
          </button>
        </form>
      </Card>

      {item && (
        <form action={deleteTestimonial} className="mt-6">
          <input type="hidden" name="id" value={item.id} />
          <DeleteButton label="Delete testimonial" confirmText={`Delete the review from "${item.name}"?`} />
        </form>
      )}
    </>
  );
}
