import { redirect } from 'next/navigation';
import { getCurrentAdmin, startSession } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { rateLimit } from '@/lib/rate-limit';

export const metadata = { title: 'Admin login — Research and Beyond', robots: { index: false } };
export const dynamic = 'force-dynamic';

async function login(formData: FormData) {
  'use server';

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) redirect('/admin/login?error=missing');
  if (!rateLimit(`login:${email}`, 8, 10 * 60 * 1000)) redirect('/admin/login?error=throttled');

  const admin = await queryOne<{ id: number; password_hash: string }>(
    'SELECT id, password_hash FROM admins WHERE email = $1',
    [email],
  );
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    redirect('/admin/login?error=invalid');
  }

  await startSession(admin.id);
  redirect('/admin');
}

const MESSAGES: Record<string, string> = {
  missing: 'Enter your email and password.',
  invalid: 'Email or password is incorrect.',
  throttled: 'Too many attempts. Try again in a few minutes.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentAdmin()) redirect('/admin');
  const { error } = await searchParams;

  return (
    <main className="theme-light flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12 text-ink">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-full.png" alt="Research and Beyond" width={140} height={120} className="h-28 w-auto" />
        </div>

        <form action={login} className="mt-8 rounded-2xl bg-white p-7">
          <h1 className="font-display text-[1.3rem] font-semibold text-navy-900">Admin login</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage project requests and site content.</p>

          {error && (
            <p role="alert" className="mt-5 rounded-lg bg-[#fdecef] px-4 py-3 text-sm text-[#c4183c]">
              {MESSAGES[error] ?? 'Could not sign in.'}
            </p>
          )}

          <div className="mt-5">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="username" className="field-input" autoFocus />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="field-input" />
          </div>

          <button type="submit" className="btn-primary mt-6 w-full">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          <a href="/" className="hover:text-white">
            ← Back to the website
          </a>
        </p>
      </div>
    </main>
  );
}
