<?php

require_once 'Class.Event.php';

class EventsCollection extends AbstractCollection{

	public static function filter(PDO $db,
	                              User $user,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              array $order_by = array('id')){

		$q_get_events = App::queryFactory()->newSelect();

		$q_get_events
			->distinct()
			->from('view_events');

		if (isset($pagination['offset'])){
			$q_get_events->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_events->limit($pagination['length']);
		}

		$_fields = Fields::mergeFields(Event::getAdditionalCols(), $fields, Event::getDefaultCols());

		$q_get_events->cols($_fields);

		$statement_array = array();
		if (isset($fields[Event::IS_FAVORITE_FIELD_NAME])){
			$statement_array[':user_id'] = $user->getId();
		}

		$is_one_event = false;

		foreach($filters as $name => $value){
			switch($name){
				case 'date': {
					$q_get_events->where('
					AND ((
						DATE(view_events.first_event_date) <= DATE(:date)
							AND
						DATE(view_events.last_event_date) >= DATE(:date)
						)
						OR
						(
						DATE(view_events.first_event_date) = DATE(:date)
							AND
						DATE(view_events.last_event_date) = DATE(:date)
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
					$q_get_events->where("view_events.last_event_date > (SELECT DATE_PART('epoch', TIMESTAMP 'yesterday') :: INT)");
					break;
				}
				case 'favorites': {
					$q_get_events->where("id IN (SELECT DISTINCT event_id FROM favorite_events WHERE status = TRUE AND user_id = :user_id)");
					$statement_array[':user_id'] = $user->getId();
					break;
				}
				case 'since':{
					if ($value instanceof DateTime){
						$value = $value->getTimestamp();
					}elseif($value == null){
						break;
					}
					$q_get_events->where('first_event_date >= :since_date');
					$statement_array[':since_date'] = $value;
					break;
				}
				case 'till':{
					if ($value instanceof DateTime){
						$value = $value->getTimestamp();
					}elseif($value == null){
						break;
					}
					$q_get_events->where('last_event_date <= :till_date');
					$statement_array[':till_date'] = $value;
					break;
				}
				case 'title':{
					$value = trim($value);
					if (empty($value)) break;
					if (isset($filters['strict']) && $filters['strict'] == true){
						$q_get_events->where('LOWER(title) = LOWER(:title)');
						$statement_array[':title'] = $value;
					}else{
						$q_get_events->where('LOWER(title) LIKE LOWER(:title)');
						$statement_array[':title'] = $value . '%';
					}
					break;
				}
				case 'description':{
					$value = trim($value);
					if (isset($filters['strict']) && $filters['strict'] == true){
						$q_get_events->where('LOWER(description) = LOWER(:description)');
						$statement_array[':description'] = $value;
					}else{
						$q_get_events->where('LOWER(description) LIKE LOWER(:description)');
						$statement_array[':description'] = '%'. $value . '%';
					}
					break;
				}
				case 'changed_since': {
					if ($value instanceof DateTime){
						$value = $value->getTimestamp();
					}elseif($value == null){
						break;
					}
					$q_get_events->where('updated_at >= :changed_since');
					$statement_array[':changed_since'] = $value;
					break;
				}
				case 'tags': {
					if (is_array($value)){
						$q_part = array();
						foreach($value as $key => $tag){
							$tag = str_replace('#', '', $tag);
							$q_part[] = '(:tag_' . $key . ' = tags.name )';
							$statement_array[':tag_' . $key] = trim($tag);
						}
						if (count($q_part) > 0){
							$q_get_events->where('(' . implode(' OR ', $q_part) . ')');
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
		if (count($events) == 0 && $is_one_event) throw new LogicException('CANT_FIND_EVENT:' . $filters['id']);
		$result_events = array();
		if ($is_one_event) return $events[0];
		foreach($events as $event){
			$result_events[] = $event->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}

	public static function one(PDO $db,
	                           User $user,
	                           int $id,
	                           array $fields = null) : Event{

		$event = self::filter($db, $user, array('id' => $id), $fields);

		Statistics::Event(
			$event,
			$user,
			$db,
			Statistics::EVENT_VIEW
		);
		return $event;
	}
}