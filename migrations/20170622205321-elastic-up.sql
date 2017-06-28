create or replace function get_organization_search_score(int) returns table(score float) as
$$
begin
  return query
  select t.score::float
  from temp_organization_ratings as t
  where t.organization_id = $1;
  exception when undefined_table then
  return query select 0::float;
end
$$ language plpgsql stable;


create or replace function get_event_search_score(int) returns table(score float) as
$$
begin
  return query
  select t.score::float
  from temp_event_ratings as t
  where t.event_id = $1;
  exception when undefined_table then
  return query select 0::float;
end
$$ language plpgsql stable;


ALTER TABLE registration_form_fields ADD COLUMN order_number INT;

CREATE OR REPLACE VIEW view_registration_form_fields AS
  SELECT
    registration_form_fields.id,
    registration_form_fields.uuid,
    registration_form_fields.event_id,
    registration_form_fields.field_type_id,
    registration_form_fields.label,
    registration_form_fields.required,
    registration_form_fields.status,
    registration_form_fields.created_at,
    registration_form_fields.updated_at,
    registration_field_types.field_type                                                         AS type,
    (SELECT array_to_json(array_agg(view_registration_select_values))
     FROM view_registration_select_values
     WHERE view_registration_select_values.registration_form_field_id = registration_form_fields.id) AS values,
    registration_form_fields.order_number
  FROM registration_form_fields
    INNER JOIN registration_field_types ON registration_form_fields.field_type_id = registration_field_types.id;


CREATE OR REPLACE VIEW view_tickets AS
  SELECT
    tickets.id,
    tickets.user_id,
    tickets.ticket_type_id,
    tickets.ticket_order_id,
    tickets.status,
    tickets.checked_out,
    tickets.uuid,
    view_all_ticket_types.uuid                                                                 AS ticket_type_uuid,
    view_tickets_orders.uuid                                                                   AS ticket_order_uuid,
    DATE_PART('epoch', tickets.created_at) :: INT                                              AS created_at,
    DATE_PART('epoch', tickets.updated_at) :: INT                                              AS updated_at,
    view_tickets_orders.event_id                                                               AS event_id,
    (view_tickets_orders.status_type_code IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                          AS is_canceled,
    (view_tickets_orders.status_type_code NOT IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                          AS is_active,
    view_all_ticket_types.type_code,
    view_all_ticket_types.price,
    RPAD(tickets.id :: TEXT || '00' || reverse((view_tickets_orders.id * 16) :: TEXT), 9, '0')::TEXT || ' ' AS number,
    tickets.checked_out AS checkout
  FROM tickets
    INNER JOIN view_tickets_orders ON view_tickets_orders.id = tickets.ticket_order_id
    INNER JOIN view_all_ticket_types ON view_all_ticket_types.id = tickets.ticket_type_id;

CREATE OR REPLACE VIEW view_registration_field_values AS
  SELECT
    view_registration_form_fields.uuid AS form_field_uuid,
    view_registration_form_fields.label AS form_field_label,
    view_registration_form_fields.type AS form_field_type,
    view_registration_form_fields.field_type_id AS form_field_type_id,
    view_registration_form_fields.required AS form_field_required,
    COALESCE(registration_field_values.value,
             (SELECT string_agg
             (a.a->>'value', ', ')
              FROM (SELECT jsonb_array_elements((registration_field_values.values))) as a(a)
              WHERE registration_field_values.values IS NOT NULL
                    AND registration_field_values.values != 'null')
    ) AS value,
    registration_field_values.values::JSONB,
    DATE_PART('epoch', registration_field_values.created_at) :: INT AS created_at,
    DATE_PART('epoch', registration_field_values.updated_at) :: INT AS updated_at,
    registration_field_values.ticket_order_id,
    view_tickets_orders.uuid AS ticket_order_uuid
  FROM registration_field_values
    INNER JOIN view_registration_form_fields ON registration_field_values.registration_form_field_id = view_registration_form_fields.id
    INNER JOIN view_tickets_orders ON registration_field_values.ticket_order_id = view_tickets_orders.id;

