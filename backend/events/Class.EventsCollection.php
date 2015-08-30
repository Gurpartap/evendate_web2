<?php

class EventsCollection{


	public static function filter(PDO $db, User $user, array $filters = null, $order_by = '') {
		$q_get_events = 'SELECT events.*, event_types.latin_name as event_type_latin_name, organizations.img_url as organization_img_url,
			organizations.name as organization_name, organization_types.name as organization_type_name, organizations.short_name as organization_short_name,
			(SELECT COUNT(*) AS liked_count FROM favorite_events WHERE status = 1 AND event_id = events.id) AS liked_users_count
			FROM events
			INNER JOIN organizations ON organizations.id = events.organization_id
			INNER JOIN organization_types ON organization_types.id = organizations.type_id
			INNER JOIN event_types ON event_types.id = events.event_type_id
			WHERE organizations.status = 1';
		$statement_array = array();
		foreach($filters as $name => $value){
			switch($name){
				case 'date': {
					$q_get_events .= ' AND ((events.event_start_date >= DATE(:date) AND events.event_end_date <= DATE(:date)) OR (DATE(events.event_start_date) = DATE(:date) AND DATE(events.event_end_date) = DATE(:date)))';
					$statement_array[':date'] = $value;
					break;
				}
				case 'organization': {
					if ($value instanceof Organization == false) break;
					$q_get_events .= ' AND (organizations.id = :organization_id) ';
					$statement_array[':organization_id'] = $value->getId();
					break;
				}
				case 'my': {
					$q_get_events .= ' AND (organizations.id IN (SELECT organization_id FROM subscriptions WHERE
						subscriptions.user_id = :user_id AND
						subscriptions.status = 1)) ';
					$statement_array[':user_id'] = $value->getId();
					break;
				}
				case 'type': {
					if ($value == 'future'){
						$q_get_events .= ' AND (
								(DATE(NOW()) BETWEEN DATE(events.event_start_date) AND DATE(events.event_end_date))
								OR
								(DATE(NOW()) < DATE(events.event_start_date))
							)';
					}elseif ($value == 'favorites'){
						$q_get_events .= ' AND (events.id IN (
							SELECT DISTINCT event_id FROM favorite_events WHERE status=1 AND user_id = :user_id
						))';
					}
					break;
				}
				case 'since_date':{
					if ($value instanceof DateTime){
						$value = $value->format('Y-m-d');
					}elseif($value == null){
						break;
					}
					$q_get_events .= ' AND (DATE(events.event_start_date) >= DATE(:since_date) OR DATE(events.event_end_date) >= DATE(:since_date))';
					$statement_array[':since_date'] = $value;
					break;
				}
				case 'till_date':{
					if ($value instanceof DateTime){
						$value = $value->format('Y-m-d');
					}elseif($value == null){
						break;
					}
					$q_get_events .= ' AND (DATE(events.event_start_date) <= DATE(:till_date) OR (DATE(events.event_end_date) <= DATE(:till_date)))';
					$statement_array[':till_date'] = $value;
					break;
				}
				case 'title':{
					$q_get_events .= ' AND events.title LIKE :title';
					$statement_array[':title'] = '%' . trim($value) . '%';
					break;
				}
				case 'description':{
					$q_get_events .= ' AND events.description LIKE :description';
					$statement_array[':description'] = '%' . trim($value) . '%';
					break;
				}
				case 'tags':{
					if (is_array($value)){
						$q_part = array();
						foreach($value as $key => $tag){
							$q_part[] = '(:tag_' . $key . ' IN (SELECT tags.name
											FROM tags
											INNER JOIN events_tags ON tags.id = events_tags.tag_id))';
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
		$q_get_events .= $order_by;
		$p_get_events = $db->prepare($q_get_events);
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$events = $p_get_events->fetchAll();

		if (isset($filters['type'])){
			if ($filters['type'] == 'short'){
				foreach($events as &$_event){
					$_event = array(
						'id' => $_event['id'],
						'title' => $_event['title'],
						'event_start_date' => $_event['event_start_date'],
						'event_end_date' => $_event['event_end_date']
					);
				}
			}
		}

		$p_get_favorite_days = $db->prepare('SELECT id, event_date
												FROM favorite_events
												WHERE event_id = :event_id
												AND user_id = :user_id');

		$p_get_tags = $db->prepare('SELECT tags.id, tags.name
			FROM  tags
			INNER JOIN events_tags ON tags.id = events_tags.tag_id
			WHERE events_tags.status = 1
			AND tags.status = 1
			AND events_tags.event_id = :event_id');

		$p_get_liked_users = $db->prepare('SELECT users.first_name, users.last_name,
			users.middle_name, users.id, favorite_events.event_date, users.avatar_url
			FROM view_friends
			INNER JOIN users ON users.id = view_friends.friend_id
			INNER JOIN favorite_events ON favorite_events.user_id = view_friends.friend_id
			WHERE
				view_friends.user_id = :user_id
			AND favorite_events.event_id = :event_id
			AND favorite_events.status = 1
			AND users.show_to_friends = 1');

		foreach($events as &$event){
			$p_get_favorite_days->execute(array(
				':event_id' => $event['id'],
				':user_id' => $user->getId()
			));

			$p_get_liked_users->execute(array(
				':user_id' => $user->getId(),
				':event_id' => $event['id']
			));

			$p_get_tags->execute(array(
				':event_id' => $event['id']
			));

			$event['favorite_dates'] = array();
			$event['favorite_friends'] = array();

			if ($p_get_favorite_days->rowCount() != 0){
				$dates = $p_get_favorite_days->fetchAll();
				foreach($dates as $event_date){
					$event['favorite_dates'][] = $event_date['event_date'];
				}
			}

			if ($p_get_liked_users->rowCount() != 0){
				$friends = $p_get_liked_users->fetchAll();
				foreach($friends as $friend){
					if (!isset($event['favorite_friends'][$friend['event_date']])){
						$event['favorite_friends'][$friend['event_date']] = array();
					}
					$event['favorite_friends'][$friend['event_date']][] = $friend;
				}
			}
			$event['tags'] = $p_get_tags->fetchAll();
		}

		return new Result(true, '', $events);
	}
}