<?php

require_once 'Class.Event.php';

class EventsCollection{

	public static function filter(PDO $db,
	                              User $user,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              array $order_by = array('id')) {

		$q_get_events = App::$QUERY_FACTORY->newSelect();

		$q_get_events
			->distinct()
			->from('view_events');

		if (isset($pagination['offset'])){
			$q_get_events->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_events->limit($pagination['length']);
		}

		$_fields = Fields::mergeFields(Event::$ADDITIONAL_COLS, $fields, Event::$DEFAULT_COLS);

		$q_get_events->cols($_fields);

		$statement_array = array();
		if (isset($fields[Event::IS_FAVORITE_COL_NAME])){
			$statement_array[':user_id'] = $user->getId();
		}

		$is_one_event = false;

		foreach($filters as $name => $value){
			switch($name){
				case 'date': {
					$q_get_events->where('
					AND ((
						DATE(events.first_event_date) <= DATE(:date)
							AND
						DATE(events.last_event_date) >= DATE(:date)
						)
						OR
						(
						DATE(events.first_event_date) = DATE(:date)
							AND
						DATE(events.last_event_date) = DATE(:date)
						)
						OR (:date IN (SELECT events_dates.event_date FROM events_dates WHERE events.id = events_dates.event_id AND status = 1) AND events.first_event_date IS NULL)
						)');
					$statement_array[':date'] = $value;
					break;
				}
				case 'my': {
					if ($value instanceof User == false){
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
					(events.id
						IN (SELECT event_id
							FROM favorite_events
							WHERE favorite_events.status = TRUE
							AND favorite_events.user_id = :user_id)
					))
					AND
					(events.id
						NOT IN (SELECT event_id
						FROM hidden_events
						WHERE hidden_events.status = TRUE
						AND hidden_events.user_id = :user_id))');
					$statement_array[':user_id'] = $value->getId();
					break;
				}
				case 'id': {
					$q_get_events->where('id = :event_id');
					$statement_array[':event_id'] = $value;
					$is_one_event = true;
					break;
				}
				case 'organization': {
					if ($value instanceof Organization){
						$q_get_events->where('organization_id = :organization_id');
						$statement_array[':organization_id'] = $value->getId();
					}
					break;
				}
				case 'future': {
					$q_get_events .= ' AND (
					(DATE(NOW()) BETWEEN DATE(events.first_event_date) AND DATE(events.last_event_date))
					OR
					(DATE(NOW()) < DATE(events.first_event_date))
					OR
					(events.last_event_date IS NULL AND (SELECT COUNT(*) FROM events_dates WHERE events_dates.event_id = events.id AND events_dates.status = 1 AND DATE(event_date) >= DATE(NOW())))
					)';

					break;
				}
				case 'favorites': {
					$q_get_events .= ' AND (events.id IN (
							SELECT DISTINCT event_id FROM favorite_events WHERE status=1 AND user_id = :user_id
						))  AND (
								(DATE(NOW()) BETWEEN DATE(events.first_event_date) AND DATE(events.last_event_date))
								OR
								(DATE(NOW()) < DATE(events.first_event_date))
								OR
								(events.last_event_date IS NULL AND (SELECT COUNT(*) FROM events_dates WHERE events_dates.event_id = events.id AND events_dates.status = 1 AND DATE(event_date) >= DATE(NOW())))
							)';

					$statement_array[':user_id'] = $user->getId();
					break;
				}
				case 'since_date':{
					if ($value instanceof DateTime){
						$value = $value->format('Y-m-d H:i:S');
					}elseif($value == null){
						break;
					}
					$q_get_events->where('
							SELECT COUNT(*)
							FROM events_dates
							WHERE
							DATE(events_dates.event_date) >= DATE(:since_date) > 0
						 ');
					$statement_array[':since_date'] = $value;
					break;
				}
				case 'till_date':{
					if ($value instanceof DateTime){
						$value = $value->format('Y-m-d');
					}elseif($value == null){
						break;
					}
					$q_get_events .= ' AND (
					(DATE(events.first_event_date) <= DATE(:till_date) OR (DATE(events.last_event_date) <= DATE(:till_date)))
					OR
					(SELECT COUNT(*) FROM events_dates WHERE DATE(events_dates.event_date) > DATE(:till_date)) > 0
					)';
					$statement_array[':till_date'] = $value;
					break;
				}
				case 'title':{
					$value = trim($value);
					if (empty($value)) break;
					$q_get_events .= ' AND (events.title LIKE :title OR events.description LIKE :title)';
					$statement_array[':title'] = '%' . $value . '%';
					break;
				}
				case 'description':{
					$q_get_events .= ' AND (events.description LIKE :description OR events.title LIKE :description)';
					$statement_array[':description'] = '%' . trim($value) . '%';
					break;
				}
				case 'updated_since':{
					$q_get_events .= ' AND (events.created_at > :updated_since OR events.updated_at > :updated_since)';
					$statement_array[':updated_since'] = trim($value);
					break;
				}
				case 'tags':{
					if (is_array($value)){
						$q_part = array();
						foreach($value as $key => $tag){
							$tag = str_replace('#', '', $tag);
							$q_part[] = '(:tag_' . $key . ' = tags.name )';
							$statement_array[':tag_' . $key] = trim($tag);
						}
						if (count($q_part) > 0){
							$q_get_events .= ' AND (' . implode(' OR ', $q_part). ')';
						}
						break;
					}
				}
			}
		}

		$q_get_events->orderBy($order_by);
		$p_get_events = $db->prepare($q_get_events->getStatement());
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$events = $p_get_events->fetchAll(PDO::FETCH_CLASS, 'Event');
		if (count($events) == 0 && $is_one_event) throw new LogicException('CANT_FIND_EVENT');
		$result_events = array();
		if ($is_one_event) return $events[0];
		foreach($events as $event){
			$result_events[] = $event->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}
}