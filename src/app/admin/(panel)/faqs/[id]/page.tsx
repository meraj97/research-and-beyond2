import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/admin/DeleteButton';
import { Card, Field, FormMessage, LangColumns, LangNote, PageTitle, SortActiveFields } from '@/components/admin/ui';
import { queryOne } from '@/lib/db';
import type { Faq } from '@/lib/types';
import { deleteFaq, saveFaq } from '../../../actions';

export default async function FaqEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === 'new';
  const item = isNew ? null : await queryOne<Faq>('SELECT * FROM faqs WHERE id = $1', [Number(id) || 0]);
  if (!isNew && !item) notFound();

  return (
    <>
      <p className="mb-3 text-[0.93rem]">
        <Link href="/admin/faqs" className="text-signal hover:underline">
          ← All questions
        </Link>
      </p>
      <PageTitle title={isNew ? 'Add question' : 'Edit question'} />
      <FormMessage error={error} />

      <Card className="max-w-4xl p-6">
        <form action={saveFaq} className="space-y-5">
          {item && <input type="hidden" name="id" value={item.id} />}

          <LangNote />
          <LangColumns
            bn={
              <>
                <Field label="Question" name="question_bn">
                  <input id="question_bn" name="question_bn" lang="bn" maxLength={300} defaultValue={item?.question_bn ?? ''} className="field-input" />
                </Field>
                <Field label="Answer" name="answer_bn">
                  <textarea id="answer_bn" name="answer_bn" lang="bn" rows={7} maxLength={2000} defaultValue={item?.answer_bn ?? ''} className="field-input resize-y" />
                </Field>
              </>
            }
            en={
              <>
                <Field label="Question" name="question_en">
                  <input id="question_en" name="question_en" lang="en" maxLength={300} defaultValue={item?.question_en ?? ''} className="field-input" />
                </Field>
                <Field label="Answer" name="answer_en">
                  <textarea id="answer_en" name="answer_en" lang="en" rows={7} maxLength={2000} defaultValue={item?.answer_en ?? ''} className="field-input resize-y" />
                </Field>
              </>
            }
          />

          <SortActiveFields sortOrder={item?.sort_order ?? 0} isActive={item?.is_active ?? true} />

          <button type="submit" className="btn-primary">
            {isNew ? 'Add question' : 'Save changes'}
          </button>
        </form>
      </Card>

      {item && (
        <form action={deleteFaq} className="mt-6">
          <input type="hidden" name="id" value={item.id} />
          <DeleteButton label="Delete question" confirmText="Delete this question?" />
        </form>
      )}
    </>
  );
}
