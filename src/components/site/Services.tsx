import { IconArrowRight, IconCheck, ServiceIcon } from '@/components/icons';
import { formatPrice } from '@/lib/format';
import { getDict, type Lang } from '@/lib/i18n';
import type { LandingService } from '@/lib/types';
import SectionHeading from './SectionHeading';
import SpotlightCard from './SpotlightCard';

export default function Services({ lang, services }: { lang: Lang; services: LandingService[] }) {
  const t = getDict(lang).services;

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeading id="services-heading" title={t.title} lead={t.lead} />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <div key={service.id} data-reveal style={{ '--d': `${(i % 2) * 120}ms` } as React.CSSProperties}>
            <SpotlightCard className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="icon-tile flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan via-brand-blue to-brand-violet text-white">
                  <ServiceIcon name={service.icon} size={26} />
                </span>
                <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm font-medium text-heading">
                  {service.price !== null ? t.priceFrom(formatPrice(service.price, lang)) : t.pricePerProject}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[1.2rem] font-semibold text-heading">{service.title}</h3>
              {service.summary && <p className="mt-2 text-[0.97rem] text-muted">{service.summary}</p>}

              {service.features.length > 0 && (
                <ul className="mt-5 space-y-2 text-[0.94rem] text-ink">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <span className="mt-[0.3rem] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal">
                        <IconCheck size={11} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-6">
                <a
                  href="#inquiry"
                  data-service-id={service.id}
                  className="group/link inline-flex items-center gap-2 font-semibold text-signal hover:text-signal-600"
                >
                  {t.request}
                  <IconArrowRight size={18} className="transition-transform duration-300 group-hover/link:translate-x-1.5" />
                </a>
              </div>
            </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
