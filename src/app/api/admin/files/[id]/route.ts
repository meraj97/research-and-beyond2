import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { getCurrentAdmin } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { resolveStoredPath } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Uploaded client files are private: only a signed-in admin can download them.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return new Response('Not signed in', { status: 401 });

  const { id } = await params;
  const file = await queryOne<{ original_name: string; stored_name: string; mime_type: string }>(
    'SELECT original_name, stored_name, mime_type FROM inquiry_files WHERE id = $1',
    [Number(id) || 0],
  );
  if (!file) return new Response('File not found', { status: 404 });

  const fullPath = resolveStoredPath(file.stored_name);
  if (!fullPath) return new Response('File not found', { status: 404 });

  let size: number;
  try {
    size = (await stat(fullPath)).size;
  } catch {
    return new Response('File is missing from storage', { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(fullPath)) as ReadableStream;
  const asciiName = file.original_name.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_');

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(size),
      'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file.original_name)}`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
