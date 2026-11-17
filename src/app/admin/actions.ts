'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';
import { SETTING_FIELDS } from '@/lib/settings';
import { removeUploadFolder } from '@/lib/uploads';
import {
  faqSchema,
  firstErrors,
  formToObject,
  inquiryUpdateSchema,
  passwordChangeSchema,
  serviceSchema,
  testimonialSchema,
} from '@/lib/validation';

const errorParam = (errors: Record<string, string>) => encodeURIComponent(Object.values(errors)[0] ?? 'Check the form');
const idOf = (form: FormData) => Number(form.get('id')) || 0;

// ---------------- Project requests ----------------
export async function updateInquiry(form: FormData) {
  await requireAdmin();
  const id = idOf(form);
  const parsed = inquiryUpdateSchema.safeParse(formToObject(form));
  if (!parsed.success) redirect(`/admin/inquiries/${id}?error=${errorParam(firstErrors(parsed.error))}`);
  await query('UPDATE inquiries SET status = $1, admin_note = $2, updated_at = now() WHERE id = $3', [
    parsed.data.status,
    parsed.data.admin_note,
    id,
  ]);
  revalidatePath('/admin', 'layout');
  redirect(`/admin/inquiries/${id}?saved=1`);
}

export async function deleteInquiry(form: FormData) {
  await requireAdmin();
  const id = idOf(form);
  const files = await query<{ stored_name: string }>('SELECT stored_name FROM inquiry_files WHERE inquiry_id = $1', [id]);
  await query('DELETE FROM inquiries WHERE id = $1', [id]);
  // stored_name is "<yyyy-mm>/<uuid>/<file>" — remove the whole request folder
  const folders = new Set(files.map((f) => f.stored_name.split('/').slice(0, 2).join('/')));
  for (const folder of folders) await removeUploadFolder(folder).catch(() => {});
  revalidatePath('/admin', 'layout');
  redirect('/admin/inquiries?deleted=1');
}

// ---------------- Services ----------------
export async function saveService(form: FormData) {
  await requireAdmin();
  const id = idOf(form);
  const back = id ? `/admin/services/${id}` : '/admin/services/new';
  const parsed = serviceSchema.safeParse(formToObject(form));
  if (!parsed.success) redirect(`${back}?error=${errorParam(firstErrors(parsed.error))}`);
  const d = parsed.data;
  const values = [d.title, d.summary_bn, d.summary_en, d.features_bn, d.features_en, d.starting_price, d.icon, d.sort_order, d.is_active];
  if (id) {
    await query(
      `UPDATE services
          SET title=$1, summary_bn=$2, summary_en=$3, features_bn=$4, features_en=$5, starting_price=$6,
              icon=$7, sort_order=$8, is_active=$9, updated_at=now()
        WHERE id=$10`,
      [...values, id],
    );
  } else {
    await query(
      `INSERT INTO services (title, summary_bn, summary_en, features_bn, features_en, starting_price, icon, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      values,
    );
  }
  revalidatePath('/');
  revalidatePath('/en');
  redirect('/admin/services?saved=1');
}

export async function deleteService(form: FormData) {
  await requireAdmin();
  await query('DELETE FROM services WHERE id = $1', [idOf(form)]);
  revalidatePath('/');
  revalidatePath('/en');
  redirect('/admin/services?deleted=1');
}

// ---------------- Testimonials ----------------
export async function saveTestimonial(form: FormData) {
  await requireAdmin();
  const id = idOf(form);
  const back = id ? `/admin/testimonials/${id}` : '/admin/testimonials/new';
  const parsed = testimonialSchema.safeParse(formToObject(form));
  if (!parsed.success) redirect(`${back}?error=${errorParam(firstErrors(parsed.error))}`);
  const d = parsed.data;
  const values = [d.name, d.role_bn, d.role_en, d.content_bn, d.content_en, d.rating, d.sort_order, d.is_active];
  if (id) {
    await query(
      `UPDATE testimonials
          SET name=$1, role_bn=$2, role_en=$3, content_bn=$4, content_en=$5, rating=$6, sort_order=$7, is_active=$8, updated_at=now()
        WHERE id=$9`,
      [...values, id],
    );
  } else {
    await query(
      `INSERT INTO testimonials (name, role_bn, role_en, content_bn, content_en, rating, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      values,
    );
  }
  revalidatePath('/');
  revalidatePath('/en');
  redirect('/admin/testimonials?saved=1');
}

export async function deleteTestimonial(form: FormData) {
  await requireAdmin();
  await query('DELETE FROM testimonials WHERE id = $1', [idOf(form)]);
  revalidatePath('/');
  revalidatePath('/en');
  redirect('/admin/testimonials?deleted=1');
}

// ---------------- FAQs ----------------
export async function saveFaq(form: FormData) {
  await requireAdmin();
  const id = idOf(form);
  const back = id ? `/admin/faqs/${id}` : '/admin/faqs/new';
  const parsed = faqSchema.safeParse(formToObject(form));
  if (!parsed.success) redirect(`${back}?error=${errorParam(firstErrors(parsed.error))}`);
  const d = parsed.data;
  const values = [d.question_bn, d.question_en, d.answer_bn, d.answer_en, d.sort_order, d.is_active];
  if (id) {
    await query(
      `UPDATE faqs SET question_bn=$1, question_en=$2, answer_bn=$3, answer_en=$4, sort_order=$5, is_active=$6, updated_at=now()
        WHERE id=$7`,
      [...values, id],
    );
  } else {
    await query(
      `INSERT INTO faqs (question_bn, question_en, answer_bn, answer_en, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6)`,
      values,
    );
  }
  revalidatePath('/');
  revalidatePath('/en');
  redirect('/admin/faqs?saved=1');
}

export async function deleteFaq(form: FormData) {
  await requireAdmin();
  await query('DELETE FROM faqs WHERE id = $1', [idOf(form)]);
  revalidatePath('/');
  revalidatePath('/en');
  redirect('/admin/faqs?deleted=1');
}

// ---------------- Settings ----------------
export async function saveSettings(form: FormData) {
  await requireAdmin();
  for (const field of SETTING_FIELDS) {
    const value = String(form.get(field.key) ?? '').trim().slice(0, 3000);
    await query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [field.key, value],
    );
  }
  revalidatePath('/');
  revalidatePath('/en');
  redirect('/admin/settings?saved=1');
}

export async function changePassword(form: FormData) {
  const admin = await requireAdmin();
  const parsed = passwordChangeSchema.safeParse(formToObject(form));
  if (!parsed.success) redirect(`/admin/settings?pw_error=${errorParam(firstErrors(parsed.error))}#password`);
  const row = await queryOne<{ password_hash: string }>('SELECT password_hash FROM admins WHERE id = $1', [admin.id]);
  if (!row || !verifyPassword(parsed.data.current_password, row.password_hash)) {
    redirect(`/admin/settings?pw_error=${encodeURIComponent('Current password is incorrect')}#password`);
  }
  await query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hashPassword(parsed.data.new_password), admin.id]);
  redirect('/admin/settings?pw_saved=1#password');
}
