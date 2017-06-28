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


SELECT * FROM registration_form_fields WHERE event_id=5806 ORDER BY order_number