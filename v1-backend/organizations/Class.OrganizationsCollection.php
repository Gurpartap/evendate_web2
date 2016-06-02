<?php

class OrganizationsCollection
{

    private $db;
    private $user;


    public static function filter(PDO $db,
                                  User $user,
                                  array $filters = null,
                                  array $fields = null,
                                  array $pagination = null,
                                  $order_by = array('organization_type_order', 'organization_type_id'))
    {

        $statement_array = array();
        $_friend = null;
        $return_one = isset($filters['id']);
        $cols = Fields::mergeFields(Organization::getAdditionalCols(), $fields, Organization::getDefaultCols());
        $select = App::queryFactory()->newSelect();

        if (isset($filters[Organization::IS_SUBSCRIBED_FIELD_NAME])) {
            $cols[] = Organization::getAdditionalCols()[Organization::IS_SUBSCRIBED_FIELD_NAME];
        }
        if (isset($fields[Organization::NEW_EVENTS_COUNT_FIELD_NAME])) {
            $cols[] = Organization::getAdditionalCols()[Organization::NEW_EVENTS_COUNT_FIELD_NAME];
            $statement_array[':user_id'] = $user->getId();
        }

        $select
            ->distinct()
            ->from('view_organizations');


        foreach ($filters as $name => $value) {
            switch ($name) {
                case 'name': {
                    $select->orWhere('LOWER(view_organizations.name) LIKE LOWER(:name)');
                    $statement_array[':name'] = $value . '%';
                    break;
                }
                case 'description': {
                    $select->orWhere('LOWER(view_organizations.description) LIKE LOWER(:description)');
                    $statement_array[':description'] = $value . '%';
                    break;
                }
                case 'short_name': {
                    $select->orWhere('LOWER(view_organizations.short_name) LIKE LOWER(:short_name)');
                    $statement_array[':short_name'] = $value . '%';
                    break;
                }
                case 'type_id': {
                    $select->where('view_organizations.organization_type_id = :type_id');
                    $statement_array[':type_id'] = $value;
                    break;
                }
                case 'q': {
                    $select->where('fts @@ to_tsquery(:search_stm)');
                    $statement_array[':search_stm'] = App::prepareSearchStatement($value);
                    break;
                }
                case 'privileges': {
                    if ($value == 'can_add') {
                        $select
                            ->join('INNER', 'users_organizations', 'users_organizations.organization_id = view_organizations.id AND users_organizations.status = TRUE')
                            ->where('users_organizations.user_id = :user_id');
                        $statement_array[':user_id'] = $user->getId();
                    }
                    break;
                }
                case 'id': {
                    foreach (Organization::getAdditionalCols() as $key => $val) {
                        if (is_numeric($key)) {
                            $cols[] = $val;
                        } else {
                            $cols[] = $val;
                        }
                    }
                    $select->where('view_organizations.id = :id');
                    $statement_array[':id'] = $value;
                    break;
                }
                case (Organization::IS_SUBSCRIBED_FIELD_NAME): {
                    if ($return_one) break;
                    if (!isset($fields[Organization::IS_SUBSCRIBED_FIELD_NAME])) {
                        $fields[] = Organization::IS_SUBSCRIBED_FIELD_NAME;
                    }
                    $select->where('(SELECT
						id IS NOT NULL = ' . (strtolower(trim($value)) == 'true' ? ' TRUE' : 'FALSE') . '
						FROM subscriptions
						WHERE organization_id = "view_organizations"."id"
							AND "subscriptions"."status" = TRUE
							AND user_id = :user_id) IS NOT NULL');
                    $statement_array[':user_id'] = $user->getId();
                    break;
                }
                case 'friend': {
                    if ($value instanceof Friend) {
                        $select->where('(SELECT
							id IS NOT NULL = TRUE AS is_subscribed
							FROM subscriptions
							WHERE organization_id = "view_organizations"."id"
								AND "subscriptions"."status" = TRUE
								AND user_id = :user_id) = TRUE');
                        $statement_array[':user_id'] = $value->getId();
                    }
                    break;
                }
                case 'recommendations': {

                    // subscribed friends count
                    // active events count / 5
                    // added last week events count * 2
                    // does subscribe to organization = 50

                    $rating_subscribed_friends = '(SELECT COUNT(id)
                            FROM subscriptions
                            INNER JOIN view_friends ON view_friends.friend_id = subscriptions.user_id
                            WHERE organization_id = view_organizations.id
                            AND subscriptions.status = TRUE
                            AND view_friends.user_id = :user_id)::INT';

                    $rating_active_events_count = '(SELECT COUNT(id) / 5
						        FROM view_events
						        WHERE view_events.organization_id = view_organizations.id)::INT';

                    $rating_last_events_count = '(SELECT COUNT(id) * 2
						        FROM view_events
						        WHERE view_events.organization_id = view_organizations.id
						        AND view_events.created_at > DATE_PART(\'epoch\', (NOW() - interval \'7 days\'))
						    )::INT';
                    
                    $rating_subscribed_in_social_network = '(SELECT COUNT(id) * 50
						        FROM view_organizations vo
						        WHERE vo.id = view_organizations.id
						        AND vo.vk_url_path IN 
						            (SELECT vk_groups.screen_name 
						                FROM vk_groups
						                INNER JOIN vk_users_subscriptions ON vk_users_subscriptions.vk_group_id=vk_groups.id
						                WHERE vk_users_subscriptions.user_id = :user_id)
						    )::INT';
                    
                    $cols[] =
                        '('
                              . $rating_subscribed_friends . '
                            + 
                            ' . $rating_active_events_count . '
                            + 
                            ' . $rating_subscribed_in_social_network . '
						    +
						    ' . $rating_last_events_count . '
						    ) AS ' . Organization::RATING_OVERALL;
                    
                    
                    $cols[] = $rating_subscribed_friends . ' AS ' . Organization::RATING_SUBSCRIBED_FRIENDS;
                    $cols[] = $rating_active_events_count . ' AS ' . Organization::RATING_ACTIVE_EVENTS;
                    $cols[] = $rating_last_events_count . ' AS ' . Organization::RATING_LAST_EVENTS_COUNT;
                    $cols[] = $rating_subscribed_in_social_network . ' AS ' . Organization::RATING_SUBSCRIBED_IN_SOCIAL_NETWORK;

                    $fields[] = Organization::RATING_OVERALL;
                    $fields[] = Organization::RATING_SUBSCRIBED_FRIENDS;
                    $fields[] = Organization::RATING_ACTIVE_EVENTS;
                    $fields[] = Organization::RATING_LAST_EVENTS_COUNT;
                    $fields[] = Organization::RATING_SUBSCRIBED_IN_SOCIAL_NETWORK;

                    $select->where('(SELECT
						id
						FROM subscriptions
						WHERE organization_id = "view_organizations"."id"
							AND "subscriptions"."status" = TRUE
							AND user_id = :user_id) IS NULL');

                    $statement_array[':user_id'] = $user->getId();
                    $order_by = array('rating DESC');
                    $statement_array[':user_id'] = $user->getId();
                    break;
                }
            }
        }

        $select
            ->cols($cols)
            ->orderBy($order_by);

        if (isset($pagination['offset'])) {
            $select->offset($pagination['offset']);
        }

        if (isset($pagination['length'])) {
            $select->limit($pagination['length']);
        }

        if (isset($fields[Organization::IS_SUBSCRIBED_FIELD_NAME])
            || isset($fields[Organization::SUBSCRIPTION_ID_FIELD_NAME])
            || $return_one
        ) {
            $statement_array[':user_id'] = $user->getId();
        }

//		echo $select->getStatement();
        $p_search = $db->prepare($select->getStatement());
        $p_search->execute($statement_array);

        $organizations = $p_search->fetchAll(PDO::FETCH_CLASS, 'Organization');

        if ($return_one) return $organizations[0];


        $result_array = array();

        foreach ($organizations as $org) {
            $result_array[] = $org->getParams($user, $fields)->getData();
        }
        return new Result(true, '', $result_array);
    }

    public static function one(PDO $db,
                               User $user,
                               int $id,
                               array $fields = null) : Organization
    {

        $organization = self::filter($db, $user, array('id' => $id), $fields);
        Statistics::Organization(
            $organization,
            $user,
            $db,
            Statistics::ORGANIZATION_VIEW
        );
        return $organization;
    }
}