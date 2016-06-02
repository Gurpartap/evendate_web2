<?php

require_once 'Class.Event.php';

class EventsCollection extends AbstractCollection
{

    public static function filter(PDO $db,
                                  User $user = null,
                                  array $filters = null,
                                  array $fields = null,
                                  array $pagination = null,
                                  array $order_by = array('id'))
    {

        $q_get_events = App::queryFactory()->newSelect();

        $q_get_events
            ->distinct()
            ->from('view_events');

        if (isset($pagination['offset'])) {
            $q_get_events->offset($pagination['offset']);
        }

        if (isset($pagination['length'])) {
            $q_get_events->limit($pagination['length']);
        }

        $_fields = Fields::mergeFields(Event::getAdditionalCols(), $fields, Event::getDefaultCols());


        $statement_array = array();
        if (isset($fields[Event::IS_FAVORITE_FIELD_NAME]) || isset($fields[Event::CAN_EDIT_FIELD_NAME])) {
            $statement_array[':user_id'] = $user->getId();
        }

        $is_one_event = false;
        $canceled_condition = 'canceled = FALSE';

        foreach ($filters as $name => $value) {
            switch ($name) {
                case 'date': {
                    if ($value instanceof DateTime == false) {
                        $date_parts = explode(' ', $value);
                        $value = new DateTime($value);
                        $with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
                        if ($with_time) {
                            $statement_array[':time_part'] = $value->format('H:i:s');
                        }
                    } else {
                        $with_time = true;
                        $statement_array[':time_part'] = $value->format('H:i:s');
                    }

                    if ($with_time) {
                        $query_part = ' AND :time_part BETWEEN start_time AND end_time)';
                    } else {
                        $query_part = ')';
                    }
                    $q_get_events->where(':date IN
						(SELECT
							events_dates.event_date
							FROM events_dates
							WHERE
							view_events.id = events_dates.event_id
							AND
							status = TRUE ' . $query_part
                    );
                    $statement_array[':date'] = $value->format('Y-m-d');
                    break;
                }
                case 'my': {
                    if ($value instanceof User == false) {
                        $value = $user;
                    }
                    $q_get_events->where('
					((organization_id
						IN (SELECT organization_id
							FROM subscriptions
							WHERE
							subscriptions.user_id = :user_id
							AND subscriptions.status = TRUE)
					)
					OR
					(view_events.id
						IN (SELECT event_id
							FROM favorite_events
							WHERE favorite_events.status = TRUE
							AND favorite_events.user_id = :user_id)
					))
					AND
					(view_events.id
						NOT IN (SELECT event_id
						FROM hidden_events
						WHERE hidden_events.status = TRUE
						AND hidden_events.user_id = :user_id))');
                    $statement_array[':user_id'] = $value->getId();
                    break;
                }
                case 'id': {
                    foreach (Event::getAdditionalCols() as $key => $val) {
                        if (is_numeric($key)) {
                            $_fields[] = $val;
                        }
                    }
                    $q_get_events->where('id = :event_id');
                    $statement_array[':event_id'] = $value;
                    $is_one_event = true;
                    break;
                }
                case 'organization': {
                    if ($value instanceof Organization) {
                        $q_get_events->where('organization_id = :organization_id');
                        $statement_array[':organization_id'] = $value->getId();
                    }
                    break;
                }
                case 'canceled_shown': {
                    if ($value == 'true') {
                        $canceled_condition = '';
                    }
                    break;
                }
                case 'organization_id': {
                    $organization = OrganizationsCollection::one($db, $user, intval($value), array());
                    if ($organization instanceof Organization) {
                        $q_get_events->where('organization_id = :organization_id');
                        $statement_array[':organization_id'] = $organization->getId();
                    }
                    break;
                }
                case 'future': {
                    if ($value == 'true') {
                        $q_get_events->where("view_events.last_event_date > (SELECT DATE_PART('epoch', TIMESTAMP 'yesterday') :: INT)");
                    }
                    break;
                }
                case 'favorites': {
                    $q_get_events->where("id IN (SELECT DISTINCT event_id FROM favorite_events WHERE status = TRUE AND user_id = :user_id)");
                    $statement_array[':user_id'] = $user->getId();
                    break;
                }
                case 'since': {
                    if ($value instanceof DateTime == false) {
                        $date_parts = explode(' ', $value);
                        $value = new DateTime($value);
                        $with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
                    } else {
                        $with_time = true;
                    }

                    if ($with_time) {
                        $column_type = '::TIMESTAMP';
                    } else {
                        $column_type = '::DATE';
                    }
                    $statement_array[':since_date'] = $value->format($with_time ? 'Y-m-d H:i:s' : 'Y-m-d');
                    $q_get_events->where(':since_date' . $column_type . ' <= (SELECT CONCAT(event_date, \' \', start_time)' . $column_type . ' AS "date_with_start_time"
						FROM events_dates
						WHERE event_id = "view_events"."id"
						AND status = TRUE
						ORDER BY date_with_start_time LIMIT 1 ) ');
                    break;
                }
                case 'till': {
                    if ($value instanceof DateTime == false) {
                        $date_parts = explode(' ', $value);
                        $value = new DateTime($value);
                        $with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
                    } else {
                        $with_time = true;
                    }

                    $column_type = $with_time ? '::TIMESTAMP' : '::DATE';

                    $statement_array[':till_date'] = $value->format($with_time ? 'Y-m-d H:i:s' : 'Y-m-d');
                    $q_get_events->where(':till_date' . $column_type . ' >= (SELECT CONCAT(event_date, \' \', end_time)' . $column_type . ' AS "date_with_start_time"
						FROM events_dates
						WHERE event_id = "view_events"."id"
						AND status = TRUE
						ORDER BY date_with_start_time DESC LIMIT 1 ) ');
                    break;
                }
                case 'title': {
                    $value = strtolower(trim($value));
                    if (empty($value)) break;
                    if (isset($filters['strict']) && $filters['strict'] == 'true') {
                        $q_get_events->where('LOWER(title) = LOWER(:title)');
                        $statement_array[':title'] = $value;
                    } else {
                        $q_get_events->where('LOWER(title) LIKE LOWER(:title)');
                        $statement_array[':title'] = $value . '%';
                    }
                    break;
                }
                case 'description': {
                    $value = strtolower(trim($value));
                    if (isset($filters['strict']) && $filters['strict'] == 'true') {
                        $q_get_events->where('LOWER(description) = LOWER(:description)');
                        $statement_array[':description'] = $value;
                    } else {
                        $q_get_events->where('LOWER(description) LIKE LOWER(:description)');
                        $statement_array[':description'] = $value . '%';
                    }
                    break;
                }
                case 'changed_since': {
                    if ($value instanceof DateTime) {
                        $value = $value->getTimestamp();
                    } elseif ($value == null) {
                        break;
                    } else {
                        $dt = new DateTime($value);
                        $value = $dt->getTimestamp();
                    }
                    $q_get_events->where('updated_at >= :changed_since');
                    $statement_array[':changed_since'] = $value;
                    break;
                }
                case 'q': {
                    $q_get_events->where('fts @@ to_tsquery(:search_stm)');
                    $statement_array[':search_stm'] = App::prepareSearchStatement($value);
                    break;
                }
                case 'tags': {
                    if (is_array($value)) {
                        $q_part = array();
                        foreach ($value as $key => $tag) {
                            $tag = str_replace('#', '', $tag);
                            $q_part[] = '(:tag_' . $key . ' = tags.name )';
                            $statement_array[':tag_' . $key] = trim($tag);
                        }
                        if (count($q_part) > 0) {
                            $q_get_events->where('(' . implode(' OR ', $q_part) . ')');
                        }
                    }
                    break;
                }
                case 'recommendations': {

                    // has tags in favorites
                    // count of favored friends
                    // has tags with hidden events
                    // date since creation => 36

                    // dates till end => 10
                    // date till registration end =>

                    $has_tags_in_favorites = 'COALESCE((SELECT SUM(t_favored_by_user.favored_with_tag_count)::INT FROM
                        (SELECT
                            COUNT(events_tags.id)::INT AS favored_with_tag_count
                            FROM events_tags
                            WHERE 
                            events_tags.event_id IN (
                                SELECT favorite_events.event_id
                                FROM favorite_events
                                WHERE status = TRUE
                                AND favorite_events.user_id = :user_id
                            )
                            AND events_tags.event_id = view_events.id
                            GROUP BY events_tags.tag_id) AS t_favored_by_user)::INT, 0)';

                    $favored_friends_count = '(SELECT COUNT(id)
						        FROM favorite_events
						        INNER JOIN view_friends ON view_friends.friend_id = favorite_events.user_id 
						        WHERE view_events.id = favorite_events.event_id
						        AND view_friends.user_id = :user_id)::INT';


                    $has_tags_in_hidden = 'COALESCE((SELECT SUM (favored_with_tag_count) FROM
                        (SELECT
                            COUNT(events_tags.id)::INT AS favored_with_tag_count
                            FROM events_tags
                            WHERE 
                            events_tags.event_id IN (
                                SELECT hidden_events.event_id
                                FROM hidden_events
                                WHERE status = TRUE
                                AND hidden_events.user_id = :user_id
                            )
                            AND events_tags.event_id = view_events.id
                            GROUP BY events_tags.tag_id) AS favored_by_user)::INT,0)';

                    $create_date = '(SELECT
                        CASE WHEN DATE_PART(\'epoch\', NOW()) > ve.created_at + ' . Event::RATING_DATE_CREATION_LIMIT . '::INT
                        THEN 0
                        ELSE (' . Event::RATING_DATE_CREATION_LIMIT . '::INT - (DATE_PART(\'epoch\', NOW()) - ve.created_at))::INT / 7200 END
                        FROM view_events AS ve
                        WHERE ve.id = view_events.id)';

                    $actual_dates_count = Event::getAdditionalCols()[Event::ACTUALITY_FIELD_NAME];


                    $_fields[] =
                        '(' . $has_tags_in_favorites . '
                            + 
                            ' . $favored_friends_count . '
                            + 
                            ' . $has_tags_in_hidden . '
                            + 
                            ' . $create_date . '
                            + 
                            (' . $actual_dates_count . ')
						 ) AS ' . Event::RATING_OVERALL;


                    $_fields[] = $has_tags_in_favorites . ' AS ' . Event::RATING_TAGS_IN_FAVORITES;
                    $_fields[] = $favored_friends_count . ' AS ' . Event::RATING_FAVORED_FRIENDS;
                    $_fields[] = $has_tags_in_hidden . ' AS ' . Event::RATING_TAGS_IN_HIDDEN;
                    $_fields[] = $create_date . ' AS ' . Event::RATING_RECENT_CREATED;
                    $_fields[] = $actual_dates_count . ' AS ' . Event::RATING_ACTIVE_DAYS;

                    $fields[] = Event::RATING_TAGS_IN_FAVORITES;
                    $fields[] = Event::RATING_FAVORED_FRIENDS;
                    $fields[] = Event::RATING_TAGS_IN_HIDDEN;
                    $fields[] = Event::RATING_RECENT_CREATED;
                    $fields[] = Event::RATING_ACTIVE_DAYS;
                    $fields[] = Event::RATING_OVERALL;


                    $statement_array[':user_id'] = $user->getId();


                    $q_get_events->where('id NOT IN (SELECT
						event_id
						FROM stat_events
						INNER JOIN tokens ON tokens.id = stat_events.token_id 
						WHERE tokens.user_id = :user_id)');


                    $order_by = array('rating DESC');
                    $statement_array[':user_id'] = $user->getId();
                    break;
                }
            }
        }

        if (array_key_exists(Event::FAVORED_FRIENDS_COUNT_FIELD_NAME, $fields)) {
            $statement_array[':user_id'] = $user->getId();
        }

        $q_get_events->where($canceled_condition);
        $q_get_events->cols($_fields);
        $q_get_events->orderBy($order_by);
        $p_get_events = $db->prepare($q_get_events->getStatement());
        $result = $p_get_events->execute($statement_array);
        if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

        $events = $p_get_events->fetchAll(PDO::FETCH_CLASS, 'Event');
        if (count($events) == 0 && $is_one_event) throw new LogicException('CANT_FIND_EVENT: ' . $filters['id']);
        $result_events = array();
        if ($is_one_event) return $events[0];
        foreach ($events as $event) {
            $result_events[] = $event->getParams($user, $fields)->getData();
        }
        return new Result(true, '', $result_events);
    }

    public static function one(PDO $db,
                               User $user = null,
                               int $id,
                               array $fields = null) : Event
    {
        $event = self::filter($db, $user, array('id' => $id), $fields);
        return $event;
    }
}