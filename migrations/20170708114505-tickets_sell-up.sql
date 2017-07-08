CREATE TABLE orders_payments (
  id          SERIAL PRIMARY KEY,
  order_id    INT                NOT NULL REFERENCES ticket_orders (id),
  uuid        TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  sum         NUMERIC,
  finished    BOOLEAN                     DEFAULT FALSE,
  canceled    BOOLEAN                     DEFAULT FALSE,
  aviso_data  JSONB                       DEFAULT NULL,
  payed_at    TIMESTAMP                   DEFAULT NULL,
  canceled_at TIMESTAMP                   DEFAULT NULL,
  created_at  TIMESTAMP                   DEFAULT NOW(),
  updated_at  TIMESTAMP                   DEFAULT NULL
);

