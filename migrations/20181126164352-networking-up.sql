ALTER TABLE events
  ADD COLUMN networking_code INT DEFAULT (random() * 999999 + 1) NOT NULL;

DROP TABLE IF EXISTS users_profiles CASCADE;

CREATE TABLE users_profiles (
  user_id       INT REFERENCES users (id),
  first_name    TEXT               DEFAULT NULL,
  last_name     TEXT               DEFAULT NULL,
  avatar_url    TEXT               DEFAULT NULL,
  info          TEXT               DEFAULT NULL,
  looking_for   TEXT               DEFAULT NULL,
  vk_url        TEXT               DEFAULT NULL, --vk.com/username
  facebook_url  TEXT               DEFAULT NULL, --facebook.com/username
  twitter_url   TEXT               DEFAULT NULL, --twitter.com/username
  linkedin_url  TEXT               DEFAULT NULL, --linkedin.com/in/username
  telegram_url  TEXT               DEFAULT NULL, --t.me/username
  instagram_url TEXT               DEFAULT NULL, --instagram.com/username
  github_url    TEXT               DEFAULT NULL, --github.com/username
  email         TEXT               DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP          DEFAULT NULL,
  UNIQUE (user_id)
);

DROP TABLE IF EXISTS networking_goals;


CREATE TABLE networking_goals (
  id           SERIAL PRIMARY KEY,
  event_id     INT REFERENCES events (id),
  user_id      INT REFERENCES users (id),
  info         TEXT               DEFAULT NULL,
  looking_for  TEXT               DEFAULT NULL,
  company_name TEXT               DEFAULT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP          DEFAULT NULL,
  UNIQUE (event_id, user_id)
);

CREATE TABLE networking_access (
  id         SERIAL PRIMARY KEY,
  event_id   INT REFERENCES events (id)        NULL,
  user_id    INT REFERENCES users (id),
  status     BOOLEAN                                    DEFAULT TRUE,
  created_at TIMESTAMP                         NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP                                  DEFAULT NULL,
  UNIQUE (event_id, user_id)
);

DROP VIEW IF EXISTS view_networking_access;

CREATE OR REPLACE VIEW view_networking_access AS
  (SELECT
     event_id,
     user_id
   FROM networking_access
   WHERE networking_access.status = TRUE)
  UNION
  (SELECT DISTINCT ON (event_id, user_id)
     event_id,
     user_id
   FROM view_tickets
   WHERE view_tickets.order_status_type = 'green')
  UNION
  (SELECT
     id AS event_id,
     user_id
   FROM events
     INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id
   WHERE users_organizations.status = TRUE);


DROP TABLE IF EXISTS networking_requests;

CREATE TABLE networking_requests (
  id                SERIAL PRIMARY KEY,
  uuid              TEXT UNIQUE                       NOT NULL DEFAULT uuid_generate_v4(),
  event_id          INT REFERENCES events (id)        NOT NULL,
  sender_user_id    INT REFERENCES users (id)         NOT NULL,
  recipient_user_id INT REFERENCES users (id)         NOT NULL,
  message           TEXT                                       DEFAULT NULL,
  status            BOOLEAN                                    DEFAULT TRUE,
  accept_status     BOOLEAN                                    DEFAULT NULL,
  accepted_at       TIMESTAMP                         NULL     DEFAULT NULL,
  created_at        TIMESTAMP                         NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP                                  DEFAULT NULL,
  UNIQUE (event_id, sender_user_id, recipient_user_id)
);

CREATE OR REPLACE VIEW view_networking_profiles_access
AS
  SELECT
    users_profiles.*,
    sender_user_id
  FROM networking_requests
    INNER JOIN users_profiles ON networking_requests.recipient_user_id = users_profiles.user_id

  WHERE
    networking_requests.accept_status = TRUE
    AND networking_requests.status = TRUE;

DROP VIEW IF EXISTS view_networking_profiles;

CREATE OR REPLACE VIEW view_networking_profiles AS
  SELECT
    users.id,
    u2.id                                                              AS for_id,
    COALESCE(users_profiles.first_name, users.first_name)              AS first_name,
    COALESCE(users_profiles.last_name, users.last_name)                AS last_name,
    COALESCE(users_profiles.avatar_url, users.avatar_url)              AS avatar_url,
    view_networking_access.event_id,
    view_networking_access.user_id,
    COALESCE(networking_goals.info, users_profiles.info)               AS info,
    COALESCE(networking_goals.looking_for, users_profiles.looking_for) AS looking_for,
    vk_url,
    facebook_url,
    twitter_url,
    linkedin_url,
    telegram_url,
    instagram_url,
    github_url,
    users_profiles.email,
    networking_goals.company_name,
    DATE_PART('epoch', networking_goals.created_at) :: INT             AS created_at,
    DATE_PART('epoch', networking_goals.updated_at) :: INT             AS updated_at,
    CASE WHEN networking_goals.info IS NOT NULL OR networking_goals.created_at IS NOT NULL
      THEN TRUE
    ELSE FALSE END                                                     AS signed_up,
    networking_requests.uuid IS NOT NULL                               AS request_exists,
    networking_requests.accept_status                                  AS request_status
  FROM users
    FULL OUTER JOIN users u2 ON 1 = 1
    LEFT JOIN view_networking_access ON view_networking_access.user_id = users.id
    LEFT JOIN users_profiles ON users.id = (
      CASE WHEN ((SELECT COUNT(*)
                  FROM networking_requests
                  WHERE networking_requests.recipient_user_id = users.id
                        AND networking_requests.sender_user_id = u2.id
                        AND networking_requests.status = TRUE
                        AND networking_requests.accept_status = TRUE) > 0) OR (users.id = u2.id)
        THEN users_profiles.user_id
      ELSE -1 END)

    LEFT JOIN networking_goals
      ON users.id = networking_goals.user_id AND networking_goals.event_id = view_networking_access.event_id
    LEFT JOIN networking_requests ON u2.id = networking_requests.recipient_user_id
                                     AND networking_requests.event_id = view_networking_access.event_id
                                     AND networking_requests.status = TRUE
  ORDER BY users.id;

DROP VIEW IF EXISTS view_networking_requests;

CREATE OR REPLACE VIEW view_networking_requests AS
  SELECT
    uuid,
    event_id,
    sender_user_id,
    recipient_user_id,
    message,
    status,
    accept_status,
    DATE_PART('epoch', networking_requests.accepted_at) :: INT AS accepted_at,
    DATE_PART('epoch', networking_requests.created_at) :: INT  AS created_at,
    DATE_PART('epoch', networking_requests.updated_at) :: INT  AS updated_at
  FROM
    networking_requests;

--UPDATES
CREATE OR REPLACE VIEW view_networking_profiles AS
  SELECT
    users.id,
    u2.id                                                              AS for_id,
    COALESCE(users_profiles.first_name, users.first_name)              AS first_name,
    COALESCE(users_profiles.last_name, users.last_name)                AS last_name,
    COALESCE(users_profiles.avatar_url, users.avatar_url)              AS avatar_url,
    view_networking_access.event_id,
    view_networking_access.user_id,
    COALESCE(networking_goals.info, users_profiles.info)               AS info,
    COALESCE(networking_goals.looking_for, users_profiles.looking_for) AS looking_for,
    vk_url,
    facebook_url,
    twitter_url,
    linkedin_url,
    telegram_url,
    instagram_url,
    github_url,
    users_profiles.email,
    networking_goals.company_name,
    DATE_PART('epoch', networking_goals.created_at) :: INT             AS created_at,
    DATE_PART('epoch', networking_goals.updated_at) :: INT             AS updated_at,
    CASE WHEN networking_goals.info IS NOT NULL OR networking_goals.created_at IS NOT NULL
      THEN TRUE
    ELSE FALSE END                                                     AS signed_up,
    networking_requests.uuid IS NOT NULL                               AS request_exists,
    networking_requests.accept_status                                  AS request_status,
    networking_requests.uuid,
    networking_requests.uuid                                           AS request_uuid

  FROM users
    FULL OUTER JOIN users u2 ON 1 = 1
    LEFT JOIN view_networking_access ON view_networking_access.user_id = users.id
    LEFT JOIN users_profiles ON users.id = (
      CASE WHEN ((SELECT COUNT(*)
                  FROM networking_requests
                  WHERE networking_requests.recipient_user_id = users.id
                        AND networking_requests.sender_user_id = u2.id
                        AND networking_requests.status = TRUE
                        AND networking_requests.accept_status = TRUE) > 0) OR (users.id = u2.id)
        THEN users_profiles.user_id
      ELSE -1 END)

    LEFT JOIN networking_goals
      ON users.id = networking_goals.user_id AND networking_goals.event_id = view_networking_access.event_id
    LEFT JOIN networking_requests ON u2.id = networking_requests.recipient_user_id
                                     AND networking_requests.event_id = view_networking_access.event_id
                                     AND networking_requests.status = TRUE
                                     AND networking_requests.sender_user_id = users.id
  ORDER BY users.id;
