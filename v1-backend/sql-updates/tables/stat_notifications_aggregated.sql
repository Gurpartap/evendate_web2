DROP TABLE IF EXISTS stat_notifications_aggregated;

CREATE TABLE stat_notifications_aggregated (
  id                  SERIAL PRIMARY KEY NOT NULL,
  event_id            BIGINT             NOT NULL  REFERENCES events (id) UNIQUE,
  notifications_count BIGINT,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);