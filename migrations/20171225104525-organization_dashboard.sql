DROP VIEW view_friends CASCADE;

CREATE MATERIALIZED VIEW view_friends AS SELECT
                              'google'                       AS type,
                              view_google_friends.uid        AS uid,
                              view_google_friends.user_id    AS user_id,
                              view_google_friends.friend_uid AS friend_uid,
                              view_google_friends.friend_id  AS friend_id
                            FROM view_google_friends
                            UNION SELECT
                                    'facebook'                       AS type,
                                    view_facebook_friends.uid        AS uid,
                                    view_facebook_friends.user_id    AS user_id,
                                    view_facebook_friends.friend_uid AS friend_uid,
                                    view_facebook_friends.friend_id  AS friend_id
                                  FROM view_facebook_friends
                            UNION SELECT
                                    'vk.com'                   AS type,
                                    view_vk_friends.uid        AS uid,
                                    view_vk_friends.user_id    AS user_id,
                                    view_vk_friends.friend_uid AS friend_uid,
                                    view_vk_friends.friend_id  AS friend_id
                                  FROM view_vk_friends;

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

CREATE INDEX ON public.view_friends USING btree(user_id,friend_id);
CREATE INDEX ON public.view_events USING btree(organization_id,created_at,last_event_date_dt);
CREATE INDEX ON public.tokens USING btree(id,user_id);
CREATE INDEX ON public.view_events USING btree(id);
CREATE INDEX ON public.stat_events USING btree(event_id,token_id);
CREATE INDEX ON public.view_friends USING btree(user_id,friend_id);
CREATE INDEX ON public.view_events USING btree(organization_id,last_event_date);
CREATE INDEX ON public.tickets USING btree(ticket_order_id);
CREATE INDEX ON public.tokens USING btree(token);
CREATE INDEX ON public.stat_events USING btree(created_at);
CREATE INDEX ON public.ticket_orders USING btree(event_id);