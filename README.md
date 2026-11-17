# Research and Beyond — website and admin panel

A single-page funnel website for **রিসার্চ অ্যান্ড বিয়ন্ড (Research and Beyond)** with an admin panel.

- **Two languages:** Bangla at `/`, English at `/en`, with a switch in the header
- **Two themes:** dark and light, with a switch in the header
- **Motion:** animated hero, scroll-in sections, moving keyword strip, counting numbers, review slider, hover effects
- **Stack:** Next.js (App Router) + React + Tailwind CSS, PostgreSQL, SMTP email (Nodemailer). No animation library — the motion is plain CSS plus a few small components.

## What is included

**Public page**

1. Header: logo, menu, language switch (বাং / EN), theme switch, reading-progress line
2. Hero: headline, both buttons, a live-looking SHAP chart with floating chips
3. Three promises (expert team, confidentiality, on-time delivery), overlapping the hero
4. Moving strip of tools and methods
5. Services — managed from the admin panel; "Request This Service" pre-selects the service in the form
6. How it works (4 steps with a line that draws itself)
7. About us, quality points and three numbers that count up
8. Client reviews — a slider that also moves on its own (with pause)
9. FAQ — animated accordion
10. Project requirement form with file upload
11. Footer with the full logo, email, phone, WhatsApp, Telegram and social links
12. Floating WhatsApp button

**Admin panel (`/admin`, English, always light)**

- Dashboard with request counts
- Project requests: list, search, filter by status, details (including which language the client used), file download, status (Pending / In Review / Completed), internal notes, delete
- Services, Testimonials, FAQs: add, edit, delete, hide, reorder — each with a **Bangla** and an **English** box
- Settings: contact details, social links, About text and the three numbers in both languages, change password

**When a client submits the form**

1. The request and its files are saved (files are stored privately, outside the public folder).
2. The official inbox (`NOTIFY_EMAIL`) gets a notification email.
3. The client gets a confirmation email **in the language they were using**, with a reference number such as `RB-2611-0001`.

---

## 1. Run it on your computer

You need **Node.js 20.9 or newer** and **PostgreSQL 14 or newer**.

```bash
# 1. Install packages
npm install

# 2. Create the database (example)
createdb research_and_beyond

# 3. Create your settings file and edit it
cp .env.example .env
#    - set DATABASE_URL
#    - set SESSION_SECRET (long random text)
#    - set ADMIN_EMAIL and ADMIN_PASSWORD

# 4. Create tables, add starting content, create the admin account
npm run setup

# 5. Start
npm run dev
```

Open <http://localhost:3000> (Bangla), <http://localhost:3000/en> (English) and <http://localhost:3000/admin>.

While `SMTP_HOST` is empty, emails are not sent; they are printed in the terminal so you can read them.

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start in development mode |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run db:migrate` | Create or update the database tables |
| `npm run db:seed` | Add starting services, sample testimonials and FAQs (only into empty tables) |
| `npm run admin:create` | Create an admin, or reset the password for an existing email |
| `npm run setup` | Runs the three commands above in order |

To add a second admin:

```bash
node --env-file=.env scripts/create-admin.mjs "Name" person@example.com "their-password"
```

### Upgrading from the first version

If you already set up the first (single-language) version, run `npm run db:migrate` once. Your existing services, testimonials, FAQs and settings are kept as the **Bangla** version; add the English text in the admin panel (until you do, the English page shows the Bangla text). The old free-text starting price is kept in a column named `starting_price_text_v1`; enter the price again as a number in Admin → Services.

---

## 2. Languages

| | Bangla | English |
|---|---|---|
| Address | `/` | `/en` |
| Fixed text (menu, headings, hero, steps, form labels, error messages, emails) | `src/lib/i18n.ts`, the `bn` block | `src/lib/i18n.ts`, the `en` block |
| Services, testimonials, FAQs | Admin panel, "বাংলা (Bangla)" box | Admin panel, "English" box |
| About text, reply time, labels of the three numbers | Admin → Settings | Admin → Settings |

- **Service names** are one field and are shown as written on both pages (your plan uses English names).
- **If one language is left empty**, the other language's text is shown on both pages. A FAQ always shows a question and its answer in the same language.
- **Numbers** are typed once in English digits (`150+`, `5000`); the Bangla page shows `১৫০+` and `৳৫,০০০` automatically.
- **Budget ranges** in the form are in taka (৳) in both languages — change them in `BUDGET_RANGES` in `src/lib/options.ts`.
- Search engines are told about both versions (`hreflang` links and `/sitemap.xml`).

## 3. Dark and light theme

- The first visit follows the visitor's device setting. To always start dark or light, change `THEME_DEFAULT` in `src/lib/boot-script.ts`.
- The visitor's choice is remembered on their device and kept when they switch language.
- All theme colours are at the top of `src/app/globals.css` (section 1): the `:root` block is light, the `.dark` block is dark. Brand colours taken from the logo are in the `@theme` block below it.
- The hero, "How it works", the form section and the footer stay navy in both themes, like the reference design.

## 4. Motion

| Effect | Where to change it |
|---|---|
| Sections fading/sliding in on scroll | Add `data-reveal` (or `data-reveal="left"`, `"right"`, `"zoom"`) to any element; delay with `style={{ '--d': '150ms' }}`. Speed and distance: `globals.css`, section 4. |
| Hero entrance, floating chips, chart scan line | `Hero.tsx`, `ShapFigure.tsx`; keyframes in `globals.css` |
| Moving keyword strip | Words: `MARQUEE_ITEMS` in `src/lib/i18n.ts`. Speed: `.marquee-track` in `globals.css` (38s). |
| Numbers counting up | `CountUp.tsx` (duration 1.6s) |
| Review slider auto-play | `AUTO_MS` in `Testimonials.tsx` (5.5s) |
| Card light following the mouse, lift on hover | `.spotlight` and `.lift` in `globals.css` |
| Header glass effect, active menu item, progress line | `Header.tsx` |

Visitors whose device is set to "reduce motion" get a still page automatically, and the page stays fully visible if JavaScript fails to load.

## 5. Logo files

| File | Used for |
|---|---|
| `public/brand/logo-mark.png` | R&B mark in the header and admin bar (transparent background) |
| `public/brand/logo-full.png` | Full logo in the footer and on the admin login page |
| `public/brand/og.png` | Picture shown when the link is shared on Facebook, WhatsApp, LinkedIn |
| `src/app/icon.png`, `src/app/apple-icon.png` | Browser tab icon and phone home-screen icon |

These were made from the logo image you sent (752×638 px) by removing its white background. To swap in a sharper original later, replace the files and keep the same names.

---

## 6. Put it online (VPS — recommended)

A small VPS (1 GB RAM is enough) running Ubuntu works well. The steps below assume Ubuntu 22.04 or 24.04.

```bash
# Node.js 22, PostgreSQL, Nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs postgresql nginx
sudo npm install -g pm2

# Database
sudo -u postgres psql -c "CREATE USER rb_user WITH PASSWORD 'a-strong-password';"
sudo -u postgres psql -c "CREATE DATABASE research_and_beyond OWNER rb_user;"

# App
cd /var/www && sudo mkdir research-and-beyond && sudo chown $USER research-and-beyond
# upload the project files into /var/www/research-and-beyond, then:
cd /var/www/research-and-beyond
cp .env.example .env && nano .env      # fill in real values, SITE_URL=https://your-domain.com
npm install
npm run setup
npm run build
pm2 start npm --name research-and-beyond -- start
pm2 save && pm2 startup
```

Nginx (`/etc/nginx/sites-available/research-and-beyond`):

```nginx
server {
    server_name your-domain.com www.your-domain.com;

    # must be larger than MAX_UPLOAD_MB in .env
    client_max_body_size 30m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/research-and-beyond /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com     # free HTTPS
```

To update the site later: upload the new files, then `npm install && npm run db:migrate && npm run build && pm2 restart research-and-beyond`.

### About Vercel and similar hosts

The site runs on Vercel with a hosted PostgreSQL (Neon, Supabase), **but uploaded files will not be kept**, because those hosts do not have a permanent disk. If you want to use such a host, change `src/lib/uploads.ts` to save files to object storage (S3, Cloudflare R2) first. On a VPS no change is needed.

---

## 7. Before you launch — checklist

- [ ] **Replace the sample testimonials.** The four seeded reviews are clearly marked as samples (নমুনা / sample). Add real client reviews in Admin → Testimonials, or delete the samples (the section hides itself when empty).
- [ ] **Replace the sample numbers** (150+, 5+, 20+) in Admin → Settings with your real figures, or leave them empty to hide them.
- [ ] **Set real contact details** in Admin → Settings: email, phone, WhatsApp number, Telegram username, social links.
- [ ] **Read both language versions.** The Bangla hero headline and sub-headline come from your plan. Everything else — the English text, FAQ answers, quality points, process steps, the three promises and the "within 24 hours" reply promise — was written for you; change anything that does not match how you work. FAQs are edited in Admin → FAQs; the rest is in `src/lib/i18n.ts` and Admin → Settings.
- [ ] **Set up SMTP** in `.env` and send yourself a test request in each language. Check both emails arrive.
- [ ] **Set starting prices** for services in Admin → Services, if you want to show them.
- [ ] Change the admin password from the one in `.env` (Admin → Settings → Change password).
- [ ] Use HTTPS. Keep `COOKIE_SECURE=true`.
- [ ] Set up a database backup, for example a daily `pg_dump research_and_beyond > backup.sql`, and back up the `storage/uploads` folder.

---

## 8. Settings in `.env`

| Name | Meaning |
|---|---|
| `SITE_URL` | Public address of the site. Used in email links, the sitemap and share previews. |
| `DATABASE_URL` | PostgreSQL connection string |
| `DATABASE_SSL` | `true` if the database host needs SSL |
| `SESSION_SECRET` | Long random text (32+ characters) that signs admin login cookies. Changing it signs everyone out. |
| `COOKIE_SECURE` | Keep `true`. Set `false` only if the live site has no HTTPS. |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by `npm run admin:create` |
| `UPLOAD_DIR` | Folder for client files. Default `./storage/uploads` |
| `MAX_UPLOAD_MB` | Total upload size allowed per request. Default 25 |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Your email provider's SMTP details |
| `MAIL_FROM` | Sender shown on emails |
| `NOTIFY_EMAIL` | Inbox that receives new-request notifications |

---

## 9. Where things are

```
db/
  schema.sql            database tables (also upgrades a first-version database)
  seed-data.mjs         starting services, sample testimonials, FAQs — in both languages
scripts/                migrate, seed, create-admin
public/brand/           logo files
src/
  app/
    page.tsx            Bangla page  (/)
    en/page.tsx         English page (/en)
    layout.tsx          fonts, theme start-up script
    globals.css         theme colours, buttons, all motion
    icon.png, apple-icon.png, sitemap.ts
    api/inquiries/      receives the requirement form (saves, uploads, emails)
    api/admin/files/    private file download for admins
    admin/              admin panel pages
    admin/actions.ts    all admin save/delete actions
  components/
    site/
      LandingPage.tsx   loads the content for a language; page title and description
      LandingView.tsx   the order of the sections — reorder or remove sections here
      Header.tsx        menu, language switch, theme switch, progress line
      Hero.tsx          headline, buttons, chart with chips, three promises
      ShapFigure.tsx    the chart in the hero
      Marquee.tsx       moving keyword strip
      Services.tsx, Process.tsx, About.tsx, Testimonials.tsx, Faq.tsx, InquiryForm.tsx, Footer.tsx
      MotionProvider.tsx, CountUp.tsx, SpotlightCard.tsx, Tilt.tsx     motion building blocks
      LangSwitch.tsx, ThemeToggle.tsx, Logo.tsx, WhatsappButton.tsx
    admin/              admin panel building blocks
  lib/
    i18n.ts             ALL fixed website text in Bangla and English
    boot-script.ts      which theme a first-time visitor sees
    options.ts          budget ranges, contact methods, statuses, allowed file types
    settings.ts         list of editable settings and their defaults
    validation.ts       form rules
    mail.ts             email templates
    data.ts             loads page content and picks the right language
    auth.ts, session.ts, password.ts   admin login
    uploads.ts          file saving and checks
    db.ts               database connection
```

---

## 10. Security notes

- Admin passwords are stored as scrypt hashes, never as plain text.
- Admin sessions are signed, HTTP-only cookies that expire after 7 days.
- Every admin page, admin action and file download checks the login first.
- Uploaded files are stored outside the public folder with random names. They have no public link.
- The form has a hidden spam trap field and a limit of 5 requests per 10 minutes per IP address. Login is limited to 8 tries per 10 minutes per email. These limits are kept in memory, so they reset when the app restarts.
- All database queries use parameters (no SQL built from user text).

---

## 11. How this was tested

**Tested on a real PostgreSQL 16 server**

- `db/schema.sql` on an empty database, run twice, and as an upgrade of a first-version database with data in it (data kept, nothing lost).
- The real `seed` and `create-admin` scripts.
- The request API and every admin action: saving in both languages, language fallback, prices, file upload and private download, status changes, search, deleting a request with its files, deleting a service that old requests point to, password change, and that every admin action refuses a signed-out visitor.

**Tested in a real browser (Chromium), against that database**

- The page server-rendered and then hydrated, with no hydration or console errors, in Bangla and English, light and dark, at 320–1360 px wide with no sideways scrolling.
- Theme switch (and that it survives a reload and a language change), language switch (keeps the section), scroll reveal, counting numbers, moving strip, hover effects, review slider auto-play and pause, FAQ accordion, mobile menu.
- The form from the browser to the database: error messages in the visitor's language, file picker, a successful English submission arriving in the database with its file and both emails generated.
- Reduced-motion visitors get a still page; with JavaScript switched off the page content stays visible.

**Not tested — please check once on your machine**

- `npm install` and `next build` could not be run where this was written (no access to the package registry). The pages were exercised by rendering the same components with React and compiling the same Tailwind CSS, with stand-ins for Next's own modules and for the `pg` driver (queries were sent to PostgreSQL through `psql`). Run `npm run setup` and `npm run build`; if either reports a problem, the message names the file and line.
- Real email delivery through your SMTP provider.
- The real web fonts (Hind Siliguri, Sora) load from Google at build time; screenshots here used fallback fonts.
