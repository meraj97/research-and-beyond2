'use client';

/** Submit button that asks for confirmation first. Place it inside a <form action={...}>. */
export default function DeleteButton({ label = 'Delete', confirmText }: { label?: string; confirmText: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
      className="rounded-full border border-[#c4183c]/30 px-4 py-2 text-[0.9rem] font-semibold text-[#c4183c] hover:bg-[#fdecef]"
    >
      {label}
    </button>
  );
}
