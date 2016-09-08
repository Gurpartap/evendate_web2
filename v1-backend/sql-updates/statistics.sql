DROP TABLE IF EXISTS stat_notifications_aggregated;

CREATE TABLE stat_notifications_aggregated (
  id                  SERIAL PRIMARY KEY NOT NULL,
  event_id            BIGINT             NOT NULL  REFERENCES events (id) UNIQUE,
  notifications_count BIGINT,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.stat_users
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.stat_organizations
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.stat_events
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;


CREATE VIEW view_statistics_minutes AS SELECT *
FROM generate_series('2015-12-15' :: TIMESTAMP, NOW(), '1 minute');

CREATE VIEW view_statistics_hours AS SELECT *
FROM generate_series('2015-12-15' :: TIMESTAMP, NOW(), '1 hour');

CREATE VIEW view_statistics_days AS SELECT *
FROM generate_series('2015-12-15' :: TIMESTAMP, NOW(), '1 day');