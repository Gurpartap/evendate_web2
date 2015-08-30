<?php

class Event{

	private $db;
	private $id;
	private $title;
	private $description;
	private $location;
	private $location_uri;
	private $event_start_date;
	private $notifications_schema_json;
	private $creator_id;
	private $organization_id;
	private $latitude;
	private $longitude;
	private $event_end_date;
	private $image_vertical_ext;
	private $event_type_id;
	private $detail_info_url;
	private $begin_time;
	private $end_time;
	private $image_horizontal_ext;
	private $location_object;

	const TAGS_LIMIT = 5;


	public function __construct($id, PDO $db) {
		$this->db = $db;
		$q_get_event = 'SELECT events.* FROM events WHERE events.id = :id';
		$p_get_event = $this->db->prepare($q_get_event);
		$result = $p_get_event->execute(array(
			':id' => $id
		));
		if ($result === FALSE) throw new DBQueryException('DB_QUERY_ERROR', $db);
		if ($p_get_event->rowCount() != 1) throw new InvalidArgumentException('CANT_FIND_EVENT');

		$event = $p_get_event->fetch();
		foreach($event as $key => $value){
			if (property_exists('Event', $key)){
				$this->$key = $value;
			}
		}
	}

	public static function create(PDO $db, array $data){
		$q_ins_event = 'INSERT INTO `events`(created_at, title, description, location,
						location_object, location_uri, event_start_date, event_end_date,
						notifications_schema_json, creator_id, organization_id,
						latitude, longitude, image_vertical_ext, image_horizontal_ext,
						event_type_id, detail_info_url, begin_time, end_time)

				VALUES(NOW(), :title, :description, :location, :location_object,
						:location_uri, :event_start_date, :event_end_date,
						:notifications_schema_json, :creator_id, :organization_id,
						:latitude, :longitude, :image_vertical_ext, :image_horizontal_ext,
						:event_type_id, :detail_info_url, :begin_time, :end_time)';

		$p_ins_event = $db->prepare($q_ins_event);

		$data['location'] = isset($data['address']) ? $data['address'] : null;
		$data['latitude'] = isset($data['geo']['coordinates']['G']) ? $data['geo']['coordinates']['G'] : null;
		$data['longitude'] = isset($data['geo']['coordinates']['K']) ? $data['geo']['coordinates']['K'] : null;


		$notification_keys = array('day', 'month', 'three-days', 'two-hours', 'week');


		$notifications_count = 0;
		foreach($notification_keys as $value){
			if ($notifications_count == 2) break;
			$data['notification_schema'][$value] = $data['notification-before-' . $value] == true;
			$notifications_count++;
		}


		$query_data = array(
			':title' => $data['title'],
			':description' => $data['description'],
			':location' => $data['location'],
			':location_object' => json_encode($data['geo']),
			':location_uri' => 'content://maps.google.com/lat=' . $data['latitude'] .'&long='.$data['longitude'],
			':event_start_date' => $data['date-start'],
			':event_end_date' => $data['date-end'],
			':notifications_schema_json' => json_encode($data['notification_schema']),
			':creator_id' => $data['creator_id'],
			':organization_id' => $data['organization_id'],
			':latitude' => $data['latitude'],
			':longitude' => $data['longitude'],
			':image_vertical_ext' => $data['image_extensions']['vertical'],
			':image_horizontal_ext' => $data['image_extensions']['horizontal'],
			':event_type_id' => 1, // мероприятие
			':detail_info_url' => $data['detail-info-url'],
			':begin_time' => $data['begin-hours'] . ':' . $data['begin-minutes'] . ':00',
			':end_time' => $data['end-hours'] . ':' . $data['end-minutes'] . ':00'
		);

		$result = $p_ins_event->execute($query_data);

		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$event_id = $db->lastInsertId();

		self::saveEventTags($db, $event_id, $data['tags']);

		self::saveEventImage($data['files']['horizontal'], $data['image_extensions']['horizontal'], 'horizontal', $event_id);
		self::saveEventImage($data['files']['vertical'], $data['image_extensions']['vertical'], 'vertical', $event_id);

		return new Result(true, 'Событие успешно создано!');
	}

	private static function saveEventImage($file, $ext, $img_type, $id){
		$start_memory = memory_get_usage();
		$tmp = unserialize(serialize($file));
		$img_size = memory_get_usage() - $start_memory;

		if ($img_size / 1024 > 6144){ // CMP with 6 MB, coz var is not only image data
			throw new InvalidArgumentException('Файл слишком большого размера. Максимальный размер - 4МБ');
		}

		$file = explode(',', $file);
		$file = $file[1];
		if ($ext != '' && $file){
			global $ROOT_PATH;
			$new_file_name = $ROOT_PATH . '/event_images/' . $id . '-' . $img_type .  '.' . $ext;
			file_put_contents($new_file_name, base64_decode($file));
			return new Result(true, 'Данные успешно обновлены');
		}else{
			return new Result(false, 'Ошибка обновлени данных. Не указан файл или название.');
		}
	}

	public static function getEventTypes(PDO $db){
		$p_get_event_types = $db->query('SELECT *
			FROM event_types
			WHERE status = 1');
		return new Result(true, '', $p_get_event_types->fetchAll());
	}

	private static function saveEventTags(PDO $db, $event_id, array $tags) {
		$q_ins_tags = 'INSERT INTO events_tags(event_id, tag_id, created_at, status)
			VALUES(:event_id, :tag_id, NOW(), 1)';
		$p_ins_tags = $db->prepare($q_ins_tags);
		$inserted_count = 0;
		foreach($tags as $tag_id){
			if ($inserted_count == 5) break;
			$p_ins_tags->execute(array(
				':event_id' => $event_id,
				':tag_id' => $tag_id
			));
			$inserted_count++;
		}
	}

	/**
	 * @return mixed
	 */
	public function getId() {
		return $this->id;
	}
}