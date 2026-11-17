'use client';

import { useEffect, useRef, useState } from 'react';
import { IconChat, IconCheck, IconClose, IconFile, IconSend, IconShield, IconUpload } from '@/components/icons';
import { formatBytes, localizeDigits } from '@/lib/format';
import { getDict, type Lang } from '@/lib/i18n';
import { ALLOWED_EXTENSIONS, BUDGET_RANGES, CONTACT_METHODS, MAX_FILES } from '@/lib/options';
import type { LandingService } from '@/lib/types';

type Props = {
  lang: Lang;
  services: LandingService[];
  whatsappUrl: string;
  responseTime: string;
  maxUploadMb: number;
};

type Status = 'idle' | 'sending' | 'done';

export default function InquiryForm({ lang, services, whatsappUrl, responseTime, maxUploadMb }: Props) {
  const t = getDict(lang).inquiry;
  const formRef = useRef<HTMLFormElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const focusFirstError = useRef(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [refCode, setRefCode] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // "Request This Service" links pre-select the service in this form.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-service-id]');
      if (!link) return;
      const select = serviceRef.current;
      if (!select) return;
      select.value = link.dataset.serviceId ?? '';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      window.setTimeout(() => select.focus({ preventScroll: true }), 600);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // After the server returns field errors, move focus to the first field that needs fixing.
  useEffect(() => {
    if (!focusFirstError.current) return;
    focusFirstError.current = false;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    // Copy the files out now: the input is cleared right after this, which empties the browser's own list.
    const picked = Array.from(incoming);
    setFiles((current) => [...current, ...picked].slice(0, MAX_FILES));
    setErrors((e) => ({ ...e, files: '' }));
  };

  const removeFile = (index: number) => setFiles((current) => current.filter((_, i) => i !== index));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrors({});
    setMessage('');

    const data = new FormData(event.currentTarget);
    data.delete('files');
    files.forEach((file) => data.append('files', file));

    try {
      const response = await fetch(`/api/inquiries?lang=${lang}`, { method: 'POST', body: data });
      const result = (await response.json()) as {
        ok: boolean;
        ref?: string;
        message?: string;
        errors?: Record<string, string>;
      };
      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setMessage(result.message ?? t.errorGeneric);
        setStatus('idle');
        focusFirstError.current = true;
        return;
      }
      setRefCode(result.ref ?? '');
      setStatus('done');
      formRef.current?.reset();
      setFiles([]);
    } catch {
      setMessage(t.errorNetwork);
      setStatus('idle');
    }
  }

  const invalid = (field: string) => (errors[field] ? { 'aria-invalid': true as const, 'aria-describedby': `${field}-error` } : {});
  const required = <span className="text-danger">*</span>;

  return (
    <section id="inquiry" aria-labelledby="inquiry-heading" className="dark-band">
      <div aria-hidden className="grid-lines" />
      <div aria-hidden className="aurora -left-40 top-10 h-[26rem] w-[26rem] bg-brand-blue !opacity-45" />
      <div aria-hidden className="aurora -bottom-40 right-0 h-[22rem] w-[22rem] bg-brand-violet !opacity-40" style={{ animationDelay: '-8s' }} />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
        <div data-reveal="left" className="lg:pr-6">
          <span aria-hidden className="fan">
            <i />
            <i />
            <i />
          </span>
          <h2 id="inquiry-heading" className="mt-3 text-[1.75rem] font-bold sm:text-[2.2rem]">
            {t.title}
          </h2>
          <p className="mt-4 text-[1.05rem] text-white/75">{t.lead(responseTime)}</p>

          <ul className="mt-7 space-y-4 text-[0.96rem] text-white/75">
            <li className="flex gap-3">
              <IconShield size={20} className="mt-0.5 shrink-0 text-brand-cyan" />
              {t.pointFiles}
            </li>
            <li className="flex gap-3">
              <IconCheck size={20} className="mt-0.5 shrink-0 text-brand-cyan" />
              {t.pointRef}
            </li>
          </ul>

          {whatsappUrl && (
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur">
              <p className="text-[0.96rem] text-white/75">{t.whatsappPrompt}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light mt-3 w-full !py-2.5 sm:w-auto">
                <IconChat size={19} />
                {t.whatsappCta}
              </a>
            </div>
          )}
        </div>

        <div data-reveal="right" className="rounded-3xl border border-white/10 bg-surface p-6 text-ink shadow-[0_40px_90px_-50px_rgb(0_0_0/0.9)] sm:p-8">
          {status === 'done' ? (
            <div className="hero-pop py-8 text-center" role="status">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan via-brand-blue to-brand-violet text-white">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="check-draw" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h3 className="mt-5 font-display text-[1.35rem] font-semibold text-heading">{t.successTitle}</h3>
              <p className="mt-4 text-sm text-muted">{t.successRef}</p>
              <p className="mt-1 font-display text-[1.5rem] font-bold tracking-wide text-heading">{refCode}</p>
              <p className="mx-auto mt-4 max-w-sm text-muted">{t.successBody(responseTime)}</p>
              <button type="button" className="btn-outline mt-7" onClick={() => setStatus('idle')}>
                {t.again}
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="lang" value={lang} />

              {message && (
                <p role="alert" className="mb-5 rounded-lg bg-danger-soft px-4 py-3 text-[0.95rem] text-danger">
                  {message}
                </p>
              )}

              {/* honeypot — hidden from people, filled by bots */}
              <div className="absolute left-[-9999px]" aria-hidden>
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="field-label">
                    {t.name} {required}
                  </label>
                  <input id="name" name="name" type="text" required autoComplete="name" className="field-input" {...invalid('name')} />
                  {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="field-label">
                    {t.email} {required}
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" className="field-input" {...invalid('email')} />
                  {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="field-label">
                    {t.phone} {required}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+8801XXXXXXXXX"
                    className="field-input"
                    {...invalid('phone')}
                  />
                  {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="contact_method" className="field-label">
                    {t.contactMethod} {required}
                  </label>
                  <select id="contact_method" name="contact_method" required className="field-input" defaultValue="whatsapp" {...invalid('contact_method')}>
                    {CONTACT_METHODS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option[lang]}
                      </option>
                    ))}
                  </select>
                  {errors.contact_method && <p id="contact_method-error" className="field-error">{errors.contact_method}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="service" className="field-label">
                    {t.service} {required}
                  </label>
                  <select id="service" name="service" ref={serviceRef} required className="field-input" defaultValue="" {...invalid('service')}>
                    <option value="" disabled>
                      {t.servicePlaceholder}
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                    <option value="other">{t.serviceOther}</option>
                  </select>
                  {errors.service && <p id="service-error" className="field-error">{errors.service}</p>}
                </div>

                <div>
                  <label htmlFor="budget_range" className="field-label">
                    {t.budget} {required}
                  </label>
                  <select id="budget_range" name="budget_range" required className="field-input" defaultValue="" {...invalid('budget_range')}>
                    <option value="" disabled>
                      {t.budgetPlaceholder}
                    </option>
                    {BUDGET_RANGES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option[lang]}
                      </option>
                    ))}
                  </select>
                  {errors.budget_range && <p id="budget_range-error" className="field-error">{errors.budget_range}</p>}
                </div>

                <div>
                  <label htmlFor="deadline" className="field-label">
                    {t.deadline}
                  </label>
                  <input id="deadline" name="deadline" type="date" className="field-input" {...invalid('deadline')} />
                  {errors.deadline && <p id="deadline-error" className="field-error">{errors.deadline}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="field-label">
                    {t.description} {required}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    className="field-input resize-y"
                    placeholder={t.descriptionPlaceholder}
                    {...invalid('description')}
                  />
                  {errors.description && <p id="description-error" className="field-error">{errors.description}</p>}
                </div>

                <div className="sm:col-span-2">
                  <span className="field-label">{t.files}</span>
                  <label
                    htmlFor="files"
                    className="group flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line bg-surface-2 px-4 py-4 transition-colors hover:border-signal"
                  >
                    <IconUpload size={22} className="shrink-0 text-signal transition-transform duration-300 group-hover:-translate-y-0.5" />
                    <span className="text-[0.92rem] text-muted">
                      {t.filesHint(localizeDigits(MAX_FILES, lang), localizeDigits(maxUploadMb, lang))}
                    </span>
                  </label>
                  <input
                    id="files"
                    name="files"
                    type="file"
                    multiple
                    className="sr-only"
                    accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
                    onChange={(event) => {
                      addFiles(event.target.files);
                      event.target.value = '';
                    }}
                  />
                  {errors.files && <p className="field-error">{errors.files}</p>}

                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((file, index) => (
                        <li key={`${file.name}-${index}`} className="hero-rise flex items-center gap-3 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                          <IconFile size={17} className="shrink-0 text-muted" />
                          <span className="min-w-0 flex-1 truncate">{file.name}</span>
                          <span className="shrink-0 text-muted">{formatBytes(file.size)}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            aria-label={t.removeFile(file.name)}
                            className="shrink-0 rounded p-1 text-muted hover:bg-surface hover:text-danger"
                          >
                            <IconClose size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary mt-6 w-full" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <span aria-hidden className="spinner block h-[18px] w-[18px] rounded-full border-2 border-navy-950/30 border-t-navy-950" />
                ) : (
                  <IconSend size={19} />
                )}
                {status === 'sending' ? t.sending : t.submit}
              </button>
              <p className="mt-3 text-center text-sm text-muted">{t.note}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
