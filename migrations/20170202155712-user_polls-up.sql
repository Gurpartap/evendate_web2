CREATE TABLE stat_external_link_opens(
  id         SERIAL PRIMARY KEY,
  url TEXT,
  user_id INT NULL DEFAULT NULL,
  params JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);