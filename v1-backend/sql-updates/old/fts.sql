CREATE TEXT SEARCH DICTIONARY ispell_ru (
TEMPLATE = ispell,
  dictfile = ru,
  afffile = ru,
  stopwords = russian
);

CREATE TEXT SEARCH DICTIONARY ispell_en (
TEMPLATE = ispell,
  dictfile = en,
  afffile = en,
  stopwords = english
);

CREATE TEXT SEARCH CONFIGURATION ru ( COPY = russian );

ALTER TEXT SEARCH CONFIGURATION ru
ALTER MAPPING
FOR word, hword, hword_part
WITH ispell_ru, russian_stem;

ALTER TEXT SEARCH CONFIGURATION ru
ALTER MAPPING
FOR asciiword, asciihword, hword_asciipart
WITH ispell_en, english_stem;

SET default_text_search_config = 'ru';

--
-- Чтобы не определять конфигурацию поиска каждый раз в новой сессии,
-- мы должны прописать ее в файле настроек PostgreSQL "postgresql.conf".
-- Установите переменную default_text_search_config равную имени нашей конфигурации "ru"
-- default_text_search_config = 'ru'.

ALTER TABLE events
  ADD COLUMN fts TSVECTOR;

UPDATE events
SET fts =
setweight(coalesce(to_tsvector('ru', title), ''), 'A') || ' ' ||
setweight(coalesce(to_tsvector('ru', description), ''), 'B') || ' ' ||
setweight(coalesce(to_tsvector('ru', location), ''), 'D');


CREATE INDEX fts_index ON events USING GIN (fts);


ALTER TABLE organizations
  ADD COLUMN fts TSVECTOR;

UPDATE organizations
SET fts =
setweight(coalesce(to_tsvector('ru', name), ''), 'A') || ' ' ||
setweight(coalesce(to_tsvector('ru', short_name), ''), 'B') || ' ' ||
setweight(coalesce(to_tsvector('ru', description), ''), 'B') || ' ' ||
setweight(coalesce(to_tsvector('ru', default_address), ''), 'D');


CREATE INDEX fts_index_organizations ON organizations USING GIN (fts);

CREATE FUNCTION events_vector_update()
  RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE')
  THEN
    IF (OLD.title <> NEW.title OR OLD.description <> NEW.description OR OLD.location <> NEW.location)
    THEN
      NEW.fts = setweight(coalesce(to_tsvector('ru', NEW.title), ''), 'A') || ' ' ||
                setweight(coalesce(to_tsvector('ru', NEW.description), ''), 'B') || ' ' ||
                setweight(coalesce(to_tsvector('ru', NEW.location), ''), 'D');
      RETURN NEW;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF (TG_OP = 'INSERT')
    THEN
      NEW.fts = setweight(coalesce(to_tsvector('ru', NEW.title), ''), 'A') || ' ' ||
                setweight(coalesce(to_tsvector('ru', NEW.description), ''), 'B') || ' ' ||
                setweight(coalesce(to_tsvector('ru', NEW.location), ''), 'D');
      RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE 'plpgsql';


CREATE FUNCTION organizations_vector_update()
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

CREATE TRIGGER article_fts_update BEFORE INSERT OR UPDATE ON events
FOR EACH ROW EXECUTE PROCEDURE events_vector_update();

CREATE TRIGGER article_fts_update BEFORE INSERT OR UPDATE ON organizations
FOR EACH ROW EXECUTE PROCEDURE organizations_vector_update();


CREATE OR REPLACE VIEW view_events AS
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
    events.public_at,
    events.canceled,
    vk_posts.group_id                                                                AS vk_group_id,
    vk_posts.image_path                                                              AS vk_image_path,
    vk_posts.message                                                                 AS vk_message,
    events.registration_required,
    DATE_PART('epoch', events.registration_till) :: INT                              AS registration_till,
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
    'http://evendate.io/event.php?id=' || events.id                                  AS link,
    TRUE                                                                             AS status,
    events.images_domain || 'event_images/large/' || events.image_vertical           AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal         AS image_horizontal_url,
    events.images_domain || 'event_images/large/' || events.image_vertical           AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal         AS image_horizontal_large_url,

    events.images_domain || 'event_images/square/' || events.image_vertical          AS image_square_vertical_url,
    events.images_domain || 'event_images/square/' || events.image_horizontal        AS image_square_horizontal_url,

    events.images_domain || 'event_images/medium/' || events.image_horizontal        AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_vertical          AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical           AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' || events.image_horizontal         AS image_horizontal_small_url,
    events.images_domain || 'event_images/vk/' || vk_posts.image_path                AS vk_image_url,
    view_organizations.img_medium_url                                                AS organization_logo_medium_url,
    view_organizations.img_url                                                       AS organization_logo_large_url,
    view_organizations.img_small_url                                                 AS organization_logo_small_url,
    view_organizations.name                                                          AS organization_name,
    organization_types.name                                                          AS organization_type_name,
    view_organizations.short_name                                                    AS organization_short_name,
    (SELECT DATE_PART('epoch', MIN((events_dates.event_date::DATE || ' ' || events_dates.start_time)::TIMESTAMP)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date >= NOW()::DATE AND events_dates.status =
                                                                               TRUE) AS nearest_event_date,
    (SELECT DATE_PART('epoch', MIN((events_dates.event_date::DATE || ' ' || events_dates.start_time)::TIMESTAMP)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                      AS first_event_date,
    (SELECT DATE_PART('epoch', MIN((events_dates.event_date::DATE || ' ' || events_dates.start_time)::TIMESTAMP)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                      AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                                     AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                                     AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                              AS favored_users_count,
    events.fts
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
  --LEFT JOIN events_tags ON events.id = events_tags.event_id
  --LEFT JOIN tags ON tags.id = events_tags.tag_id
  WHERE view_organizations.status = TRUE
        AND events.status = TRUE;



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
  WHERE organizations.status = TRUE;