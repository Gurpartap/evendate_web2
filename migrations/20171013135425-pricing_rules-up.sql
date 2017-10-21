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
  (3, 'user_orders_count_between', ''),
  (4, 'user_orders_count_between', '');

-- ALTER TABLE ticket_orders DROP COLUMN ticket_pricing_rule_id;
-- DROP VIEW view_tickets_pricing_rules;
-- DROP TABLE tickets_pricing_rules;

CREATE TABLE tickets_pricing_rules (
  id                           SERIAL PRIMARY KEY,
  uuid                         TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  name                         TEXT,
  event_id                     INT REFERENCES events (id),
  tickets_pricing_rule_type_id INT REFERENCES tickets_pricing_rule_types (id),
  effort                       NUMERIC            NOT NULL,
  is_fixed                     BOOLEAN                     DEFAULT FALSE,
  is_percentage                BOOLEAN                     DEFAULT TRUE,
  rule                         JSONB              NOT NULL,
  enabled                      BOOLEAN                     DEFAULT TRUE,
  created_at                   TIMESTAMP          NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMP                   DEFAULT NULL,
  UNIQUE (uuid, event_id, rule, effort, is_fixed, is_percentage)
);

ALTER TABLE events
  ADD COLUMN apply_promocodes_and_pricing_rules BOOLEAN DEFAULT TRUE;

ALTER TABLE ticket_orders
  ADD COLUMN ticket_pricing_rule_id INT REFERENCES tickets_pricing_rules (id) DEFAULT NULL;

ALTER TABLE ticket_orders
  ADD COLUMN ticket_pricing_rule_discount NUMERIC DEFAULT NULL;

CREATE OR REPLACE VIEW view_tickets_pricing_rules AS
  SELECT
    tickets_pricing_rules.id,
    uuid,
    name,
    event_id,
    tickets_pricing_rule_type_id,
    tickets_pricing_rule_types.type_code,
    effort,
    is_percentage,
    is_fixed,
    rule,
    enabled,
    DATE_PART('epoch', tickets_pricing_rules.created_at) :: INT AS created_at,
    DATE_PART('epoch', tickets_pricing_rules.updated_at) :: INT AS updated_at
  FROM tickets_pricing_rules
    INNER JOIN tickets_pricing_rule_types
      ON tickets_pricing_rules.tickets_pricing_rule_type_id = tickets_pricing_rule_types.id;


CREATE OR REPLACE VIEW view_tickets_orders AS
  SELECT
    ticket_orders.id,
    ticket_orders.uuid,
    ticket_orders.user_id,
    ticket_orders.order_content,
    ticket_orders.event_id :: INT,
    ticket_orders.is_canceled,
    DATE_PART('epoch', ticket_orders.payed_at) :: INT                                            AS payed_at,
    DATE_PART('epoch', ticket_orders.canceled_at) :: INT                                         AS canceled_at,
    DATE_PART('epoch', ticket_orders.created_at) :: INT                                          AS created_at,
    DATE_PART('epoch', ticket_orders.updated_at) :: INT                                          AS updated_at,
    tickets_orders_statuses.type_code                                                            AS status_type_code,
    tickets_orders_statuses.name                                                                 AS status_name,
    tickets_orders_statuses.id                                                                   AS status_id,
    RPAD(ticket_orders.id :: TEXT || '00' || reverse((ticket_orders.id * 1610) :: TEXT), 9, '0') AS number,
    money.sum,
    st.payed,
    CASE WHEN COALESCE(ticket_orders.final_sum, money.sum) < 0
      THEN 0
    ELSE COALESCE(ticket_orders.final_sum, money.sum) END                                        AS final_sum,
    ticket_orders.promocode_id,
    ticket_orders.shop_sum_amount,
    CASE WHEN st.payed > 0
              AND events.ticketing_locally = TRUE
              AND ticket_orders.shop_sum_amount > 0
              AND COALESCE(ticket_orders.final_sum, money.sum) > 0
      THEN ROUND((
                   (COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount) /
                   COALESCE(ticket_orders.final_sum, money.sum) * 100
                 ), 2)
    ELSE NULL END                                                                                AS processing_commission,
    FLOOR(ticket_orders.shop_sum_amount - (COALESCE(ticket_orders.final_sum, money.sum) * 0.01)) AS withdraw_available,
    CASE WHEN st.payed > 0
              AND events.ticketing_locally = TRUE
      THEN (CASE
            WHEN aviso_data ->> 'paymentType' IS NOT NULL
              THEN aviso_data ->> 'paymentType'
            WHEN aviso_data ->> 'legal_entity' = 'true'
              THEN 'LEP'
            WHEN aviso_data ->> 'bitcoin' = 'true'
              THEN 'BTC'
            ELSE 'OTH' END)
    ELSE NULL END                                                                                AS payment_type,
    CASE WHEN st.payed > 0
              AND events.ticketing_locally = TRUE
              AND ticket_orders.shop_sum_amount > 0
              AND COALESCE(ticket_orders.final_sum, money.sum) > 0
      THEN COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount
    ELSE NULL END                                                                                AS processing_commission_value,
    CASE WHEN st.payed > 0
              AND events.ticketing_locally = TRUE
              AND ticket_orders.shop_sum_amount > 0
              AND COALESCE(ticket_orders.final_sum, money.sum) > 0
      THEN FLOOR(COALESCE(ticket_orders.final_sum, money.sum) * 0.01)
    ELSE NULL END                                                                                AS evendate_commission_value,
    (SELECT COUNT(*)
     FROM tickets
     WHERE tickets.ticket_order_id = ticket_orders.id)                                           AS tickets_count,
    tickets_orders_statuses.type                                                                    ticket_order_status_type,
    ticket_orders.ticket_pricing_rule_id,
    ticket_orders.ticket_pricing_rule_discount
  FROM ticket_orders
    INNER JOIN events ON events.id = ticket_orders.event_id
    LEFT JOIN (SELECT
                 SUM(tickets.price),
                 tickets.ticket_order_id
               FROM tickets
               WHERE tickets.status = TRUE
               GROUP BY tickets.ticket_order_id) AS money(sum, ticket_order_id)
      ON money.ticket_order_id = ticket_orders.id
    LEFT JOIN (SELECT
                 COUNT(id),
                 orders_payments.ticket_order_id,
                 orders_payments.aviso_data
               FROM orders_payments
               WHERE orders_payments.canceled = FALSE AND
                     orders_payments.finished = TRUE
               GROUP BY orders_payments.ticket_order_id, aviso_data) AS st(payed, ticket_order_id, aviso_data)
      ON st.ticket_order_id = ticket_orders.id
    INNER JOIN tickets_orders_statuses ON tickets_orders_statuses.id =
                                          (CASE
                                           WHEN events.registration_approvement_required IS TRUE
                                                AND COALESCE(ticket_orders.final_sum, money.sum) :: REAL = 0 :: REAL
                                                AND
                                                (ticket_orders.order_status_id = 4 OR ticket_orders.order_status_id = 1)
                                             THEN 9 :: INT -- should not pay for tickets

                                           WHEN COALESCE(ticket_orders.final_sum, money.sum) :: REAL > 0 :: REAL
                                                AND st.payed > 0
                                             THEN 2 :: INT -- payed for tickets

                                           WHEN COALESCE(ticket_orders.final_sum, money.sum) :: REAL > 0 :: REAL
                                                AND (st.payed = 0 OR st.payed IS NULL)
                                                AND NOW() AT TIME ZONE 'UTC' - ticket_orders.created_at >
                                                    (SELECT e.booking_time * '1 hour' :: INTERVAL
                                                     FROM events AS e
                                                     WHERE e.id = ticket_orders.event_id)
                                             THEN 5 :: INT -- payment canceled auto
                                           ELSE ticket_orders.order_status_id END);
