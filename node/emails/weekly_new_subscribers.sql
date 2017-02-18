SELECT
  DISTINCT
  users.id AS user_id,
  first_name,
  last_name,
  avatar_url
FROM users
  INNER JOIN tokens ON tokens.user_id = users.id
  INNER JOIN stat_organizations ON tokens.id = stat_organizations.token_id
                                   AND stat_organizations.organization_id = $1
  INNER JOIN stat_event_types ON stat_organizations.stat_type_id = stat_event_types.id
                                 AND stat_event_types.entity = 'organization' AND
                                 stat_event_types.type_code = 'subscribe'
WHERE
  stat_organizations.created_at :: DATE >= $2 :: DATE
  AND stat_organizations.created_at :: DATE <= $3 :: DATE;