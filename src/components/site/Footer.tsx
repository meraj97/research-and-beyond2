import { IconChat, IconLink, IconMail, IconPhone, IconSend } from '@/components/icons';
import { telegramLink, whatsappLink } from '@/lib/format';
import { getDict, type Lang } from '@/lib/i18n';

export default function Footer({ lang, settings }: { lang: Lang; settings: Record<string, string> }) {
  const t = getDict(lang);
  const nav = [
    { href: '#services', label: t.nav.services },
    { href: '#process', label: t.nav.process },
    { href: '#about', label: t.nav.about },
    { href: '#faq', label: t.nav.faq },
    { href: '#inquiry', label: t.footer.sendRequirement },
  ];
  const socials = [
    { url: settings.facebook_url, label: 'Facebook' },
    { url: settings.linkedin_url, label: 'LinkedIn' },
    { url: settings.youtube_url, label: 'YouTube' },
  ].filter((s) => s.url?.trim());

  const contactLink = 'group flex items-center gap-2.5 text-white/70 transition-colors hover:text-white';
  const contactIcon = 'shrink-0 text-brand-cyan transition-transform duration-300 group-hover:scale-110';

  return (
    <footer className="bg-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_0.7fr_1fr]">
        <div data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-full.png" alt="Research and Beyond" width={140} height={120} className="h-[7.5rem] w-auto" loading="lazy" />
          <p className="mt-5 max-w-sm text-[0.96rem] text-white/65">{t.footer.blurb}</p>
        </div>

        <nav data-reveal style={{ '--d': '100ms' } as React.CSSProperties} aria-label={t.footer.navLabel}>
          <h2 className="font-display text-[1.05rem] font-semibold">{t.footer.sections}</h2>
          <ul className="mt-4 space-y-2.5 text-[0.96rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-block text-white/65 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div data-reveal style={{ '--d': '200ms' } as React.CSSProperties}>
          <h2 className="font-display text-[1.05rem] font-semibold">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-3 text-[0.96rem]">
            {settings.contact_email && (
              <li>
                <a href={`mailto:${settings.contact_email}`} className={contactLink}>
                  <IconMail size={18} className={contactIcon} />
                  {settings.contact_email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className={contactLink}>
                  <IconPhone size={18} className={contactIcon} />
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.whatsapp_number && (
              <li>
                <a href={whatsappLink(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <IconChat size={18} className={contactIcon} />
                  WhatsApp
                </a>
              </li>
            )}
            {settings.telegram_username && (
              <li>
                <a href={telegramLink(settings.telegram_username)} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <IconSend size={18} className={contactIcon} />
                  Telegram
                </a>
              </li>
            )}
          </ul>

          {socials.length > 0 && (
            <ul className="mt-5 flex gap-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/75 transition-[transform,border-color,color] duration-300 hover:-translate-y-1 hover:border-brand-orange hover:text-white"
                  >
                    <IconLink size={18} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-white/50 sm:px-6">
          © {new Date().getFullYear()} Research and Beyond. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
