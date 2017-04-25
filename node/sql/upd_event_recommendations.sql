UPDATE recommendations_events
SET
  rating_favored_friends   =
    (SELECT COUNT(id)
     FROM favorite_events
       INNER JOIN view_friends ON view_friends.friend_id = favorite_events.user_id
     WHERE view_users_events.event_id = favorite_events.event_id
           AND view_friends.user_id = view_users_events.user_id) :: INT,
  rating_tags_in_favorites = COALESCE(
      (SELECT SUM(t_favored_by_user.favored_with_tag_count) :: INT
       FROM
         (SELECT COUNT(events_tags.id) :: INT AS favored_with_tag_count
          FROM events_tags
          WHERE     events_tags.event_id IN
                    (SELECT favorite_events.event_id
                     FROM favorite_events
                     WHERE status = TRUE
                           AND favorite_events.user_id = view_users_events.user_id
                    )
                    AND events_tags.event_id = view_users_events.event_id
          GROUP BY events_tags.tag_id
         ) AS t_favored_by_user) :: INT, 0),
  rating_tags_in_hidden    = COALESCE(
      (SELECT SUM(favored_with_tag_count)
       FROM
         (SELECT COUNT(events_tags.id) :: INT AS favored_with_tag_count
          FROM events_tags
          WHERE     events_tags.event_id IN
                    (SELECT hidden_events.event_id
                     FROM hidden_events
                     WHERE status = TRUE
                           AND hidden_events.user_id = view_users_events.user_id
                    )
                    AND events_tags.event_id = view_users_events.event_id
          GROUP BY events_tags.tag_id
         ) AS favored_by_user) :: INT, 0),
  rating_recent_created    = (SELECT
                                CASE
                                WHEN DATE_PART('epoch', NOW()) > ve.created_at + 259200 :: FLOAT     THEN 0
                                ELSE (259200 :: FLOAT - (DATE_PART('epoch', NOW()) - ve.created_at)) :: FLOAT /     7200
                                END
                              FROM view_events AS ve
                              WHERE ve.id = view_users_events.event_id) :: FLOAT,
  rating_active_days       = (SELECT 1 / (CASE
                                          WHEN (ve.registration_required = TRUE AND     ve.registration_till < DATE_PART('epoch', NOW())) THEN 1000::FLOAT
                                          ELSE (SELECT CASE WHEN COUNT(id) :: INT = 0     THEN 1000::FLOAT     ELSE COUNT(id) :: FLOAT
                                                       END
                                                FROM events_dates
                                                WHERE     events_dates.event_id = ve.id
                                                          AND event_date > NOW()
                                                          AND event_date < (NOW() + INTERVAL '10 days')
                                                          AND status = TRUE )     END) :: FLOAT * 10
                              FROM view_events AS ve
                              WHERE ve.id = view_users_events.event_id) :: FLOAT,
  rating_texts_similarity  = '{SIMILARITY_TEXT}',
  updated_at               = NOW()
FROM
  (SELECT view_users_events.*
   FROM view_users_events
     INNER JOIN view_events ON view_users_events.event_id = view_events.id
   WHERE view_events.last_event_date > (SELECT DATE_PART('epoch', TIMESTAMP 'yesterday') :: INT)
'{WHERE_PLACEHOLDER}') AS view_users_events
WHERE view_users_events.user_id = recommendations_events.user_id
      AND view_users_events.event_id = recommendations_events.event_id