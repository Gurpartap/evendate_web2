DROP VIEW view_registration_field_values;

 CREATE OR REPLACE VIEW view_registration_field_values AS
  SELECT
    view_registration_form_fields.uuid AS form_field_uuid,
    view_registration_form_fields.label AS form_field_label,
    view_registration_form_fields.field_type_id AS form_field_type_id,
    view_registration_form_fields.type AS form_field_type,
    view_registration_form_fields.required AS form_field_required,
    value,
    DATE_PART('epoch', registration_field_values.created_at) :: INT AS created_at,
    DATE_PART('epoch', registration_field_values.updated_at) :: INT AS updated_at,
    registration_field_values.ticket_order_id,
    view_tickets_orders.uuid AS ticket_order_uuid
  FROM registration_field_values
    INNER JOIN view_registration_form_fields ON registration_field_values.registration_form_field_id = view_registration_form_fields.id
    INNER JOIN view_tickets_orders ON registration_field_values.ticket_order_id = view_tickets_orders.id;
