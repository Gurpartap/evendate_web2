ALTER TABLE organizations
  ADD COLUMN vk_url VARCHAR(255);
ALTER TABLE organizations
  ADD COLUMN facebook_url VARCHAR(255);
ALTER TABLE organizations
  ADD COLUMN creator_id INT REFERENCES users (id);
ALTER TABLE organizations
  ADD COLUMN email VARCHAR(255);

ALTER TABLE organizations
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users_organizations
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE organizations
  ALTER COLUMN background_medium_img_url DROP NOT NULL;
ALTER TABLE organizations
  ALTER COLUMN background_small_img_url DROP NOT NULL;

CREATE TABLE organizations_states (
  id          SERIAL PRIMARY KEY NOT NULL,
  state       VARCHAR(255),
  description TEXT
);


ALTER TABLE organizations
  ADD COLUMN state_id INT REFERENCES organizations_states (id) DEFAULT 1;

INSERT INTO organizations_states (id, state, description)
VALUES (0, 'on-moderation', ''), (1, 'active', '');

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





CREATE OR REPLACE VIEW view_privileges AS
  SELECT
    users_organizations.user_id,
    users_organizations.organization_id,
    users_organizations.by_default,
    users_organizations.role_id,
    DATE_PART(
        'epoch',
        users_organizations.created_at) :: INT AS created_at,
    users_roles.name,
    users_roles.description
  FROM users_organizations
    INNER JOIN users_roles ON users_organizations.role_id = users_roles.id
  WHERE users_organizations.status = TRUE;