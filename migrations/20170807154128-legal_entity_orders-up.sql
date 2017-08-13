INSERT INTO tickets_orders_statuses (id, type_code, name, created_at)
VALUES (12, 'order_waiting_for_payment_legal_entity', 'Ожидает оплаты от юрлица', NOW());

INSERT INTO tickets_orders_statuses (id, type_code, name, created_at)
VALUES (13, 'payed_legal_entity', 'Ожидает оплаты отОплачено юрлицом', NOW());

ALTER TABLE events
  ADD COLUMN accept_bitcoins BOOLEAN DEFAULT FALSE;

CREATE TABLE orders_legal_entities (
  id                         SERIAL PRIMARY KEY,
  ticket_order_id            INT REFERENCES ticket_orders (id) NOT NULL UNIQUE,
  participants               TEXT                              NOT NULL,
  company_name               TEXT                              NOT NULL,
  company_inn                TEXT                              NOT NULL,
  company_kpp                TEXT                              NOT NULL,
  company_address            TEXT                              NOT NULL,
  company_zipcode            TEXT                              NOT NULL,
  bank_name                  TEXT                              NOT NULL,
  bank_bik                   TEXT                              NOT NULL,
  bank_correspondent_account TEXT                              NOT NULL,
  bank_payment_account       TEXT                              NOT NULL,
  signer_full_name           TEXT                              NOT NULL,
  signer_position            TEXT                              NOT NULL,
  contact_full_name          TEXT                              NOT NULL,
  contact_email              TEXT                              NOT NULL,
  contact_phone_number       TEXT                              NOT NULL,
  finished                   BOOLEAN   DEFAULT FALSE,
  payed_at                   TIMESTAMP DEFAULT NULL,
  created_at                 TIMESTAMP DEFAULT NOW(),
  updated_at                 TIMESTAMP DEFAULT NULL
);

