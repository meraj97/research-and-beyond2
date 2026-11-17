'use client';

import { useState } from 'react';
import { IconChat, IconPlus } from '@/components/icons';
import { getDict, type Lang } from '@/lib/i18n';
import type { LandingFaq } from '@/lib/types';
import SectionHeading from './SectionHeading';

export default function Faq({ lang, faqs, whatsappUrl }: { lang: Lang; faqs: LandingFaq[]; whatsappUrl: string }) {
  const t = getDict(lang).faq;
  const [open, setOpen] = useState<number | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-bg">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <div>
          <SectionHeading id="faq-heading" title={t.title} lead={t.lead} />
          {whatsappUrl && (
            <div data-reveal style={{ '--d': '120ms' } as React.CSSProperties} className="mt-8 rounded-2xl border border-line bg-paper p-5">
              <p className="text-[0.97rem] text-ink">{t.more}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 !py-2.5">
                <IconChat size={19} />
                {t.moreCta}
              </a>
            </div>
          )}
        </div>

        <ul className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === faq.id;
            return (
              <li key={faq.id} data-reveal style={{ '--d': `${Math.min(i, 5) * 70}ms` } as React.CSSProperties}>
                <div
                  className={`rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300 ${
                    isOpen ? 'card-shadow border-signal/50' : 'border-line hover:border-signal/40'
                  }`}
                >
                  <h3 className="font-sans">
                    <button
                      type="button"
                      id={`faq-q-${faq.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${faq.id}`}
                      onClick={() => setOpen(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-[1.03rem] font-semibold text-heading"
                    >
                      {faq.question}
                      <span
                        aria-hidden
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-300 ${
                          isOpen ? 'rotate-45 bg-brand-orange text-navy-950' : 'bg-surface-2 text-heading'
                        }`}
                      >
                        <IconPlus size={18} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-q-${faq.id}`}
                    aria-hidden={!isOpen}
                    data-open={isOpen}
                    className="accordion-body"
                  >
                    <div>
                      <p className="whitespace-pre-line px-5 pb-5 pr-12 text-[0.98rem] text-muted">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
