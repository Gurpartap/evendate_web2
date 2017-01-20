SELECT
  COUNT(id)                            AS organization_events_count,
  (SELECT email
   FROM organizations
   WHERE id = (SELECT organization_id
               FROM events
               WHERE id = $1))         AS organization_email,
  (SELECT email
   FROM users
   WHERE id = (SELECT creator_id
               FROM events
               WHERE id = $1))         AS creator_email,
  (SELECT COUNT(id) AS users_events_count
   FROM events
   WHERE creator_id = (SELECT creator_id
                       FROM events
                       WHERE id = $1)) AS users_events_count
FROM events
WHERE id <> $1
      AND organization_id = (SELECT organization_id
                             FROM events
                             WHERE id = $1)