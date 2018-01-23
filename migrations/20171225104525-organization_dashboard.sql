DROP VIEW view_friends CASCADE;
DROP MATERIALIZED VIEW view_friends CASCADE;


CREATE OR REPLACE VIEW view_friends_data AS SELECT DISTINCT
                                              'google'                       AS type,
                                              view_google_friends.uid        AS uid,
                                              view_google_friends.user_id    AS user_id,
                                              view_google_friends.friend_uid AS friend_uid,
                                              view_google_friends.friend_id  AS friend_id
                                            FROM view_google_friends
                                            UNION SELECT DISTINCT
                                                    'facebook'                       AS type,
                                                    view_facebook_friends.uid        AS uid,
                                                    view_facebook_friends.user_id    AS user_id,
                                                    view_facebook_friends.friend_uid AS friend_uid,
                                                    view_facebook_friends.friend_id  AS friend_id
                                                  FROM view_facebook_friends
                                            UNION SELECT DISTINCT
                                                    'vk.com'                   AS type,
                                                    view_vk_friends.uid        AS uid,
                                                    view_vk_friends.user_id    AS user_id,
                                                    view_vk_friends.friend_uid AS friend_uid,
                                                    view_vk_friends.friend_id  AS friend_id
                                                  FROM view_vk_friends;

CREATE MATERIALIZED VIEW view_friends AS
  SELECT DISTINCT ON (type, uid, user_id, friend_id, friend_uid) *
  FROM view_friends_data;


CREATE UNIQUE INDEX view_friendsi
  ON view_friends (type, uid, user_id, friend_id, friend_uid);

REFRESH MATERIALIZED VIEW CONCURRENTLY view_friends;

CREATE OR REPLACE FUNCTION refresh_friends_mat_view()
  RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY view_friends;
  RETURN NULL;
END $$;

CREATE TRIGGER refresh_mat_view_friends
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON vk_sign_in
EXECUTE PROCEDURE refresh_friends_mat_view();


CREATE TRIGGER refresh_mat_view_friends
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON google_sign_in
EXECUTE PROCEDURE refresh_friends_mat_view();

CREATE TRIGGER refresh_mat_view_friends
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON facebook_sign_in
EXECUTE PROCEDURE refresh_friends_mat_view();

CREATE OR REPLACE VIEW view_recommendations_friend_interests_notifications AS
  SELECT DISTINCT
    (view_friends.friend_id)                    AS user_id,
    notification_types.id                       AS notification_type_id,
    stat_events.event_id,
    (SELECT COUNT(DISTINCT (vf.friend_id))
     FROM view_friends vf
       INNER JOIN favorite_events
         ON favorite_events.user_id = vf.friend_id AND favorite_events.event_id = stat_events.event_id
     WHERE vf.user_id = view_friends.friend_id) AS favored_friends_count,
    notifications_recommendations.id
  FROM stat_events
    INNER JOIN stat_event_types ON stat_event_types.id = stat_events.stat_type_id
    INNER JOIN tokens ON stat_events.token_id = tokens.id
    INNER JOIN view_friends ON tokens.user_id = view_friends.user_id
    INNER JOIN notification_types ON notification_types.id = 51
    LEFT JOIN notifications_recommendations
      ON notification_types.id = notifications_recommendations.notification_type_id
         AND notifications_recommendations.user_id = view_friends.friend_id
         AND (notifications_recommendations.data ->> 'event_id') :: INT = stat_events.event_id
  WHERE stat_event_types.type_code = 'fave' AND stat_event_types.entity = 'event'
        AND stat_events.created_at > (NOW() - INTERVAL '2 hours')
        AND notifications_recommendations.id IS NULL;

CREATE INDEX ON public.view_friends USING BTREE (user_id, friend_id);
CREATE INDEX ON public.view_events USING BTREE (organization_id, created_at, last_event_date_dt);
CREATE INDEX ON public.tokens USING BTREE (id, user_id);
CREATE INDEX ON public.view_events USING BTREE (id);
CREATE INDEX ON public.stat_events USING BTREE (event_id, token_id);
CREATE INDEX ON public.view_friends USING BTREE (user_id, friend_id);
CREATE INDEX ON public.view_events USING BTREE (organization_id, last_event_date);
CREATE INDEX ON public.tickets USING BTREE (ticket_order_id);
CREATE INDEX ON public.tokens USING BTREE (token);
CREATE INDEX ON public.stat_events USING BTREE (created_at);
CREATE INDEX ON public.ticket_orders USING BTREE (event_id);

DROP VIEW view_users CASCADE;

CREATE MATERIALIZED VIEW view_users AS
  SELECT
    users.id,
    users.local_avatar_filename,
    (CASE
     WHEN users.local_avatar_filename IS NOT NULL
       THEN 'https://evendate.io/user_images/default/' || users.local_avatar_filename
     ELSE users.avatar_url
     END
    )                AS avatar_url,
    (CASE
     WHEN users.local_avatar_filename IS NOT NULL
       THEN 'https://evendate.io/user_images/blurred/' || users.local_avatar_filename
     ELSE NULL
     END
    )                AS blurred_img_url,
    users.email,
    users.vk_uid,
    users.facebook_uid,
    users.google_uid,
    users.first_name,
    users.last_name,
    users.middle_name,
    users.gender,
    users.token,
    users.show_to_friends,
    users.blurred_image_url,
    users.avatar_url AS original_avatar_url
  FROM users;

CREATE UNIQUE INDEX view_usersi
  ON view_users (id);


REFRESH MATERIALIZED VIEW CONCURRENTLY view_users;

CREATE OR REPLACE FUNCTION refresh_users_mat_view()
  RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY view_users;
  RETURN NULL;
END $$;

CREATE TRIGGER refresh_mat_view_users
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON users
EXECUTE PROCEDURE refresh_users_mat_view();

CREATE VIEW view_invitation_links AS
  SELECT
    organization_id,
    creator_id,
    uuid,
    DATE_PART(
        'epoch',
        organizations_invitation_links.created_at) :: INT AS created_at,
    DATE_PART(
        'epoch',
        organizations_invitation_links.updated_at) :: INT AS updated_at,
    status,
    view_users.first_name                                 AS creator_first_name,
    view_users.last_name                                  AS creator_last_name,
    view_users.avatar_url                                 AS creator_avatar_url
  FROM organizations_invitation_links
    INNER JOIN view_users ON view_users.id = organizations_invitation_links.creator_id
  WHERE organizations_invitation_links.status = TRUE;

CREATE OR REPLACE VIEW view_invited_users
  AS
    SELECT DISTINCT
      organizations_invitations.organization_id,
      organizations_invitations.user_id,
      organizations_invitations.creator_id,
      organizations_invitations.email,
      organizations_invitations.uuid,
      COALESCE(users_by_id.first_name, users_by_email.first_name, NULL) AS user_first_name,
      COALESCE(users_by_id.last_name, users_by_email.last_name, NULL)   AS user_last_name,
      COALESCE(users_by_id.avatar_url, users_by_email.avatar_url, NULL) AS user_avatar_url,
      inviters.first_name                                               AS creator_first_name,
      inviters.last_name                                                AS creator_last_name,
      inviters.avatar_url                                               AS creator_avatar_url,
      DATE_PART(
          'epoch',
          organizations_invitations.created_at) :: INT                  AS created_at,
      DATE_PART(
          'epoch',
          organizations_invitations.updated_at) :: INT                  AS updated_at,
      organizations_invitations.email IS NOT NULL                       AS invited_by_email,
      organizations_invitations.user_id IS NOT NULL                     AS invited_by_user_id,
      organizations_invitations.status
    FROM organizations_invitations
      INNER JOIN view_users AS inviters ON inviters.id = organizations_invitations.creator_id
      LEFT JOIN view_users AS users_by_id ON users_by_id.id = organizations_invitations.user_id
      LEFT JOIN view_users AS users_by_email ON users_by_email.email = organizations_invitations.email;


DROP VIEW view_organization_finance;
DROP VIEW view_event_finance;
DROP VIEW view_networking_profiles;
DROP VIEW view_networking_access;
DROP MATERIALIZED VIEW view_tickets;
DROP VIEW view_promocodes;
DROP VIEW view_emails_after_event;
DROP VIEW view_emails_waiting_for_payment;
DROP VIEW view_registration_field_values;
DROP VIEW view_stats_utm;
DROP VIEW view_tickets_orders;


CREATE MATERIALIZED VIEW view_tickets_orders AS
  SELECT
    ticket_orders.id,
    ticket_orders.uuid,
    ticket_orders.user_id,
    ticket_orders.order_content,
    ticket_orders.event_id,
    ticket_orders.is_canceled,
    date_part('epoch' :: TEXT, ticket_orders.payed_at) :: INTEGER AS payed_at,
    date_part('epoch' :: TEXT,
              ticket_orders.canceled_at) :: INTEGER               AS canceled_at,
    date_part('epoch' :: TEXT,
              ticket_orders.created_at) :: INTEGER                AS created_at,
    date_part('epoch' :: TEXT,
              ticket_orders.updated_at) :: INTEGER                AS updated_at,
    tickets_orders_statuses.type_code                             AS status_type_code,
    tickets_orders_statuses.name                                  AS status_name,
    tickets_orders_statuses.id                                    AS status_id,
    rpad((ticket_orders.id :: TEXT || '00' :: TEXT) || reverse((ticket_orders.id * 1610) :: TEXT), 9,
         '0' :: TEXT)                                             AS number,
    money.sum,
    st.payed,
    CASE
    WHEN COALESCE(ticket_orders.final_sum, money.sum) < 0 :: NUMERIC
      THEN 0 :: NUMERIC
    ELSE COALESCE(ticket_orders.final_sum, money.sum)
    END                                                           AS final_sum,
    ticket_orders.promocode_id,
    ticket_orders.shop_sum_amount,
    CASE
    WHEN st.payed > 0 AND ticket_orders.shop_sum_amount > 0 :: NUMERIC AND
         COALESCE(ticket_orders.final_sum, money.sum) > 0 :: NUMERIC
      THEN round((COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount) /
                 COALESCE(ticket_orders.final_sum, money.sum) * 100 :: NUMERIC, 2)
    ELSE NULL :: NUMERIC
    END                                                           AS processing_commission,
    CASE
    WHEN events.canceled AND (events.last_event_date + '120 days' :: INTERVAL) > now()
      THEN 0 :: NUMERIC - (COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount) * 2 :: NUMERIC
           -
           COALESCE(ticket_orders.final_sum, money.sum) * 0.01
    ELSE floor(ticket_orders.shop_sum_amount - COALESCE(ticket_orders.final_sum, money.sum) * 0.01 -
               CASE
               WHEN (ticket_orders.order_status_id = ANY (ARRAY [3, 7])) OR events.canceled
                 THEN COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount
               ELSE 0 :: NUMERIC
               END)
    END                                                           AS withdraw_available,
    CASE
    WHEN st.payed > 0 AND events.ticketing_locally = TRUE
      THEN
        CASE
        WHEN (st.aviso_data ->> 'paymentType' :: TEXT) IS NOT NULL
          THEN st.aviso_data ->> 'paymentType' :: TEXT
        WHEN (st.aviso_data ->> 'legal_entity' :: TEXT) = 'true' :: TEXT
          THEN 'LEP' :: TEXT
        WHEN (st.aviso_data ->> 'bitcoin' :: TEXT) = 'true' :: TEXT
          THEN 'BTC' :: TEXT
        ELSE 'OTH' :: TEXT
        END
    ELSE NULL :: TEXT
    END                                                           AS payment_type,
    CASE
    WHEN st.payed > 0 AND ticket_orders.shop_sum_amount > 0 :: NUMERIC AND
         COALESCE(ticket_orders.final_sum, money.sum) > 0 :: NUMERIC
      THEN COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount +
           CASE
           WHEN (ticket_orders.order_status_id = ANY (ARRAY [3, 7])) OR events.canceled
             THEN COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount
           ELSE 0 :: NUMERIC
           END
    ELSE NULL :: NUMERIC
    END                                                           AS processing_commission_value,
    CASE
    WHEN st.payed > 0 AND ticket_orders.shop_sum_amount > 0 :: NUMERIC AND
         COALESCE(ticket_orders.final_sum, money.sum) > 0 :: NUMERIC
      THEN floor(COALESCE(ticket_orders.final_sum, money.sum) * 0.01)
    ELSE NULL :: NUMERIC
    END                                                           AS evendate_commission_value,
    (SELECT count(*) AS count
     FROM tickets
     WHERE tickets.ticket_order_id =
           ticket_orders.id)                                      AS tickets_count,
    tickets_orders_statuses.type                                  AS ticket_order_status_type,
    ticket_orders.ticket_pricing_rule_id,
    ticket_orders.ticket_pricing_rule_discount,
    CASE
    WHEN (ticket_orders.order_status_id = ANY (ARRAY [3, 7])) OR events.canceled
      THEN COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount
    ELSE 0 :: NUMERIC
    END                                                           AS additional_commision,
    events.ticketing_locally
  FROM ticket_orders
    JOIN events ON events.id = ticket_orders.event_id
    LEFT JOIN (SELECT
                 sum(tickets.price) AS sum,
                 tickets.ticket_order_id
               FROM tickets
               WHERE tickets.status = TRUE
               GROUP BY tickets.ticket_order_id) money(sum, ticket_order_id) ON money.ticket_order_id = ticket_orders.id
    LEFT JOIN (SELECT
                 count(orders_payments.id) AS count,
                 orders_payments.ticket_order_id,
                 orders_payments.aviso_data
               FROM orders_payments
               WHERE orders_payments.canceled = FALSE AND orders_payments.finished = TRUE
               GROUP BY orders_payments.ticket_order_id,
                 orders_payments.aviso_data) st(payed, ticket_order_id, aviso_data)
      ON st.ticket_order_id = ticket_orders.id
    JOIN tickets_orders_statuses ON tickets_orders_statuses.id =
                                    CASE
                                    WHEN events.registration_approvement_required IS TRUE AND
                                         COALESCE(ticket_orders.final_sum, money.sum) :: REAL = 0 :: REAL AND
                                         (ticket_orders.order_status_id = 4 OR ticket_orders.order_status_id = 1)
                                      THEN 9
                                    WHEN
                                      COALESCE(ticket_orders.final_sum, money.sum) :: REAL > 0 :: REAL AND st.payed > 0
                                      AND (ticket_orders.order_status_id <> ALL (ARRAY [3, 7]))
                                      THEN 2
                                    WHEN COALESCE(ticket_orders.final_sum, money.sum) :: REAL > 0 :: REAL AND
                                         (st.payed = 0 OR st.payed IS NULL) AND
                                         (timezone('UTC' :: TEXT, now()) - ticket_orders.created_at) >
                                         ((SELECT e.booking_time :: DOUBLE PRECISION * '01:00:00' :: INTERVAL
                                           FROM events e
                                           WHERE e.id = ticket_orders.event_id))
                                      THEN 5
                                    ELSE ticket_orders.order_status_id
                                    END;

CREATE UNIQUE INDEX view_tickets_ordersi
  ON view_tickets_orders (id);


REFRESH MATERIALIZED VIEW CONCURRENTLY view_tickets_orders;

CREATE OR REPLACE FUNCTION refresh_tickets_orders_mat_view()
  RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY view_tickets_orders;
  RETURN NULL;
END $$;

CREATE TRIGGER refresh_mat_view_tickets_orders
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON tickets
EXECUTE PROCEDURE refresh_tickets_orders_mat_view();

CREATE TRIGGER refresh_mat_view_tickets_orders
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON ticket_orders
EXECUTE PROCEDURE refresh_tickets_orders_mat_view();

CREATE TRIGGER refresh_mat_view_tickets_orders
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON ticket_types
EXECUTE PROCEDURE refresh_tickets_orders_mat_view();

CREATE TRIGGER refresh_mat_view_tickets_orders
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON tickets_orders_statuses
EXECUTE PROCEDURE refresh_tickets_orders_mat_view();

CREATE TRIGGER refresh_mat_view_tickets_orders
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON events
EXECUTE PROCEDURE refresh_tickets_orders_mat_view();

CREATE TRIGGER refresh_mat_view_tickets_orders
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON orders_payments
EXECUTE PROCEDURE refresh_tickets_orders_mat_view();


CREATE MATERIALIZED VIEW view_tickets AS
  SELECT
    tickets.id,
    tickets.user_id,
    tickets.ticket_type_id,
    tickets.ticket_order_id,
    tickets.status,
    tickets.checked_out,
    tickets.uuid,
    view_all_ticket_types.uuid                                                                                AS ticket_type_uuid,
    view_tickets_orders.uuid                                                                                  AS ticket_order_uuid,
    DATE_PART('epoch',
              tickets.created_at) :: INT                                                                      AS created_at,
    DATE_PART('epoch',
              tickets.updated_at) :: INT                                                                      AS updated_at,
    view_tickets_orders.event_id                                                                              AS event_id,
    (view_tickets_orders.status_type_code IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                                         AS is_canceled,
    (view_tickets_orders.status_type_code NOT IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                                         AS is_active,
    view_all_ticket_types.type_code,
    view_all_ticket_types.price,
    RPAD(tickets.id :: TEXT || '00' || reverse((view_tickets_orders.id * 16) :: TEXT), 9, '0') :: TEXT || ' ' AS number,
    tickets.checked_out                                                                                       AS checkout,
    view_tickets_orders.ticket_order_status_type                                                              AS order_status_type
  FROM tickets
    INNER JOIN view_tickets_orders ON view_tickets_orders.id = tickets.ticket_order_id
    INNER JOIN view_all_ticket_types ON view_all_ticket_types.id = tickets.ticket_type_id;


CREATE UNIQUE INDEX view_ticketsi
  ON view_tickets (id);


REFRESH MATERIALIZED VIEW CONCURRENTLY view_tickets;

CREATE OR REPLACE FUNCTION refresh_tickets_mat_view()
  RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY view_tickets;
  RETURN NULL;
END $$;

CREATE TRIGGER refresh_mat_view_tickets
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON tickets
EXECUTE PROCEDURE refresh_tickets_mat_view();

CREATE TRIGGER refresh_mat_view_tickets
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON ticket_orders
EXECUTE PROCEDURE refresh_tickets_mat_view();

CREATE TRIGGER refresh_mat_view_tickets
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON ticket_types
EXECUTE PROCEDURE refresh_tickets_mat_view();

CREATE OR REPLACE VIEW view_networking_access AS
  (SELECT
     event_id,
     user_id
   FROM networking_access
   WHERE networking_access.status = TRUE)
  UNION
  (SELECT DISTINCT ON (event_id, user_id)
     event_id,
     user_id
   FROM view_tickets
   WHERE view_tickets.order_status_type = 'green')
  UNION
  (SELECT
     id AS event_id,
     user_id
   FROM events
     INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id
   WHERE users_organizations.status = TRUE);


CREATE OR REPLACE VIEW view_networking_profiles AS
  SELECT
    users.id,
    u2.id                                                                      AS for_id,
    COALESCE(users_profiles.first_name, users.first_name)                      AS first_name,
    COALESCE(users_profiles.last_name, users.last_name)                        AS last_name,
    COALESCE(users_profiles.avatar_url, users.avatar_url)                      AS avatar_url,
    view_networking_access.event_id,
    view_networking_access.user_id,
    COALESCE(networking_goals.info, users_profiles.info)                       AS info,
    COALESCE(networking_goals.looking_for, users_profiles.looking_for)         AS looking_for,
    vk_url,
    facebook_url,
    twitter_url,
    linkedin_url,
    telegram_url,
    instagram_url,
    github_url,
    users_profiles.email,
    networking_goals.company_name,
    DATE_PART('epoch', networking_goals.created_at) :: INT                     AS created_at,
    DATE_PART('epoch', networking_goals.updated_at) :: INT                     AS updated_at,
    CASE WHEN networking_goals.info IS NOT NULL OR networking_goals.created_at IS NOT NULL
      THEN TRUE
    ELSE FALSE END                                                             AS signed_up,
    networking_requests.uuid IS NOT NULL                                       AS request_exists,
    networking_requests.accept_status                                          AS request_status,
    networking_requests.uuid,
    networking_requests.uuid                                                   AS request_uuid,
    (SELECT uuid
     FROM networking_requests
     WHERE sender_user_id = u2.id
           AND networking_requests.recipient_user_id = users.id
           AND networking_requests.event_id = view_networking_access.event_id) AS outgoing_request_uuid
  FROM users
    FULL OUTER JOIN users u2 ON 1 = 1
    LEFT JOIN view_networking_access ON view_networking_access.user_id = users.id
    LEFT JOIN users_profiles ON users.id = (
      CASE WHEN ((SELECT COUNT(*)
                  FROM networking_requests
                  WHERE networking_requests.recipient_user_id = users.id
                        AND networking_requests.sender_user_id = u2.id
                        AND networking_requests.status = TRUE
                        AND networking_requests.accept_status = TRUE) > 0) OR (users.id = u2.id)
        THEN users_profiles.user_id
      ELSE -1 END)

    LEFT JOIN networking_goals
      ON users.id = networking_goals.user_id AND networking_goals.event_id = view_networking_access.event_id
    LEFT JOIN networking_requests ON u2.id = networking_requests.recipient_user_id
                                     AND networking_requests.event_id = view_networking_access.event_id
                                     AND networking_requests.status = TRUE
                                     AND networking_requests.sender_user_id = users.id
  ORDER BY users.id;


CREATE OR REPLACE VIEW view_event_finance AS
  SELECT
    events.id                                                                     AS event_id,
    (SELECT count(view_tickets.id) AS checked_out_count
     FROM view_tickets
     WHERE view_tickets.event_id = events.id AND view_tickets.checked_out = TRUE) AS checked_out_count,
    sum(view_tickets_orders.final_sum)                                            AS total_income,
    sum(view_tickets_orders.withdraw_available)                                   AS withdraw_available,
    sum(view_tickets_orders.processing_commission_value)                          AS processing_commission_value,
    round(avg(view_tickets_orders.processing_commission), 2)                      AS processing_commission,
    sum(view_tickets_orders.evendate_commission_value)                            AS evendate_commission_value,
    count(view_tickets_orders.id)                                                 AS orders_count
  FROM events
    JOIN view_tickets_orders ON view_tickets_orders.event_id = events.id
  WHERE view_tickets_orders.status_id = ANY (ARRAY [2, 3, 7, 4, 8, 10, 13])
  GROUP BY events.id;


CREATE OR REPLACE VIEW view_organization_finance AS
  SELECT
    organizations.id                                                                             AS organization_id,
    COALESCE(sum(view_event_finance.total_income), 0 :: NUMERIC)                                 AS total_income,
    COALESCE(sum(view_event_finance.withdraw_available) -
             ((SELECT COALESCE(sum(organizations_withdraws.sum), 0 :: NUMERIC) AS "coalesce"
               FROM organizations_withdraws
               WHERE organizations_withdraws.organization_id = organizations.id AND
                     (organizations_withdraws.organization_withdraw_status_id = ANY (ARRAY [1, 2, 3, 4])))),
             0 :: NUMERIC)                                                                       AS withdraw_available,
    sum(
        view_event_finance.processing_commission_value)                                          AS processing_commission_value,
    round(avg(view_event_finance.processing_commission),
          2)                                                                                     AS processing_commission,
    sum(
        view_event_finance.evendate_commission_value)                                            AS evendate_commission_value,
    (SELECT COALESCE(sum(organizations_withdraws.sum), 0 :: NUMERIC) AS "coalesce"
     FROM organizations_withdraws
     WHERE organizations_withdraws.organization_id = organizations.id AND
           (organizations_withdraws.organization_withdraw_status_id = ANY (ARRAY [1, 2, 3, 4]))) AS withdrawn
  FROM organizations
    LEFT JOIN events ON organizations.id = events.organization_id
    LEFT JOIN view_event_finance ON view_event_finance.event_id = events.id
  GROUP BY organizations.id;


CREATE OR REPLACE VIEW view_promocodes AS
  SELECT
    id,
    uuid,
    event_id,
    code,
    is_fixed,
    is_percentage,
    effort,
    DATE_PART('epoch', promocodes.start_date :: TIMESTAMP) :: INT                                     AS start_date,
    DATE_PART('epoch', promocodes.end_date :: TIMESTAMP) :: INT                                       AS end_date,
    enabled,
    DATE_PART('epoch', promocodes.created_at :: TIMESTAMP) :: INT                                     AS created_at,
    DATE_PART('epoch', promocodes.updated_at :: TIMESTAMP) :: INT                                     AS updated_at,
    ((NOW() BETWEEN promocodes.start_date AND promocodes.end_date) AND
     (SELECT COUNT(view_tickets_orders.id)
      FROM view_tickets_orders
        INNER JOIN events ON events.id = view_tickets_orders.event_id
      WHERE view_tickets_orders.event_id = promocodes.event_id
            AND view_tickets_orders.promocode_id = promocodes.id
            AND (view_tickets_orders.ticket_order_status_type = 'green'
                 OR view_tickets_orders.ticket_order_status_type = 'yellow')) < promocodes.use_limit) AS
                                                                                                         is_active,
    use_limit,
    (SELECT COUNT(view_tickets_orders.id)
     FROM view_tickets_orders
       INNER JOIN events ON events.id = view_tickets_orders.event_id
     WHERE view_tickets_orders.event_id = promocodes.event_id
           AND view_tickets_orders.promocode_id = promocodes.id
           AND (view_tickets_orders.ticket_order_status_type = 'green'
                OR view_tickets_orders.ticket_order_status_type = 'yellow')
    )                                                                                                 AS used_times
  FROM promocodes;


CREATE OR REPLACE VIEW view_registration_field_values AS
  SELECT
    view_registration_form_fields.uuid                              AS form_field_uuid,
    view_registration_form_fields.label                             AS form_field_label,
    view_registration_form_fields.type                              AS form_field_type,
    view_registration_form_fields.field_type_id                     AS form_field_type_id,
    view_registration_form_fields.required                          AS form_field_required,
    COALESCE(registration_field_values.value,
             (SELECT string_agg
             (a.a ->> 'value', ', ')
              FROM (SELECT jsonb_array_elements((registration_field_values.values))) AS a(a)
              WHERE registration_field_values.values IS NOT NULL
                    AND registration_field_values.values != 'null')
    )                                                               AS value,
    registration_field_values.values :: JSONB,
    DATE_PART('epoch', registration_field_values.created_at) :: INT AS created_at,
    DATE_PART('epoch', registration_field_values.updated_at) :: INT AS updated_at,
    registration_field_values.ticket_order_id,
    view_tickets_orders.uuid                                        AS ticket_order_uuid,
    view_registration_form_fields.order_number,
    view_tickets_orders.user_id,
    view_tickets_orders.event_id
  FROM registration_field_values
    INNER JOIN view_registration_form_fields
      ON registration_field_values.registration_form_field_id = view_registration_form_fields.id
    INNER JOIN view_tickets_orders ON registration_field_values.ticket_order_id = view_tickets_orders.id;


CREATE OR REPLACE VIEW view_emails_after_event AS
  SELECT
    view_events.title       AS event_title,
    view_events.id          AS event_id,
    view_events.organization_id,
    email_texts.after_event AS after_event_text,
    "users"."email",
    users.first_name,
    (SELECT token
     FROM tokens
     WHERE user_id = users.id
     ORDER BY id DESC
     LIMIT 1)               AS token,
    (SELECT value
     FROM view_registration_field_values
     WHERE "view_registration_field_values"."ticket_order_id" = "ticket_orders"."id"
           AND "view_registration_field_values"."form_field_type" = 'email'
     ORDER BY value DESC
     LIMIT 1)               AS "form_email"
  FROM view_events
    LEFT JOIN email_texts ON email_texts.event_id = view_events.id
    INNER JOIN ticket_orders ON ticket_orders.event_id = view_events.id
    INNER JOIN users ON ticket_orders.user_id = users.id
  WHERE view_events.last_event_date_dt BETWEEN (NOW() - INTERVAL '1 hour') AND (NOW() + INTERVAL '1 hour')
        AND view_events.id NOT IN (SELECT (data ->> 'event_id') :: INT
                                   FROM emails
                                   WHERE emails.email_type_id = 15);

CREATE OR REPLACE VIEW view_emails_waiting_for_payment AS
  SELECT
    view_events.title                                                                  AS event_title,
    view_events.id                                                                     AS event_id,
    view_events.organization_id,
    view_events.image_horizontal_large_url,
    view_tickets_orders.uuid                                                           AS order_uuid,
    (view_tickets_orders.created_at +
     (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') AS time_to_pay,
    "users"."email",
    users.first_name,
    (SELECT token
     FROM tokens
     WHERE user_id = users.id
     ORDER BY id DESC
     LIMIT 1)                                                                          AS token,
    (SELECT value
     FROM view_registration_field_values
     WHERE "view_registration_field_values"."ticket_order_id" = "view_tickets_orders"."id"
           AND "view_registration_field_values"."form_field_type" = 'email'
     ORDER BY value DESC
     LIMIT 1)                                                                          AS "form_email"
  FROM view_tickets_orders
    INNER JOIN view_events ON view_tickets_orders.event_id = view_events.id
    INNER JOIN users ON view_tickets_orders.user_id = users.id
  WHERE view_tickets_orders.status_type_code = 'waiting_for_payment'
        AND view_tickets_orders.final_sum > 0
        AND view_tickets_orders.uuid NOT IN (SELECT (data ->> 'order_uuid')
                                             FROM emails
                                             WHERE emails.email_type_id = 16 AND
                                                   data ->> 'order_uuid' = view_tickets_orders.uuid)
        AND
        (view_tickets_orders.created_at +
         (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') BETWEEN 0 AND 3600;


CREATE OR REPLACE VIEW view_stats_utm AS
  SELECT DISTINCT ON (
    stat_events.utm_fields ->> 'utm_source',
    stat_events.utm_fields ->> 'utm_medium',
    stat_events.utm_fields ->> 'utm_campaign',
    stat_events.utm_fields ->> 'utm_content',
    stat_events.utm_fields ->> 'utm_term'
  )
    stat_events.utm_fields ->> 'utm_source'                    AS utm_source,
    stat_events.utm_fields ->> 'utm_medium'                    AS utm_medium,
    stat_events.utm_fields ->> 'utm_campaign'                  AS utm_campaign,
    stat_events.utm_fields ->> 'utm_content'                   AS utm_content,
    stat_events.utm_fields ->> 'utm_term'                      AS utm_term,
    (SELECT COUNT(*)
     FROM stat_events se
     WHERE se.utm_fields = stat_events.utm_fields
    )                                                          AS open_count,
    0 :: BIGINT                                                AS conversion,
    (SELECT COALESCE(SUM(view_tickets_orders.final_sum), 0)
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
           AND view_tickets_orders.event_id = stat_events.event_id
           AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                ((ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
                 AND ticket_orders.user_id = tokens.user_id))) AS orders_sum,
    event_id,
    (SELECT COUNT(view_tickets_orders.id)
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
           AND view_tickets_orders.event_id = stat_events.event_id
           AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                ((ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
                 AND ticket_orders.user_id = tokens.user_id)))
                                                               AS orders_count,
    (SELECT SUM(view_tickets_orders.tickets_count)
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
           AND view_tickets_orders.event_id = stat_events.event_id
           AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                ((ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
                 AND ticket_orders.user_id = tokens.user_id)))
                                                               AS tickets_count
  FROM events
    INNER JOIN stat_events ON stat_events.event_id = events.id
    INNER JOIN tokens ON stat_events.token_id = tokens.id
  WHERE
    stat_events.utm_fields IS NOT NULL
    AND utm_fields :: TEXT <> '{}';

