UPDATE recommendations_organizations
SET rating_subscribed_friends         = (SELECT COUNT(id)
                                         FROM subscriptions
                                           INNER JOIN view_friends ON view_friends.friend_id = subscriptions.user_id
                                         WHERE subscriptions.organization_id = view_users_organizations.organization_id
                                               AND subscriptions.status = TRUE
                                               AND view_friends.user_id = view_users_organizations.user_id) :: INT,
  rating_active_events_count          = (SELECT COUNT(id) / 5
                                         FROM view_events
                                         WHERE view_events.organization_id =
                                               view_users_organizations.organization_id) :: INT,
  rating_last_events_count            = (SELECT COUNT(id) * 2
                                         FROM view_events
                                         WHERE view_events.organization_id = view_users_organizations.organization_id
                                               AND view_events.created_at >
                                                   DATE_PART('epoch', (NOW() - INTERVAL '7 days'))) :: INT,
  rating_subscribed_in_social_network = (SELECT COUNT(id) * 50
                                         FROM view_organizations vo
                                         WHERE vo.id = view_users_organizations.organization_id AND
                                               vo.vk_url_path IN (SELECT vk_groups.screen_name
                                                                  FROM vk_groups
                                                                    INNER JOIN vk_users_subscriptions
                                                                      ON vk_users_subscriptions.vk_group_id =
                                                                         vk_groups.id
                                                                  WHERE vk_users_subscriptions.user_id =
                                                                        view_users_organizations.user_id)) :: INT,
  rating_texts_similarity             = '{SIMILARITY_TEXT}',
  updated_at = NOW()
FROM (SELECT *
      FROM view_users_organizations
'{WHERE_PLACEHOLDER}')
AS view_users_organizations
WHERE view_users_organizations.user_id = recommendations_organizations.user_id
AND view_users_organizations.organization_id = recommendations_organizations.organization_id