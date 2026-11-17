import crypto from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getDict, type Lang } from './i18n';
import { ALLOWED_EXTENSIONS, MAX_FILES } from './options';

export function uploadRoot(): string {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || './storage/uploads');
}

export function maxUploadBytes(): number {
  const mb = Number(process.env.MAX_UPLOAD_MB || 25);
  return (Number.isFinite(mb) && mb > 0 ? mb : 25) * 1024 * 1024;
}

export function extensionOf(name: string): string {
  const ext = path.extname(name).slice(1).toLowerCase();
  return ext;
}

/** Keep a readable but safe version of the original file name. */
export function safeFileName(name: string): string {
  const base = path.basename(name).normalize('NFC');
  // \p{M} keeps combining marks, which Bangla vowel signs (কার) and hasanta rely on
  const cleaned = base.replace(/[^\p{L}\p{M}\p{N}._ -]/gu, '_').replace(/\s+/g, ' ').trim();
  return (cleaned || 'file').slice(0, 120);
}

export type UploadCheck = { ok: true; files: File[] } | { ok: false; error: string };

export function checkUploads(entries: FormDataEntryValue[], lang: Lang = 'bn'): UploadCheck {
  const m = getDict(lang).api;
  const files = entries.filter((v): v is File => typeof v !== 'string' && v.size > 0);
  if (files.length > MAX_FILES) return { ok: false, error: m.tooManyFiles(String(MAX_FILES)) };
  const total = files.reduce((sum, f) => sum + f.size, 0);
  const limit = maxUploadBytes();
  if (total > limit) return { ok: false, error: m.tooBig(String(Math.round(limit / 1024 / 1024))) };
  for (const f of files) {
    if (!ALLOWED_EXTENSIONS.includes(extensionOf(f.name))) return { ok: false, error: m.badType(safeFileName(f.name)) };
  }
  return { ok: true, files };
}

export type SavedFile = { original_name: string; stored_name: string; mime_type: string; size_bytes: number };

/** Saves files to UPLOAD_DIR/<folder>/<random>-<name>. Returns paths relative to UPLOAD_DIR. */
export async function saveUploads(folder: string, files: File[]): Promise<SavedFile[]> {
  if (!files.length) return [];
  const dir = path.join(uploadRoot(), folder);
  await mkdir(dir, { recursive: true });
  const saved: SavedFile[] = [];
  for (const file of files) {
    const original = safeFileName(file.name);
    const storedBase = `${crypto.randomBytes(8).toString('hex')}-${original.replace(/[^A-Za-z0-9._-]/g, '_')}`;
    await writeFile(path.join(dir, storedBase), Buffer.from(await file.arrayBuffer()));
    saved.push({
      original_name: original,
      stored_name: `${folder}/${storedBase}`,
      mime_type: file.type || 'application/octet-stream',
      size_bytes: file.size,
    });
  }
  return saved;
}

/** Resolves a stored name to an absolute path, refusing anything outside UPLOAD_DIR. */
export function resolveStoredPath(storedName: string): string | null {
  const root = uploadRoot();
  const full = path.resolve(root, storedName);
  return full.startsWith(root + path.sep) ? full : null;
}

export async function removeUploadFolder(folder: string): Promise<void> {
  const full = resolveStoredPath(folder);
  if (full) await rm(full, { recursive: true, force: true });
}
