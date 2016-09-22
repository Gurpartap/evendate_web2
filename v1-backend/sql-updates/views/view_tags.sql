--depends: tags, events_tags

CREATE VIEW view_tags AS
  SELECT
    tags.id,
    tags.name,
    count(events_tags.tag_id)                  AS events_count,
    DATE_PART('epoch', tags.created_at) :: INT AS created_at,
    DATE_PART('epoch', tags.updated_at) :: INT AS updated_at
  FROM tags
    LEFT JOIN events_tags ON events_tags.tag_id = tags.id AND events_tags.status = TRUE
  GROUP BY tags.id, events_tags.tag_id;