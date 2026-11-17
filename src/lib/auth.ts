import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { queryOne } from './db';
import { createSessionToken, readSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from './session';

export type Admin = { id: number; name: string; email: string };

function secureCookies(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false';
}

export async function startSession(adminId: number) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(adminId), {
    httpOnly: true,
    secure: secureCookies(),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  const jar = await cookies();
  const adminId = readSessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!adminId) return null;
  return queryOne<Admin>('SELECT id, name, email FROM admins WHERE id = $1', [adminId]);
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}
