import { whatsappLink } from '@/lib/format';
import { getDict, type Lang } from '@/lib/i18n';
import type { LandingData } from '@/lib/types';
import About from './About';
import Faq from './Faq';
import Footer from './Footer';
import Header from './Header';
import Hero from './Hero';
import InquiryForm from './InquiryForm';
import Marquee from './Marquee';
import MotionProvider from './MotionProvider';
import Process from './Process';
import Services from './Services';
import Testimonials from './Testimonials';
import WhatsappButton from './WhatsappButton';

/** The whole public page in one language, in reading order. To reorder or remove a section, edit the list inside <main>. */
export default function LandingView({ lang, data, maxUploadMb }: { lang: Lang; data: LandingData; maxUploadMb: number }) {
  const t = getDict(lang);
  const { services, testimonials, faqs, settings, aboutText, responseTime, stats } = data;
  const whatsappUrl = settings.whatsapp_number ? whatsappLink(settings.whatsapp_number, t.whatsapp.prefill) : '';

  return (
    <div lang={lang}>
      <a
        href="#inquiry"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-900"
      >
        {t.skipToForm}
      </a>
      <MotionProvider />
      <Header lang={lang} />
      <main className="page-clip">
        <Hero lang={lang} responseTime={responseTime} />
        <Marquee />
        <Services lang={lang} services={services} />
        <Process lang={lang} />
        <About lang={lang} aboutText={aboutText} stats={stats} />
        <Testimonials lang={lang} testimonials={testimonials} />
        <Faq lang={lang} faqs={faqs} whatsappUrl={whatsappUrl} />
        <InquiryForm lang={lang} services={services} whatsappUrl={whatsappUrl} responseTime={responseTime} maxUploadMb={maxUploadMb} />
      </main>
      <Footer lang={lang} settings={settings} />
      {whatsappUrl ? <WhatsappButton url={whatsappUrl} label={t.whatsapp.fab} /> : null}
    </div>
  );
}
