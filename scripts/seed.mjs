// Inserts starting content into EMPTY tables only. Usage: npm run db:seed
import pg from 'pg';
import { services, testimonials, faqs } from '../db/seed-data.mjs';

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

async function isEmpty(table) {
  const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM ${table}`);
  return rows[0].n === 0;
}

try {
  await client.connect();
  await client.query('BEGIN');

  if (await isEmpty('services')) {
    for (const [i, s] of services.entries()) {
      await client.query(
        `INSERT INTO services (title, summary_bn, summary_en, features_bn, features_en, starting_price, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [s.title, s.summary_bn, s.summary_en, s.features_bn, s.features_en, s.starting_price, s.icon, i + 1],
      );
    }
    console.log(`✔ Added ${services.length} services`);
  } else console.log('• services already has data — skipped');

  if (await isEmpty('testimonials')) {
    for (const [i, t] of testimonials.entries()) {
      await client.query(
        `INSERT INTO testimonials (name, role_bn, role_en, content_bn, content_en, rating, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [t.name, t.role_bn, t.role_en, t.content_bn, t.content_en, t.rating, i + 1],
      );
    }
    console.log(`✔ Added ${testimonials.length} sample testimonials (replace them before launch)`);
  } else console.log('• testimonials already has data — skipped');

  if (await isEmpty('faqs')) {
    for (const [i, f] of faqs.entries()) {
      await client.query(
        `INSERT INTO faqs (question_bn, question_en, answer_bn, answer_en, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [f.question_bn, f.question_en, f.answer_bn, f.answer_en, i + 1],
      );
    }
    console.log(`✔ Added ${faqs.length} FAQs`);
  } else console.log('• faqs already has data — skipped');

  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK').catch(() => {});
  console.error('✖ Seeding failed:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
