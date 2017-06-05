CREATE OR REPLACE VIEW view_tickets_orders AS
  SELECT
    ticket_orders.id,
    ticket_orders.uuid,
    ticket_orders.user_id,
    ticket_orders.order_content,
    ticket_orders.event_id,
    ticket_orders.is_canceled,
    DATE_PART('epoch', ticket_orders.payed_at) :: INT    AS payed_at,
    DATE_PART('epoch', ticket_orders.canceled_at) :: INT AS canceled_at,
    DATE_PART('epoch', ticket_orders.created_at) :: INT  AS created_at,
    DATE_PART('epoch', ticket_orders.updated_at) :: INT  AS updated_at,
    tickets_orders_statuses.type_code                    AS status_type_code,
    tickets_orders_statuses.name                         AS status_name,
    tickets_orders_statuses.id                           AS status_id,
    RPAD(ticket_orders.id :: TEXT || '00' || reverse((ticket_orders.id * 1610) :: TEXT), 9, '0') AS number

  FROM ticket_orders
    INNER JOIN tickets_orders_statuses ON tickets_orders_statuses.id = ticket_orders.order_status_id;
