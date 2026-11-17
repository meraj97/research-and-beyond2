export default function Flash({ saved, deleted }: { saved?: string; deleted?: string }) {
  if (!saved && !deleted) return null;
  return (
    <p role="status" className="mb-5 rounded-lg bg-[#e6f6ec] px-4 py-3 text-[0.95rem] text-[#1a7f45]">
      {deleted ? 'Deleted.' : 'Changes saved. The website now shows the update.'}
    </p>
  );
}
