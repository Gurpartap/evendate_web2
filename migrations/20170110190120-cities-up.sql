CREATE TABLE countries (
  id             SERIAL PRIMARY KEY,
  en_name        VARCHAR(255),
  local_name     VARCHAR(255),
  language       VARCHAR(255),
  language_short VARCHAR(10),
  status         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP        DEFAULT NOW(),
  updated_at     TIMESTAMP
);


INSERT INTO countries (id, en_name, local_name, language, language_short) VALUES
  (1, 'Russia', 'Россия', 'Русский', 'ru_ru');

CREATE TABLE cities (
  id               SERIAL PRIMARY KEY,
  en_name          TEXT,
  local_name       TEXT,
  timediff_seconds INT,
  country_id       INT,
  status           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP      DEFAULT NOW(),
  updated_at       TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries (id)
);


INSERT INTO cities (id, en_name, local_name, timediff_seconds, country_id)
VALUES (1, 'Moscow', 'Москва', 10800, 1);


CREATE OR REPLACE VIEW view_countries AS
  SELECT
    id,
    en_name,
    local_name,
    language,
    language_short,
    (SELECT COUNT(id)
     FROM cities
     WHERE country_id = countries.id) AS cities_count,
    DATE_PART(
        'epoch',
        countries.updated_at) :: INT  AS updated_at,
    DATE_PART(
        'epoch',
        countries.created_at) :: INT  AS created_at
  FROM countries
  WHERE status = TRUE AND (SELECT COUNT(id)
                           FROM cities
                           WHERE country_id = countries.id) > 0;

CREATE OR REPLACE VIEW view_cities AS
  SELECT
    id,
    en_name,
    local_name,
    cities.timediff_seconds,
    country_id,
    (SELECT COUNT(id)
     FROM organizations
     WHERE city_id = cities.id AND organizations.status = TRUE) AS organizations_count,
    DATE_PART(
        'epoch',
        cities.updated_at) :: INT  AS updated_at,
    DATE_PART(
        'epoch',
        cities.created_at) :: INT  AS created_at
  FROM cities
  WHERE status = TRUE AND (SELECT COUNT(id)
                           FROM organizations
                           WHERE city_id = cities.id AND organizations.status = TRUE) > 0;


ALTER TABLE organizations
  ADD COLUMN city_id INT DEFAULT 1;
ALTER TABLE organizations
  ADD FOREIGN KEY (city_id) REFERENCES cities (id);

ALTER TABLE events_dates
  ADD COLUMN start_time_utc TIMESTAMP;
ALTER TABLE events_dates
  ADD COLUMN end_time_utc TIMESTAMP;

UPDATE events_dates
SET start_time_utc =
(SELECT (ed.event_date || ' ' || ed.start_time) :: TIMESTAMP
 FROM events_dates AS ed
 WHERE ed.id = events_dates.id) :: TIMESTAMP;


UPDATE events_dates
SET end_time_utc =
(SELECT (ed.event_date || ' ' || ed.end_time) :: TIMESTAMP
 FROM events_dates AS ed
 WHERE ed.id = events_dates.id) :: TIMESTAMP;

ALTER TABLE events_dates
  ALTER COLUMN start_time_utc SET NOT NULL;
ALTER TABLE events_dates
  ALTER COLUMN end_time_utc SET NOT NULL;

ALTER TABLE users
  ADD COLUMN timediff_seconds INTEGER DEFAULT 10800;


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
    organizations.is_private,
    organizations.brand_color,
    organizations.city_id,
    cities.country_id,
    cities.en_name                          AS city_en_name,
    cities.local_name                       AS city_local_name,
    cities.timediff_seconds                 AS city_timediff_seconds,
    countries.en_name                       AS country_en_name,
    countries.local_name                    AS country_local_name,
    countries.language                      AS country_language,
    countries.language_short                AS country_language_short
  FROM organizations
    INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = TRUE
    INNER JOIN cities ON cities.id = organizations.city_id
    INNER JOIN countries ON countries.id = cities.country_id
  WHERE organizations.status = TRUE
        AND organizations.state_id = 1;

CREATE OR REPLACE VIEW view_dates AS
  SELECT DISTINCT
    events_dates.id,
    events_dates.event_id,
    DATE_PART('epoch', events_dates.event_date) :: INT AS event_date,
    events_dates.start_time,
    events_dates.end_time,
    organization_id,
    DATE_PART('epoch', events_dates.created_at) :: INT AS created_at,
    DATE_PART('epoch', events_dates.updated_at) :: INT AS updated_at,
    DATE_PART('epoch', events_dates.start_time_utc) :: INT AS start_time_utc,
    DATE_PART('epoch', events_dates.end_time_utc) :: INT AS end_time_utc
  FROM events_dates
    INNER JOIN events ON events_dates.event_id = events.id AND events_dates.status = TRUE;
