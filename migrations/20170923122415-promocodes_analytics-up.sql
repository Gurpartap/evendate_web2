ALTER TABLE tickets_orders_statuses
  ADD COLUMN type TEXT;

UPDATE tickets_orders_statuses
SET type = 'red'
WHERE id IN (3, 5, 6, 7, 11);

UPDATE tickets_orders_statuses
SET type = 'yellow'
WHERE id IN (1, 9, 12);

UPDATE tickets_orders_statuses
SET type = 'green'
WHERE id IN (2, 4, 8, 10, 13);

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
     WHERE tickets.ticket_order_id = ticket_orders.id)                                           AS tickets_count,
    tickets_orders_statuses.type                                                                    ticket_order_status_type
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
                                                AND (ticket_orders.order_status_id = 4 OR ticket_orders.order_status_id = 1)
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


CREATE OR REPLACE VIEW view_promocodes AS
  SELECT
    id,
    uuid,
    event_id,
    code,
    is_fixed,
    is_percentage,
    effort,
    DATE_PART('epoch', promocodes.start_date :: TIMESTAMP) :: INT                                     AS start_date,
    DATE_PART('epoch', promocodes.end_date :: TIMESTAMP) :: INT                                       AS end_date,
    enabled,
    DATE_PART('epoch', promocodes.created_at :: TIMESTAMP) :: INT                                     AS created_at,
    DATE_PART('epoch', promocodes.updated_at :: TIMESTAMP) :: INT                                     AS updated_at,
    ((NOW() BETWEEN promocodes.start_date AND promocodes.end_date) AND
     (SELECT COUNT(view_tickets_orders.id)
      FROM view_tickets_orders
        INNER JOIN events ON events.id = view_tickets_orders.event_id
      WHERE view_tickets_orders.event_id = promocodes.event_id
            AND view_tickets_orders.promocode_id = promocodes.id
            AND (view_tickets_orders.ticket_order_status_type = 'green'
                 OR view_tickets_orders.ticket_order_status_type = 'yellow')) < promocodes.use_limit) AS
                                                                                                         is_active,
    use_limit,
    (SELECT COUNT(view_tickets_orders.id)
     FROM view_tickets_orders
       INNER JOIN events ON events.id = view_tickets_orders.event_id
     WHERE view_tickets_orders.event_id = promocodes.event_id
           AND view_tickets_orders.promocode_id = promocodes.id
           AND (view_tickets_orders.ticket_order_status_type = 'green'
                OR view_tickets_orders.ticket_order_status_type = 'yellow')
    )                                                                                                 AS used_times
  FROM promocodes;

CREATE OR REPLACE VIEW view_event_finance AS
  SELECT
    events.id                                                                     AS event_id,
    (SELECT COUNT(id) AS checked_out_count
     FROM view_tickets
     WHERE view_tickets.event_id = events.id AND view_tickets.checked_out = TRUE) AS checked_out_count,
    SUM(view_tickets_orders.final_sum)                                            AS total_income,
    SUM(view_tickets_orders.withdraw_available)                                   AS withdraw_available,
    SUM(view_tickets_orders.processing_commission_value)                          AS processing_commission_value,
    ROUND(AVG(view_tickets_orders.processing_commission), 2)                      AS processing_commission,
    SUM(view_tickets_orders.evendate_commission_value)                            AS evendate_commission_value,
    COUNT(view_tickets_orders.id)                                                 AS orders_count
  FROM events
    INNER JOIN view_tickets_orders ON view_tickets_orders.event_id = events.id
  WHERE view_tickets_orders.ticket_order_status_type = 'green'
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
                 INNER JOIN tickets_orders_statuses ON ticket_orders.order_status_id = tickets_orders_statuses.id
               WHERE tickets_orders_statuses.type = 'green'
               GROUP BY tickets.ticket_type_id) AS sold(count, ticket_type_id)
      ON sold.ticket_type_id = ticket_types.id
         AND ticket_types.status = TRUE;


CREATE OR REPLACE VIEW view_tickets AS
  SELECT
    tickets.id,
    tickets.user_id,
    tickets.ticket_type_id,
    tickets.ticket_order_id,
    tickets.status,
    tickets.checked_out,
    tickets.uuid,
    view_all_ticket_types.uuid                                                                                AS ticket_type_uuid,
    view_tickets_orders.uuid                                                                                  AS ticket_order_uuid,
    DATE_PART('epoch',
              tickets.created_at) :: INT                                                                      AS created_at,
    DATE_PART('epoch',
              tickets.updated_at) :: INT                                                                      AS updated_at,
    view_tickets_orders.event_id                                                                              AS event_id,
    (view_tickets_orders.status_type_code IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                                         AS is_canceled,
    (view_tickets_orders.status_type_code NOT IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                                         AS is_active,
    view_all_ticket_types.type_code,
    view_all_ticket_types.price,
    RPAD(tickets.id :: TEXT || '00' || reverse((view_tickets_orders.id * 16) :: TEXT), 9, '0') :: TEXT || ' ' AS number,
    tickets.checked_out                                                                                       AS checkout,
    view_tickets_orders.ticket_order_status_type                                                              AS order_status_type
  FROM tickets
    INNER JOIN view_tickets_orders ON view_tickets_orders.id = tickets.ticket_order_id
    INNER JOIN view_all_ticket_types ON view_all_ticket_types.id = tickets.ticket_type_id;
