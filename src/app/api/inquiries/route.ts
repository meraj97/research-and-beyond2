import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { queryOne, transaction } from '@/lib/db';
import { getSettings, localizeSettings } from '@/lib/data';
import { makeRefCode } from '@/lib/format';
import { DEFAULT_LANG, getDict, isLang, type Lang } from '@/lib/i18n';
import { adminNotificationEmail, clientAutoReplyEmail, sendMail } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { withDefaults } from '@/lib/settings';
import { checkUploads, removeUploadFolder, saveUploads } from '@/lib/uploads';
import { firstErrors, formToObject, makeInquirySchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  // The form sends the page language; the same value also arrives as ?lang= so it is known before the body is read.
  const urlLang = new URL(request.url).searchParams.get('lang');
  let lang: Lang = isLang(urlLang) ? urlLang : DEFAULT_LANG;
  let t = getDict(lang).api;

  if (!rateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, message: t.throttled }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: t.unreadable }, { status: 400 });
  }
  const formLang = form.get('lang');
  if (isLang(formLang)) {
    lang = formLang;
    t = getDict(lang).api;
  }

  // Honeypot: real visitors never fill this hidden field.
  if (String(form.get('website') ?? '').trim() !== '') {
    return NextResponse.json({ ok: true, ref: 'RB-0000-0000' });
  }

  const parsed = makeInquirySchema(lang).safeParse(formToObject(form));
  const uploads = checkUploads(form.getAll('files'), lang);
  const errors = parsed.success ? {} : firstErrors(parsed.error);
  if (!uploads.ok) errors.files = uploads.error;
  if (!parsed.success || !uploads.ok) {
    return NextResponse.json({ ok: false, message: t.fixFields, errors }, { status: 400 });
  }
  const data = parsed.data;

  // Resolve the chosen service (or "other").
  let serviceId: number | null = null;
  let serviceTitle = 'Other / Not sure';
  if (data.service !== 'other') {
    const service = await queryOne<{ id: number; title: string }>(
      'SELECT id, title FROM services WHERE id = $1 AND is_active',
      [Number(data.service) || 0],
    );
    if (!service) {
      return NextResponse.json(
        { ok: false, message: t.fixFields, errors: { service: getDict(lang).validation.service } },
        { status: 400 },
      );
    }
    serviceId = service.id;
    serviceTitle = service.title;
  }

  const folder = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}`;
  let refCode: string;
  let inquiryId: number;
  let savedFiles: Awaited<ReturnType<typeof saveUploads>> = [];

  try {
    savedFiles = await saveUploads(folder, uploads.files);
    ({ id: inquiryId, ref: refCode } = await transaction(async (db) => {
      const { rows } = await db.query<{ id: number; created_at: Date }>(
        `INSERT INTO inquiries
           (name, email, phone, contact_method, service_id, service_title, budget_range, deadline, description, ip_address, lang)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, created_at`,
        [
          data.name,
          data.email,
          data.phone,
          data.contact_method,
          serviceId,
          serviceTitle,
          data.budget_range,
          data.deadline,
          data.description,
          ip,
          lang,
        ],
      );
      const { id, created_at } = rows[0];
      const ref = makeRefCode(id, new Date(created_at));
      await db.query('UPDATE inquiries SET ref_code = $1 WHERE id = $2', [ref, id]);
      for (const f of savedFiles) {
        await db.query(
          `INSERT INTO inquiry_files (inquiry_id, original_name, stored_name, mime_type, size_bytes)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, f.original_name, f.stored_name, f.mime_type, f.size_bytes],
        );
      }
      return { id, ref };
    }));
  } catch (err) {
    console.error('[inquiry] save failed', err);
    if (savedFiles.length) await removeUploadFolder(folder).catch(() => {});
    return NextResponse.json({ ok: false, message: t.saveFailed }, { status: 500 });
  }

  // Emails are sent after saving; a mail failure never loses the request.
  const settings = await getSettings().catch(() => withDefaults({}));
  const mailData = {
    ref_code: refCode,
    name: data.name,
    email: data.email,
    phone: data.phone,
    contact_method: data.contact_method,
    service_title: serviceTitle,
    budget_range: data.budget_range,
    deadline: data.deadline,
    description: data.description,
    lang,
    files: savedFiles.map((f) => ({ original_name: f.original_name, size_bytes: f.size_bytes })),
  };
  const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
  const notifyTo = process.env.NOTIFY_EMAIL || settings.contact_email;
  const adminMail = adminNotificationEmail(mailData, `${siteUrl}/admin/inquiries/${inquiryId}`);
  const clientMail = clientAutoReplyEmail(mailData, localizeSettings(settings, lang).responseTime);

  const results = await Promise.allSettled([
    notifyTo ? sendMail({ to: notifyTo, ...adminMail, replyTo: data.email }) : Promise.resolve(),
    sendMail({ to: data.email, ...clientMail, replyTo: notifyTo || undefined }),
  ]);
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[inquiry] email failed', r.reason);
  });

  return NextResponse.json({ ok: true, ref: refCode });
}
