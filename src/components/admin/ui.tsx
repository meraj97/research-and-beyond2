import Link from 'next/link';
import type { InquiryStatus } from '@/lib/options';

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-[1.5rem] font-semibold text-navy-900">{title}</h1>
        {description && <p className="mt-1 text-[0.95rem] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-white ${className}`}>{children}</div>;
}

export function StatusBadge({ status }: { status: InquiryStatus | string }) {
  const styles: Record<string, string> = {
    pending: 'bg-[#fff3e0] text-[#9a5b00]',
    in_review: 'bg-[#e7effd] text-[#1f55e0]',
    completed: 'bg-[#e6f6ec] text-[#1a7f45]',
  };
  const labels: Record<string, string> = { pending: 'Pending', in_review: 'In Review', completed: 'Completed' };
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? 'bg-paper text-muted'}`}>
      {labels[status] ?? status}
    </span>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? 'bg-[#e6f6ec] text-[#1a7f45]' : 'bg-paper text-muted'
      }`}
    >
      {active ? 'Visible' : 'Hidden'}
    </span>
  );
}

export function EmptyState({ title, hint, href, cta }: { title: string; hint?: string; href?: string; cta?: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-semibold text-navy-900">{title}</p>
      {hint && <p className="mx-auto mt-1.5 max-w-sm text-[0.95rem] text-muted">{hint}</p>}
      {href && cta && (
        <Link href={href} className="btn-primary mt-5">
          {cta}
        </Link>
      )}
    </div>
  );
}

export function FormMessage({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mb-5 rounded-lg bg-[#fdecef] px-4 py-3 text-[0.95rem] text-[#c4183c]">
      {error}
    </p>
  );
}

export function Field({
  label,
  name,
  children,
  hint,
  required,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label} {required && <span className="text-[#c4183c]">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function SortActiveFields({ sortOrder, isActive }: { sortOrder: number; isActive: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Sort order" name="sort_order" hint="Smaller numbers appear first on the website.">
        <input id="sort_order" name="sort_order" type="number" min={0} max={9999} defaultValue={sortOrder} className="field-input" />
      </Field>
      <div className="flex items-end">
        <label className="flex cursor-pointer items-center gap-2.5 pb-2.5">
          <input name="is_active" type="checkbox" defaultChecked={isActive} className="h-4 w-4 accent-[#2f6bff]" />
          <span className="text-[0.95rem] font-medium">Show on the website</span>
        </label>
      </div>
    </div>
  );
}

/** Two side-by-side columns for the Bangla and English version of the same text. */
export function LangColumns({ bn, en }: { bn: React.ReactNode; en: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-line p-4">
        <p className="mb-3 text-sm font-semibold text-navy-900">বাংলা (Bangla)</p>
        <div className="space-y-4">{bn}</div>
      </div>
      <div className="rounded-lg border border-line p-4">
        <p className="mb-3 text-sm font-semibold text-navy-900">English</p>
        <div className="space-y-4">{en}</div>
      </div>
    </div>
  );
}

export function LangNote() {
  return (
    <p className="rounded-lg bg-paper px-4 py-3 text-[0.93rem] text-muted">
      The website has a Bangla page and an English page. If you fill in only one language, that text is shown on both pages.
    </p>
  );
}
