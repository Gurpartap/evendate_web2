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
    ELSE NULL END                                                                                AS evendate_commission_value
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
    AVG(view_tickets_orders.processing_commission)                                AS processing_commission,
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



SELECT
  SUM(view_tickets_orders.final_sum)::INT AS value,
  DATE_PART('epoch', ts.time_value)::INT AS time_value
FROM view_tickets_orders
  RIGHT OUTER JOIN (SELECT *
                    FROM generate_series(to_timestamp(:till), to_timestamp(:since), '-1 days')) AS ts(time_value)
    ON to_timestamp(view_tickets_orders.created_at) <= ts.time_value AND view_tickets_orders.payed > 0
GROUP BY ts.time_value
ORDER BY ts.time_value;
