ALTER TABLE public.stat_organizations
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.stat_events
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;


CREATE INDEX ON stat_events(event_id);
CREATE INDEX ON stat_notifications (created_at);

DROP TABLE IF EXISTS stat_notifications_aggregated;

CREATE TABLE stat_notifications_aggregated (
  id                  SERIAL PRIMARY KEY NOT NULL,
  event_id            BIGINT             NOT NULL  REFERENCES events (id) UNIQUE,
  notifications_count BIGINT,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);