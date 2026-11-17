-- Research and Beyond — PostgreSQL schema
-- Safe to run more than once. Text shown on the website is stored in two languages:
-- columns ending in _bn (Bangla) and _en (English).

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id             SERIAL PRIMARY KEY,
  title          TEXT        NOT NULL,                 -- service name, shown in both languages
  summary_bn     TEXT        NOT NULL DEFAULT '',
  summary_en     TEXT        NOT NULL DEFAULT '',
  features_bn    TEXT[]      NOT NULL DEFAULT '{}',    -- bullet points
  features_en    TEXT[]      NOT NULL DEFAULT '{}',
  starting_price INTEGER,                              -- in BDT; NULL = "priced per project"
  icon           TEXT        NOT NULL DEFAULT 'general',
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  role_bn    TEXT        NOT NULL DEFAULT '',          -- university / designation
  role_en    TEXT        NOT NULL DEFAULT '',
  content_bn TEXT        NOT NULL DEFAULT '',
  content_en TEXT        NOT NULL DEFAULT '',
  rating     SMALLINT    NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sort_order INTEGER     NOT NULL DEFAULT 0,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id          SERIAL PRIMARY KEY,
  question_bn TEXT        NOT NULL DEFAULT '',
  question_en TEXT        NOT NULL DEFAULT '',
  answer_bn   TEXT        NOT NULL DEFAULT '',
  answer_en   TEXT        NOT NULL DEFAULT '',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS inquiries (
  id             SERIAL PRIMARY KEY,
  ref_code       TEXT        UNIQUE,
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  contact_method TEXT        NOT NULL,
  service_id     INTEGER     REFERENCES services(id) ON DELETE SET NULL,
  service_title  TEXT        NOT NULL DEFAULT '',      -- snapshot, survives service edits/deletes
  budget_range   TEXT        NOT NULL,
  deadline       DATE,
  description    TEXT        NOT NULL,
  lang           TEXT        NOT NULL DEFAULT 'bn',    -- language the client used on the website
  status         TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'in_review', 'completed')),
  admin_note     TEXT        NOT NULL DEFAULT '',
  ip_address     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiry_files (
  id            SERIAL PRIMARY KEY,
  inquiry_id    INTEGER     NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  original_name TEXT        NOT NULL,
  stored_name   TEXT        NOT NULL,
  mime_type     TEXT        NOT NULL DEFAULT 'application/octet-stream',
  size_bytes    BIGINT      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Upgrade from version 1 (single-language columns). Does nothing on a new database.
-- Existing text is kept as the Bangla version; add the English version in the admin panel.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  has_col CONSTANT TEXT := 'SELECT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_schema = current_schema() AND table_name = $1 AND column_name = $2)';
  found BOOLEAN;
BEGIN
  EXECUTE has_col INTO found USING 'services', 'summary';
  IF found THEN
    ALTER TABLE services RENAME COLUMN summary TO summary_bn;
    ALTER TABLE services RENAME COLUMN features TO features_bn;
    ALTER TABLE services RENAME COLUMN starting_price TO starting_price_text_v1;  -- old free-text price, kept for reference
    ALTER TABLE services ALTER COLUMN starting_price_text_v1 DROP NOT NULL;
  END IF;

  EXECUTE has_col INTO found USING 'testimonials', 'content';
  IF found THEN
    ALTER TABLE testimonials RENAME COLUMN content TO content_bn;
    ALTER TABLE testimonials RENAME COLUMN role TO role_bn;
  END IF;

  EXECUTE has_col INTO found USING 'faqs', 'question';
  IF found THEN
    ALTER TABLE faqs RENAME COLUMN question TO question_bn;
    ALTER TABLE faqs RENAME COLUMN answer TO answer_bn;
  END IF;
END $$;

ALTER TABLE services     ADD COLUMN IF NOT EXISTS summary_en     TEXT    NOT NULL DEFAULT '';
ALTER TABLE services     ADD COLUMN IF NOT EXISTS features_en    TEXT[]  NOT NULL DEFAULT '{}';
ALTER TABLE services     ADD COLUMN IF NOT EXISTS starting_price INTEGER;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role_en        TEXT    NOT NULL DEFAULT '';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_en     TEXT    NOT NULL DEFAULT '';
ALTER TABLE testimonials ALTER COLUMN content_bn SET DEFAULT '';
ALTER TABLE faqs         ADD COLUMN IF NOT EXISTS question_en    TEXT    NOT NULL DEFAULT '';
ALTER TABLE faqs         ADD COLUMN IF NOT EXISTS answer_en      TEXT    NOT NULL DEFAULT '';
ALTER TABLE faqs         ALTER COLUMN question_bn SET DEFAULT '';
ALTER TABLE faqs         ALTER COLUMN answer_bn   SET DEFAULT '';
ALTER TABLE inquiries    ADD COLUMN IF NOT EXISTS lang           TEXT    NOT NULL DEFAULT 'bn';

-- Version 1 settings that are now stored per language
INSERT INTO settings (key, value)
  SELECT key || '_bn', value FROM settings
   WHERE key IN ('about_text', 'response_time', 'stat_1_label', 'stat_2_label', 'stat_3_label')
ON CONFLICT (key) DO NOTHING;
DELETE FROM settings WHERE key IN ('about_text', 'response_time', 'stat_1_label', 'stat_2_label', 'stat_3_label');

CREATE INDEX IF NOT EXISTS inquiries_status_created_idx ON inquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiry_files_inquiry_idx ON inquiry_files (inquiry_id);
