import nodemailer, { type Transporter } from 'nodemailer';
import { formatBytes, formatDate } from './format';
import { getDict, LANG_NAMES, type Lang } from './i18n';
import { BUDGET_RANGES, CONTACT_METHODS, labelOf } from './options';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

type MailInput = { to: string; subject: string; html: string; text: string; replyTo?: string };

export async function sendMail(mail: MailInput): Promise<void> {
  const t = getTransporter();
  if (!t) {
    // Development: no SMTP configured — print instead of sending.
    console.info(`\n[mail:dev] To: ${mail.to}\nSubject: ${mail.subject}\n${mail.text}\n`);
    return;
  }
  await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: mail.replyTo,
  });
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const shell = (body: string) => `<!doctype html><html><body style="margin:0;background:#eef1f8;padding:24px;font-family:'Hind Siliguri',Arial,sans-serif;color:#10193a">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dce2ef">
<div style="background:#0a1c55;color:#ffffff;padding:18px 24px;font-weight:700;font-size:18px">Research and Beyond</div>
<div style="padding:24px;line-height:1.7;font-size:15px">${body}</div></div></body></html>`;

type InquiryMailData = {
  ref_code: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
  service_title: string;
  budget_range: string;
  deadline: string | null;
  description: string;
  lang: Lang;
  files: { original_name: string; size_bytes: number }[];
};

export function adminNotificationEmail(inq: InquiryMailData, adminUrl: string) {
  const rows: [string, string][] = [
    ['Reference', inq.ref_code],
    ['Name', inq.name],
    ['Email', inq.email],
    ['Phone / WhatsApp', inq.phone],
    ['Preferred contact', labelOf(CONTACT_METHODS, inq.contact_method)],
    ['Service', inq.service_title],
    ['Budget', labelOf(BUDGET_RANGES, inq.budget_range)],
    ['Deadline', formatDate(inq.deadline)],
    ['Site language', LANG_NAMES[inq.lang]],
    ['Files', inq.files.length ? inq.files.map((f) => `${f.original_name} (${formatBytes(f.size_bytes)})`).join(', ') : 'None'],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#586282;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`,
    )
    .join('');
  const html = shell(`<p style="margin-top:0">A new project request has arrived.</p>
<table style="border-collapse:collapse;font-size:14px">${table}</table>
<p style="margin:16px 0 6px;color:#586282">Project description</p>
<div style="white-space:pre-wrap;background:#f3f5fa;border-radius:8px;padding:12px">${esc(inq.description)}</div>
<p style="margin-top:20px"><a href="${esc(adminUrl)}" style="background:#f58a14;color:#061238;font-weight:700;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block">Open in admin panel</a></p>`);
  const text = `New project request ${inq.ref_code}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${inq.description}\n\nOpen: ${adminUrl}`;
  return { subject: `New project request ${inq.ref_code} — ${inq.service_title}`, html, text };
}

/** Confirmation sent to the client, written in the language they used on the website. */
export function clientAutoReplyEmail(inq: InquiryMailData, responseTime: string) {
  const t = getDict(inq.lang).email;
  const budget = labelOf(BUDGET_RANGES, inq.budget_range, inq.lang);
  const html = shell(`<p style="margin-top:0">${esc(t.greeting(inq.name))}</p>
<p>${esc(t.received)} <strong>${esc(inq.ref_code)}</strong></p>
<p>${esc(t.next(responseTime))}</p>
<table style="border-collapse:collapse;font-size:14px;margin:12px 0">
<tr><td style="padding:4px 12px 4px 0;color:#586282">${esc(t.service)}</td><td>${esc(inq.service_title)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#586282">${esc(t.budget)}</td><td>${esc(budget)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#586282">${esc(t.deadline)}</td><td>${esc(formatDate(inq.deadline))}</td></tr>
</table>
<p>${esc(t.reply)}</p>
<p style="margin-bottom:0">${esc(t.signoff)}<br>${esc(t.team)}</p>`);
  const text = `${t.greeting(inq.name)}\n\n${t.received} ${inq.ref_code}\n${t.next(responseTime)}\n\n${t.signoff}\n${t.team}`;
  return { subject: t.subject(inq.ref_code), html, text };
}
