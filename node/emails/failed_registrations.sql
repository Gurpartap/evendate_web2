SELECT
  email,
  name,
  uuid
FROM organization_registrations
  LEFT JOIN emails ON recipient = organization_registrations.email
                      AND email_type_id = (SELECT id
                                           FROM email_types
                                           WHERE type_code = 'organization_registration_failed')
                      AND emails.created_at BETWEEN (NOW() - INTERVAL '1 DAYS') AND (NOW() + INTERVAL '1 DAYS')
WHERE finished = FALSE
      AND
      (DATE_PART('epoch', NOW()) :: INT - DATE_PART('epoch', organization_registrations.created_at) :: INT) < 86400
      AND emails.id IS NULL