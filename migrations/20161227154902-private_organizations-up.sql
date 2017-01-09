ALTER TABLE organizations
  ADD COLUMN private BOOLEAN DEFAULT FALSE;

ALTER TABLE organizations
  ADD COLUMN brand_color VARCHAR(10) DEFAULT NULL;

CREATE OR REPLACE VIEW view_organizations AS
  SELECT DISTINCT
    organizations.id :: INT,
    organizations.description,
    organizations.id :: INT                 AS oid,
    organizations.images_domain || 'organizations_images/backgrounds/medium/' ||
    organizations.background_medium_img_url AS background_medium_img_url,
    organizations.images_domain || 'organizations_images/backgrounds/small/' ||
    organizations.background_small_img_url  AS background_small_img_url,
    organizations.images_domain || 'organizations_images/logos/medium/' ||
    organizations.img_medium_url            AS img_medium_url,
    organizations.images_domain || 'organizations_images/logos/small/' ||
    organizations.img_small_url             AS img_small_url,
    organizations.site_url,
    organizations.name,
    organizations.type_id :: INT,
    organizations.images_domain || 'organizations_images/logos/large/' ||
    organizations.img_url                   AS img_url,
    organizations.images_domain || 'organizations_images/backgrounds/large/' ||
    organizations.background_img_url        AS background_img_url,
    TRUE                                    AS status,
    organizations.short_name,
    organization_types.name                 AS type_name,
    organizations.default_address,
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
    )                                       AS subscribed_count,

    organizations.vk_url_path,
    organizations.facebook_url_path,
    organizations.fts,
    organizations.facebook_url,
    organizations.vk_url,
    organizations.email,
    organizations.private,
    organizations.brand_color
  FROM organizations
    INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = TRUE
  WHERE organizations.status = TRUE
        AND organizations.state_id = 1;

CREATE TABLE organizations_invitations (
  id              SERIAL PRIMARY KEY,
  organization_id INT                NOT NULL,
  user_id         INT                         DEFAULT NULL,
  creator_id      INT                         DEFAULT NULL,
  email           TEXT               NOT NULL,
  uuid            TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ                 DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  status          BOOLEAN                     DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (creator_id) REFERENCES users (id),
  FOREIGN KEY (organization_id) REFERENCES organizations (id),
  UNIQUE (organization_id, user_id, email)
);

CREATE TABLE organizations_invitation_links (
  id              SERIAL PRIMARY KEY,
  organization_id INT                NOT NULL,
  creator_id      INT                NOT NULL,
  uuid            TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ                 DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  status          BOOLEAN                     DEFAULT TRUE,
  FOREIGN KEY (creator_id) REFERENCES users (id),
  FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

INSERT INTO notification_types (id, type, timediff, text)
VALUES (16, 'notification-registration-approved', -1, 'Регистрация подтверждена на событие {title}'),
  (17, 'notification-registration-not-approved', -1, 'Отказано в регистрации на событие {title}');

CREATE OR REPLACE VIEW view_all_events AS
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
    events.min_price,
    DATE_PART('epoch', events.public_at :: TIMESTAMPTZ) :: INT                         AS public_at,
    (events.status = FALSE AND events.public_at IS NOT
                               NULL)                                                   AS is_delayed,
    events.status,
    events.canceled,
    events.canceled                                                                    AS is_canceled,
    vk_posts.group_id                                                                  AS vk_group_id,
    vk_posts.image_path                                                                AS vk_image_path,
    vk_posts.message                                                                   AS vk_message,
    events.registration_required,
    DATE_PART('epoch', events.registration_till :: TIMESTAMPTZ) :: INT                 AS registration_till,
    events.is_free,
    ((SELECT SUM(counter)
      FROM (SELECT DISTINCT
              events_dates.start_time,
              events_dates.end_time,
              1 AS counter
            FROM events_dates
            WHERE event_id = events.id AND status = TRUE) AS sb) = 1) :: BOOL
                                                                                       AS is_same_time,
    events.organization_id :: INT,
    'http://evendate.ru/event/' || events.id                                           AS link,
    events.images_domain || 'event_images/large/' || events.image_vertical             AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal           AS image_horizontal_url,
    events.images_domain || 'event_images/large/' || events.image_vertical             AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal           AS image_horizontal_large_url,

    events.images_domain || 'event_images/square/' || events.image_vertical            AS image_square_vertical_url,
    events.images_domain || 'event_images/square/' || events.image_horizontal          AS image_square_horizontal_url,

    events.images_domain || 'event_images/medium/' || events.image_horizontal          AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_vertical            AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical             AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' || events.image_horizontal           AS image_horizontal_small_url,
    events.images_domain || 'event_images/vk/' || vk_posts.image_path                  AS vk_image_url,
    view_organizations.img_medium_url                                                  AS organization_logo_medium_url,
    view_organizations.img_url                                                         AS organization_logo_large_url,
    view_organizations.img_small_url                                                   AS organization_logo_small_url,
    view_organizations.name                                                            AS organization_name,
    organization_types.name                                                            AS organization_type_name,
    view_organizations.short_name                                                      AS organization_short_name,
    (SELECT DATE_PART('epoch',
                      MIN((events_dates.event_date :: DATE || ' ' || events_dates.start_time) :: TIMESTAMPTZ)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date >= NOW() :: DATE AND events_dates.status =
                                                                                 TRUE) AS nearest_event_date,
    (SELECT DATE_PART('epoch',
                      MIN((events_dates.event_date :: DATE || ' ' || events_dates.start_time) :: TIMESTAMPTZ)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                        AS first_event_date,
    (SELECT DATE_PART('epoch',
                      MAX((events_dates.event_date :: DATE || ' ' || events_dates.start_time) :: TIMESTAMPTZ)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                        AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                                       AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                                       AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                                AS favored_users_count,
    events.fts,
    events.registration_approvement_required,
    events.registration_limit_count,
    events.registration_locally,
    events.registered_count,
    (events.registration_locally
     AND (events.registration_limit_count > events.registered_count OR events.registration_limit_count IS NULL OR
          events.registered_count IS NULL)
     AND (DATE_PART('epoch', NOW()) :: INT < (DATE_PART('epoch', events.registration_till) :: INT) OR
          events.registration_till IS NULL))                                           AS registration_available,
    view_organizations.private                                                         AS organization_private
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
  WHERE view_organizations.status = TRUE;

CREATE OR REPLACE VIEW view_events AS
  SELECT *
  FROM view_all_events
  WHERE status = TRUE;

CREATE VIEW view_invitation_links AS
  SELECT
    organization_id,
    creator_id,
    uuid,
    DATE_PART(
        'epoch',
        organizations_invitation_links.created_at) :: INT AS created_at,
    DATE_PART(
        'epoch',
        organizations_invitation_links.updated_at) :: INT AS updated_at,
    status,
    view_users.first_name                                 AS creator_first_name,
    view_users.last_name                                  AS creator_last_name,
    view_users.avatar_url                                 AS creator_avatar_url
  FROM organizations_invitation_links
    INNER JOIN view_users ON view_users.id = organizations_invitation_links.creator_id
  WHERE organizations_invitation_links.status = TRUE;

CREATE OR REPLACE VIEW view_invited_users
AS
  SELECT DISTINCT
    organizations_invitations.organization_id,
    organizations_invitations.user_id,
    organizations_invitations.creator_id,
    organizations_invitations.email,
    organizations_invitations.uuid,
    COALESCE(users_by_id.first_name, users_by_email.first_name, NULL) AS user_first_name,
    COALESCE(users_by_id.last_name, users_by_email.last_name, NULL)   AS user_last_name,
    COALESCE(users_by_id.avatar_url, users_by_email.avatar_url, NULL) AS user_avatar_url,
    inviters.first_name                                 AS creator_first_name,
    inviters.last_name                                  AS creator_last_name,
    inviters.avatar_url                                 AS creator_avatar_url,
    DATE_PART(
        'epoch',
        organizations_invitations.created_at) :: INT                  AS created_at,
    DATE_PART(
        'epoch',
        organizations_invitations.updated_at) :: INT                  AS updated_at,
    organizations_invitations.email IS NOT NULL                       AS invited_by_email,
    organizations_invitations.user_id IS NOT NULL                     AS invited_by_user_id,
    organizations_invitations.status
  FROM organizations_invitations
    INNER JOIN view_users AS inviters ON inviters.id = organizations_invitations.creator_id
    LEFT JOIN view_users AS users_by_id ON users_by_id.id = organizations_invitations.user_id
    LEFT JOIN view_users AS users_by_email ON users_by_email.email = organizations_invitations.email;

ALTER TABLE organizations RENAME COLUMN private TO is_private;
ALTER TABLE view_organizations RENAME COLUMN private TO is_private;
ALTER TABLE view_events RENAME COLUMN organization_private TO organization_is_private;

ALTER TABLE organizations_invitations ALTER COLUMN email DROP NOT NULL;