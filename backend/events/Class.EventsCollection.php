<?php

require_once 'Class.Event.php';

class EventsCollection{

	static $URLs = array(
		'facebook' => 'https://facebook.com/',
		'google' => 'https://plus.google.com/',
		'vk' => 'http://vk.com/id',
	);

	public static function filter(PDO $db, User $user, array $filters = null, $order_by = '') {
		$q_get_events = 'SELECT DISTINCT events.*, event_types.latin_name as event_type_latin_name, organizations.img_url as organization_img_url,
			organizations.name as organization_name, organization_types.name as organization_type_name, organizations.short_name as organization_short_name,
			IF(events.event_start_date IS NULL,
			 	(SELECT MIN(event_date) FROM events_dates WHERE events_dates.event_id = events.id AND status = 1 AND DATE(event_date) >= DATE(NOW()) GROUP BY events_dates.event_id),
			 	IF(events.event_start_date  < NOW(),
			 	 DATE(NOW()),
			 	 events.event_start_date
			 	)
			 	) AS nearest_event_date,
			UNIX_TIMESTAMP(event_start_date) as timestamp_event_start_date,
			UNIX_TIMESTAMP(events.created_at) as timestamp_created_at,
			UNIX_TIMESTAMP(event_end_date) as timestamp_event_end_date,
			UNIX_TIMESTAMP(events.updated_at) as timestamp_updated_at,
			IF(events.event_start_date IS NULL,
			 	(SELECT MIN(event_date) FROM events_dates WHERE events_dates.event_id = events.id AND status = 1 GROUP BY events_dates.event_id),
			 	events.event_start_date
				) AS first_date,
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

		$is_short = false;
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
						)
						OR (:date IN (SELECT events_dates.event_date FROM events_dates WHERE events.id = events_dates.event_id AND status = 1) AND events.event_start_date IS NULL)
						)';
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
					if ($value instanceof User == false){
						$value = $user;
					}
					$q_get_events .= ' AND (
						(organizations.id IN (SELECT organization_id FROM subscriptions WHERE
						    subscriptions.user_id = :user_id AND
						    subscriptions.status = 1)
						 )
						 OR
						 (events.id IN (SELECT event_id FROM favorite_events WHERE favorite_events.status = 1 AND favorite_events.user_id = :user_id))
						 )
						 AND (events.id NOT IN (SELECT event_id FROM hidden_events WHERE hidden_events.status = 1 AND hidden_events.user_id = :user_id))';
					$statement_array[':user_id'] = $value->getId();
					break;
				}
				case 'id': {
					if ($value instanceof Event == false) break;
					$q_get_events .= ' AND (events.id = :event_id)';
					$statement_array[':event_id'] = $value->getId();
					break;
				}
				case 'organization_id': {
					$q_get_events .= ' AND (events.organization_id = :organization_id)';
					$statement_array[':organization_id'] = $value;
					break;
				}
				case 'type': {
					if ($value == 'future'){
						$q_get_events .= ' AND (
								(DATE(NOW()) BETWEEN DATE(events.event_start_date) AND DATE(events.event_end_date))
								OR
								(DATE(NOW()) < DATE(events.event_start_date))
								OR
								(events.event_end_date IS NULL AND (SELECT COUNT(*) FROM events_dates WHERE events_dates.event_id = events.id AND events_dates.status = 1 AND DATE(event_date) >= DATE(NOW())))
							)';
					}elseif ($value == 'favorites'){
						$q_get_events .= ' AND (events.id IN (
							SELECT DISTINCT event_id FROM favorite_events WHERE status=1 AND user_id = :user_id
						))  AND (
								(DATE(NOW()) BETWEEN DATE(events.event_start_date) AND DATE(events.event_end_date))
								OR
								(DATE(NOW()) < DATE(events.event_start_date))
								OR
								(events.event_end_date IS NULL AND (SELECT COUNT(*) FROM events_dates WHERE events_dates.event_id = events.id AND events_dates.status = 1 AND DATE(event_date) >= DATE(NOW())))
							)';
					}else{
						$is_short = true;
					}
					break;
				}
				case 'since_date':{
					if ($value instanceof DateTime){
						$value = $value->format('Y-m-d');
					}elseif($value == null){
						break;
					}
					$q_get_events .= ' AND (
						(DATE(events.event_start_date) >= DATE(:since_date) OR DATE(events.event_end_date) >= DATE(:since_date))
						OR
						(SELECT COUNT(*) FROM events_dates WHERE DATE(events_dates.event_date) >= DATE(:since_date)) > 0
					)
						 ';
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
					(DATE(events.event_start_date) <= DATE(:till_date) OR (DATE(events.event_end_date) <= DATE(:till_date)))
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
		$q_get_events .= $order_by;
		$p_get_events = $db->prepare($q_get_events);
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$events = $p_get_events->fetchAll();

		if (isset($filters['type'])){
			if ($filters['type'] == 'short'){
				foreach($events as &$_event){
					$_event = array(
						'id' => intval($_event['id']),
						'title' => $_event['title'],
						'event_start_date' => $_event['event_start_date'],
						'event_end_date' => $_event['event_end_date'],
						'image_vertical' => $_event['image_vertical'],
						'image_horizontal' => $_event['image_horizontal']
					);

					$_event = array_merge($_event, self::makeImgUrls($_event));
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

		$p_get_dates = $db->prepare('SELECT events_dates.event_date as event_date
			FROM events_dates
			WHERE
				events_dates.status = 1
			AND events_dates.event_id = :event_id
			ORDER BY events_dates.event_date');

		$p_get_liked_users = $db->prepare('SELECT DISTINCT users.first_name, users.last_name,
			users.middle_name, users.id, users.avatar_url, view_friends.friend_uid,
			view_friends.type,
			IF (
				(SELECT COUNT(view_friends.friend_id) FROM view_friends WHERE view_friends.user_id = :user_id AND view_friends.friend_id = users.id) > 0,
			1, 0)
				AS is_friend
			FROM users
			INNER JOIN view_friends ON users.id = view_friends.friend_id
			LEFT JOIN favorite_events ON favorite_events.user_id = view_friends.friend_id
			WHERE
				favorite_events.event_id = :event_id
			AND favorite_events.status = 1
			AND users.show_to_friends = 1
			AND users.id != :user_id
			GROUP BY users.id');

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

			$p_get_dates->execute(array(
				':event_id' => $event['id']
			));

			if (!$is_short){
				$event['longitude'] = floatval($event['longitude']);
				$event['latitude'] = floatval($event['latitude']);
				$event['event_type_id'] = intval($event['event_type_id']);
				$event['liked_users_count'] = intval($event['liked_users_count']);
				$event['creator_id'] = intval($event['creator_id']);
				$event['id'] = intval($event['id']);
				$event['organization_id'] = intval($event['organization_id']);
				$event['can_edit'] = boolval($event['can_edit']);
				$event['timestamp_event_start_date'] = intval($event['timestamp_event_start_date']);
				$event['timestamp_created_at'] = intval($event['timestamp_created_at']);
				$event['timestamp_event_end_date'] = intval($event['timestamp_event_end_date']);
				$event['timestamp_updated_at'] = intval($event['timestamp_updated_at']);
				$event['organization_img_url'] = App::$SCHEMA . App::$DOMAIN . '/' . $event['organization_img_url'];
				$event['is_full_day'] = $event['end_time'] == '00:00:00' && $event['begin_time'] == '00:00:00';
				$event['location_object'] = $event['location_object'] == null ? null : $event['location_object'];
				$event['status'] = $event['status'] == 1;
				$first_date_dt = new DateTime($event['first_date']);
				$event['timestamp_first_date'] = $first_date_dt->getTimestamp();
			}

			$event['favorite_friends'] = array();
			$event['dates_range'] = array();

			if ($p_get_liked_users->rowCount() != 0){
				$event['favorite_friends'] = $p_get_liked_users->fetchAll();
				foreach($event['favorite_friends'] as &$friend){
					$friend['id'] = intval($friend['id']);
					$friend['friend_uid'] = intval($friend['friend_uid']);
					$friend['friend_id'] = isset($friend['friend_id']) ? intval($friend['friend_id']) : null;
					$friend['link'] = User::getLinkToSocialNetwork($friend['type'], $friend['friend_uid']);
				}
			}

			if ($p_get_dates->rowCount() != 0){
				$_dates = $p_get_dates->fetchAll();
				foreach($_dates as $date){
					$event['dates_range'][] = $date['event_date'];
				}
			}else{
				$end_date = new DateTime($event['event_end_date']);
				$end_date->add(new DateInterval('P1D'));
				$period = new DatePeriod(
					new DateTime($event['event_start_date']),
					new DateInterval('P1D'),
					$end_date
				);
				foreach($period as $date){
					$event['dates_range'][] = $date->format('Y-m-d');
				}
				if (count($event['dates_range']) == 0 && $event['event_start_date'] == $event['event_end_date']){
					$event['dates_range'][] = $event['event_start_date'];
				}
			}

			$tags = $p_get_tags->fetchAll();
			$event['tags'] = array();

			foreach($tags as $tag){
				$tag['id'] = intval($tag['id']);
				$event['tags'][] = $tag;
			}

			$event['is_favorite'] = $p_get_is_favorite->rowCount() > 0;
			$event = array_merge($event, self::makeImgUrls($event));
		}

		return new Result(true, '', $events);
	}

	public static function makeImgUrls(array $event){
		return array(
			'image_vertical_url' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_MEDIUM . '/' . $event['image_vertical'],
			'image_horizontal_url' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_MEDIUM . '/' . $event['image_horizontal'],
			'image_square_url' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_SQUARE . '/' .$event['image_vertical'],

			'vertical_images' => array(
				'large' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_LARGE . '/' . $event['image_vertical'],
				'medium' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_MEDIUM . '/' . $event['image_vertical'],
				'small' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_SMALL . '/' . $event['image_vertical'],
			),
			'horizontal_images' => array(
				'large' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_LARGE . '/' . $event['image_horizontal'],
				'medium' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_MEDIUM . '/' . $event['image_horizontal'],
				'small' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_SMALL . '/' . $event['image_horizontal'],
			),
			'square_images' => array(
				'vertical' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_SQUARE . '/' . $event['image_vertical'],
				'horizontal' => App::$SCHEMA . App::$DOMAIN . Event::IMAGES_PATH . Event::IMG_SIZE_TYPE_SQUARE . '/' . $event['image_horizontal'],
			)
		);
	}
}