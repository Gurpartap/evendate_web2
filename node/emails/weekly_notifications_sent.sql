SELECT
  (COUNT(stat_users_notifications.id) +
  (SELECT COUNT(stat_notifications.id) AS auto_notifications_sent
   FROM stat_notifications
     INNER JOIN events_notifications ON stat_notifications.event_notification_id = events_notifications.id
     INNER JOIN events ON events_notifications.event_id = events.id
   WHERE events.organization_id = $1
         AND events_notifications.created_at :: DATE >= $2 :: DATE AND
         events_notifications.created_at :: DATE <= $3 :: DATE)) AS notifications_sent
FROM stat_users_notifications
  INNER JOIN users_notifications ON stat_users_notifications.user_notification_id = users_notifications.id
  INNER JOIN events ON users_notifications.event_id = events.id
WHERE events.organization_id = $1
      AND stat_users_notifications.created_at :: DATE >= $2 :: DATE AND
      stat_users_notifications.created_at :: DATE <= $3 :: DATE;