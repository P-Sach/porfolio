# Portfolio + CMS

Next.js 15 portfolio with a private admin area (`/admin`) for editing every piece of content, including the downloadable resume. Content lives in Supabase; the public pages are statically rendered and revalidated when you save.

## How it works

| Piece | Where |
| --- | --- |
| Public pages | `app/page.tsx`, `app/{experience,projects,skills}/page.tsx` (server components reading `getSiteContent()`) |
| Content schemas (Zod) | `lib/content/schema.ts` |
| Built-in seed content / fallback | `lib/content/defaults.ts` |
| Admin UI | `app/admin/*`, `components/admin/*` |
| Writes (auth-checked server actions) | `app/admin/actions.ts` |
| Stable resume URL | `app/resume/route.ts` (`/resume`) |
| Database + storage schema | `supabase/schema.sql` |

If Supabase isn't configured, or a section was never saved, the site serves `defaults.ts`, so it never renders empty.

## Security model

- `/admin` is gated three times: middleware redirect, the admin layout/pages (`requireAdminPage`), and **every server action** (`requireAdmin`). Only the account whose email equals `ADMIN_EMAIL` (and is confirmed) is accepted; anyone else with a Supabase session is rejected.
- Writes use the service-role key on the server only, after the owner check. Row-level security allows the public to **read** content and nobody to write through the anon key.
- Every save is validated with Zod. Links must be `http(s)`/`mailto`; colours and icons are whitelisted keys.
- Uploads are checked by content (PDF `%PDF-` header, PNG/JPEG/WebP signatures), size-capped (5 MB / 3 MB), stored under server-generated names and served with `nosniff`.
- Each save keeps the previous version for one-step **Undo**.

## One-time setup

1. **Supabase project** → SQL editor → run `supabase/schema.sql`.
2. **Auth** → Providers → Email: keep enabled. **Disable "Allow new users to sign up"** (Auth → Sign In / Providers), then **Users → Add user** with your email and a strong password (tick *Auto confirm*).
3. Copy `.env.example` to `.env.local` and fill in the four values.
4. `npm install` then `npm run dev` and open `/admin/login`.

### Deploy on Vercel

Import the repo, add the same four environment variables, deploy. GitHub Pages can't be used: a CMS needs a server. Point your domain at Vercel (or use the `*.vercel.app` URL).

## Everyday use

- Edit anything under **/admin**, click **Save & publish**. Pages refresh immediately.
- **Resume & Photo** replaces or deletes the files. All "Download CV" buttons use `/resume`, so nothing else changes. With no upload, `/resume` serves the bundled `public/ParthSachdeva_CV_22.pdf`. To hide the button entirely, turn it off under **Profile**.

## Scripts

```bash
npm run dev     # local dev
npm run build   # production build
npm test        # validators, schemas and search (Vitest)
```
