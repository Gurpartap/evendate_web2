CREATE TABLE organization_registrations (
  id         SERIAL PRIMARY KEY,
  email      TEXT,
  site_url   TEXT                        DEFAULT NULL,
  uuid       TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  name       TEXT,
  finished   BOOLEAN                     DEFAULT FALSE,
  created_at TIMESTAMPTZ                 DEFAULT NOW(),
  updated_at TIMESTAMPTZ                 DEFAULT NULL
);

CREATE TABLE email_types (
  id         SERIAL PRIMARY KEY,
  type_code  VARCHAR(255),
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NULL
);

INSERT INTO email_types (id, type_code, name)
VALUES
  (1, 'organization_registration_done', 'Организация успешно зарегистрирована'),
  (2, 'organization_registration_failed', 'Регистрация Вашей организации'),
  (3, 'first_event_added', 'Вашу первое событие успешно опубликовано'),
  (4, 'event_done', 'Событие завершилось: {title}'),
  (5, 'weekly_stats', '{organization_short_name}: еженедельная статистика');

INSERT INTO email_types (id, type_code, name)
VALUES
  (6, 'private_organization_invitation', 'Вас пригласили в организацию'),
  (7, 'registration_finished_needs_approve', 'Регистрация завершена, но требуется подтверждение'),
  (8, 'registration_finished_not_needs_approve', 'Регистрация успешно завершена'),
  (9, 'registration_finished_approved', 'Регистрация подтверждена'),
  (10, 'registration_finished_rejected', 'Отказано в регистрации'),
  (11, 'registration_finished_reverted', 'Регистрация отозвана');

CREATE TABLE emails (
  id            SERIAL PRIMARY KEY,
  email_type_id INT,
  recipient     TEXT,
  data          JSONB       DEFAULT NULL,
  status        BOOLEAN     DEFAULT TRUE,
  attempts      INT         DEFAULT 0,
  is_sending    BOOLEAN     DEFAULT FALSE,
  is_sended     BOOLEAN     DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NULL,
  FOREIGN KEY (email_type_id) REFERENCES email_types (id)
);

CREATE TABLE emails_sent (
  id         SERIAL PRIMARY KEY,
  email_id   INT,
  error      JSONB       DEFAULT NULL,
  info       JSONB       DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NULL,
  FOREIGN KEY (email_id) REFERENCES emails (id)
);


/* registration failed*/
SELECT
  email,
  name,
  emails.*
FROM organization_registrations
  LEFT JOIN emails ON recipient = organization_registrations.email
                      AND email_type_id = (SELECT id
                                           FROM email_types
                                           WHERE type_code = 'organization_registration_failed')
                      AND emails.created_at BETWEEN (NOW() - INTERVAL '1 DAYS') AND (NOW() + INTERVAL '1 DAYS')
WHERE finished = FALSE
      AND
      DATE_PART('epoch', NOW()) :: INT - DATE_PART('epoch', organization_registrations.created_at) :: INT > 86400
      AND emails.id IS NULL;

/* Check If First Event */
SELECT
  COUNT(id)                              AS organization_events_count,
  (SELECT email
   FROM organizations
   WHERE id = (SELECT organization_id
               FROM events
               WHERE id = 4886))         AS organization_email,
  (SELECT email
   FROM users
   WHERE id = (SELECT creator_id
               FROM events
               WHERE id = 4886))         AS creator_email,
  (SELECT COUNT(id) AS users_events_count
   FROM events
   WHERE creator_id = (SELECT creator_id
                       FROM events
                       WHERE id = 4886)) AS users_events_count

FROM events
WHERE id <> 4882
      AND organization_id = (SELECT organization_id
                             FROM events
                             WHERE id = 4886);

/* WEEKLY DIGESTS*/

SELECT
  name,
  short_name,
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
         AND stat_organizations.created_at > (NOW() - INTERVAL '1 week'))       AS last_week_subscribers_delta
FROM organizations
WHERE status = TRUE;

