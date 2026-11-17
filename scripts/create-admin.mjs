// Creates an admin account, or resets the password if the email already exists.
// Usage:  npm run admin:create
//   (reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from .env)
// Or pass values directly:
//   node --env-file=.env scripts/create-admin.mjs "Name" email@example.com "password"
import crypto from 'node:crypto';
import pg from 'pg';

const [, , argName, argEmail, argPassword] = process.argv;
const name = argName || process.env.ADMIN_NAME || 'Admin';
const email = (argEmail || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = argPassword || process.env.ADMIN_PASSWORD || '';

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env (or pass them as arguments).');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}
if (password === 'change-this-password') {
  console.error('Please change ADMIN_PASSWORD in .env from the example value first.');
  process.exit(1);
}

// Must match hashPassword() in src/lib/password.ts
function hashPassword(pw) {
  const N = 16384;
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64, { N, r: 8, p: 1 });
  return `scrypt$${N}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  const { rows } = await client.query(
    `INSERT INTO admins (name, email, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash
     RETURNING (xmax = 0) AS created`,
    [name, email, hashPassword(password)],
  );
  console.log(rows[0].created ? `✔ Admin created: ${email}` : `✔ Password updated for: ${email}`);
} catch (err) {
  console.error('✖ Could not create admin:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
