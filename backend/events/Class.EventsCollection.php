<?php

require_once 'Class.Event.php';

class EventsCollection{

	static $URLs = array(
		'facebook' => 'https://facebook.com/',
		'google' => 'https://plus.google.com/',
		'vk' => 'http://vk.com/id',
	);

	private static function getLinkToSocialNetwork($type, $uid){
		return self::$URLs[$type] . $uid;
	}
	public static function filter(PDO $db, User $user, array $filters = null, $order_by = '') {
		$q_get_events = 'SELECT DISTINCT events.*, event_types.latin_name as event_type_latin_name, organizations.img_url as organization_img_url,
			organizations.name as organization_name, organization_types.name as organization_type_name, organizations.short_name as organization_short_name,
			(SELECT COUNT(*) AS liked_count FROM favorite_events WHERE status = 1 AND event_id = events.id) AS liked_users_count,
			(SELECT COUNT(users_organizations.user_id) AS can_edit
				FROM users_organizations
				WHERE users_organizations.organization_id = organizations.id
				AND users_organizations.status = 1
				AND users_organizations.user_id = :user_id) > 0 AS can_edit
			FROM events
			INNER JOIN organizations ON organizations.id = events.organization_id
			INNER JOIN organization_types ON organization_types.id = organizations.type_id
			INNER JOIN event_types ON event_types.id = events.event_type_id
			LEFT JOIN events_tags ON events.id = events_tags.event_id
			LEFT JOIN tags ON tags.id = events_tags.tag_id
			WHERE organizations.status = 1
			AND events.status = 1';
		$statement_array = array(
			':user_id' => $user->getId()
		);
		foreach($filters as $name => $value){
			switch($name){
				case 'date': {
					$q_get_events .= '
					AND ((
						DATE(events.event_start_date) <= DATE(:date)
							AND
						DATE(events.event_end_date) >= DATE(:date)
						)
						OR
						(
						DATE(events.event_start_date) = DATE(:date)
							AND
						DATE(events.event_end_date) = DATE(:date)
						))';
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
					if ($value instanceof User == false) break;
					$q_get_events .= ' AND (organizations.id IN (SELECT organization_id FROM subscriptions WHERE
						subscriptions.user_id = :user_id AND
						subscriptions.status = 1)) ';
					/*
					 * в массиве уже есть user_id + value и user ссылаются на одно и то же, или можно получиться подписки не на себя7
					 */
					$statement_array[':user_id'] = $value->getId();
					break;
				}
				case 'id': {
					if ($value instanceof Event == false) break;
					$q_get_events .= ' AND (events.id = :event_id)';
					$statement_array[':event_id'] = $value->getId();
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
						'event_end_date' => $_event['event_end_date'],
						'image_vertical' => $_event['image_vertical'],
						'image_vertical_url' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . $_event['image_vertical'],
						'image_horizontal' => $_event['image_horizontal'],
						'image_horizontal_url' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . $_event['image_horizontal']
					);
				}
			}
		}

		$p_get_is_favorite = $db->prepare('SELECT favorite_events.id
			FROM favorite_events
			WHERE favorite_events.status = 1
			AND favorite_events.user_id = :user_id
			AND favorite_events.event_id = :event_id');

		$p_get_tags = $db->prepare('SELECT tags.id, tags.name
			FROM  tags
			INNER JOIN events_tags ON tags.id = events_tags.tag_id
			WHERE events_tags.status = 1
			AND tags.status = 1
			AND events_tags.event_id = :event_id');

		$p_get_liked_users = $db->prepare('SELECT DISTINCT users.first_name, users.last_name,
			users.middle_name, users.id, users.avatar_url, view_friends.friend_uid,
			view_friends.type
			FROM view_friends
			INNER JOIN users ON users.id = view_friends.friend_id
			INNER JOIN favorite_events ON favorite_events.user_id = view_friends.friend_id
			WHERE
				view_friends.user_id = :user_id
			AND favorite_events.event_id = :event_id
			AND favorite_events.status = 1
			AND users.show_to_friends = 1
			AND users.id != :user_id');

		foreach($events as &$event){
			$p_get_is_favorite->execute(array(
				':user_id' => $user->getId(),
				':event_id' => $event['id']
			));

			$p_get_liked_users->execute(array(
				':user_id' => $user->getId(),
				':event_id' => $event['id']
			));

			$p_get_tags->execute(array(
				':event_id' => $event['id']
			));

			$event['favorite_friends'] = array();

			if ($p_get_liked_users->rowCount() != 0){
				$event['favorite_friends'] = $p_get_liked_users->fetchAll();
				foreach($event['favorite_friends'] as &$friend){
					$friend['link'] = self::getLinkToSocialNetwork($friend['type'], $friend['friend_uid']);
				}
			}

			$event['tags'] = $p_get_tags->fetchAll();
			$event['is_favorite'] = $p_get_is_favorite->rowCount() > 0;
			$event['image_vertical_url'] = App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . $event['image_vertical'];
			$event['image_horizontal_url'] = App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . $event['image_horizontal'];
		}

		return new Result(true, '', $events);
	}
}