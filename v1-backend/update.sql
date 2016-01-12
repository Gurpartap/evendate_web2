ALTER TABLE public.users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.tokens ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.users ADD gender BOOLEAN DEFAULT NULL  NULL;
ALTER TABLE public.users ALTER COLUMN gender TYPE VARCHAR(50) USING gender :: VARCHAR(50);
ALTER TABLE public.users ALTER COLUMN gender SET DEFAULT NULL;

ALTER TABLE public.vk_sign_in ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.facebook_sign_in ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.google_sign_in ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.vk_friends ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.facebook_friends ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.google_friends ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.events_dates ALTER COLUMN event_date TYPE DATE USING event_date :: DATE;
ALTER TABLE public.events_dates ADD start_time TIME DEFAULT NULL NULL;
ALTER TABLE public.events_dates ADD end_time TIME DEFAULT NULL NULL;
ALTER TABLE public.events ADD dates_range BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE public.events ADD COLUMN images_domain VARCHAR(50) DEFAULT 'http://evendate.ru/' NULL;
ALTER TABLE public.organizations ADD COLUMN images_domain VARCHAR(50) DEFAULT 'http://evendate.ru/' NULL;

ALTER TABLE public.organizations ALTER COLUMN status TYPE BOOLEAN USING status :: BOOLEAN;
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

/*VIEW*/
CREATE VIEW view_organizations AS
  SELECT DISTINCT
    organizations.id :: INT,
    organizations.description,
                                                                                                                organizations.id :: INT                 AS oid,
                                                                                                                organizations.images_domain
                                                                                                                ||
                                                                                                                organizations.background_medium_img_url AS background_medium_img_url,
                                                                                                                organizations.images_domain
                                                                                                                ||
                                                                                                                organizations.background_small_img_url  AS background_small_img_url,
                                                                                                                organizations.images_domain
                                                                                                                ||
                                                                                                                organizations.img_medium_url            AS img_medium_url,
                                                                                                                organizations.images_domain
                                                                                                                ||
                                                                                                                organizations.img_small_url             AS img_small_url,
    organizations.site_url,
    organizations.name,
    organizations.type_id :: INT,
                                                                                                                organizations.images_domain
                                                                                                                ||
                                                                                                                organizations.img_url                   AS img_url,
                                                                                                                organizations.images_domain
                                                                                                                ||
                                                                                                                organizations.background_img_url        AS background_img_url,
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
                                                                                                                  SELECT
                                                                                                                COUNT(
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
    TRUE                                                                                            AS status,
    events.images_domain ||
    events.image_vertical                                                                           AS image_vertical_url,
    events.images_domain ||
    events.image_horizontal                                                                         AS image_horizontal_url,
    organizations.images_domain ||
    organizations.img_url                                                                           AS organization_img_url,
    organizations.name                                                                              AS organization_name,
    organization_types.name                                                                         AS organization_type_name,
    organizations.short_name                                                                        AS organization_short_name,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date))
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date > NOW() AND events_dates.status =
                                                                        TRUE)                       AS nearest_event_date,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date))
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                                     AS first_event_date,
    (SELECT DATE_PART('epoch', MAX(events_dates.event_date))
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                                     AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                                                    AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                                                    AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                                             AS favored_users_count
  FROM events
    INNER JOIN organizations ON organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = organizations.type_id
  --LEFT JOIN events_tags ON events.id = events_tags.event_id
  --LEFT JOIN tags ON tags.id = events_tags.tag_id
  WHERE organizations.status = TRUE
        AND events.status = TRUE;


