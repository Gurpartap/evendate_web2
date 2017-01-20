SELECT
  name,
  short_name AS organization_short_name,
  id,
  email,
  (SELECT DATE_PART('day', NOW() - (SELECT MAX(created_at)
                                    FROM events
                                    WHERE organization_id = organizations.id))) AS since_last_event_added,
  (SELECT COUNT(stat_organizations.id)
   FROM stat_organizations
     INNER JOIN stat_event_types ON stat_event_types.id = stat_organizations.stat_type_id
   WHERE stat_event_types.type_code = 'subscribe' AND stat_event_types.entity = 'organization'
         AND stat_organizations.organization_id = organizations.id
         AND stat_organizations.created_at > (NOW() - INTERVAL '1 week'))       AS last_week_subscribers_delta,

  (SELECT tokens.token
   FROM tokens
   WHERE user_id = (
     SELECT users_organizations.user_id
     FROM users_organizations
       INNER JOIN users_roles ON users_roles.id = users_organizations.role_id
     WHERE users_organizations.status = TRUE
           AND users_roles.name = 'admin'
           AND organizations.id = users_organizations.organization_id
     ORDER BY id DESC LIMIT 1
   ) ORDER BY id DESC LIMIT 1)                                                                           AS admin_token
FROM organizations
WHERE status = TRUE
ORDER BY id;