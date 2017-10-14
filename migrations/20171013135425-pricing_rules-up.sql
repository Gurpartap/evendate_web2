CREATE TABLE tickets_pricing_rule_types (
  id          SERIAL PRIMARY KEY,
  type_code   TEXT      NOT NULL UNIQUE,
  description TEXT      NULL     DEFAULT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP          DEFAULT NULL
);

INSERT INTO tickets_pricing_rule_types (id, type_code, description)
VALUES
  (1, 'tickets_count_between', ''),
  (2, 'order_sum_between', ''),
  (3, 'users_order_count_between', '');

CREATE TABLE tickets_pricing_rules (
  id                           SERIAL PRIMARY KEY,
  uuid                         TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  event_id                     INT REFERENCES events (id),
  tickets_pricing_rule_type_id INT REFERENCES tickets_pricing_rule_types (id),
  effort                       NUMERIC            NOT NULL,
  is_fixed                     BOOLEAN                     DEFAULT FALSE,
  is_percentage                BOOLEAN                     DEFAULT TRUE,
  rule                         JSONB              NOT NULL,
  enabled                      BOOLEAN                     DEFAULT TRUE,
  created_at                   TIMESTAMP          NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMP                   DEFAULT NULL
);


ALTER TABLE events
  ADD COLUMN apply_promocodes_and_pricing_rules BOOLEAN DEFAULT TRUE;