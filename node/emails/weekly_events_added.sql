SELECT COUNT(id) AS events_added
FROM events
WHERE organization_id = $1
      AND events.created_at :: DATE >= $2 :: DATE AND events.created_at :: DATE <= $3 :: DATE
AND events.status = TRUE;