CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- users table
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id      TEXT    NOT NULL UNIQUE,
  name          TEXT,
  email         TEXT,
  subscription  TEXT    NOT NULL DEFAULT 'standard',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID    NOT NULL REFERENCES public.users(id),
  name         TEXT    NOT NULL,
  type         TEXT    NOT NULL CHECK (type IN ('Income','Expense')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name, type)
);

-- transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.users(id),
  category_id      UUID        REFERENCES public.categories(id),
  description      TEXT        NOT NULL,
  amount           NUMERIC(12,2) NOT NULL,
  date             DATE        NOT NULL,
  type             TEXT        NOT NULL,  
  is_recurring     BOOLEAN     NOT NULL DEFAULT FALSE,
  recurrence_rule  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES public.users(id),
  message        TEXT        NOT NULL,
  type           TEXT        NOT NULL,
  is_read        BOOLEAN     NOT NULL DEFAULT FALSE,
  scheduled_for  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
