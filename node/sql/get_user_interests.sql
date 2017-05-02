SELECT
  tg_t_main.id  AS tg_topic_id,
  users_main.id AS user_id,
  (COALESCE((SELECT ts_rank(to_tsvector('ru',
                                        (COALESCE((SELECT users_interests_aggregated.aggregated_text
                                                   FROM users_interests_aggregated
                                                   WHERE user_id = users_main.id), '')) ||
                                        (SELECT string_agg(
                                            title || ' ' ||
                                            description || ' '
                                            || (SELECT string_agg(tags.name, ', ')
                                                FROM tags
                                                  INNER JOIN events_tags
                                                    ON events_tags.tag_id = tags.id
                                                WHERE events_tags.status = TRUE
                                                      AND
                                                      events_tags.event_id = events.id)
                                            , '|')
                                         FROM events
                                           INNER JOIN (SELECT
                                                         event_id,
                                                         tokens.user_id
                                                       FROM stat_events
                                                         INNER JOIN tokens ON stat_events.token_id = tokens.id
                                                         INNER JOIN stat_event_types
                                                           ON stat_events.stat_type_id = stat_event_types.id
                                                       WHERE tokens.user_id = users_main.id AND
                                                             stat_event_types.entity = 'event'
                                                             AND stat_event_types.type_code IN
                                                                 ('open_site', 'open_notification', 'registered', 'fave', 'view_detail'))
                                                      interacted(event_id, user_id) ON interacted.event_id = events.id
                                         GROUP BY interacted.user_id
                                        )
                                        ||
                                        (SELECT string_agg(
                                            name || ' ' ||
                                            description
                                            , '|')
                                         FROM organizations
                                           INNER JOIN subscriptions ON organizations.id = subscriptions.organization_id
                                         WHERE subscriptions.status = TRUE
                                               AND subscriptions.user_id = users_main.id
                                         GROUP BY subscriptions.user_id
                                        )), plainto_or_tsquery((SELECT string_agg(t.k, '|')
                                                                FROM
                                                                  (
                                                                    SELECT jsonb_array_elements_text(
                                                                               tg_topics.keywords_json) AS keyword
                                                                    FROM tg_topics
                                                                    WHERE tg_t_main.id = tg_topics.id)
                                                                    AS t(k)
                                                               )
                            )) AS value
             FROM tg_topics AS tg_t
             WHERE tg_t.id = tg_t_main.id), 0)) AS value
FROM tg_topics tg_t_main, users AS users_main
WHERE tg_t_main.parent_id IS NULL
AND users_main.id = $1;