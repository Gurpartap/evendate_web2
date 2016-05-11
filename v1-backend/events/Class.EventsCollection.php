<?php

require_once 'Class.Event.php';

class EventsCollection extends AbstractCollection{

	public static function filter(PDO $db,
	                              User $user = null,
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


		$statement_array = array();
		if (isset($fields[Event::IS_FAVORITE_FIELD_NAME]) || isset($fields[Event::CAN_EDIT_FIELD_NAME])){
			$statement_array[':user_id'] = $user->getId();
		}

		$is_one_event = false;

		foreach($filters as $name => $value){
			switch($name){
				case 'date': {
					if ($value instanceof DateTime == false){
						$date_parts = explode(' ', $value);
						$value = new DateTime($value);
						$with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
						if ($with_time){
							$statement_array[':time_part'] = $value->format('H:i:s');
						}
					}else{
						$with_time = true;
						$statement_array[':time_part'] = $value->format('H:i:s');
					}

					if ($with_time){
						$query_part = ' AND :time_part BETWEEN start_time AND end_time)';
					}else{
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
					foreach(Event::getAdditionalCols() as $key => $val) {
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
					if ($value instanceof Organization){
						$q_get_events->where('organization_id = :organization_id');
						$statement_array[':organization_id'] = $value->getId();
					}
					break;
				}
				case 'organization_id': {
					$organization = OrganizationsCollection::one($db, $user, intval($value), array());
					if ($organization instanceof Organization){
						$q_get_events->where('organization_id = :organization_id');
						$statement_array[':organization_id'] = $organization->getId();
					}
					break;
				}
				case 'future': {
					if ($value == 'true'){
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
					if ($value instanceof DateTime == false){
						$date_parts = explode(' ', $value);
						$value = new DateTime($value);
						$with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
					}else{
						$with_time = true;
					}

					if ($with_time){
						$column_type = '::TIMESTAMP';
					}else{
						$column_type = '::DATE';
					}
					$statement_array[':since_date'] = $value->format($with_time ? 'Y-m-d H:i:s' : 'Y-m-d');
					$q_get_events->where(':since_date' . $column_type . ' <= (SELECT CONCAT(event_date, \' \', start_time)'. $column_type . ' AS "date_with_start_time"
						FROM events_dates
						WHERE event_id = "view_events"."id"
						AND status = TRUE
						ORDER BY date_with_start_time LIMIT 1 ) ');
					break;
				}
				case 'till': {
					if ($value instanceof DateTime == false){
						$date_parts = explode(' ', $value);
						$value = new DateTime($value);
						$with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
					}else{
						$with_time = true;
					}

					$column_type = $with_time ? '::TIMESTAMP' : '::DATE';

					$statement_array[':till_date'] = $value->format($with_time ? 'Y-m-d H:i:s' : 'Y-m-d');
					$q_get_events->where(':till_date' . $column_type . ' >= (SELECT CONCAT(event_date, \' \', end_time)'. $column_type . ' AS "date_with_start_time"
						FROM events_dates
						WHERE event_id = "view_events"."id"
						AND status = TRUE
						ORDER BY date_with_start_time DESC LIMIT 1 ) ');
					break;
				}
				case 'title':{
					$value = strtolower(trim($value));
					if (empty($value)) break;
					if (isset($filters['strict']) && $filters['strict'] == 'true'){
						$q_get_events->where('LOWER(title) = LOWER(:title)');
						$statement_array[':title'] = $value;
					}else{
						$q_get_events->where('LOWER(title) LIKE LOWER(:title)');
						$statement_array[':title'] = $value . '%';
					}
					break;
				}
				case 'description':{
					$value = strtolower(trim($value));
					if (isset($filters['strict']) && $filters['strict'] == 'true'){
						$q_get_events->where('LOWER(description) = LOWER(:description)');
						$statement_array[':description'] = $value;
					}else{
						$q_get_events->where('LOWER(description) LIKE LOWER(:description)');
						$statement_array[':description'] = $value . '%';
					}
					break;
				}
				case 'changed_since': {
					if ($value instanceof DateTime){
						$value = $value->getTimestamp();
					}elseif($value == null){
						break;
					}else{
						$dt = new DateTime($value);
						$value = $dt->getTimestamp();
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
					}
					break;
				}
				case 'recommendations': {

					// has tags in favorites
					// count of favored friends
					// does not have tags with hidden events
					// date since creation
					// date till end
					// date till registration end

					$has_tags_in_favorites = '(SELECT COUNT(id)
                            FROM subscriptions
                            INNER JOIN view_friends ON view_friends.friend_id = subscriptions.user_id
                            WHERE organization_id = view_organizations.id
                            AND subscriptions.status = TRUE
                            AND view_friends.user_id = :user_id)::INT';

					$count_of_favored_friends = '(SELECT COUNT(id) / 5
						        FROM view_events
						        WHERE view_events.organization_id = view_organizations.id)::INT';

					$does_not_have_tags_with_hidden = '(SELECT COUNT(id) * 2
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



		$q_get_events->cols($_fields);
		$q_get_events->orderBy($order_by);
		$p_get_events = $db->prepare($q_get_events->getStatement());
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$events = $p_get_events->fetchAll(PDO::FETCH_CLASS, 'Event');
		if (count($events) == 0 && $is_one_event) throw new LogicException('CANT_FIND_EVENT: ' . $filters['id']);
		$result_events = array();
		if ($is_one_event) return $events[0];
		foreach($events as $event){
			$result_events[] = $event->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}

	public static function one(PDO $db,
	                           User $user = null,
	                           int $id,
	                           array $fields = null) : Event{
		$event = self::filter($db, $user, array('id' => $id), $fields);
		return $event;
	}
}