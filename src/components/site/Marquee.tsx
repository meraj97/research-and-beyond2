import { MARQUEE_ITEMS } from '@/lib/i18n';

/** A strip of the tools and methods the team works with, moving sideways. Pauses on hover. */
export default function Marquee() {
  return (
    <div className="marquee overflow-hidden py-12 sm:py-14">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-center">
            {MARQUEE_ITEMS.map((item, i) => (
              <li key={item} className="flex items-center">
                <span className={`whitespace-nowrap font-display text-[1.6rem] font-semibold sm:text-[2.1rem] ${i % 2 ? 'text-outline' : 'text-heading'}`}>
                  {item}
                </span>
                <span aria-hidden className="fan mx-7 sm:mx-10">
                  <i />
                  <i />
                  <i />
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
