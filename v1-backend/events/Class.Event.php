<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';

class Event extends AbstractEntity{

	const IMAGES_PATH = '/event_images/';

	const IMG_ORIENTATION_TYPE_VERTICAL = 'vertical';
	const IMG_ORIENTATION_TYPE_HORIZONTAL = 'horizontal';


	const IMG_SIZE_TYPE_SMALL = 'small';
	const IMG_SIZE_TYPE_MEDIUM = 'medium';
	const IMG_SIZE_TYPE_LARGE = 'large';
	const IMG_SIZE_TYPE_SQUARE = 'square';

	const TAGS_LIMIT = 5;
	const ORGANIZATION_NOTIFICATIONS_LIMIT = 2;
	const IS_FAVORITE_FIELD_NAME = 'is_favorite';
	const TAGS_FIELD_NAME = 'tags';
	const DATES_FIELD_NAME = 'dates';
	const FAVORED_USERS_FIELD_NAME = 'favored';
	const NOTIFICATIONS_FIELD_NAME = 'notifications';
	const CAN_EDIT_FIELD_NAME = 'can_edit';


	protected static $DEFAULT_COLS = array(
		'id',
		'title',
		'first_event_date',
		'last_event_date',
		'nearest_event_date',
		'image_vertical_url',
		'image_horizontal_url',
		'organization_id',
	);

	protected static $ADDITIONAL_COLS = array(
		'description',
		'location',
		'detail_info_url',
		'creator_id',
		'latitude',
		'longitude',
		'organization_name',
		'organization_type_name',
		'organization_short_name',
		'organization_logo_large_url',
		'organization_logo_middle_url',
		'organization_logo_small_url',
		'created_at',
		'updated_at',
		'favored_users_count',
		self::IS_FAVORITE_FIELD_NAME => '(SELECT id IS NOT NULL
			FROM favorite_events
			WHERE favorite_events.status = TRUE
			AND favorite_events.user_id = :user_id
			AND favorite_events.event_id = view_events.id) IS NOT NULL AS is_favorite',
		self::CAN_EDIT_FIELD_NAME => '(SELECT id IS NOT NULL
			FROM view_editors
			WHERE id = :user_id AND organization_id = view_events.organization_id) IS NOT NULL AS can_edit'
	);

	protected $title;
	protected $description;
	protected $location;
	protected $location_uri;
	protected $first_event_date;
	protected $notifications_schema_json;
	protected $creator_id;
	protected $organization_id;
	protected $latitude;
	protected $longitude;
	protected $last_event_date;
	protected $image_vertical;
	protected $detail_info_url;
	protected $favored_users_count;
	protected $image_horizontal;
	protected $location_object;
	protected $organization_name;
	protected $organization_type_name;
	protected $organization_short_name;
	protected $is_favorite;
	protected $can_edit;


	private $tags;
	private $dates;
	private $favored_users;

	private $organization;


	public function __construct() {
		$this->db = App::DB();
		Statistics::Event($this, App::getCurrentUser(), App::DB(), Statistics::EVENT_VIEW);
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

	private static function getNotificationOffsets(PDO $db){
		return $db->query('SELECT * FROM notification_types')->fetchAll();
	}

	private static function generateNotificationsArray(array $data, PDO $db, $event_id = null){

		$result = array();
		$notifications_count = 0;

		foreach($data as $key => $value){
			$key_parts = explode('-', $key);
			if ($key_parts[0] == 'notification'){
				if ($value == true && $notifications_count == self::ORGANIZATION_NOTIFICATIONS_LIMIT) $value = false;
				$result[$key] = $value;
			}
		}

		if ($event_id != null){
			$p_upd_notifications = $db->prepare('SELECT
				events.notifications_schema_json,
				done,
				notification_type_id,
				notification_types.type
			FROM events
			LEFT JOIN events_notifications ON events_notifications.event_id = events.id
			LEFT JOIN notification_types ON notification_types.id = events_notifications.notification_type_id
			WHERE events.id = :event_id');
			$p_upd_notifications->execute(array(':event_id' => $event_id));

			$r = $p_upd_notifications->fetchAll();

			$done = [];
			foreach($r as $notification){
				if ($notification['done'] == 1){
					$done[$notification['type']] = $notification;
				}
			}

			$current = json_decode($r[0]['notifications_schema_json']);

			$done_count = count($done);

			if ($done_count >= self::ORGANIZATION_NOTIFICATIONS_LIMIT){ // can't change, coz all done
				return $current;
			}

			foreach($result as $type => $val){ // switch off all not done
				if ($val == false && !isset($done[$type])){ //not done and is true
					$current[$type] = $val;
				}
			}

			$switched_on = 0;
			foreach($result as $type => $val) { // switch on till reach limit
				if ($val == true
					&& !isset($done[$type])
					&& ($done_count + $switched_on) < self::ORGANIZATION_NOTIFICATIONS_LIMIT) {
					$current[$type] = $val;
					$switched_on++;
				}
			}
			$final = $current;

		}else{
			$final = $result;
		}
		$final['notification-now'] = true; // NOW IS DEFAULT FOR ALL

		$times = array();
		$_offsets = self::getNotificationOffsets($db);
		$offsets = array();

		foreach($_offsets as $type){
			$offsets[$type['type']] = $type['timediff'];
		}


		foreach($final as $type => $value){ // set times
			if ($value == true && !isset($done[$type])){
				if ($type == 'notification-now'){
					$times[$type] = time() + $offsets[$type];
				}else{
					$times[$type] = $data['first_date']->getTimestamp() - $offsets[$type];
				}
			}
		}

		return array (
			'types' => $final,
			'times' => $times
		);
	}

	private static function sortDates(array $dates){
		function sortFunc($a, $b){
			$datea = strtotime($a);
			$dateb = strtotime($b);
			if ($datea == $dateb){
				return 0;
			}
			return ($datea < $dateb) ? -1 : 1;
		}

		usort($dates, "sortFunc");
		return $dates;
	}

	private static function getFirstDate(array $data){
		$__date = new DateTime($data['dates'][0]);
		return new DateTime($__date->format('Y-m-d') . ' ' . $data['formatted_begin_time']);
	}

	private static function generateQueryData(&$data, PDO $db){
		$data['title'] = trim($data['title']);
		$data['description'] = trim($data['description']);
		$data['detail_info_url'] = trim($data['detail-info-url']);

		$data['location'] = isset($data['address']) ? trim($data['address']) : null;
		$data['latitude'] = isset($data['geo']['coordinates']['G']) ? $data['geo']['coordinates']['G'] : null;
		$data['longitude'] = isset($data['geo']['coordinates']['K']) ? $data['geo']['coordinates']['K'] : null;

		if ($data['date-start'] == null && $data['date-end'] == null && count($data['dates']) == 0) throw new LogicException('Отсутствует дата события');
		if (!isset($data['tags'])) throw new LogicException('Укажите хотя бы один тег');
		if (!is_array($data['tags'])) throw new LogicException('Укажите хотя бы один тег');


		$data['formatted_begin_time'] = $data['begin-hours'] . ':' . $data['begin-minutes'] . ':00';
		$data['formatted_end_time'] = ($data['end-hours'] == null) ? null : $data['end-hours'] . ':' . $data['end-minutes'] . ':00';


		$data['dates'] = self::sortDates($data['dates']);
		$data['first_date'] = self::getFirstDate($data);
		$data['notifications'] = self::generateNotificationsArray($data, $db);

	}

	public static function create(PDO $db, Organization $organization, array $data){

		try{
			$db->beginTransaction();

			if (!isset($data['dates']) || count($data['dates']) == 0)
				throw new InvalidArgumentException('Укажите, пожалуйста, даты','');

			$q_ins_event = App::queryFactory()->newInsert();
			$random_string = self::generateRandomString();
			$img_horizontal_filename = md5($random_string .  '-horizontal') .  '.' . $data['image_extensions']['horizontal'];
			$img_vertical_filename = md5($random_string . '-vertical') .  '.' . $data['image_extensions']['vertical'];


			self::generateQueryData($data, $db);

			$q_ins_event
				->into('events')
				->cols(array(
					'title' => $data['title'],
					'description' => $data['description'],
					'location' => $data['location'],
					'location_object' => json_encode($data['geo']),
					'creator_id' => $data['creator_id'],
					'organization_id' => $organization->getId(),
					'latitude' => $data['latitude'],
					'longitude' => $data['longitude'],
					'image_vertical' => $img_vertical_filename,
					'image_horizontal' => $img_horizontal_filename,
					'detail_info_url' => $data['detail-info-url'],
				));

			$p_ins_event = $db->prepare($q_ins_event->getStatement());

			$result = $p_ins_event->execute($q_ins_event->getBindValues());

			if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

			$event_id = $db->lastInsertId();

			self::saveDates($data['dates'], $db, $event_id);
			self::saveEventTags($db, $event_id, $data['tags']);
			self::saveNotifications($event_id, $data, $db);
			self::saveEventImage($data['files']['horizontal'], $img_horizontal_filename);
			self::saveEventImage($data['files']['vertical'], $img_vertical_filename);

			$db->commit();
			return new Result(true, 'Событие успешно создано', array('event_id' => $event_id));
		}catch(Exception $e){
			$db->rollBack();
			throw $e;
		}
	}

	private static function saveEventImage($file, $filename){
		$start_memory = memory_get_usage();
		$tmp = unserialize(serialize($file));
		$img_size = memory_get_usage() - $start_memory;

		if ($img_size / 1024 > 14000){ // CMP with 6 MB, coz var is not only image data
			throw new InvalidArgumentException('Файл слишком большого размера. Максимальный размер - 6МБ');
		}

		$file = explode(',', $file);
		$file = $file[1];
		if ($file){
			global $ROOT_PATH;
			$result = file_put_contents($ROOT_PATH . self::IMAGES_PATH . self::IMG_SIZE_TYPE_LARGE . '/' . $filename, base64_decode($file));
			if (!$result) throw new RuntimeException('Ошибка сохранения файла');
			return $result;
		}else{
			throw new InvalidArgumentException();
		}
	}


	private static function saveEventTags(PDO $db, $event_id, array $tags) {
		$p_upd = $db->prepare('UPDATE events_tags SET status = FALSE WHERE event_id = :event_id');
		$p_upd->execute(array(':event_id' => $event_id));

		$q_ins_tags = 'INSERT INTO events_tags(event_id, tag_id, status)
			VALUES(:event_id, :tag_id, TRUE)
			ON CONFLICT DO UPDATE SET status = TRUE';
		$p_ins_tags = $db->prepare($q_ins_tags);

		$inserted_count = 0;

		foreach($tags as $name){
			if (is_numeric($name)){
				$tag_id = intval($name);
			}else{
				$tag_id = TagsCollection::create($db, $name)->getId();
			}

			if ($inserted_count == self::TAGS_LIMIT) break;
			$p_ins_tags->execute(array(
				':event_id' => $event_id,
				':tag_id' => $tag_id
			));
			$inserted_count++;
		}
	}

	private static function saveDates($dates, PDO $db, $event_id) {
		$p_set_inactive = $db->prepare('UPDATE events_dates SET status = FALSE WHERE event_id = :event_id');
		$p_set_inactive->execute(array(':event_id' => $event_id));

		$q_ins_dates = 'INSERT INTO events_dates(event_date, status, event_id, start_time, end_time)
			VALUES(:event_date, TRUE, :event_id, :start_time, :end_time)';
		$p_ins_dates = $db->prepare($q_ins_dates);
		foreach($dates as $date){
			$p_ins_dates->execute(array(
				':event_date' => $date,
				':event_id' => $event_id
			));
		}
	}

	private static function saveNotifications($event_id, array $data, PDO $db) {
		$p_upd_not_done = $db->prepare('UPDATE events_notifications SET status = 1 WHERE done = 0 AND event_id = :event_id');
		$p_upd_not_done->execute(array(
			':event_id' => $event_id
		));

		$p_ins_value = $db->prepare('INSERT INTO
			events_notifications(created_at, event_id, notification_type_id, notification_time, status, done)
			SELECT
				NOW() as created_at,
				  :event_id AS event_id,
				  id as notification_type_id,
				  FROM_UNIXTIME(:notification_time) as notification_time,
				  1 as status,
				  0 as done
				FROM notification_types WHERE type = :type
				ON DUPLICATE KEY UPDATE status = 1');

		foreach($data['notifications']['times'] as $type => $notification_time){
			$p_ins_value->execute(array(
				':event_id' => $event_id,
				':notification_time' => $notification_time,
				':type' => $type
			));
		}
	}


	public function getDates(){
		$q_get_event_dates = 'SELECT event_date, start_time, end_time
			FROM events_dates
			WHERE event_id = :event_id
				AND status = TRUE
				ORDER BY events_dates.event_date ASC';
		$p_get_dates = $this->db->prepare($q_get_event_dates);
		$result = $p_get_dates->execute(array(
			':event_id' => $this->getId()
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_DATES', $this->db);

		return new Result(true, '', $p_get_dates->fetchAll());
	}

	public function getTags(){
		if ($this->tags != null) return $this->tags;
		$this->tags = TagsCollection::filter($this->db,
			array('event_id' => $this->getId())
		)->getData();
		return $this->tags;
	}

	public function getIsFavorite(){
		return $this->is_favorite;
	}

	public function getFavoredUsers(){}

	/**
	 * @return mixed
	 */
	public function getLocationObject() {
		return $this->location_object;
	}

	public function getOrganization() {
		if ($this->organization instanceof Organization == false){
			$this->organization = OrganizationsCollection::filter(
				$this->db,
				App::getCurrentUser(),
				array('id' => $this->organization_id)
			);
		}
		return $this->organization;
	}

	public function getNotifications(User $user, array $fields = null) : Result{
		return NotificationsCollection::filter($this->db,
			$user,
			array('event' => $this),
			$fields,
			array(
				'length' => $fields[self::NOTIFICATIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
				'offset' => $fields[self::NOTIFICATIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
			),
			$fields[self::NOTIFICATIONS_FIELD_NAME]['order_by'] ?? array()
		);
	}

	public function getParams(User $user, array $fields = null) : Result{

		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::DATES_FIELD_NAME])){
			$result_data[self::DATES_FIELD_NAME] = $this->getDates()->getData();
		}

		if (isset($fields[self::FAVORED_USERS_FIELD_NAME])){
			$result_data[self::FAVORED_USERS_FIELD_NAME] = UsersCollection::filter($this->db, $user,
				array('event' => $this),
				Fields::parseFields($fields[self::FAVORED_USERS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::FAVORED_USERS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::FAVORED_USERS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				$fields[self::FAVORED_USERS_FIELD_NAME]['order_by'] ?? array()
			)->getData();
		}

		if (isset($fields[self::TAGS_FIELD_NAME])){
			$result_data[self::TAGS_FIELD_NAME] = TagsCollection::filter($this->db,
				$user,
				array('event' => $this),
				Fields::parseFields($fields[self::TAGS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::TAGS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::TAGS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				$fields[self::TAGS_FIELD_NAME]['order_by'] ?? array())->getData();
		}

		if (isset($fields[self::NOTIFICATIONS_FIELD_NAME])){
			$result_data[self::NOTIFICATIONS_FIELD_NAME] = $this->getNotifications($user,
				Fields::parseFields($fields[self::NOTIFICATIONS_FIELD_NAME]['fields'] ?? ''))->getData();
		}

		return new Result(true, '', $result_data);
	}

	public function hide(User $user){
		$q_ins_hidden = 'INSERT INTO hidden_events(event_id, user_id, status)
			VALUES(:event_id, :user_id, TRUE)
			ON CONFLICT DO UPDATE status = TRUE';
		$p_ins_hidden = $this->db->prepare($q_ins_hidden);
		$result = $p_ins_hidden->execute(array(
			':event_id' => $this->getId(),
			':user_id' => $user->getId()
		));

		if ($result === FALSE) throw new DBQueryException('', $this->db);
		return new Result(true, 'Событие успешно скрыто');
	}

	public function show(User $user){
		$q_upd_hidden = 'UPDATE hidden_events
			SET status = FALSE
			WHERE user_id = :user_id AND
			event_id = :event_id
			';
		$p_upd_hidden = $this->db->prepare($q_upd_hidden);
		$result = $p_upd_hidden->execute(array(
			':event_id' => $this->getId(),
			':user_id' => $user->getId()
		));

		if ($result === FALSE) throw new DBQueryException('', $this->db);
		return new Result(true, 'Событие успешно удалено из скрытых');
	}

	public function update(array $data, Organization $organization, Editor $editor) {
		$q_upd_event = 'UPDATE events SET
				title = :title,
				description = :description,
				location = :location,
				location_object = :location_object,
				location_uri = :location_uri,
				notifications_schema_json = :notifications_schema_json,
				creator_id = :creator_id,
				organization_id = :organization_id,
				latitude = :latitude,
				longitude = :longitude,
				detail_info_url = :detail_info_url,
				begin_time = :begin_time,
				end_time = :end_time
				';



		self::generateQueryData($data, $this->db);

		if (isset($data['file_names'])){
			$data['image_extensions'] = array(
				'vertical' => $editor->getImageExtension($data['file_names']['vertical']),
				'horizontal' => $editor->getImageExtension($data['file_names']['horizontal'])
			);
		}

		$query_data = array(
			':title' => $data['title'],
			':description' => $data['description'],
			':location' => $data['location'],
			':location_object' => json_encode($data['geo']),
			':location_uri' => 'content://maps.google.com/lat=' . $data['latitude'] .'&long='.$data['longitude'],
			':first_event_date' => $data['date-start'],
			':last_event_date' => $data['date-end'],
			':notifications_schema_json' => json_encode($data['notifications']['types']),
			':creator_id' => $editor->getId(),
			':organization_id' => $organization->getId(),
			':latitude' => $data['latitude'],
			':longitude' => $data['longitude'],
			':detail_info_url' => $data['detail_info_url'],
			':begin_time' => $data['formatted_begin_time'],
			':end_time' => $data['formatted_end_time'],
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

		if (isset($data['dates']) && count($data['dates']) > 0){
			self::saveDates($data['dates'], $this->db, $this->getId());
		}


		self::saveNotifications($this->getId(), $data, $this->db);
		return new Result(true, 'Событие успешно сохранено!', array('event_id' => $this->getId()));
	}

	public function addNotification(User $user, array $notification) {
		$time = new DateTime($notification['notification_time']);
		if ($time <= new DateTime()) throw new InvalidArgumentException('BAD_NOTIFICATION_TIME');
		$q_ins_notification = App::queryFactory()->newInsert();
		$q_ins_notification
			->into('users_notifications')
			->cols(array(
				'user_id' => $user->getId(),
				'event_id' => $this->getId(),
				'notification_time' => $time->format('Y-m-d H:i:s'),
				'status' => 'true',
				'done' => 'false',
				'sent_time' => null
			))
			->returning(array('uuid'));
		$p_ins = $this->db->prepare($q_ins_notification->getStatement());
		$result = $p_ins->execute($q_ins_notification->getBindValues());
		if ($result === FALSE) throw new DBQueryException('', $this->db);
		$result = $p_ins->fetch(PDO::FETCH_ASSOC);
		return new Result(true, 'Уведомление успешно добавлено', $result);
	}
}