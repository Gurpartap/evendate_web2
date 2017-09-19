INSERT INTO notification_types (id, type, timediff, text)
VALUES (50, 'notification-new-organizations', -1, '{first_name}, мы подобрали для вас интересные огранизации')
ON CONFLICT (id)
  DO UPDATE SET
    text = '{first_name}, новые и интересные места появились в каталоге';

INSERT INTO notification_types (id, type, timediff, text)
VALUES (51, 'notification-friend-interests', -1, '{first_name} {last_name}{friends_count} интересуется {event_title}')
ON CONFLICT (id)
  DO UPDATE SET
    text = '{first_name} {last_name}{friends_count} интересуется {event_title}';

DROP TABLE notifications_recommendations CASCADE;
DROP TABLE stat_notifications_recommendations CASCADE;

CREATE TABLE notifications_recommendations (
  id                   SERIAL PRIMARY KEY,
  user_id              INT       NOT NULL REFERENCES users (id),
  notification_type_id INT       NOT NULL REFERENCES notification_types (id),
  done                 BOOLEAN   NOT NULL DEFAULT FALSE,
  data                 JSONB              DEFAULT NULL,
  status               BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMP          DEFAULT NULL
);

CREATE TABLE stat_notifications_recommendations (
  id                              SERIAL PRIMARY KEY,
  notifications_recommendation_id INT NOT NULL REFERENCES notifications_recommendations (id),
  message_id                      TEXT      DEFAULT NULL,
  token_id                        INT NOT NULL REFERENCES tokens (id),
  created_at                      TIMESTAMP DEFAULT NOW(),
  updated_at                      TIMESTAMP DEFAULT NULL
);

CREATE OR REPLACE VIEW view_recommendations_organizations_notifications AS
  SELECT DISTINCT
    (users.id)            AS user_id,
    notification_types.id AS notification_type_id
  FROM users
    LEFT JOIN log_requests ON log_requests.user_id = users.id
                              AND log_requests.class = 'organizations' AND log_requests.method_name = 'types'
                              AND log_requests.created_at > (NOW() - INTERVAL '7 days')
    LEFT JOIN notifications_recommendations ON notifications_recommendations.user_id = users.id
                                               AND
                                               notifications_recommendations.created_at > (NOW() - INTERVAL '7 days')
    INNER JOIN notification_types ON notification_types.type = 'notification-new-organizations'
  WHERE log_requests.id IS NULL
        AND notifications_recommendations.id IS NULL;


CREATE OR REPLACE VIEW view_recommendations_friend_interests_notifications AS
  SELECT DISTINCT
    (view_friends.friend_id)                    AS user_id,
    notification_types.id                       AS notification_type_id,
    stat_events.event_id,
    (SELECT COUNT(DISTINCT (vf.friend_id))
     FROM view_friends vf
       INNER JOIN favorite_events
         ON favorite_events.user_id = vf.friend_id AND favorite_events.event_id = stat_events.event_id
     WHERE vf.user_id = view_friends.friend_id) AS favored_friends_count,
    notifications_recommendations.id
  FROM stat_events
    INNER JOIN stat_event_types ON stat_event_types.id = stat_events.stat_type_id
    INNER JOIN tokens ON stat_events.token_id = tokens.id
    INNER JOIN view_friends ON tokens.user_id = view_friends.user_id
    INNER JOIN notification_types ON notification_types.id = 51
    LEFT JOIN notifications_recommendations
      ON notification_types.id = notifications_recommendations.notification_type_id
         AND notifications_recommendations.user_id = view_friends.friend_id
         AND (notifications_recommendations.data ->> 'event_id') :: INT = stat_events.event_id
  WHERE stat_event_types.type_code = 'fave' AND stat_event_types.entity = 'event'
        AND stat_events.created_at > (NOW() - INTERVAL '2 hours')
        AND notifications_recommendations.id IS NULL;

INSERT INTO notifications_recommendations (user_id, notification_type_id, data)
  SELECT
    user_id,
    notification_type_id,
    ('{"event_id": ' || event_id || ', "friends_count": ' || favored_friends_count || '}') :: JSONB AS data
  FROM view_recommendations_friend_interests_notifications;


CREATE OR REPLACE VIEW view_notifications_send_devices_for_user AS
  SELECT device_token,
    id,
    token,
    user_id,
    created_at,
    updated_at,
    token_type,
    expires_on,
    client_type,
    device_name
  FROM tokens
    WHERE id IN (SELECT MAX(id) FROM tokens AS tks GROUP BY tks.device_token, user_id);


CREATE OR REPLACE VIEW view_sold_tickets AS
  SELECT
    tickets.id,
    tickets.ticket_type_id,
    ticket_orders.event_id
  FROM tickets
    INNER JOIN ticket_orders ON tickets.ticket_order_id = ticket_orders.id
  WHERE tickets.ticket_order_id IN (1, 2, 4, 8, 9,
                                    10, 13)
  GROUP BY tickets.ticket_type_id, tickets.id, event_id;