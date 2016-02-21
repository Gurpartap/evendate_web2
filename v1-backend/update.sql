ALTER TABLE public.users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.tokens ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.subscriptions ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.users ADD gender BOOLEAN DEFAULT NULL  NULL;
ALTER TABLE public.users ALTER COLUMN gender TYPE VARCHAR(50) USING gender :: VARCHAR(50);
ALTER TABLE public.users ALTER COLUMN gender SET DEFAULT NULL;

ALTER TABLE public.vk_sign_in ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.facebook_sign_in ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.google_sign_in ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.vk_friends ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.facebook_friends ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.google_friends ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.events_dates ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.hidden_events ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.events_tags ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.events_dates ALTER COLUMN event_date TYPE DATE USING event_date :: DATE;
ALTER TABLE public.events_dates ADD start_time TIME DEFAULT NULL NULL;
ALTER TABLE public.events_dates ADD end_time TIME DEFAULT NULL NULL;

ALTER TABLE public.events ADD dates_range BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.events ALTER COLUMN location_uri SET DEFAULT NULL;
ALTER TABLE public.events ALTER COLUMN event_start_date SET DEFAULT NULL;
ALTER TABLE public.events ALTER COLUMN notifications_schema_json SET DEFAULT NULL;
ALTER TABLE public.events ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.events ALTER COLUMN event_end_date SET DEFAULT NULL;
ALTER TABLE public.events ALTER COLUMN event_type_id SET DEFAULT NULL;
ALTER TABLE public.events ALTER COLUMN begin_time SET DEFAULT NULL;
ALTER TABLE public.events ALTER COLUMN end_time SET DEFAULT NULL;

ALTER TABLE public.events ADD COLUMN images_domain VARCHAR(50) DEFAULT 'http://evendate.ru/' NULL;
ALTER TABLE public.organizations ADD COLUMN images_domain VARCHAR(50) DEFAULT 'http://evendate.ru/' NULL;

ALTER TABLE public.organizations ADD vk_url_path TEXT DEFAULT NULL NULL;
ALTER TABLE public.organizations ADD facebook_url_path TEXT DEFAULT NULL  NULL;

ALTER TABLE public.tags DROP status;
ALTER TABLE public.tags ADD status BOOLEAN DEFAULT TRUE NOT NULL;

ALTER TABLE public.subscriptions ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.subscriptions
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.subscriptions DROP status;
ALTER TABLE public.subscriptions RENAME COLUMN new_status TO status;

ALTER TABLE public.organizations ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.organizations
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.organizations DROP status;
ALTER TABLE public.organizations RENAME COLUMN new_status TO status;

/*Favorites*/
ALTER TABLE public.favorite_events ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.favorite_events
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.favorite_events DROP status;
ALTER TABLE public.favorite_events RENAME COLUMN new_status TO status;

/*Event_Tags*/
ALTER TABLE public.events_tags ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.events_tags
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.events_tags DROP status;
ALTER TABLE public.events_tags RENAME COLUMN new_status TO status;

/*Hidden_Events*/
ALTER TABLE public.hidden_events ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.hidden_events
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.hidden_events DROP status;
ALTER TABLE public.hidden_events RENAME COLUMN new_status TO status;


/*Events*/
ALTER TABLE public.events ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.events
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.events DROP status;
ALTER TABLE public.events RENAME COLUMN new_status TO status;

/*Event Dates*/
ALTER TABLE public.events_dates ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.events_dates
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.events_dates DROP status;
ALTER TABLE public.events_dates RENAME COLUMN new_status TO status;

/*Event Notifications*/
ALTER TABLE public.events_notifications ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.events_notifications
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.events_notifications DROP status;
ALTER TABLE public.events_notifications RENAME COLUMN new_status TO status;

/*Event Notifications DONE*/
ALTER TABLE public.events_notifications ADD new_done BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.events_notifications
SET new_done = (CASE done
                WHEN 1
                  THEN TRUE
                WHEN 0
                  THEN FALSE
                END);
ALTER TABLE public.events_notifications DROP done;
ALTER TABLE public.events_notifications RENAME COLUMN new_done TO done;

/*VIEW*/
CREATE VIEW view_organizations AS
  SELECT DISTINCT
    organizations.id :: INT,
    organizations.description,
    organizations.id :: INT                 AS oid,
    organizations.images_domain || 'organizations_images/backgrounds/medium/' || organizations.background_medium_img_url AS background_medium_img_url,
    organizations.images_domain || 'organizations_images/backgrounds/small/' || organizations.background_small_img_url  AS background_small_img_url,
    organizations.images_domain || 'organizations_images/logos/medium/' || organizations.img_medium_url            AS img_medium_url,
    organizations.images_domain || 'organizations_images/logos/small/' || organizations.img_small_url             AS img_small_url,
    organizations.site_url,
    organizations.name,
    organizations.type_id :: INT,
    organizations.images_domain || 'organizations_images/logos/large/' || organizations.img_url                   AS img_url,
    organizations.images_domain || 'organizations_images/background/large/' || organizations.background_img_url        AS background_img_url,
    TRUE                                    AS status,
    organizations.short_name,
    organization_types.name                 AS type_name,
    organization_types."order" :: INT       AS organization_type_order,
    organization_types."id" :: INT          AS organization_type_id,
    DATE_PART(
        'epoch',
        organizations.updated_at) :: INT    AS updated_at,
    DATE_PART(
        'epoch',
        organizations.created_at) :: INT    AS created_at,
    (
      SELECT COUNT(
                 id) :: INT AS subscribed_count
      FROM
        subscriptions
      WHERE
        subscriptions.status
        =
        TRUE
        AND
        subscriptions.organization_id
        =
        organizations.id
    )                                       AS subscribed_count
  FROM organizations
    INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = TRUE
  WHERE organizations.status = TRUE;

CREATE VIEW view_subscriptions AS
  SELECT
    subscriptions.id,
    users.first_name,
    users.last_name,
    users.middle_name,
    users.id              AS user_id,
    users.avatar_url,
    view_organizations.id AS organization_id,
    view_organizations.description,
    view_organizations.oid,
    view_organizations.background_medium_img_url,
    view_organizations.background_small_img_url,
    view_organizations.img_medium_url,
    view_organizations.img_small_url,
    view_organizations.site_url,
    view_organizations.name,
    view_organizations.type_id,
    view_organizations.img_url,
    view_organizations.background_img_url,
    view_organizations.status,
    view_organizations.short_name,
    view_organizations.type_name,
    view_organizations.organization_type_order,
    view_organizations.organization_type_id,
    view_organizations.updated_at,
    view_organizations.created_at,
    view_organizations.subscribed_count
  FROM users
    INNER JOIN subscriptions ON subscriptions.user_id = users.id
    INNER JOIN view_organizations ON view_organizations.id = subscriptions.organization_id
  WHERE subscriptions.status = TRUE;

CREATE VIEW view_vk_friends AS
  SELECT
    'vk.com'                       AS type,
    vk_sign_in.uid                 AS uid,
    vk_sign_in.user_id :: INT      AS user_id,
    vk_friends.friend_uid          AS friend_uid,
    friends_sign_in.user_id :: INT AS friend_id
  FROM vk_sign_in
    INNER JOIN vk_friends ON vk_friends.user_id = vk_sign_in.user_id
    INNER JOIN vk_sign_in friends_sign_in ON vk_friends.friend_uid = friends_sign_in.uid;

CREATE VIEW view_google_friends AS
  SELECT
    'google'                       AS type,
    google_sign_in.google_id       AS uid,
    google_sign_in.user_id :: INT  AS user_id,
    friends_sign_in.google_id      AS friend_uid,
    friends_sign_in.user_id :: INT AS friend_id
  FROM
    google_sign_in
    INNER JOIN google_friends ON google_friends.user_id = google_sign_in.user_id
    INNER JOIN google_sign_in friends_sign_in ON google_friends.friend_uid = friends_sign_in.google_id;

CREATE VIEW view_facebook_friends AS
  SELECT
    'facebook'                      AS type,
    facebook_sign_in.uid            AS uid,
    facebook_sign_in.user_id :: INT AS user_id,
    friends_sign_in.uid             AS friend_uid,
    friends_sign_in.user_id :: INT  AS friend_id
  FROM
    facebook_sign_in
    INNER JOIN facebook_friends ON facebook_friends.user_id = facebook_sign_in.user_id
    INNER JOIN facebook_sign_in friends_sign_in ON facebook_friends.friend_uid = friends_sign_in.uid;

CREATE VIEW view_friends AS SELECT
                              'google'                       AS type,
                              view_google_friends.uid        AS uid,
                              view_google_friends.user_id    AS user_id,
                              view_google_friends.friend_uid AS friend_uid,
                              view_google_friends.friend_id  AS friend_id
                            FROM view_google_friends
                            UNION SELECT
                                    'facebook'                       AS type,
                                    view_facebook_friends.uid        AS uid,
                                    view_facebook_friends.user_id    AS user_id,
                                    view_facebook_friends.friend_uid AS friend_uid,
                                    view_facebook_friends.friend_id  AS friend_id
                                  FROM view_facebook_friends
                            UNION SELECT
                                    'vk.com'                   AS type,
                                    view_vk_friends.uid        AS uid,
                                    view_vk_friends.user_id    AS user_id,
                                    view_vk_friends.friend_uid AS friend_uid,
                                    view_vk_friends.friend_id  AS friend_id
                                  FROM view_vk_friends;


CREATE VIEW view_events AS
  SELECT DISTINCT
    events.id :: INT,
    events.title,
    events.creator_id :: INT,
    events.description,
    events.detail_info_url,
    events.begin_time,
    events.end_time,
    events.latitude :: REAL,
    events.longitude :: REAL,
    events.location,
    events.organization_id :: INT,
    TRUE                                                                      AS status,
    events.images_domain || 'event_images/large/' || events.image_vertical AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal  AS image_horizontal_url,

    events.images_domain || 'event_images/large/' || events.image_vertical AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal  AS image_horizontal_large_url,

    events.images_domain || 'event_images/medium/' || events.image_vertical AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_horizontal  AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' || events.image_horizontal  AS image_horizontal_small_url,
    view_organizations.img_medium_url AS organization_logo_medium_url,
    view_organizations.img_url AS organization_logo_large_url,
    view_organizations.img_small_url  AS organization_logo_small_url,
    view_organizations.name                                                        AS organization_name,
    organization_types.name                                                   AS organization_type_name,
    view_organizations.short_name                                                  AS organization_short_name,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date > NOW() AND events_dates.status =
                                                                        TRUE) AS nearest_event_date,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)               AS first_event_date,
    (SELECT DATE_PART('epoch', MAX(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)               AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                              AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                              AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                       AS favored_users_count
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
  --LEFT JOIN events_tags ON events.id = events_tags.event_id
  --LEFT JOIN tags ON tags.id = events_tags.tag_id
  WHERE view_organizations.status = TRUE
        AND events.status = TRUE;


CREATE VIEW view_tags AS
  SELECT
    tags.id,
    tags.name,
    count(events_tags.tag_id)                  AS events_count,
    DATE_PART('epoch', tags.created_at) :: INT AS created_at,
    DATE_PART('epoch', tags.updated_at) :: INT AS updated_at

  FROM tags
    INNER JOIN events_tags ON events_tags.tag_id = tags.id AND events_tags.status = TRUE
  GROUP BY tags.id, events_tags.tag_id;

CREATE VIEW view_dates AS
  SELECT
    events_dates.id,
    events_dates.event_id,
    DATE_PART('epoch', events_dates.event_date) :: INT AS event_date,
    events_dates.start_time,
    events_dates.end_time,
    organization_id,
    DATE_PART('epoch', events_dates.created_at) :: INT AS created_at,
    DATE_PART('epoch', events_dates.updated_at) :: INT AS updated_at
  FROM events_dates
    INNER JOIN events ON events_dates.event_id = events.id AND events_dates.status = TRUE;

ALTER TABLE public.tokens ADD device_name TEXT DEFAULT NULL NULL;

CREATE VIEW view_devices AS
  SELECT
    tokens.id,
    "uuid",
    tokens.token_type,
    tokens.user_id,
    tokens.expires_on,
    tokens.device_token,
    tokens.client_type,
    tokens.device_name,
    DATE_PART('epoch', tokens.created_at) :: INT AS created_at,
    DATE_PART('epoch', tokens.updated_at) :: INT AS updated_at
  FROM tokens
  WHERE DATE_PART('epoch', NOW()) :: INT < tokens.expires_on;

DROP TABLE users_notifications;
DROP VIEW view_notifications;


CREATE EXTENSION "uuid-ossp";

CREATE TABLE public.users_notifications
(
  id                SERIAL PRIMARY KEY NOT NULL,
  user_id           INT                NOT NULL,
  event_id          INT                NOT NULL,
  created_at        TIMESTAMP                   DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP                   DEFAULT CURRENT_TIMESTAMP,
  notification_time TIMESTAMP          NOT NULL,
  status            BOOLEAN                     DEFAULT TRUE,
  done              BOOLEAN                     DEFAULT FALSE,
  sent_time         TIMESTAMP                   DEFAULT NULL,
  uuid              TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  CONSTRAINT users_notifications_events_id_fk FOREIGN KEY (event_id) REFERENCES events (id),
  CONSTRAINT users_notifications_users_id_fk FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE VIEW view_notifications AS
  SELECT
    users_notifications.uuid,
    users_notifications.user_id,
    users_notifications.event_id,
    DATE_PART('epoch', users_notifications.notification_time) :: INT AS notification_time,
    users_notifications.status,
    nt1.id                                                           AS notification_type_id,
    'notification-custom'                                            AS notification_type,
    users_notifications.done,
    DATE_PART('epoch', users_notifications.sent_time) :: INT         AS sent_time,
    users_notifications.created_at,
    users_notifications.updated_at
  FROM users_notifications
    INNER JOIN notification_types nt1 ON nt1.type = 'notification-custom'
  UNION
  SELECT
    NULL                                                              AS uuid,
    NULL                                                              AS user_id,
    events_notifications.event_id,
    DATE_PART('epoch', events_notifications.notification_time) :: INT AS notification_time,
    events_notifications.status,
    events_notifications.notification_type_id,
    nt2.type                                                          AS notification_type,
    events_notifications.done,
    NULL                                                              AS sent_time,
    events_notifications.created_at,
    events_notifications.updated_at
  FROM events_notifications
    INNER JOIN notification_types nt2 ON events_notifications.notification_type_id = nt2.id;


CREATE VIEW view_actions AS SELECT
                              stat_events.stat_type_id,
                              stat_events.event_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code,
                              tokens.user_id,
                              NULL                                              AS organization_id,
                              DATE_PART('epoch', stat_events.created_at) :: INT AS created_at
                            FROM stat_events
                              INNER JOIN stat_event_types ON stat_event_types.id = stat_events.stat_type_id
                              INNER JOIN tokens ON tokens.id = stat_events.token_id
                              INNER JOIN view_events ON view_events.id = stat_events.event_id
                            WHERE
                              view_events.status = TRUE

                            UNION

                            SELECT
                              stat_organizations.stat_type_id,
                              NULL                                                     AS event_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code,
                              tokens.user_id,
                              stat_organizations.organization_id                       AS organization_id,
                              DATE_PART('epoch', stat_organizations.created_at) :: INT AS created_at
                            FROM stat_organizations
                              INNER JOIN stat_event_types ON stat_event_types.id = stat_organizations.stat_type_id
                              INNER JOIN tokens ON tokens.id = stat_organizations.token_id
                              INNER JOIN view_organizations
                                ON view_organizations.id = stat_organizations.organization_id
                            WHERE
                              view_organizations.status = TRUE;



CREATE VIEW view_organization_types AS
  SELECT DISTINCT organization_types.id:: INT,
    organization_types.name,
     DATE_PART('epoch', organization_types.created_at):: INT AS created_at,
     DATE_PART('epoch', organization_types.updated_at):: INT AS updated_at,
    organization_types."order" :: INT AS order_position
  FROM organization_types
    INNER JOIN organizations ON organization_types.id = organizations.type_id
  WHERE organizations.status = TRUE;

ALTER TABLE subscriptions ADD CONSTRAINT user_id_organization_id UNIQUE (organization_id, user_id);


/*uSers_organizations*/
ALTER TABLE public.users_organizations ADD new_status BOOLEAN DEFAULT TRUE NOT NULL;
UPDATE public.users_organizations
SET new_status = (CASE status
                  WHEN 1
                    THEN TRUE
                  WHEN 0
                    THEN FALSE
                  END);
ALTER TABLE public.users_organizations DROP status;
ALTER TABLE public.users_organizations RENAME COLUMN new_status TO status;

CREATE VIEW view_editors AS
  SELECT users.*, users_organizations.organization_id, users_organizations.by_default
  FROM users
  INNER JOIN users_organizations ON users.id = users_organizations.user_id
  WHERE users_organizations.status = TRUE;


CREATE VIEW view_stat_events AS SELECT
                                  stat_events.*, tokens.user_id,
  events.organization_id
                                FROM stat_events
                                  INNER JOIN tokens ON stat_events.token_id = tokens.id
  INNER JOIN events ON stat_events.event_id = events.id
  WHERE events.status = true;



  ALTER TABLE public.log_requests ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
  ALTER TABLE public.log_requests ADD headers JSON DEFAULT NULL  NULL;
  ALTER TABLE public.log_requests ADD body_json JSON DEFAULT NULL  NULL;
  ALTER TABLE public.log_requests ADD response_http_status INT DEFAULT 200 NOT NULL;
  ALTER TABLE public.log_requests ADD response_error_name VARCHAR(255) DEFAULT NULL NULL;
  ALTER TABLE public.log_requests ADD   uuid              TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4();


