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
  (1, 'organization_registration_done', 'Организация успешно зарегистрировалась'),
  (2, 'organization_registration_failed', 'Организация не закончила регистрацию'),
  (3, 'first_event_added', 'Первое событие успешно добавлено'),
  (4, 'event_done', 'Событие завершилось'),
  (5, 'weekly_stats', 'Еженедельная статистика для организатора');

INSERT INTO email_types (id, type_code, name)
VALUES
  (6, 'private_organization_invitation', 'Вас пригласили в организацию'),
  (7, 'registration_finished_needs_approve', 'Регистрация окончена, но требуется подтверждение'),
  (8, 'registration_finished_not_needs_approve', 'Регистрация окончена и не требуется подтверждение'),
  (9, 'registration_finished_approved', 'Регистрация подтверждена'),
  (10, 'registration_finished_rejected', 'Отказано в регистрации'),
  (11, 'registration_finished_reverted', 'Регистрация отозвана');

CREATE TABLE emails (
  id            SERIAL PRIMARY KEY,
  email_type_id INT,
  recipient     TEXT,
  data          JSON        DEFAULT NULL,
  status        BOOLEAN     DEFAULT TRUE,
  attempts      INT         DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NULL,
  FOREIGN KEY (email_type_id) REFERENCES emails (id)
);

CREATE TABLE emails_sent (
  id         SERIAL PRIMARY KEY,
  email_id   INT,
  error      JSON        DEFAULT NULL,
  info       JSON        DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NULL,
  FOREIGN KEY (email_id) REFERENCES emails (id)
);


/* registration failed*/
SELECT
  email,
  name
FROM organization_registrations
  LEFT JOIN emails ON recipient = organization_registrations.email
                      AND email_type_id = (SELECT id
                                           FROM email_types
                                           WHERE type_code = 'registration_failed')
WHERE finished = FALSE
      AND
      DATE_PART('epoch', NOW()) :: INT - DATE_PART('epoch', organization_registrations.created_at) :: INT > 86400
      AND emails.id IS NULL;

/* Registration done */

