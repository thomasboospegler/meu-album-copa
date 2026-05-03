# Supabase setup

1. Run `schema.sql` in the Supabase SQL editor.
2. Run `seed.sql` to create the initial FIFA World Cup 2026 collection, checklist variants, album editions, and the temporary development checklist.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `.env.local`.
4. Create users through `/auth`.
5. Set admin users with `app_metadata.role = "admin"` or `user_metadata.role = "admin"`.
6. Import official sticker rows through `/admin/import-checklist` when the validated Panini checklist is available.

The app keeps localStorage fallback behavior when Supabase is not configured or when a user is not authenticated.

The seeded checklist is intentionally partial and temporary. It exists so album progress,
missing stickers, duplicates, and quick marking can be tested before the official checklist
is imported.

When `schema.sql` changes, run it again before `seed.sql`. The script is written to
add missing columns safely, such as `album_editions.is_enabled`, without recreating
existing user progress.
