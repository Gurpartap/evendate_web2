<?php

require_once $ROOT_PATH . '/backend/organizations/Class.Organization.php';

class Event{

	const IMAGES_PATH = '/event_images/';

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
	private $image_vertical;
	private $event_type_id;
	private $detail_info_url;
	private $begin_time;
	private $end_time;
	private $image_horizontal;
	private $location_object;
	private $tags;

	const TAGS_LIMIT = 5;
	private $organization;


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

	private static function generateRandomString($length = 10) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

	private static function generateNotificationsJSON(array $data){
		$result = array();
		$notifications_count = 0;
		foreach($data as $key => $value){
			$key_parts = explode('-', $key);
			if ($key_parts[0] == 'notification'){
				if ($value == true && $notifications_count == 2) $value = false;
				$result[$key] = $value;
			}
		}
		return json_encode($result);
	}

	public static function create(PDO $db, Organization $organization, array $data){
		$q_ins_event = 'INSERT INTO `events`(created_at, title, description, location,
						location_object, location_uri, event_start_date, event_end_date,
						notifications_schema_json, creator_id, organization_id,
						latitude, longitude, image_vertical, image_horizontal,
						event_type_id, detail_info_url, begin_time, end_time)

				VALUES(NOW(), :title, :description, :location, :location_object,
						:location_uri, :event_start_date, :event_end_date,
						:notifications_schema_json, :creator_id, :organization_id,
						:latitude, :longitude, :image_vertical, :image_horizontal,
						:event_type_id, :detail_info_url, :begin_time, :end_time)';

		$p_ins_event = $db->prepare($q_ins_event);

		$data['location'] = isset($data['address']) ? $data['address'] : null;
		$data['latitude'] = isset($data['geo']['coordinates']['G']) ? $data['geo']['coordinates']['G'] : null;
		$data['longitude'] = isset($data['geo']['coordinates']['K']) ? $data['geo']['coordinates']['K'] : null;


		if (!isset($data['tags'])) throw new LogicException('Укажите хотя бы один тег');
		if (!is_array($data['tags'])) throw new LogicException('Укажите хотя бы один тег');

		$img_horizontal_filename = md5(self::generateRandomString() .  '-horizontal') .  '.' . $data['image_extensions']['horizontal'];
		$img_vertical_filename = md5(self::generateRandomString() . '-vertical') .  '.' . $data['image_extensions']['vertical'];

		$query_data = array(
			':title' => $data['title'],
			':description' => $data['description'],
			':location' => $data['location'],
			':location_object' => json_encode($data['geo']),
			':location_uri' => 'content://maps.google.com/lat=' . $data['latitude'] .'&long='.$data['longitude'],
			':event_start_date' => $data['date-start'],
			':event_end_date' => $data['date-end'],
			':notifications_schema_json' => self::generateNotificationsJSON($data),
			':creator_id' => $data['creator_id'],
			':organization_id' => $organization->getId(),
			':latitude' => $data['latitude'],
			':longitude' => $data['longitude'],
			':image_vertical' => $img_vertical_filename,
			':image_horizontal' => $img_horizontal_filename,
			':event_type_id' => 1, // мероприятие
			':detail_info_url' => $data['detail-info-url'],
			':begin_time' => $data['begin-hours'] . ':' . $data['begin-minutes'] . ':00',
			':end_time' => $data['end-hours'] . ':' . $data['end-minutes'] . ':00'
		);

		$result = $p_ins_event->execute($query_data);

		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$event_id = $db->lastInsertId();

		self::saveEventTags($db, $event_id, $data['tags']);

		self::saveEventImage($data['files']['horizontal'], $img_horizontal_filename);
		self::saveEventImage($data['files']['vertical'], $img_vertical_filename);

		return new Result(true, 'Событие успешно создано!');
	}

	private static function saveEventImage($file, $filename){
		$start_memory = memory_get_usage();
		$tmp = unserialize(serialize($file));
		$img_size = memory_get_usage() - $start_memory;

		if ($img_size / 1024 > 6144){ // CMP with 6 MB, coz var is not only image data
			throw new InvalidArgumentException('Файл слишком большого размера. Максимальный размер - 6МБ');
		}

		$file = explode(',', $file);
		$file = $file[1];
		if ($file){
			global $ROOT_PATH;
			$result = file_put_contents($ROOT_PATH . self::IMAGES_PATH . $filename, base64_decode($file));
			if (!$result) throw new RuntimeException('Ошибка сохранения файла');
			return $result;
		}else{
			return FALSE;
		}
	}

	public static function getEventTypes(PDO $db){
		$p_get_event_types = $db->query('SELECT *
			FROM event_types
			WHERE status = 1');
		return new Result(true, '', $p_get_event_types->fetchAll());
	}

	private static function saveEventTags(PDO $db, $event_id, array $tags) {
		$p_upd = $db->prepare('UPDATE events_tags SET status = 0 WHERE event_id = :event_id');
		$p_upd->execute(array(':event_id' => $event_id));

		$q_ins_tags = 'INSERT INTO events_tags(event_id, tag_id, created_at, status)
			VALUES(:event_id, :tag_id, NOW(), 1) ON DUPLICATE KEY UPDATE status = 1';
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

	public function getId() {
		return $this->id;
	}

	public function getTitle() {
		return $this->title;
	}

	/**
	 * @return mixed
	 */
	public function getDescription() {
		return $this->description;
	}

	/**
	 * @return mixed
	 */
	public function getLocation() {
		return $this->location;
	}

	/**
	 * @return mixed
	 */
	public function getLocationUri() {
		return $this->location_uri;
	}

	/**
	 * @return mixed
	 */
	public function getEventStartDate() {
		return $this->event_start_date;
	}

	/**
	 * @return mixed
	 */
	public function getNotificationsSchemaJson() {
		return $this->notifications_schema_json;
	}

	/**
	 * @return mixed
	 */
	public function getCreatorId() {
		return $this->creator_id;
	}

	/**
	 * @return mixed
	 */
	public function getOrganizationId() {
		return $this->organization_id;
	}

	/**
	 * @return mixed
	 */
	public function getLatitude() {
		return $this->latitude;
	}

	/**
	 * @return mixed
	 */
	public function getLongitude() {
		return $this->longitude;
	}

	/**
	 * @return mixed
	 */
	public function getEventEndDate() {
		return $this->event_end_date;
	}

	/**
	 * @return mixed
	 */
	public function getImageVertical() {
		return $this->image_vertical;
	}

	/**
	 * @return mixed
	 */
	public function getEventTypeId() {
		return $this->event_type_id;
	}

	/**
	 * @return mixed
	 */
	public function getDetailInfoUrl() {
		return $this->detail_info_url;
	}

	/**
	 * @return mixed
	 */
	public function getBeginTime() {
		return $this->begin_time;
	}

	/**
	 * @return mixed
	 */
	public function getEndTime() {
		return $this->end_time;
	}

	/**
	 * @return mixed
	 */
	public function getImageHorizontal() {
		return $this->image_horizontal;
	}


	public function getImageHorizontalUrl() {
		return App::$SCHEMA . App::$DOMAIN . self::IMAGES_PATH . '/' . $this->image_horizontal;
	}

	public function getImageVerticalUrl() {
		return App::$SCHEMA . App::$DOMAIN . self::IMAGES_PATH . '/' . $this->image_vertical;
	}

	public function getTags(){
		if ($this->tags != null) return $this->tags;

		$q_get_tags = 'SELECT * FROM tags
			INNER JOIN events_tags ON tags.id = events_tags.tag_id
			WHERE event_id = :event_id
			AND tags.status = 1
			AND events_tags.status = 1';
		$p_get_tags = $this->db->prepare($q_get_tags);
		$result = $p_get_tags->execute(array(':event_id' => $this->getId()));
		if ($result === FALSE) throw new DBQueryException('', $this->db);

		return new Result(true, '',$p_get_tags->fetchAll());
	}

	/**
	 * @return mixed
	 */
	public function getLocationObject() {
		return $this->location_object;
	}

	public function getOrganization() {
		if ($this->organization instanceof Organization == false){
			$this->organization = new Organization($this->getOrganizationId(), $this->db);
		}
		return $this->organization;
	}

	public function getUrl(){
		return App::$SCHEMA . App::$DOMAIN . '/events.php?id=' . $this->getId();
	}

	public function getLikedUsers(User $user){
		$q_get_users = 'SELECT users.first_name,
			users.last_name,
			 users.middle_name,
			 users.avatar_url,
			 users.id
			FROM users
			INNER JOIN favorite_events ON favorite_events.user_id = users.id
			INNER JOIN events ON events.id = favorite_events.event_id
			WHERE events.status = 1
			AND favorite_events.status = 1
			AND users.show_to_friends = 1
			AND events.id = :event_id';
		$p_get_users = $this->db->prepare($q_get_users);

		$result = $p_get_users->execute(array(
			':event_id' => $this->getId()
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_LIKED_USERS', $this->db);

		return new Result(true, '', $p_get_users->fetchAll());

	}

	public function update(array $data, Organization $organization, Editor $editor) {
		$q_upd_event = 'UPDATE events SET
				title = :title,
				description = :description,
				location = :location,
				location_object = :location_object,
				location_uri = :location_uri,
				event_start_date = :event_start_date,
				notifications_schema_json = :notifications_schema_json,
				creator_id = :creator_id,
				organization_id = :organization_id,
				latitude = :latitude,
				longitude = :longitude,
				event_end_date = :event_end_date,
				detail_info_url = :detail_info_url,
				begin_time = :begin_time,
				end_time = :end_time,
				';


		$data['location'] = isset($data['address']) ? $data['address'] : null;
		$data['latitude'] = isset($data['geo']['coordinates']['G']) ? $data['geo']['coordinates']['G'] : null;
		$data['longitude'] = isset($data['geo']['coordinates']['K']) ? $data['geo']['coordinates']['K'] : null;

		if (isset($data['file_names'])){
			$data['image_extensions'] = array(
				'vertical' => $editor->getImageExtension($data['file_names']['vertical']),
				'horizontal' => $editor->getImageExtension($data['file_names']['horizontal'])
			);
		}


		if (!isset($data['tags'])) throw new LogicException('Укажите хотя бы один тег');
		if (!is_array($data['tags'])) throw new LogicException('Укажите хотя бы один тег');

		$query_data = array(
			':title' => $data['title'],
			':description' => $data['description'],
			':location' => $data['location'],
			':location_object' => json_encode($data['geo']),
			':location_uri' => 'content://maps.google.com/lat=' . $data['latitude'] .'&long='.$data['longitude'],
			':event_start_date' => $data['date-start'],
			':event_end_date' => $data['date-end'],
			':notifications_schema_json' => self::generateNotificationsJSON($data),
			':creator_id' => $editor->getId(),
			':organization_id' => $organization->getId(),
			':latitude' => $data['latitude'],
			':longitude' => $data['longitude'],
			':detail_info_url' => $data['detail-info-url'],
			':begin_time' => $data['begin-hours'] . ':' . $data['begin-minutes'] . ':00',
			':end_time' => $data['end-hours'] . ':' . $data['end-minutes'] . ':00',
			':event_id' => $this->getId()
		);

		if (isset($data['image_extensions'])
			&& isset($data['image_extensions']['horizontal'])
			&& $data['image_extensions']['horizontal'] != null){
			$img_horizontal_filename = md5(self::generateRandomString() . '-horizontal') .  '.' . $data['image_extensions']['horizontal'];
			$query_data[':image_horizontal'] = $img_horizontal_filename;
			$q_upd_event .= ' image_horizontal = :image_horizontal,';
			self::saveEventImage($data['files']['horizontal'], $img_horizontal_filename);
		}

		if (isset($data['image_extensions'])
			&& isset($data['image_extensions']['vertical'])
			&& $data['image_extensions']['vertical'] != null){
			$img_vertical_filename = md5(self::generateRandomString() . '-vertical') .  '.' . $data['image_extensions']['vertical'];
			$query_data[':image_vertical'] = $img_vertical_filename;
			$q_upd_event .= ' image_vertical = :image_vertical,';
			self::saveEventImage($data['files']['vertical'], $img_vertical_filename);
		}

		$q_upd_event .= ' status = 1 WHERE events.id = :event_id';

		$p_upd_event = $this->db->prepare($q_upd_event);
		$result = $p_upd_event->execute($query_data);

		if ($result === FALSE) throw new DBQueryException(implode(';', $this->db->errorInfo()), $this->db);
		self::saveEventTags($this->db, $this->getId(), $data['tags']);

		return new Result(true, 'Событие успешно сохранено!');
	}

}