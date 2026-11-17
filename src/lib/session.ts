import crypto from 'node:crypto';

// Stateless signed session token: base64url(JSON payload) + "." + HMAC-SHA256 signature.
export const SESSION_COOKIE = 'rb_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

type SessionPayload = { aid: number; exp: number };

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or shorter than 32 characters. Set it in .env');
  }
  return secret;
}

function sign(data: string): string {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
}

export function createSessionToken(adminId: number, now = Date.now()): string {
  const payload: SessionPayload = { aid: adminId, exp: now + SESSION_MAX_AGE * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

/** Returns the admin id if the token is valid and not expired, otherwise null. */
export function readSessionToken(token: string | undefined | null, now = Date.now()): number | null {
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot <= 0) return null;
  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.aid !== 'number' || typeof payload.exp !== 'number') return null;
    if (payload.exp < now) return null;
    return payload.aid;
  } catch {
    return null;
  }
}
