CREATE TABLE tariffs (
  id         SERIAL PRIMARY KEY,
  name       TEXT,
  status     BOOLEAN   DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);

INSERT INTO tariffs (id, name) VALUES (1, 'Базовый'), (2, 'Полный');

CREATE TABLE organizations_payments (
  id              SERIAL PRIMARY KEY,
  organization_id INT                NOT NULL REFERENCES organizations (id),
  user_id         INT                NOT NULL REFERENCES users (id),
  uuid            TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  sum             NUMERIC,
  finished        BOOLEAN                     DEFAULT FALSE,
  created_at      TIMESTAMP                   DEFAULT NOW(),
  updated_at      TIMESTAMP                   DEFAULT NULL
);

CREATE TABLE organizations_tariffs (
  id         SERIAL PRIMARY KEY,
  payment_id INT       NOT NULL REFERENCES organizations_payments (id),
  tariff_id  INT       NOT NULL REFERENCES tariffs (id),
  since      TIMESTAMP NOT NULL,
  till       TIMESTAMP NOT NULL,
  status     BOOLEAN   DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);

