DROP VIEW IF EXISTS view_auto_notifications_devices;

CREATE VIEW view_auto_notifications_devices AS
  SELECT DISTINCT
    tokens.*,
    users.notify_in_browser,
    organizations.id AS organization_id
  FROM tokens
    INNER JOIN subscriptions ON subscriptions.user_id = tokens.user_id
    INNER JOIN organizations ON organizations.id = subscriptions.organization_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND subscriptions.status = TRUE
  ORDER BY tokens.id DESC;

DROP VIEW IF EXISTS  view_auto_favored_devices;

CREATE VIEW view_auto_favored_devices AS
  SELECT DISTINCT
    tokens.*,
    favorite_events.event_id,
    users.notify_in_browser
  FROM tokens
    INNER JOIN favorite_events ON favorite_events.user_id = tokens.user_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND favorite_events.status = TRUE
  ORDER BY tokens.id DESC;


DROP VIEW IF EXISTS  view_users_notifications_devices;

CREATE VIEW view_users_notifications_devices AS
  SELECT DISTINCT
    tokens.*,
    users_notifications.id AS user_notification_id,
    users.notify_in_browser
  FROM tokens
    INNER JOIN users_notifications ON users_notifications.user_id = tokens.user_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND users_notifications.status = TRUE
  ORDER BY tokens.id DESC;

DROP TABLE recommendations_organizations;
DROP TABLE recommendations_events;
DROP TABLE users_interests_aggregated;

DROP VIEW view_users_organizations;
DROP VIEW view_users_events;