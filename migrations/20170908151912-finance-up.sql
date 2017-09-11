-- adds payment_type and commission
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
     WHERE tickets.ticket_order_id = ticket_orders.id)                                           AS tickets_count
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
                                                AND ticket_orders.order_status_id = 4
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

CREATE OR REPLACE VIEW view_event_finance AS
  SELECT
    events.id                                                                     AS event_id,
    (SELECT COUNT(id) AS checked_out_count
     FROM view_tickets
     WHERE view_tickets.event_id = events.id AND view_tickets.checked_out = TRUE) AS checked_out_count,
    SUM(view_tickets_orders.final_sum)                                            AS total_income,
    SUM(view_tickets_orders.withdraw_available)                                   AS withdraw_available,
    SUM(view_tickets_orders.processing_commission_value)                          AS processing_commission_value,
    ROUND(AVG(view_tickets_orders.processing_commission), 2)                                AS processing_commission,
    SUM(view_tickets_orders.evendate_commission_value)                            AS evendate_commission_value,
    COUNT(view_tickets_orders.id)                                                 AS orders_count
  FROM events
    INNER JOIN view_tickets_orders ON view_tickets_orders.event_id = events.id
  WHERE view_tickets_orders.status_id IN (2, 4, 8, 10, 13)
  GROUP BY events.id;


CREATE OR REPLACE VIEW view_all_ticket_types AS
  SELECT
    ticket_types.id,
    ticket_types.event_id,
    ticket_types.uuid,
    ticket_types.type_code,
    ticket_types.name,
    ticket_types.comment,
    ticket_types.price,
    DATE_PART('epoch', ticket_types.sell_start_date) :: INT AS sell_start_date,
    DATE_PART('epoch', ticket_types.sell_end_date) :: INT   AS sell_end_date,
    ticket_types.start_after_ticket_type_uuid,
    ticket_types.amount,
    ticket_types.min_count_per_user,
    ticket_types.max_count_per_user,
    ticket_types.promocode,
    ticket_types.promocode_effort,
    DATE_PART('epoch', ticket_types.created_at) :: INT      AS created_at,
    DATE_PART('epoch', ticket_types.updated_at) :: INT      AS updated_at,
    sold.count                                              AS sold_count,
    status,
    CASE
    WHEN start_after_ticket_type_code IS NOT NULL
      THEN (
        ((NOW() < sell_end_date AND NOW() > sell_start_date)
         OR (sell_end_date IS NULL AND sell_start_date < NOW())
         OR (sell_start_date IS NULL AND sell_end_date > NOW())
         OR (sell_start_date IS NULL AND sell_end_date IS NULL)
        ) = TRUE AND sold.count < ticket_types.amount
        AND (SELECT ((NOW() < tt.sell_end_date AND NOW() > tt.sell_start_date)
                     OR (tt.sell_end_date IS NULL AND tt.sell_start_date < NOW())
                     OR (tt.sell_start_date IS NULL AND tt.sell_end_date > NOW())
                     OR (tt.sell_start_date IS NULL AND tt.sell_end_date IS NULL)
                    ) = FALSE OR sold.count > tt.amount
             FROM ticket_types tt
             WHERE tt.type_code = ticket_types.start_after_ticket_type_code
                   AND tt.event_id = ticket_types.event_id)) -- checking parent type
    ELSE ((NOW() < sell_end_date AND NOW() > sell_start_date)
          OR (sell_end_date IS NULL AND sell_start_date < NOW())
          OR (sell_start_date IS NULL AND sell_end_date > NOW())
          OR (sell_start_date IS NULL AND sell_end_date IS NULL)
         )
         AND (sold.count IS NULL OR sold.count < ticket_types.amount)
    END                                                     AS is_selling,
    ticket_types.start_after_ticket_type_code
  FROM ticket_types
    LEFT JOIN (SELECT
                 COALESCE(COUNT(tickets.id), 0),
                 tickets.ticket_type_id
               FROM tickets
                 INNER JOIN ticket_orders ON tickets.ticket_order_id = ticket_orders.id
               WHERE ticket_orders.order_status_id IN (2, 4, 8, 10, 13)
               GROUP BY tickets.ticket_type_id) AS sold(count, ticket_type_id)
      ON sold.ticket_type_id = ticket_types.id
         AND ticket_types.status = TRUE;

CREATE OR REPLACE VIEW view_ticket_types AS
  SELECT
    view_all_ticket_types.id,
    view_all_ticket_types.event_id,
    view_all_ticket_types.uuid,
    view_all_ticket_types.type_code,
    view_all_ticket_types.name,
    view_all_ticket_types.comment,
    view_all_ticket_types.price,
    view_all_ticket_types.sell_start_date,
    view_all_ticket_types.sell_end_date,
    view_all_ticket_types.min_count_per_user,
    view_all_ticket_types.max_count_per_user,
    view_all_ticket_types.created_at,
    view_all_ticket_types.updated_at,
    view_all_ticket_types.amount,
    view_all_ticket_types.start_after_ticket_type_code,
    view_all_ticket_types.status,
    view_all_ticket_types.is_selling
  FROM view_all_ticket_types
  WHERE status = TRUE
        AND (type_code <> 'registration' OR type_code IS NULL)
        AND view_all_ticket_types.is_selling = TRUE;


CREATE TABLE organizations_withdraws_statuses (
  id          SERIAL PRIMARY KEY,
  type_code   TEXT      NOT NULL UNIQUE,
  description TEXT      NULL     DEFAULT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP          DEFAULT NULL
);

INSERT INTO organizations_withdraws_statuses (id, type_code, description)
VALUES (1, 'pending', 'Ожидает обработки'),
  (2, 'in_progress', 'Обрабатывается'),
  (3, 'bank_charging', 'Отправлено в банк на исполнение'),
  (4, 'completed', 'Выполнено'),
  (5, 'rejected', 'Отказано'),
  (6, 'rejected_by_organization', 'Отозвано организаторов');

DROP TABLE IF EXISTS organizations_withdraws CASCADE;

CREATE TABLE organizations_withdraws (
  id                              SERIAL PRIMARY KEY,
  organization_withdraw_status_id INT       NOT NULL REFERENCES organizations_withdraws (id) DEFAULT 1,
  sum                             NUMERIC                                                    DEFAULT 0,
  number                          INT       NULL                                             DEFAULT NULL,
  user_id                         INT       NOT NULL REFERENCES users (id),
  organization_id                 INT       NOT NULL REFERENCES organizations (id),
  comment                         TEXT      NULL                                             DEFAULT NULL,
  response                        TEXT      NULL                                             DEFAULT NULL,
  created_at                      TIMESTAMP NOT NULL                                         DEFAULT NOW(),
  updated_at                      TIMESTAMP                                                  DEFAULT NULL
);

CREATE OR REPLACE VIEW view_organization_finance AS
  SELECT
    organizations.id                                        AS organization_id,
    COALESCE(SUM(view_event_finance.total_income), 0)       AS total_income,
    COALESCE((SUM(view_event_finance.withdraw_available)
              - (SELECT COALESCE(SUM(sum), 0)
                 FROM organizations_withdraws
                 WHERE organizations_withdraws.organization_id = organizations.id
                       AND organizations_withdraws.organization_withdraw_status_id IN (1, 2, 3, 4))
             ), 0)                                          AS withdraw_available,
    SUM(view_event_finance.processing_commission_value)     AS processing_commission_value,
    ROUND(AVG(view_event_finance.processing_commission), 2) AS processing_commission,
    SUM(view_event_finance.evendate_commission_value)       AS evendate_commission_value
  FROM organizations
    LEFT JOIN events ON organizations.id = events.organization_id
    LEFT JOIN view_event_finance ON view_event_finance.event_id = events.id
  GROUP BY organizations.id;

CREATE OR REPLACE VIEW view_organizations_withdraws
AS
  SELECT
    organizations_withdraws.id,
    organizations_withdraws.sum,
    organizations_withdraws.user_id,
    organizations_withdraws.organization_id,
    organizations_withdraws.comment,
    organizations_withdraws.response,
    COALESCE(organizations_withdraws.number :: TEXT,
             RPAD(organizations_withdraws.id :: TEXT || '00' || reverse((organizations_withdraws.id * 161097) :: TEXT),
                  9, '0'))                                        AS number,
    organizations_withdraws_statuses.type_code                    AS status_type_code,
    organizations_withdraws_statuses.description                  AS status_description,
    DATE_PART('epoch', organizations_withdraws.created_at) :: INT AS created_at,
    DATE_PART('epoch', organizations_withdraws.updated_at) :: INT AS updated_at
  FROM organizations_withdraws
    INNER JOIN organizations_withdraws_statuses
      ON organizations_withdraws.organization_withdraw_status_id = organizations_withdraws_statuses.id;
