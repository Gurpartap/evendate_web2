CREATE OR REPLACE VIEW view_dates AS
  SELECT DISTINCT
    events_dates.id,
    events_dates.event_id,
    DATE_PART('epoch', events_dates.event_date) :: INT AS event_date,
    events_dates.start_time,
    events_dates.end_time,
    organization_id,
    DATE_PART('epoch', events_dates.created_at) :: INT AS created_at,
    DATE_PART('epoch', events_dates.updated_at) :: INT AS updated_at,
    DATE_PART('epoch', events_dates.start_time_utc) :: INT AS start_datetime_utc,
    DATE_PART('epoch', events_dates.end_time_utc) :: INT AS end_datetime_utc
  FROM events_dates
    INNER JOIN events ON events_dates.event_id = events.id AND events_dates.status = TRUE;
