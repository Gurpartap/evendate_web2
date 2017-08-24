CREATE TABLE events_landings (
  id         SERIAL PRIMARY KEY,
  data       JSONB     DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL

)