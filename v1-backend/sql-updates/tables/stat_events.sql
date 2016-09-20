CREATE TABLE stat_events
(
  id BIGINT PRIMARY KEY NOT NULL,
  event_id BIGINT NOT NULL,
  token_id BIGINT,
  stat_type_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP,
  CONSTRAINT stat_events_token_id_fkey FOREIGN KEY (token_id) REFERENCES tokens (id),
  CONSTRAINT stat_events_stat_type_id_fkey FOREIGN KEY (stat_type_id) REFERENCES stat_event_types (id)
);
CREATE INDEX public_stat_events_token_id1_idx ON stat_events (token_id);
CREATE INDEX public_stat_events_stat_type_id0_idx ON stat_events (stat_type_id);
CREATE INDEX ON stat_events(event_id);