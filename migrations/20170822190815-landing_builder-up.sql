DROP TABLE IF EXISTS event_landings;

CREATE TABLE event_landings (
  id         SERIAL PRIMARY KEY,
  event_id   INT NOT NULL REFERENCES events (id) UNIQUE ,
  url        TEXT      DEFAULT uuid_generate_v4(),
  data       JSONB     DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL,
  UNIQUE (event_id, url)
);

ALTER TABLE organizations ADD COLUMN brand_color_accent TEXT DEFAULT NULL;

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
    countries.language_short                AS country_language_short,
    organizations.brand_color_accent
  FROM organizations
    INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = TRUE
    INNER JOIN cities ON cities.id = organizations.city_id
    INNER JOIN countries ON countries.id = cities.country_id
  WHERE organizations.status = TRUE
        AND organizations.state_id = 1;
