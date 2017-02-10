-- Flag to enable tickets selling throw us
ALTER TABLE events
  ADD COLUMN ticketing_locally
  BOOLEAN DEFAULT FALSE;

-- Flag to set registration start date (ONLY IF ticketing_locally == FALSE)
ALTER TABLE events
  ADD COLUMN registration_since
  TIMESTAMP DEFAULT NULL;

-- Statuses of tickets
CREATE TABLE tickets_orders_statuses (
  id         SERIAL PRIMARY KEY,
  type_code  VARCHAR(255),
  name       TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);

-- Input first statuses of tickets
INSERT INTO tickets_orders_statuses (id, type_code, name)
VALUES
  (1, 'waiting_for_payment', 'Ожидание оплаты'),
  (2, 'payed', 'Оплачено'),
  (3, 'returned', 'Возврат билетов');

-- Statuses of registration
CREATE TABLE registration_statuses (
  id         SERIAL PRIMARY KEY,
  type_code  VARCHAR(255),
  name       TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);

-- Input first statuses of registration
INSERT INTO registration_statuses (id, type_code, name)
VALUES
  (0, 'completed', 'Заполнено.'),
  (1, 'is_pending', 'Ожидает подтверждения'),
  (2, 'approved', 'Подтверждено'),
  (3, 'rejected', 'Отказано в регистрации');

-- Filled by one user registration/ticketing form
CREATE TABLE registration_forms (
  id                     SERIAL PRIMARY KEY,
  user_id                INT,
  event_id               INT,
  created_at             TIMESTAMP,
  updated_at             TIMESTAMP,
  status                 BOOLEAN,
  registration_status_id INT REFERENCES registration_statuses (id),
  keyword                TEXT                        DEFAULT NULL,
  checked_out            BOOLEAN                     DEFAULT FALSE,
  uuid                   TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (event_id) REFERENCES events (id),
  UNIQUE (event_id, user_id)
);

-- Added by organization ticket types
CREATE TABLE ticket_types (
  id                           SERIAL PRIMARY KEY,
  event_id  INT REFERENCES events (id)  DEFAULT NULL,
  uuid      TEXT          NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
  type_code VARCHAR(255)     DEFAULT NULL,
  name      TEXT NOT NULL,
  comment   TEXT   DEFAULT NULL,
  price     INT DEFAULT 0 NOT NULL,
  sell_start_date TIMESTAMP   DEFAULT NULL,
  sell_end_date   TIMESTAMP   DEFAULT NULL,
  start_after_ticket_type_uuid TEXT REFERENCES ticket_types (uuid),
  amount                       INT DEFAULT 0,
  min_count_per_user           INT DEFAULT 1,
  max_count_per_user           INT DEFAULT NULL,
  promocode                    TEXT DEFAULT NULL,
  promocode_effort             VARCHAR(10) DEFAULT NULL,
  created_at                   TIMESTAMP DEFAULT NOW(),
  updated_at                   TIMESTAMP,
  status BOOLEAN DEFAULT TRUE
);

-- Users ticket orders (one registration -> one order)
CREATE TABLE ticket_orders (
  id              SERIAL PRIMARY KEY,
  uuid TEXT NOT NULL       DEFAULT uuid_generate_v4() UNIQUE,
  created_at TIMESTAMP     DEFAULT NOW(),
  updated_at TIMESTAMP,
  user_id    INTEGER REFERENCES users (id),
  order_content JSONB,
  payed_at      TIMESTAMP,
  is_canceled   BOOLEAN    DEFAULT FALSE,
  canceled_at   TIMESTAMP,
  order_status_id INTEGER  DEFAULT 1
);

-- Tickets bought by user
CREATE TABLE tickets (
  id              SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  ticket_type_id INTEGER REFERENCES ticket_types (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  ticket_order_id INTEGER REFERENCES ticket_orders (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  created_at      TIMESTAMP,
  updated_at      TIMESTAMP,
  status          BOOLEAN,
  checked_out     BOOLEAN       DEFAULT FALSE,
  uuid            TEXT NOT NULL DEFAULT uuid_generate_v4() UNIQUE
);

ALTER TABLE registration_info
  RENAME TO registration_field_values;

DROP VIEW view_users_registrations;
DROP VIEW view_registration_fields;
DROP TABLE users_registrations;

CREATE OR REPLACE VIEW view_all_ticket_types AS
  SELECT
    ticket_types.id,
    ticket_types.event_id,
    ticket_types.uuid,
    ticket_types.type_code,
    ticket_types.name,
    ticket_types.comment,
    ticket_types.price,
    DATE_PART('epoch', ticket_types.sell_start_date) :: INT AS sell_start_date,
    DATE_PART('epoch', ticket_types.sell_end_date) :: INT AS sell_end_date,
    ticket_types.start_after_ticket_type_uuid,
    ticket_types.amount,
    ticket_types.min_count_per_user,
    ticket_types.max_count_per_user,
    ticket_types.promocode,
    ticket_types.promocode_effort,
    DATE_PART('epoch', ticket_types.created_at) :: INT AS created_at,
    DATE_PART('epoch', ticket_types.updated_at) :: INT AS updated_at,
    status
  FROM ticket_types;

CREATE OR REPLACE VIEW view_ticket_types AS
  SELECT * FROM  view_all_ticket_types WHERE status = TRUE;


CREATE OR REPLACE VIEW view_registration_forms AS
  SELECT
    registration_forms.id,
    registration_forms.uuid,
    registration_forms.user_id,
    registration_forms.event_id,
    registration_forms.checked_out,
    registration_forms.keyword,
    registration_forms.registration_status_id,
    registration_statuses.type_code                          AS registration_status,
    registration_forms.status,
    DATE_PART('epoch', registration_forms.created_at) :: INT AS created_at,
    DATE_PART('epoch', registration_forms.updated_at) :: INT AS updated_at,
    DATE_PART('epoch', events.registration_till) :: INT      AS registration_till,
    DATE_PART('epoch', events.registration_since) :: INT     AS registration_since
  FROM registration_forms
    INNER JOIN tickets_statuses
      ON registration_statuses.id = registration_forms.registration_status_id
    INNER JOIN events ON registration_forms.event_id = events.id;


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
                               NULL)                           AS is_delayed,
    events.status,
    events.canceled,
    events.canceled                                            AS is_canceled,
    vk_posts.group_id                                          AS vk_group_id,
    vk_posts.image_path                                        AS vk_image_path,
    vk_posts.message                                           AS vk_message,
    events.registration_required,
    DATE_PART('epoch', events.registration_till :: TIMESTAMPTZ) :: INT AS registration_till,
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
    'http://evendate.ru/event/' || events.id                           AS link,
    events.images_domain || 'event_images/large/' || events.image_vertical AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal AS image_horizontal_url,
    events.images_domain || 'event_images/large/' || events.image_vertical   AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal AS image_horizontal_large_url,

    events.images_domain || 'event_images/square/' || events.image_vertical  AS image_square_vertical_url,
    events.images_domain || 'event_images/square/' || events.image_horizontal AS image_square_horizontal_url,

    events.images_domain || 'event_images/medium/' || events.image_horizontal AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_vertical   AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical    AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' || events.image_horizontal  AS image_horizontal_small_url,
    events.images_domain || 'event_images/vk/' || vk_posts.image_path         AS vk_image_url,
    view_organizations.img_medium_url                                         AS organization_logo_medium_url,
    view_organizations.img_url                                                AS organization_logo_large_url,
    view_organizations.img_small_url                                          AS organization_logo_small_url,
    view_organizations.name                                                   AS organization_name,
    organization_types.name                                                   AS organization_type_name,
    view_organizations.short_name                                             AS organization_short_name,
    (SELECT DATE_PART('epoch',
                      MIN((events_dates.event_date :: DATE || ' ' || events_dates.start_time) :: TIMESTAMPTZ)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date >= NOW() :: DATE AND events_dates.status =
                                                                                 TRUE) AS nearest_event_date,
    DATE_PART('epoch', events.first_event_date) :: INT                                 AS first_event_date,
    DATE_PART('epoch', events.last_event_date) :: INT                                  AS last_event_date,
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
    view_organizations.is_private                                                      AS organization_is_private,
    events.first_event_date                                                            AS first_event_date_dt,
    events.last_event_date                                                             AS last_event_date_dt
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
  WHERE view_organizations.status = TRUE;

CREATE OR REPLACE VIEW view_events AS
  SELECT *
  FROM view_all_events
  WHERE status = TRUE;