# Supabase setup

1. Run `schema.sql` in the Supabase SQL editor.
2. Run `seed.sql` to create the initial FIFA World Cup 2026 collection, checklist variants, and album editions.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
4. Create users through `/auth`.
5. Set admin users with `app_metadata.role = "admin"` or `user_metadata.role = "admin"`.
6. Import official sticker rows through `/admin/import-checklist`.

The app keeps localStorage fallback behavior when Supabase is not configured or when a user is not authenticated.
