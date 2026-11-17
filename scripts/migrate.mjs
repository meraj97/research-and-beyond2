// Creates all database tables. Usage: npm run db:migrate
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  const sql = await readFile(path.join(here, '..', 'db', 'schema.sql'), 'utf8');
  await client.query(sql);
  console.log('✔ Database schema is up to date.');
} catch (err) {
  console.error('✖ Migration failed:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
