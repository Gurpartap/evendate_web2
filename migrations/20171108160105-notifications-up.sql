-- adds field for utm
ALTER TABLE ticket_orders
  ADD COLUMN utm_fields JSONB DEFAULT NULL;

-- adds field for utm
ALTER TABLE stat_events
  ADD COLUMN utm_fields JSONB DEFAULT NULL;

-- adds field for user-agent info
ALTER TABLE tokens
  ADD COLUMN user_agent_info JSONB DEFAULT NULL;

-- adds field for user-agent info
ALTER TABLE tokens
  ADD COLUMN user_agent TEXT DEFAULT NULL;

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


ALTER TABLE broadcasts
  ADD COLUMN subject TEXT DEFAULT NULL;

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
    DATE_PART('epoch', broadcasts.updated_at) :: INT             AS updated_at,
    subject
  FROM broadcasts
    LEFT JOIN events ON broadcasts.event_id = events.id;

CREATE OR REPLACE VIEW view_stats_utm AS
  SELECT
    stat_events.utm_fields ->> 'utm_source'   AS utm_source,
    stat_events.utm_fields ->> 'utm_medium'   AS utm_medium,
    stat_events.utm_fields ->> 'utm_campaign' AS utm_campaign,
    stat_events.utm_fields ->> 'utm_content'  AS utm_content,
    stat_events.utm_fields ->> 'utm_term'     AS utm_term,
    COUNT(*) AS open_count,
    ((SELECT COUNT(*)
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
      AND stat_events.event_id = view_tickets_orders.event_id
      AND ticket_orders.utm_fields = stat_events.utm_fields
    ) / COUNT(*)) AS conversion,
    (SELECT SUM(COALESCE(view_tickets_orders.final_sum, 0) )
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
      AND stat_events.event_id = view_tickets_orders.event_id
      AND ticket_orders.utm_fields = stat_events.utm_fields
    ) AS orders_sum,
    event_id
  FROM events
    INNER JOIN stat_events ON stat_events.event_id = events.id
  WHERE
    stat_events.utm_fields IS NOT NULL
    AND utm_fields :: TEXT <> '{}'
GROUP BY utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
event_id,
utm_fields;

