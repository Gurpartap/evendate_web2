--depends: tags, events_tags

CREATE VIEW view_tags_used AS
  SELECT
    tags.id,
    tags.name,
    DATE_PART('epoch', tags.created_at) :: INT AS created_at,
    DATE_PART('epoch', tags.updated_at) :: INT AS updated_at,
    events_tags.id AS event_tag_id
  FROM tags
    LEFT JOIN events_tags ON events_tags.tag_id = tags.id AND events_tags.status = TRUE;