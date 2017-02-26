CREATE TABLE tg_users (
  id         SERIAL PRIMARY KEY,
  user_id    INT   NOT NULL,
  first_name TEXT      DEFAULT NULL,
  last_name  TEXT      DEFAULT NULL,
  username   TEXT      DEFAULT NULL,
  json_data  JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL,
  UNIQUE (user_id)
);

CREATE TABLE tg_chats (
  id         SERIAL PRIMARY KEY,
  chat_id    INT   NOT NULL,
  title      TEXT      DEFAULT NULL,
  type       TEXT      DEFAULT NULL,
  json_data  JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL,
  UNIQUE (chat_id)
);

CREATE TABLE tg_messages (
  id         SERIAL PRIMARY KEY,
  chat_id    INT   NOT NULL,
  message_id INT   NOT NULL,
  user_id    INT   NOT NULL,
  json_data  JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE tg_topics (
  id            SERIAL PRIMARY KEY,
  keyword       TEXT,
  parent_id     INT       DEFAULT NULL REFERENCES tg_topics (id),
  children_json JSONB     DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NULL,
  UNIQUE (keyword, parent_id)
);

ALTER TABLE tg_topics ADD COLUMN keywords_json JSONB NOT NULL DEFAULT '[]';

TRUNCATE tg_topics CASCADE;

CREATE TABLE tg_sub_topics (
  id          SERIAL PRIMARY KEY,
  chat_id     INT NOT NULL,
  tg_topic_id INT NOT NULL REFERENCES tg_topics (id),
  status      BOOLEAN   DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NULL,
  UNIQUE (chat_id, tg_topic_id)
);

CREATE OR REPLACE FUNCTION plainto_or_tsquery(TEXT)
  RETURNS TSQUERY AS $$
SELECT to_tsquery(regexp_replace($1, E'[\\s\'|:&()!]+', '|', 'g'));
$$ LANGUAGE SQL STRICT IMMUTABLE;


-- CREATE TABLE tg_sub_organizations (
--   id              SERIAL PRIMARY KEY,
--   tg_user_id      INT NOT NULL REFERENCES tg_users (id),
--   organization_id INT NOT NULL REFERENCES organizations (id),
--   status          BOOLEAN   DEFAULT TRUE,
--   created_at      TIMESTAMP DEFAULT NOW(),
--   updated_at      TIMESTAMP DEFAULT NULL
-- );
--
-- CREATE TABLE tg_sub_keywords (
--   id         SERIAL PRIMARY KEY,
--   tg_user_id INT  NOT NULL,
--   keyword    TEXT NOT NULL,
--   status     BOOLEAN   DEFAULT TRUE,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMP DEFAULT NULL
-- );