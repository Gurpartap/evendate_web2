CREATE VIEW view_auto_notifications AS
  SELECT DISTINCT
    events_notifications.*,
    view_events.organization_id,
    view_events.title,
    organizations.short_name,
    organizations.notification_suffix,
    view_events.image_square_vertical_url,
    view_events.image_square_horizontal_url,
    notification_types.type AS notification_type_name,
    notification_types.text AS notification_type_text
  FROM events_notifications
    INNER JOIN view_events ON events_notifications.event_id = view_events.id
    INNER JOIN notification_types ON notification_types.id = events_notifications.notification_type_id
    INNER JOIN organizations ON organizations.id = view_events.organization_id
  WHERE notification_time <= NOW() AND done = FALSE;