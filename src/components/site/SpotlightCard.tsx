'use client';

/** A card with a soft light that follows the pointer (styles: ".spotlight" in globals.css). */
export default function SpotlightCard({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return (
    <article
      {...rest}
      className={`spotlight ${className}`}
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`);
        event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`);
      }}
    >
      {children}
    </article>
  );
}
