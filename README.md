# VercelEX (local) — Supabase integration

This project includes an optional Supabase integration to persist per-user data (users and transactions). The app will fall back to localStorage when Supabase environment variables are not provided.

Follow these steps to set up Supabase and connect the app.

## 1) Create a Supabase project

1. Go to https://app.supabase.com and create a new project.
2. Note the Project URL and anon public API key (Settings → API).

## 2) Create schema (SQL)

Use the SQL editor in Supabase or run the provided SQL file `db/supabase_schema.sql` to create `users` and `transactions` tables.

The SQL file provided in this repository (`db/supabase_schema.sql`) contains example table definitions and simple policies for demo usage. Review and tighten policies for production use.

## 3) Add environment variables

Create a `.env` file in the project root and add the values (or use the provided `.env.example`):

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

Restart the dev server after adding `.env`.

## 4) Tables and columns expected by the app

- `users` table
  - `id` (uuid) PK
  - `email` (text) unique
  - `display_name` (text)
  - `balances` (jsonb) — optional; the app writes `{ sphynx: number }` as JSON

- `transactions` table
  - `id` (text) PK
  - `user_email` (text) — used to query transactions by user
  - `type` (text)
  - `channel` (text)
  - `networkOrMethod` (text)
  - `amount` (numeric)
  - `currency` (text)
  - `status` (text)
  - `details` (text)
  - `date` (timestamptz)

## 5) Security & production notes

- For production, use Supabase Auth and RLS policies to ensure users can only access their own records.
- Avoid using anon key for privileged operations; use server-side service_role key where necessary.

## 6) Run the app

Install deps and start the dev server:

```bash
npm install
npm run dev
```

If you followed the steps above and set `.env`, the app will attempt to sync transactions and user balances with Supabase.
