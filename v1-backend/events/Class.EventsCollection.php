<?php

require_once 'Class.Event.php';
require_once "{$BACKEND_FULL_PATH}/organizations/Class.PrivateOrganization.php";

class EventsCollection extends AbstractCollection
{

	const VIEW_ALL_EVENTS = 'view_all_events';
	const VIEW_ALL_EVENTS_WITH_ALIAS = 'view_all_events AS view_events';


	private static function getIsEditor(Organization $organization = null, User $user)
	{
		if ($organization != null) {
			$params = $organization->getParams($user, array('privileges' => true))->getData();

			return (isset($params['privileges'])
				&& is_array($params['privileges'])
				&& count($params['privileges']) > 0
			);
		}
	}

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$q_get_events = App::queryFactory()->newSelect();

		$from_view = 'view_events';

		$q_get_events
			->distinct();

		if (isset($pagination['offset'])) {
			$q_get_events->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_events->limit($pagination['length']);
		}

		$_fields = Fields::mergeFields(Event::getAdditionalCols(), $fields, Event::getDefaultCols());


		$statement_array = array();
		if (isset($fields[Event::IS_FAVORITE_FIELD_NAME])
			|| isset($fields[Event::CAN_EDIT_FIELD_NAME])
			|| isset($fields[Event::IS_SEEN_FIELD_NAME])
		) {
			$statement_array[':user_id'] = $user->getId();
		}

		$is_one_event = false;
		$canceled_condition = 'canceled = FALSE';

		$_organization = null;
		if (array_key_exists('organization', $filters)) {
			if ($filters['organization'] instanceof Organization) {
				$_organization = OrganizationsCollection::one($db, $user, $filters['organization']->getId(), array('privileges'));
			}
		} elseif (array_key_exists('organization_id', $filters)) {
			$_organization = OrganizationsCollection::one($db, $user, $filters['organization_id'], array('privileges'));
		} elseif (array_key_exists('id', $filters)) {
			$q_get_organization_id = App::queryFactory()
				->newSelect();
			$q_get_organization_id->cols(array('organization_id'))
				->from('view_all_events')
				->where('id = ?', $filters['id']);
			$p_get_organization_id = $db->prepareExecute($q_get_organization_id);
			if ($p_get_organization_id->rowCount() == 1) {
				$org_id = $p_get_organization_id->fetchColumn(0);
				try {
					/*check if can make private instance*/
					$_organization = OrganizationsCollection::onePrivate($db, $user, $org_id, null, array('privileges'));
					$getting_personal_events = true;
				} catch (Exception $e) {
					$_organization = OrganizationsCollection::one($db, $user, $org_id, array('privileges'));
				}
			}
		}

		if ($user instanceof User) {
			$is_editor = self::getIsEditor($_organization, $user);
		} else {
			$is_editor = false;
		}

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
					if ($value instanceof NotAuthorizedUser) break;
					if ($value instanceof User == false) {
						$value = $user;
					}
					$q_get_events->where(Event::MY_EVENTS_QUERY_PART);
					$statement_array[':user_id'] = $value->getId();
					$getting_personal_events = true;
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
					if ($is_editor) {
						$from_view = self::VIEW_ALL_EVENTS_WITH_ALIAS;
					}
					break;
				}
				case 'organization': {
					if ($value instanceof Organization) {
						$q_get_events->where('organization_id = :organization_id');
						$statement_array[':organization_id'] = $value->getId();
						$getting_personal_events = true;
					}
					break;
				}
				case 'canceled_shown': {
					if ($value == 'true') {
						$canceled_condition = '';
					}
					break;
				}
				case 'statistics': {
					if (filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
						global $BACKEND_FULL_PATH;
						require_once $BACKEND_FULL_PATH . '/users/Class.Roles.php';
						require_once $BACKEND_FULL_PATH . '/statistics/Class.EventsStatistics.php';

						$_fields[] = '(' . EventsStatistics::getValueSQLWithNamedParams(Statistics::EVENT_VIEW)
							. ') AS ' . Statistics::EVENT_VIEW;
						$statement_array[':type_code_' . Statistics::EVENT_VIEW] = Statistics::EVENT_VIEW;

						$_fields[] = '(' . EventsStatistics::getValueSQLWithNamedParams(Statistics::EVENT_FAVE)
							. ') AS ' . Statistics::EVENT_FAVE;
						$statement_array[':type_code_' . Statistics::EVENT_FAVE] = Statistics::EVENT_FAVE;


						$_fields[] = '(' . EventsStatistics::getValueSQLWithNamedParams(Statistics::EVENT_VIEW_DETAIL)
							. ') AS ' . Statistics::EVENT_VIEW_DETAIL;
						$statement_array[':type_code_' . Statistics::EVENT_VIEW_DETAIL] = Statistics::EVENT_VIEW_DETAIL;


						$_fields[] = '(' . EventsStatistics::getValueSQLWithNamedParams(Statistics::EVENT_OPEN_SITE)
							. ') AS ' . Statistics::EVENT_OPEN_SITE;
						$statement_array[':type_code_' . Statistics::EVENT_OPEN_SITE] = Statistics::EVENT_OPEN_SITE;


						$_fields[] = '(' . EventsStatistics::getValueSQLWithNamedParams(Statistics::EVENT_UNFAVE)
							. ') AS ' . Statistics::EVENT_UNFAVE;
						$statement_array[':type_code_' . Statistics::EVENT_UNFAVE] = Statistics::EVENT_UNFAVE;


						/*Notifications*/

						$_fields[] = '(' . EventsStatistics::SQL_GET_NOTIFICATIONS_SENT_AGGREGATED
							. ' AND event_id = view_events.id) AS ' . Statistics::EVENT_NOTIFICATIONS_SENT;

						$fields[] = Statistics::EVENT_VIEW;
						$fields[] = Statistics::EVENT_FAVE;
						$fields[] = Statistics::EVENT_VIEW_DETAIL;
						$fields[] = Statistics::EVENT_OPEN_SITE;
						$fields[] = Statistics::EVENT_UNFAVE;

						$fields[] = Statistics::EVENT_NOTIFICATIONS_SENT;

						$q_get_events->where('organization_id IN (SELECT organization_id FROM users_organizations ua WHERE ua.user_id = :user_id AND ua.role_id = :role_id)');
						$q_get_events->where('organization_id IN (SELECT organization_id FROM users_organizations ua WHERE ua.user_id = :user_id AND ua.role_id = :role_id)');
						$statement_array[':user_id'] = $user->getId();
						$statement_array[':role_id'] = Roles::getId(Roles::ROLE_ADMIN);
						$statement_array[':since'] = '2014-01-01 00:00:00';
						$statement_array[':till'] = (new DateTime())->format('Y-m-d H:i:s');
					}
					break;
				}
				case 'organization_id': {
					if ($_organization instanceof Organization) {
						$q_get_events->where('organization_id = :organization_id');
						$statement_array[':organization_id'] = $_organization->getId();
					}
					break;
				}
				case 'is_registered':
				case 'registered': {
					$val = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
					if ($val) {
						$from_view = self::VIEW_ALL_EVENTS_WITH_ALIAS;
						$operand = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'IN' : 'NOT IN';
						$q_get_events->where('id ' . $operand . ' (SELECT event_id FROM view_tickets WHERE user_id = :user_id AND is_active = TRUE)');
						$statement_array[':user_id'] = $user->getId();
					}
					break;
				}
				case 'registration_available':
				case 'registration_locally':
				case 'registration_required': {
					$val = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
					if ($val != null) {
						$q_get_events->where($name . ' = :' . $name);
						$statement_array[':' . $name] = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
					}
					break;
				}
				case 'is_canceled':
				case 'is_free':
				case 'is_delayed': {
					$val = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
					if ($is_editor) {
						$from_view = self::VIEW_ALL_EVENTS_WITH_ALIAS;
						$q_get_events->where($name . ' = :' . $name);
						$statement_array[':' . $name] = $val ? 'true' : 'false';
					}
					break;
				}
				case 'future': {
					$val = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
					if ($val) {
						$q_get_events->where("view_events.last_event_date > (SELECT DATE_PART('epoch', TIMESTAMP 'today') :: INT)");
					} else if ($val == false) {
						$q_get_events->where("view_events.last_event_date < (SELECT DATE_PART('epoch', TIMESTAMP 'today') :: INT)");
					}
					break;
				}
				case 'bounds': {
					$points = explode(',', $value);

					if (count($points) != 2) throw new InvalidArgumentException('EXPECTED_2_BOUND_POINTS');
					$bottom_point = explode(' ', trim($points[0]));
					$top_point = explode(' ', trim($points[1]));

					if (count($bottom_point) != 2) throw new InvalidArgumentException('EXPECTED_2_POINT_COORDINATES');
					if (count($top_point) != 2) throw new InvalidArgumentException('EXPECTED_2_POINT_COORDINATES');

					$bottom_point = array(floatval($bottom_point[0]), floatval($bottom_point[1]));
					$top_point = array(floatval($top_point[0]), floatval($top_point[1]));


					//first_number (x) is latitude, second(y) is longitude
					$_points = array(
						'top-left' => array($bottom_point[0], $top_point[1]),
						'top-right' => $top_point,
						'bottom-left' => $bottom_point,
						'bottom-right' => array($top_point[0], $bottom_point[1]),
					);

					$q_get_events
						->where('
                            (latitude >= :min_x AND latitude <= :max_x)
                            AND 
                            (longitude >= :min_y AND longitude <= :max_y)
                        ');
					$statement_array[':min_x'] = $_points['bottom-left'][0];
					$statement_array[':max_x'] = $_points['bottom-right'][0];
					$statement_array[':min_y'] = $_points['bottom-left'][1];
					$statement_array[':max_y'] = $_points['top-right'][1];
					break;
				}
				case 'point': {
					$point = explode(' ', $value);

					if (count($point) != 2) throw new InvalidArgumentException('EXPECTED_2_POINT_COORDINATES');

					if (!isset($filters['distance'])) throw new InvalidArgumentException('DISTANCE_IS_REQUIRED');
					if (!is_numeric($filters['distance'])) throw new InvalidArgumentException('DISTANCE_IS_REQUIRED');

					$filters['distance'] = floatval($filters['distance']);

					$lon0 = $point[1] - $filters['distance'] / abs(cos(deg2rad($point[0])) * 111.0); # 1 градус широты = 111 км
					$lon1 = $point[1] + $filters['distance'] / abs(cos(deg2rad($point[0])) * 111.0);
					$lat0 = $point[0] - ($filters['distance'] / 111.0);
					$lat1 = $point[0] + ($filters['distance'] / 111.0);

					$q_get_events->where('latitude BETWEEN :lat_0 AND :lat_1 
                        AND longitude BETWEEN :long_0 AND :long_1');

					$statement_array[':lat_0'] = $lat0;
					$statement_array[':lat_1'] = $lat1;
					$statement_array[':long_0'] = $lon0;
					$statement_array[':long_1'] = $lon1;

					break;
				}
				case 'favorites': {
					if ($value instanceof NotAuthorizedUser) break;
					if ($value instanceof UserInterface == false) break;
					$q_get_events->where("id IN (SELECT DISTINCT event_id FROM favorite_events WHERE status = TRUE AND user_id = :user_id)");
					$statement_array[':user_id'] = $value->getId();
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
					$value = mb_strtolower(trim($value));
					if (empty($value)) break;
					if (isset($filters['strict']) && filter_var($filters['strict'], FILTER_VALIDATE_BOOLEAN)) {
						$q_get_events->where('LOWER(title) = LOWER(:title)');
						$statement_array[':title'] = $value;
					} else {
						$q_get_events->where('LOWER(title) LIKE LOWER(:title)');
						$statement_array[':title'] = $value . '%';
					}
					break;
				}
				case 'description': {
					$value = mb_strtolower(trim($value));
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
					if (strpos($value, '*') != FALSE) {
						$value = explode('*', $value);
						if (count($value) == 0) throw new InvalidArgumentException('TAGS_SHOULD_NOT_BE_EMPTY');
						$tags_tmpl = [];
						foreach ($value as $index => $tag) {
							$key = ':tag_' . $index;
							$tags_tmpl[] = $key;
							$statement_array[$key] = mb_strtolower($tag);
						}
						$q_get_events->where('(SELECT COUNT(tags.id) FROM tags INNER JOIN events_tags ON events_tags.tag_id = tags.id WHERE events_tags.status=true AND event_id = view_events.id AND LOWER(name) IN (' . implode(',', $tags_tmpl) . ')) = ' . count($value));
					} elseif (strpos($value, '|') != FALSE) {
						$value = explode('|', $value);
						if (count($value) == 0) throw new InvalidArgumentException('TAGS_SHOULD_NOT_BE_EMPTY');
						$tags_tmpl = [];
						foreach ($value as $index => $tag) {
							$key = ':tag_' . $index;
							$tags_tmpl[] = $key;
							$statement_array[$key] = mb_strtolower($tag);
						}
						$q_get_events->where('(SELECT COUNT(tags.id) FROM tags INNER JOIN events_tags ON events_tags.tag_id = tags.id WHERE events_tags.status=true AND event_id = view_events.id AND LOWER(name) IN (' . implode(',', $tags_tmpl) . ')) > 0');
					} else {
						$q_get_events->where('(SELECT COUNT(tags.id) FROM tags INNER JOIN events_tags ON events_tags.tag_id = tags.id WHERE events_tags.status=true AND event_id = view_events.id AND LOWER(name) = :tag_0) > 0');
						$statement_array[':tag_0'] = mb_strtolower($value);
					}
					break;
				}
				case 'recommendations': {

					if ($value instanceof NotAuthorizedUser) break;

					$fields[] = Event::RATING_OVERALL;
					$_fields[] = Event::getAdditionalCols()[Event::RATING_OVERALL];


					$statement_array[':user_id'] = $user->getId();

					$q_get_events->where('id NOT IN (SELECT
						hidden_events.event_id
						FROM hidden_events
						WHERE hidden_events.user_id = :user_id)');


					$order_by = array('rating DESC');
					$statement_array[':user_id'] = $user->getId();
					break;
				}
				case 'can_edit': {
					$val = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
					$operand = $val ? 'IN' : ' NOT IN ';
					$q_get_events->where('id ' . $operand .' (SELECT user_id 
							FROM users_organizations 
							WHERE organization_id = view_events.organization_id 
							AND users_organizations.status = TRUE)');
					$statement_array[':user_id'] = $user->getId();
					break;
				}
			}
		}

		if (array_key_exists(Event::FAVORED_FRIENDS_COUNT_FIELD_NAME, $fields) ||
			array_key_exists(Event::IS_REGISTERED_FIELD_NAME, $fields) ||
			array_key_exists(Event::TICKETS_COUNT_FIELD_NAME, $fields) ||
			array_key_exists(Event::REGISTRATION_APPROVE_STATUS_FIELD_NAME, $fields)
		) {
			$statement_array[':user_id'] = $user->getId();
		}

		$q_get_events
			->from($from_view)
			->cols($_fields)
			->orderBy($order_by);
		if ($from_view != self::VIEW_ALL_EVENTS_WITH_ALIAS) {
			$canceled_condition ? $q_get_events->where($canceled_condition) : false;
		}
		if (!isset($getting_personal_events) || $getting_personal_events == false) {
			$q_get_events
				->where('organization_is_private = false');
		}


		$events = $db->prepareExecute($q_get_events, 'CANT_GET_EVENTS', $statement_array)->fetchAll(PDO::FETCH_CLASS, 'Event');
		if (count($events) == 0 && $is_one_event) throw new LogicException('CANT_FIND_EVENT: ' . $filters['id']);
		$result_events = array();
		if ($is_one_event) return $events[0];
		foreach ($events as $event) {
			$result_events[] = $event->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}

	public static function one(ExtendedPDO $db,
														 AbstractUser $user = null,
														 int $id,
														 array $fields = null): Event
	{
		$event = self::filter($db, $user, array('id' => $id), $fields);
		return $event;
	}
}