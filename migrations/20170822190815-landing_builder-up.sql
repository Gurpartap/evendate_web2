DROP TABLE IF EXISTS event_landings;

CREATE TABLE event_landings (
  id         SERIAL PRIMARY KEY,
  event_id   INT NOT NULL REFERENCES events (id),
  url        TEXT      DEFAULT uuid_generate_v4(),
  data       JSONB     DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL,
  UNIQUE (event_id, url)
);

