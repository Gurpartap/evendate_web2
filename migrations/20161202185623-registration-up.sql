INSERT INTO stat_event_types (id, type_code, name, created_at, entity)
VALUES (100, 'register_started', 'Начал регистрироваться', NOW(), 'event'),
  (101, 'registered', 'Зарегистрировался', NOW(), 'event'),
  (102, 'canceled_registration', 'Отменил регистрацию', NOW(), 'event')
ON CONFLICT (id)
  DO NOTHING;

CREATE TABLE registration_field_types (
  id          SERIAL PRIMARY KEY,
  field_type  VARCHAR(50) NOT NULL,
  description TEXT        NOT NULL
);

INSERT INTO registration_field_types (id, field_type, description) VALUES
  (1, 'email', 'E-mail'),
  (2, 'first_name', 'Имя'),
  (3, 'last_name', 'Фамилия'),
  (4, 'phone_number', 'Номер телефона'),
  (5, 'additional_text', 'Дополнительное текстовое поле');

ALTER TABLE events
  ADD COLUMN registration_locally BOOLEAN DEFAULT FALSE;

ALTER TABLE events
  ADD COLUMN registration_limit_count INT DEFAULT NULL;

ALTER TABLE events
  ADD COLUMN registration_approvement_required BOOLEAN DEFAULT FALSE;

CREATE TABLE registration_form_fields (
  id            SERIAL PRIMARY KEY,
  uuid              TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  event_id      INT,
  field_type_id INT,
  label         TEXT,
  required      BOOLEAN     DEFAULT TRUE,
  status        BOOLEAN     DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ,
  FOREIGN KEY (event_id) REFERENCES events (id),
  FOREIGN KEY (field_type_id) REFERENCES registration_field_types (id),
  UNIQUE (event_id, field_type_id, label)
);

CREATE TABLE users_registrations (
  id                   SERIAL PRIMARY KEY,
  user_id              INT,
  event_id             INT,
  created_at           TIMESTAMPTZ,
  updated_at           TIMESTAMPTZ,
  status               BOOLEAN,
  organization_approved BOOLEAN DEFAULT NULL,
  checked_out BOOLEAN DEFAULT FALSE,
  uuid              TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (event_id) REFERENCES events (id),
  UNIQUE (event_id, user_id)
);

CREATE TABLE registration_info (
  id                         SERIAL PRIMARY KEY,
  user_registration_id       INT,
  registration_form_field_id INT,
  value                      TEXT,
  created_at                 TIMESTAMPTZ DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ,
  FOREIGN KEY (user_registration_id) REFERENCES users_registrations (id),
  FOREIGN KEY (registration_form_field_id) REFERENCES registration_form_fields (id),
  UNIQUE (user_registration_id, registration_form_field_id)
);

CREATE VIEW view_registration_form_fields AS
  SELECT
    registration_form_fields.*,
    registration_field_types.field_type AS type
  FROM registration_form_fields
    INNER JOIN registration_field_types ON registration_form_fields.field_type_id = registration_field_types.id;


INSERT INTO notification_types(id, type, timediff, text)
VALUES (1001, 'notification-registration-approved', -1, 'Регистрация подтверждена');
VALUES (1002, 'notification-registration-declined', -1, 'Отказано в регистрации');



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
    events.registration_locally
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
  WHERE view_organizations.status = TRUE;