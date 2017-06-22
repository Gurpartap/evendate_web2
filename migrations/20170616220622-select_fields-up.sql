INSERT INTO registration_field_types (id, field_type, description)
VALUES (7, 'select', 'Radio buttons'), (8, 'select_multi', 'Checkbox buttons');

UPDATE registration_field_types
SET description = 'Выбор одного варианта'
WHERE id = 7;
UPDATE registration_field_types
SET description = 'Выбор нескольких вариантов'
WHERE id = 8;

CREATE TABLE registration_select_values (
  id                         SERIAL PRIMARY KEY,
  registration_form_field_id INT REFERENCES registration_form_fields (id) NOT NULL,
  uuid                       TEXT UNIQUE                                  NOT NULL DEFAULT uuid_generate_v4(),
  value                      TEXT                                         NOT NULL,
  status                     BOOLEAN                                               DEFAULT TRUE,
  created_at                 TIMESTAMP                                             DEFAULT NOW(),
  updated_at                 TIMESTAMP                                             DEFAULT NULL
);

CREATE OR REPLACE VIEW view_registration_select_values AS
  SELECT
    registration_select_values.registration_form_field_id,
    registration_select_values.uuid,
    registration_select_values.value,
    DATE_PART('epoch', registration_select_values.created_at) :: INT AS created_at,
    DATE_PART('epoch', registration_select_values.updated_at) :: INT    updated_at
  FROM registration_select_values
  WHERE registration_select_values.status = TRUE;


CREATE OR REPLACE VIEW view_registration_form_fields AS
  SELECT
    registration_form_fields.*,
    registration_field_types.field_type                                                         AS type,
    (SELECT array_to_json(array_agg(view_registration_select_values))
     FROM view_registration_select_values
     WHERE view_registration_select_values.registration_form_field_id = registration_form_fields.id) AS values
  FROM registration_form_fields
    INNER JOIN registration_field_types ON registration_form_fields.field_type_id = registration_field_types.id;


ALTER TABLE registration_field_values ADD COLUMN values JSONB DEFAULT NULL;

CREATE OR REPLACE VIEW view_tickets_orders AS
  SELECT
    ticket_orders.id,
    ticket_orders.uuid,
    ticket_orders.user_id,
    ticket_orders.order_content,
    ticket_orders.event_id,
    ticket_orders.is_canceled,
    DATE_PART('epoch', ticket_orders.payed_at) :: INT                                            AS payed_at,
    DATE_PART('epoch', ticket_orders.canceled_at) :: INT                                         AS canceled_at,
    DATE_PART('epoch', ticket_orders.created_at) :: INT                                          AS created_at,
    DATE_PART('epoch', ticket_orders.updated_at) :: INT                                          AS updated_at,
    tickets_orders_statuses.type_code                                                            AS status_type_code,
    tickets_orders_statuses.name                                                                 AS status_name,
    tickets_orders_statuses.id                                                                   AS status_id,
    RPAD(ticket_orders.id :: TEXT || '00' || reverse((ticket_orders.id * 1610) :: TEXT), 9, '0') AS number

  FROM ticket_orders
    INNER JOIN events ON events.id = ticket_orders.event_id
    INNER JOIN tickets_orders_statuses ON tickets_orders_statuses.id =
                                          (CASE WHEN events.registration_approvement_required IS TRUE AND
                                                     ticket_orders.order_status_id = 4
                                            THEN 9 :: INT
                                           ELSE ticket_orders.order_status_id END);


DROP VIEW view_registration_field_values;
CREATE OR REPLACE VIEW view_registration_field_values AS
  SELECT
    view_registration_form_fields.uuid AS form_field_uuid,
    view_registration_form_fields.label AS form_field_label,
    view_registration_form_fields.type AS form_field_type,
    view_registration_form_fields.field_type_id AS form_field_type_id,
    view_registration_form_fields.required AS form_field_required,
    registration_field_values.value,
    registration_field_values.values::JSONB,
    DATE_PART('epoch', registration_field_values.created_at) :: INT AS created_at,
    DATE_PART('epoch', registration_field_values.updated_at) :: INT AS updated_at,
    registration_field_values.ticket_order_id,
    view_tickets_orders.uuid AS ticket_order_uuid
  FROM registration_field_values
    INNER JOIN view_registration_form_fields ON registration_field_values.registration_form_field_id = view_registration_form_fields.id
    INNER JOIN view_tickets_orders ON registration_field_values.ticket_order_id = view_tickets_orders.id;
