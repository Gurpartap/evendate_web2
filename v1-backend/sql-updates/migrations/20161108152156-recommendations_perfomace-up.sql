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
  id                                  SERIAL PRIMARY KEY NOT NULL,
  user_id                             BIGINT             NOT NULL  REFERENCES users (id),
  event_id                            BIGINT             NOT NULL  REFERENCES organizations (id),
  rating_favored_friends              REAL,
  rating_tags_in_favorites            REAL,
  rating_tags_in_hidden               REAL,
  rating_subscribed_in_social_network REAL,
  rating_recent_created               REAL,
  rating_active_days                  REAL,
  rating_texts_similarity             REAL,
  rating                              REAL,
  updated_at                          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, event_id)
);

ALTER TABLE users_interests
  ADD COLUMN interests_tsquery TEXT DEFAULT 'evendate';

UPDATE users_interests
SET interests_tsquery = subquery.interests_tsquery
FROM (SELECT
        users.id                                                                       AS user_id,
        array_to_string(regexp_split_to_array((SELECT string_agg(CONCAT_WS(
                                                                     ' ',
                                                                     city, education_university_name,
                                                                     education_faculty_name, education_graduation,
                                                                     occupation_name, relation, personal_political,
                                                                     personal_smoking, personal_alcohol,
                                                                     interests, movies, tv, books, games, about), ' ')
                                               FROM users_interests)
                                              ||
                                              (SELECT string_agg(vk_groups.description || ' ' || vk_groups.name, ' ')
                                               FROM vk_users_subscriptions
                                                 INNER JOIN vk_groups
                                                   ON vk_groups.id = vk_users_subscriptions.vk_group_id
                                               WHERE user_id = users.id), '\s+'), '|') AS interests_tsquery
      FROM users) AS subquery
WHERE users_interests.user_id = subquery.user_id;

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


UPDATE recommendations_organizations
SET
  rating_subscribed_friends         = (SELECT COUNT(id)
                                         FROM subscriptions
                                           INNER JOIN view_friends ON view_friends.friend_id = subscriptions.user_id
                                         WHERE subscriptions.organization_id = view_users_organizations.organization_id
                                               AND subscriptions.status = TRUE
                                               AND view_friends.user_id = view_users_organizations.user_id) :: INT,
  rating_active_events_count          = (SELECT COUNT(id) / 5
                                         FROM view_events
                                         WHERE view_events.organization_id =
                                               view_users_organizations.organization_id) :: INT,
  rating_last_events_count            = (SELECT COUNT(id) * 2
                                         FROM view_events
                                         WHERE view_events.organization_id = view_users_organizations.organization_id
                                               AND view_events.created_at >
                                                   DATE_PART('epoch', (NOW() - INTERVAL '7 days'))) :: INT,
  rating_subscribed_in_social_network = (SELECT COUNT(id) * 50
                                         FROM view_organizations vo
                                         WHERE vo.id = view_users_organizations.organization_id
                                               AND vo.vk_url_path IN
                                                   (SELECT vk_groups.screen_name
                                                    FROM vk_groups
                                                      INNER JOIN vk_users_subscriptions
                                                        ON vk_users_subscriptions.vk_group_id = vk_groups.id
                                                    WHERE
                                                      vk_users_subscriptions.user_id =
                                                      view_users_organizations.user_id)) :: INT,
  rating_texts_similarity             = (SELECT ts_rank_cd('{1.0, 0.7, 0.5, 0.3}', vo.fts, query) :: REAL AS rank
                                         FROM view_organizations AS vo, to_tsquery(
                                                                            (SELECT users_interests.interests_tsquery
                                                                             FROM users_interests
                                                                             WHERE users_interests.user_id =
                                                                                   view_users_organizations.user_id)
                                                                        ) AS query
                                         WHERE vo.id = view_users_organizations.organization_id) :: REAL
FROM (SELECT *
      FROM view_users_organizations) AS view_users_organizations
WHERE view_users_organizations.user_id = recommendations_organizations.user_id
AND view_users_organizations.organization_id = recommendations_organizations.organization_id;

INSERT INTO recommendations_organizations(user_id, organization_id, rating_subscribed_friends, rating_active_events_count, rating_last_events_count, rating_subscribed_in_social_network, rating_texts_similarity, rating, updated_at)
    SELECT user_id, organization_id,
      NULL AS rating_subscribed_friends,
      NULL AS rating_active_events_count,
      NULL AS rating_last_events_count,
      NULL AS rating_subscribed_in_social_network,
      NULL AS rating_texts_similarity,
      NULL AS rating,
      NULL AS updated_at
      FROM view_users_organizations
ON CONFLICT DO NOTHING;

UPDATE recommendations_organizations
SET
  rating_subscribed_friends         = subquery.rating_subscribed_friends,
  rating_active_events_count          = subquery.rating_active_events_count,
  rating_last_events_count            = subquery.rating_last_events_count,
  rating_subscribed_in_social_network = subquery.rating_subscribed_in_social_network,
  rating_texts_similarity             = subquery.rating_texts_similarity,
  updated_at = NOW()
FROM (SELECT view_users_organizations.*,

        (SELECT COUNT(id)
         FROM subscriptions
           INNER JOIN view_friends ON view_friends.friend_id = subscriptions.user_id
         WHERE subscriptions.organization_id = view_users_organizations.organization_id
               AND subscriptions.status = TRUE
               AND view_friends.user_id = view_users_organizations.user_id) :: INT AS rating_subscribed_friends,

        (SELECT COUNT(id) / 5
         FROM view_events
         WHERE view_events.organization_id =
               view_users_organizations.organization_id) :: INT AS rating_active_events_count,


        (SELECT COUNT(id) * 2
         FROM view_events
         WHERE view_events.organization_id = view_users_organizations.organization_id
               AND view_events.created_at >
                   DATE_PART('epoch', (NOW() - INTERVAL '7 days'))) :: INT AS rating_last_events_count,

        (SELECT COUNT(id) * 50
         FROM view_organizations vo
         WHERE vo.id = view_users_organizations.organization_id
               AND vo.vk_url_path IN
                   (SELECT vk_groups.screen_name
                    FROM vk_groups
                      INNER JOIN vk_users_subscriptions
                        ON vk_users_subscriptions.vk_group_id = vk_groups.id
                    WHERE
                      vk_users_subscriptions.user_id =
                      view_users_organizations.user_id)) :: INT AS rating_subscribed_in_social_network,

        (SELECT ts_rank_cd('{1.0, 0.7, 0.5, 0.3}', vo.fts, query) :: REAL AS rank
         FROM view_organizations AS vo, to_tsquery(
                                            (SELECT users_interests.interests_tsquery
                                             FROM users_interests
                                             WHERE users_interests.user_id =
                                                   view_users_organizations.user_id)
                                        ) AS query
         WHERE vo.id = view_users_organizations.organization_id) :: REAL AS rating_texts_similarity

      FROM view_users_organizations) AS subquery
WHERE subquery.user_id = recommendations_organizations.user_id
AND subquery.organization_id = recommendations_organizations.organization_id;