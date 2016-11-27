DROP VIEW IF EXISTS view_auto_notifications_devices;

CREATE VIEW view_auto_notifications_devices AS
  SELECT DISTINCT
    tokens.*,
    users.notify_in_browser,
    organizations.id AS organization_id
  FROM tokens
    INNER JOIN subscriptions ON subscriptions.user_id = tokens.user_id
    INNER JOIN organizations ON organizations.id = subscriptions.organization_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND subscriptions.status = TRUE
    INNER JOIN (SELECT MAX(tokens.id) AS id
                FROM tokens
                GROUP BY tokens.device_token) AS t ON t.id = tokens.id
  ORDER BY tokens.id DESC;

DROP VIEW IF EXISTS view_auto_favored_devices;

CREATE VIEW view_auto_favored_devices AS
  SELECT DISTINCT
    tokens.*,
    favorite_events.event_id,
    users.notify_in_browser
  FROM tokens
    INNER JOIN favorite_events ON favorite_events.user_id = tokens.user_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND favorite_events.status = TRUE
    INNER JOIN (SELECT MAX(tokens.id) AS id
                FROM tokens
                GROUP BY tokens.device_token) AS t ON t.id = tokens.id
  ORDER BY tokens.id DESC;


DROP VIEW IF EXISTS view_users_notifications_devices;

CREATE VIEW view_users_notifications_devices AS
  SELECT DISTINCT
    tokens.*,
    users_notifications.id AS user_notification_id,
    users.notify_in_browser
  FROM tokens
    INNER JOIN users_notifications ON users_notifications.user_id = tokens.user_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND users_notifications.status = TRUE
    INNER JOIN (SELECT MAX(tokens.id) AS id
                FROM tokens
                GROUP BY tokens.device_token) AS t ON t.id = tokens.id

  ORDER BY tokens.id DESC;


/*RECOMMENDATIONS IMPROVEMENT*/


CREATE TABLE recommendations_organizations (
  id                                  SERIAL PRIMARY KEY NOT NULL,
  user_id                             BIGINT             NOT NULL  REFERENCES users (id),
  organization_id                     BIGINT             NOT NULL  REFERENCES organizations (id),
  rating_subscribed_friends           REAL,
  rating_active_events_count          REAL,
  rating_last_events_count            REAL,
  rating_subscribed_in_social_network REAL,
  rating_texts_similarity             REAL,
  rating                              REAL,
  updated_at                          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, organization_id)
);

CREATE TABLE recommendations_events (
  id                       SERIAL PRIMARY KEY NOT NULL,
  user_id                  BIGINT             NOT NULL  REFERENCES users (id),
  event_id                 BIGINT             NOT NULL  REFERENCES organizations (id),
  rating_favored_friends   REAL,
  rating_tags_in_favorites REAL,
  rating_tags_in_hidden    REAL,
  rating_recent_created    REAL,
  rating_active_days       REAL,
  rating_texts_similarity  REAL,
  rating                   REAL,
  updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, event_id)
);

CREATE TABLE users_interests_aggregated (
  user_id            INT NOT NULL UNIQUE,
  aggregated_text    TEXT,
  aggregated_tsquery TEXT,
  updated_at         TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE VIEW view_users_organizations AS
  SELECT
    users.id         AS user_id,
    organizations.id AS organization_id
  FROM users
    FULL OUTER JOIN organizations ON 1 = 1;

CREATE VIEW view_users_events AS
  SELECT
    users.id  AS user_id,
    events.id AS event_id
  FROM users
    FULL OUTER JOIN events ON 1 = 1;


INSERT INTO recommendations_organizations (user_id, organization_id, rating_subscribed_friends, rating_active_events_count, rating_last_events_count, rating_subscribed_in_social_network, rating_texts_similarity, rating, updated_at)
  SELECT
    user_id,
    organization_id,
    NULL AS rating_subscribed_friends,
    NULL AS rating_active_events_count,
    NULL AS rating_last_events_count,
    NULL AS rating_subscribed_in_social_network,
    NULL AS rating_texts_similarity,
    NULL AS rating,
    NULL AS updated_at
  FROM view_users_organizations
ON CONFLICT DO NOTHING;


INSERT INTO recommendations_events (user_id, event_id, rating_favored_friends, rating_tags_in_favorites, rating_tags_in_hidden, rating_recent_created, rating_active_days, rating_texts_similarity, rating, updated_at)
  SELECT
    user_id,
    organization_id,
    NULL AS rating_favored_friends,
    NULL AS rating_tags_in_favorites,
    NULL AS rating_tags_in_hidden,
    NULL AS rating_recent_created,
    NULL AS rating_active_days,
    NULL AS rating_texts_similarity,
    NULL AS rating,
    NULL AS updated_at
  FROM view_users_organizations
ON CONFLICT DO NOTHING;


CREATE VIEW view_actions AS SELECT
                              stat_events.stat_type_id,
                              stat_events.event_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code,
                              tokens.user_id,
                              NULL                                                   AS organization_id,
                              DATE_PART('epoch', MAX(stat_events.created_at)) :: INT AS created_at
                            FROM stat_events
                              INNER JOIN stat_event_types ON stat_event_types.id = stat_events.stat_type_id
                              INNER JOIN tokens ON tokens.id = stat_events.token_id
                              INNER JOIN view_events ON view_events.id = stat_events.event_id
                            WHERE
                              view_events.status = TRUE
                              AND (stat_event_types.type_code = 'fave'
                                   OR stat_event_types.type_code = 'unfave')
                            GROUP BY stat_events.event_id, tokens.user_id, stat_events.stat_type_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code
                            UNION

                            SELECT
                              stat_organizations.stat_type_id,
                              NULL                                                          AS event_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code,
                              tokens.user_id,
                              stat_organizations.organization_id                            AS organization_id,
                              DATE_PART('epoch', MAX(stat_organizations.created_at)) :: INT AS created_at
                            FROM stat_organizations
                              INNER JOIN stat_event_types ON stat_event_types.id = stat_organizations.stat_type_id
                              INNER JOIN tokens ON tokens.id = stat_organizations.token_id
                              INNER JOIN view_organizations
                                ON view_organizations.id = stat_organizations.organization_id
                            WHERE (stat_event_types.type_code = 'subscribe'
                                   OR stat_event_types.type_code = 'unsubscribe')
                            GROUP BY stat_organizations.organization_id, tokens.user_id,
                              stat_organizations.stat_type_id, stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code;