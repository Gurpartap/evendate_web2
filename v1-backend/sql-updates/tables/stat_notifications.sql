CREATE TABLE stat_notifications
(
  id BIGINT PRIMARY KEY NOT NULL,
  event_notification_id BIGINT NOT NULL,
  token_id BIGINT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP,
  click_time TIMESTAMP,
  received BOOLEAN DEFAULT false NOT NULL,
  message_id TEXT,
  CONSTRAINT notifications_event_notification_id_fkey FOREIGN KEY (event_notification_id) REFERENCES events_notifications (id),
  CONSTRAINT notifications_token_id_fkey FOREIGN KEY (token_id) REFERENCES tokens (id)
);
CREATE INDEX public_notifications_event_notification_id0_idx ON stat_notifications (event_notification_id);
CREATE INDEX public_notifications_token_id1_idx ON stat_notifications (token_id);
CREATE INDEX ON stat_notifications (created_at);