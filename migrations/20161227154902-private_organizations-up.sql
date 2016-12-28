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

INSERT INTO notification_types(id, type, timediff, text)
    VALUES (16, 'notification-registration-approved', -1, 'Регистрация подтверждена на событие {title}'),
(17, 'notification-registration-not-approved', -1, 'Отказано в регистрации на событие {title}');