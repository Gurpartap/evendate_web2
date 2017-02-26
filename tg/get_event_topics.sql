SELECT
  id,
  keyword,
  ts_rank((SELECT fts
           FROM events
           WHERE id = $1), plainto_or_tsquery((SELECT string_agg(t.k, '|')
                                                 FROM
                                                   (
                                                     SELECT jsonb_array_elements_text(tg_topics.keywords_json) AS keyword
                                                     FROM tg_topics
                                                     WHERE tg_t.id = tg_topics.id)
                                                     AS t(k)
                                                )
          )) AS euristic,

  (SELECT COUNT(events_tags.id)
   FROM events_tags
     INNER JOIN tags ON events_tags.tag_id = tags.id
   WHERE event_id = $1
         AND events_tags.status = TRUE
         AND tags.name IN
             (SELECT keyword
              FROM tg_topics
              WHERE tg_topics.parent_id =
                    (SELECT id
                     FROM tg_topics
                     WHERE tg_topics.keyword = tg_t.keyword
                           AND tg_topics.parent_id
                               IS NULL
                    )
             )
  ) AS lvl2_tags,

  (SELECT COUNT(events_tags.id) * 10
   FROM events_tags
     INNER JOIN tags ON events_tags.tag_id = tags.id
   WHERE event_id = 4892 AND
         tags.name = tg_t.keyword) AS lvl1_tags
FROM tg_topics tg_t
WHERE tg_t.parent_id IS NULL
ORDER BY lvl1_tags DESC, lvl2_tags DESC, euristic DESC;

