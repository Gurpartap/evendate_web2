ALTER TABLE organizations ADD COLUMN vk_url VARCHAR(255);
ALTER TABLE organizations ADD COLUMN facebook_url VARCHAR(255);
ALTER TABLE organizations ADD COLUMN state_id INT REFERENCES organizations_states(id);
ALTER TABLE organizations ADD COLUMN creator_id INT REFERENCES users(id);
ALTER TABLE organizations ADD COLUMN email VARCHAR(255);

ALTER TABLE organizations ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE organizations ALTER COLUMN background_medium_img_url DROP NOT NULL;
ALTER TABLE organizations ALTER COLUMN background_small_img_url DROP NOT NULL;

CREATE TABLE organizations_states(
  id                   SERIAL PRIMARY KEY NOT NULL,
  state VARCHAR(255),
  description TEXT
);

INSERT INTO organizations_states(id, state, description)
    VALUES (0, 'on-moderation',''), (1, 'active','');

CREATE OR REPLACE FUNCTION organizations_vector_update()
  RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE')
  THEN
    IF (OLD.name <> NEW.name OR OLD.short_name <> NEW.short_name OR OLD.description <> NEW.description OR
        OLD.default_address <> NEW.default_address)
    THEN
      NEW.fts =
      setweight(coalesce(to_tsvector('ru', NEW.name), ''), 'A') || ' ' ||
      setweight(coalesce(to_tsvector('ru', NEW.short_name), ''), 'B') || ' ' ||
      setweight(coalesce(to_tsvector('ru', NEW.description), ''), 'B') || ' ' ||
      setweight(coalesce(to_tsvector('ru', NEW.default_address), ''), 'D');
      RETURN NEW;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF (TG_OP = 'INSERT')
    THEN
      NEW.fts =
      setweight(coalesce(to_tsvector('ru', NEW.name), ''), 'A') || ' ' ||
      setweight(coalesce(to_tsvector('ru', NEW.short_name), ''), 'B') || ' ' ||
      setweight(coalesce(to_tsvector('ru', NEW.description), ''), 'B') || ' ' ||
      setweight(coalesce(to_tsvector('ru', NEW.default_address), ''), 'D');
      RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE VIEW view_organizations AS
  SELECT DISTINCT
    organizations.id :: INT,
    organizations.description,
    organizations.id :: INT                                                                                      AS oid,
    organizations.images_domain || 'organizations_images/backgrounds/medium/' ||
    organizations.background_medium_img_url                                                                      AS background_medium_img_url,
    organizations.images_domain || 'organizations_images/backgrounds/small/' ||
    organizations.background_small_img_url                                                                       AS background_small_img_url,
    organizations.images_domain || 'organizations_images/logos/medium/' ||
    organizations.img_medium_url                                                                                 AS img_medium_url,
    organizations.images_domain || 'organizations_images/logos/small/' ||
    organizations.img_small_url                                                                                  AS img_small_url,
    organizations.site_url,
    organizations.name,
    organizations.type_id :: INT,
    organizations.images_domain || 'organizations_images/logos/large/' ||
    organizations.img_url                                                                                        AS img_url,
    organizations.images_domain || 'organizations_images/backgrounds/large/' ||
    organizations.background_img_url                                                                             AS background_img_url,
    TRUE                                                                                                         AS status,
    organizations.short_name,
    organization_types.name                                                                                      AS type_name,
    organizations.default_address,
    organization_types."order" :: INT                                                                            AS organization_type_order,
    organization_types."id" :: INT                                                                               AS organization_type_id,
    DATE_PART(
        'epoch',
        organizations.updated_at) :: INT                                                                         AS updated_at,
    DATE_PART(
        'epoch',
        organizations.created_at) :: INT                                                                         AS created_at,
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
    )                                                                                                            AS subscribed_count,

    organizations.vk_url_path,
    organizations.facebook_url_path,
    organizations.fts
  FROM organizations
    INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = TRUE
  WHERE organizations.status = TRUE
  AND organizations.state_id = 1;
