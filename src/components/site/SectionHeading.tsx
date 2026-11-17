/** Section title with the three "pages" strokes from the logo. Fades in when scrolled into view. */
export default function SectionHeading({
  title,
  lead,
  onDark = false,
  id,
  className = '',
}: {
  title: string;
  lead?: string;
  onDark?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <div data-reveal className={`max-w-2xl ${className}`}>
      <span aria-hidden className="fan">
        <i />
        <i />
        <i />
      </span>
      <h2 id={id} className={`mt-3 text-[1.75rem] font-bold sm:text-[2.2rem] ${onDark ? 'text-white' : 'text-heading'}`}>
        {title}
      </h2>
      {lead ? <p className={`mt-3 text-[1.05rem] ${onDark ? 'text-white/70' : 'text-muted'}`}>{lead}</p> : null}
    </div>
  );
}
