/**
 * Company logo: the R&B mark (public/brand/logo-mark.png) with the name beside it.
 * `onDark` = sits on a navy background (hero, footer, admin bar).
 */
export default function Logo({ onDark = false, stacked = false }: { onDark?: boolean; stacked?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-mark.png" alt="" width={50} height={40} className="h-10 w-auto shrink-0" />
      <span
        className={`font-display font-semibold leading-[1.15] ${
          onDark ? 'text-[#ff9a2e]' : 'text-[#d2640a] dark:text-[#ff9a2e]'
        } ${stacked ? 'text-[0.82rem] max-[374px]:hidden sm:text-[1.04rem]' : 'text-[1.04rem]'}`}
      >
        <span className={stacked ? 'block sm:inline' : undefined}>Research </span>
        <span className={stacked ? 'block sm:inline' : undefined}>and Beyond</span>
      </span>
    </span>
  );
}
