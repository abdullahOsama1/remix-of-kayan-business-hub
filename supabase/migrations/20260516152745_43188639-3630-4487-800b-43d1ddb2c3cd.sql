-- Custom admin auth table (separate from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- No public/anon/authenticated access. Only service role (edge functions) can read.
-- Intentionally no policies = denied for everyone except service role bypass.

-- Seed default admin: username=admin, password=123 (sha256 hash)
INSERT INTO public.admin_users (username, password_hash)
VALUES ('admin', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3')
ON CONFLICT (username) DO NOTHING;