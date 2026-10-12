# Result Information Website

Responsive black/yellow public result-information site with:
- Current and previous results
- Monthly history table
- Supabase-backed persistent storage
- Supabase Auth admin login
- Admin CRUD for games/results
- Browser notification opt-in for visitors
- SEO metadata, robots.txt and sitemap

## Important scope
This starter is for publishing informational results and history only. It intentionally has no betting, deposits, wallets, wagering, or prediction functionality. Verify applicable laws and platform rules before publishing any gambling-adjacent content.

## 1. Create Supabase project
1. Create a project at https://supabase.com.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication > Users, create an admin user with email/password.
4. Add `.env.local` using `.env.example`. Never expose a service-role key in frontend code.

## 2. Run locally
Requires Node.js 20+.
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000 and `/admin/login`.

## 3. Make the admin account
Create users in Supabase Dashboard > Authentication > Users. RLS policies allow only authenticated users in the `admins` table to manage records. After creating the auth user, copy its UUID and insert it into the admins table:
```sql
insert into public.admins (user_id) values ('PASTE_AUTH_USER_UUID');
```
Do this only for people who should have publishing privileges.

## 4. Browser notifications
The bell control requests permission and subscribes the browser to notifications while the site is open. This starter does **not** send push notifications when the browser is closed. Real push requires a service worker, VAPID keys, a subscriptions table, and a trusted server-side sender (for example, a scheduled/triggered function). Do not put private VAPID keys in public environment variables.

## 5. Deploy
Deploy to Vercel or another Node-compatible host. Set the three environment variables in deployment settings. Set `NEXT_PUBLIC_SITE_URL` to the production domain. Add the domain to Supabase Auth URL configuration.

## Production checklist
- Add rate limiting / CAPTCHA to sign-in if exposed publicly.
- Configure backups and monitoring in Supabase.
- Confirm the public dataset contains only information you are allowed to publish.
- Test RLS with a non-admin account.
- Set a custom domain, Search Console, favicon and social preview image.
- Consider adding server-sent/web push only if there is a clear user need.
