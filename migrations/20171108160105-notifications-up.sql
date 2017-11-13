ALTER TABLE ticket_orders
  ADD COLUMN utm_fields JSONB DEFAULT NULL;

ALTER TABLE ticket_orders
  ADD COLUMN client_info JSONB DEFAULT NULL;

CREATE TABLE broadcasts (
  id                SERIAL PRIMARY KEY,
  uuid              TEXT UNIQUE                       NOT NULL DEFAULT uuid_generate_v4(),
  event_id          INT REFERENCES events (id)        NULL,
  organization_id   INT REFERENCES organizations (id) NULL,
  creator_id        INT REFERENCES users (id),
  is_email          BOOLEAN                                    DEFAULT FALSE,
  is_push           BOOLEAN                                    DEFAULT FALSE,
  is_sms            BOOLEAN                                    DEFAULT FALSE,
  title             TEXT                              NOT NULL,
  message_text      TEXT                                       DEFAULT NULL,
  url               TEXT                                       DEFAULT NULL,
  notification_time TIMESTAMP                                  DEFAULT NOW(),
  is_active         BOOLEAN                                    DEFAULT TRUE,
  done              BOOLEAN                                    DEFAULT FALSE,
  created_at        TIMESTAMP                         NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP                                  DEFAULT NULL
);

CREATE OR REPLACE VIEW view_broadcasts
AS
  SELECT
    broadcasts.id,
    uuid,
    event_id,
    broadcasts.organization_id,
    COALESCE(broadcasts.organization_id, events.organization_id) AS owner_organization_id,
    is_email,
    is_push,
    is_sms,
    broadcasts.title,
    message_text,
    url,
    notification_time,
    is_active,
    done,
    DATE_PART('epoch', broadcasts.created_at) :: INT             AS created_at,
    DATE_PART('epoch', broadcasts.updated_at) :: INT             AS updated_at
  FROM broadcasts
    LEFT JOIN events ON broadcasts.event_id = events.id;

