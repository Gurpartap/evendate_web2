INSERT INTO evendate.public.tariffs (
  id,
  name,
  available_additional_notifications,
  available_event_publications,
  available_tickets_selling,
  available_telegram_bots,
  available_slack_bots,
  available_auditory_analytics,
  available_in_city,
  price,
  status,
  comment,
  is_default_for_city,
  created_at)
VALUES (
  4,
  'Расширенный (пробный)',
  1,
  100000,
  100000,
  TRUE,
  TRUE,
  TRUE,
  NULL,
  800,
  TRUE,
  'Расширенный тариф для организаторов в первый месяц пользования',
  FALSE,
  NOW()
);

CREATE OR REPLACE VIEW view_organizations_tariffs AS
  SELECT
    organizations.id                                                                             AS organization_id,
    DATE_PART('epoch', COALESCE(view_payments.since, '2015-12-15 00:00:00' :: TIMESTAMP)) :: INT AS since,
    DATE_PART('epoch', COALESCE(view_payments.till, NULL)) :: INT                                AS till,
    COALESCE(view_payments.status, TRUE)                                                         AS status,
    COALESCE(view_payments.tariff_id,
             (SELECT id
              FROM tariffs
              WHERE is_default_for_city = TRUE
                    AND
                    organizations.city_id = available_in_city), default_tariff.id)
                                                                                                 AS tariff_id,
    COALESCE(view_payments.payment_id,
             NULL)                                                                               AS payment_id,
    COALESCE(tariffs.available_additional_notifications,
             default_tariff.available_additional_notifications)                                  AS available_additional_notifications,
    COALESCE(tariffs.available_event_publications,
             default_tariff.available_event_publications)                                        AS available_event_publications,
    COALESCE(tariffs.available_tickets_selling,
             default_tariff.available_tickets_selling)                                           AS available_tickets_selling,
    COALESCE(tariffs.available_telegram_bots,
             default_tariff.available_telegram_bots)                                             AS available_telegram_bots,
    COALESCE(tariffs.available_slack_bots,
             default_tariff.available_slack_bots)                                                AS available_slack_bots,
    COALESCE(tariffs.available_auditory_analytics,
             default_tariff.available_auditory_analytics)                                        AS available_auditory_analytics,
    COALESCE(tariffs.available_in_city,
             default_tariff.available_in_city)                                                   AS available_in_city,
    COALESCE(tariffs.price, default_tariff.price) :: INT                                         AS price,
    COALESCE(tariffs.name, default_tariff.name)                                                  AS name
  FROM organizations
    LEFT JOIN view_payments ON organizations.id = view_payments.organization_id AND
                               view_payments.status = TRUE AND view_payments.till > NOW()
    LEFT JOIN tariffs ON tariffs.id = tariff_id
    LEFT JOIN (SELECT
                 id,
                 available_additional_notifications,
                 available_event_publications,
                 available_tickets_selling,
                 available_telegram_bots,
                 available_slack_bots,
                 available_auditory_analytics,
                 available_in_city,
                 price,
                 name
               FROM tariffs) AS default_tariff(id,
              available_additional_notifications,
              available_event_publications,
              available_tickets_selling,
              available_telegram_bots,
              available_slack_bots,
              available_auditory_analytics,
              available_in_city,
              price,
              name) ON COALESCE(view_payments.tariff_id,
                                (SELECT id
                                 FROM tariffs
                                 WHERE is_default_for_city = TRUE
                                       AND
                                       organizations.city_id = available_in_city),
                                (SELECT CASE WHEN organizations.created_at > current_date - INTERVAL '31' DAY
                                  THEN id
                                        ELSE 1 END
                                 FROM tariffs
                                 WHERE tariffs.id = 4)) = default_tariff.id;

