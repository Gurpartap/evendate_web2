<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/tags/Class.Tag.php';
require_once $BACKEND_FULL_PATH . '/tags/Class.TagsCollection.php';

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

	protected $title;

	protected static $ADDITIONAL_COLS = array(
		'description',
		'location',
		'detail_info_url',
		'creator_id',
		'latitude',
		'longitude',
		'link',
		'image_vertical_small_url',
		'image_horizontal_small_url',
		'image_vertical_medium_url',
		'image_horizontal_medium_url',
		'image_vertical_large_url',
		'image_horizontal_large_url',
		'organization_name',
		'organization_type_name',
		'organization_short_name',
		'organization_logo_large_url',
		'organization_logo_medium_url',
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

	private $organization;


	public function __construct() {
		$this->db = App::DB();
	}

//	private static function generateNotificationsArray(array $data, PDO $db, $event_id = null) {
//		$result = array();
//
//		if (!isset($data['notification']) || $data['notification']){
//			return array();
//		}
//
//		if ($event_id != null){
//			$p_upd_notifications = $db->prepare('SELECT
//				events_notifications.done,
//				events_notifications.notification_type_id,
//				notification_types.type
//			FROM events_notifications
//			LEFT JOIN notification_types ON notification_types.id = events_notifications.notification_type_id
//			WHERE events_notifications.event_id = :event_id');
//			$p_upd_notifications->execute(array(':event_id' => $event_id));
//
//			$r = $p_upd_notifications->fetchAll();
//
//			$done = [];
//			foreach($r as $notification){
//				if ($notification['done'] == 1 || $notification['done'] == 'true'){
//					$done[$notification['type']] = $notification;
//				}
//			}
//
//			$done_count = count($done);
//
//			if ($done_count >= self::ORGANIZATION_NOTIFICATIONS_LIMIT){ // can't change, coz all done
//				return array();
//			}
//
//			foreach($result as $type => $val){ // switch off all not done
//				if ($val == false && !isset($done[$type])){ //not done and is true
//					$current[$type] = $val;
//				}
//			}
//
//			$switched_on = 0;
//			foreach($result as $type => $val) { // switch on till reach limit
//				if ($val == true
//					&& !isset($done[$type])
//					&& ($done_count + $switched_on) < self::ORGANIZATION_NOTIFICATIONS_LIMIT) {
//					$current[$type] = $val;
//					$switched_on++;
//				}
//			}
//		}
//		$final['notification-now'] = true; // NOW IS DEFAULT FOR ALL
//
//		$times = array();
//		$_offsets = self::getNotificationOffsets($db);
//		$offsets = array();
//
//		foreach($_offsets as $type){
//			$offsets[$type['type']] = $type['timediff'];
//		}
//
//
//		foreach($final as $type => $value){ // set times
//			if ($value == true && !isset($done[$type])){
//				if ($type == 'notification-now'){
//					$times[$type] = time() + $offsets[$type];
//				}else{
//					$times[$type] = $data['first_date']->getTimestamp() - $offsets[$type];
//				}
//			}
//		}
//
//		return array (
//			'types' => $final,
//			'times' => $times
//		);
//	}

	private static function sortDates(array $dates){
		function sortFunc($a, $b){
			$datea = strtotime($a['event_date']. ' ' . $a['start_time']);
			$dateb = strtotime($b['event_date']. ' ' . $b['start_time']);
			if ($datea == $dateb){
				return 0;
			}
			return ($datea < $dateb) ? -1 : 1;
		}

		usort($dates, "sortFunc");
		return $dates;
	}

	private static function getFirstDate(array $data){
		return new DateTime($data['dates'][0] . ' ' . $data['dates'][0]['start_time']);
	}

	private static function generateQueryData(&$data, PDO $db){
		$data['title'] = trim($data['title']);
		$data['description'] = trim($data['description']);
		$data['detail_info_url'] = trim($data['detail_info_url']);

		$data['location'] = isset($data['address']) ? trim($data['address']) : null;
		$data['latitude'] = isset($data['geo']['coordinates']['G']) ? $data['geo']['coordinates']['G'] : null;
		$data['longitude'] = isset($data['geo']['coordinates']['K']) ? $data['geo']['coordinates']['K'] : null;

		$data['file_names'] = $data['filenames'] ?? $data['file_names'];

		if (!isset($data['tags'])) throw new LogicException('Укажите хотя бы один тег');
		if (!is_array($data['tags'])) throw new LogicException('Укажите хотя бы один тег');

		try{
			if (isset($data['public_at']) && $data['public_at'] != null){
				$data['public_at'] =  new DateTime($data['public_at']);
			}else{
				$data['public_at'] =  new DateTime();
			}
			$data['notification_at'] = clone $data['public_at'];
			$data['notification_at']->modify('+10 minutes');
			$data['public_at'] = $data['public_at']->format('Y-m-d H:i:s');
		}catch(Exception $e){
			$data['public_at'] = null;
			$data['notification_at'] = (new DateTime())->modify('+10 minutes');
		}

		$data['registration_required'] = isset($data['registration_required']) && $data['registration_required'] == 'true' ? 'true' : 'false';

		try{
			if (isset($data['registration_required']) && $data['registration_required'] != null){
				$data['registration_till'] = isset($data['registration_till']) ? new DateTime($data['registration_till']) : null;
			}else{
				$data['registration_till'] =  null;
			}
		}catch(Exception $e){
			$data['registration_till'] =  null;
		}


		$data['dates'] = self::sortDates($data['dates']);
//		$data['first_date'] = self::getFirstDate($data);
		$data['is_free'] = isset($data['is_free']) && strtolower($data['is_free']) == 'true';
		$data['min_price'] = $data['is_free'] == true && is_numeric($data['min_price']) ? (int) $data['min_price'] : null;

	}

	public static function create(PDO $db, Organization $organization, array $data){

		try{
			$db->beginTransaction();

			if (!isset($data['dates']) || count($data['dates']) == 0)
				throw new InvalidArgumentException('Укажите, пожалуйста, даты','');

			$q_ins_event = App::queryFactory()->newInsert();
			$random_string = App::generateRandomString();
			$img_horizontal_filename = md5($random_string .  '-horizontal') .  '.' . $data['image_extensions']['horizontal'];
			$img_vertical_filename = md5($random_string . '-vertical') .  '.' . $data['image_extensions']['vertical'];

			self::generateQueryData($data, $db);

			$q_ins_event
				->into('events')
				->cols(array(
					'title' => $data['title'],
					'description' => $data['description'],
					'location' => $data['location'],
					'location_object' => json_encode($data['geo'] ?? ''),
					'creator_id' => intval($data['creator_id']),
					'organization_id' => $organization->getId(),
					'latitude' => is_numeric($data['latitude']) ? (float) $data['latitude'] : null,
					'longitude' => is_numeric($data['longitude']) ? (float) $data['longitude'] : null,
					'image_vertical' => $img_vertical_filename,
					'image_horizontal' => $img_horizontal_filename,
					'detail_info_url' => $data['detail_info_url'],
					'registration_required' => $data['registration_required'],
					'registration_till' => $data['registration_till'],
					'public_at' => $data['public_at'] instanceof DateTime ? $data['public_at']->format('Y-m-d H:i:s') : 'null',
					'is_free' => $data['is_free'] == 'true' ? 'true' : 'false',
					'min_price' => $data['min_price'],
					'status' => $data['public_at'] instanceof DateTime ? 'false' : 'true',
				))->returning(array('id'));

			$p_ins_event = $db->prepare($q_ins_event->getStatement());

			$result = $p_ins_event->execute($q_ins_event->getBindValues());

			if ($result === FALSE) throw new DBQueryException('CANT_CREATE_EVENT', $db);

			$result = $p_ins_event->fetch(PDO::FETCH_ASSOC);
			$event_id = $result['id'];

			self::saveDates($data['dates'], $db, $event_id);
			self::saveEventTags($db, $event_id, $data['tags']);
			self::saveNotifications($event_id, $data, $db);

			App::saveImage($data['image_horizontal'],
				self::IMAGES_PATH . self::IMG_SIZE_TYPE_LARGE . '/' . $img_horizontal_filename,
				14000);

			App::saveImage($data['image_vertical'],
				self::IMAGES_PATH . self::IMG_SIZE_TYPE_LARGE . '/' . $img_vertical_filename,
				14000);

			$db->commit();
			return new Result(true, 'Событие успешно создано', array('event_id' => $event_id));
		}catch(Exception $e){
			$db->rollBack();
			throw $e;
		}
	}


	private static function saveEventTags(PDO $db, $event_id, array $tags) {
		$p_upd = $db->prepare('UPDATE events_tags SET status = FALSE WHERE event_id = :event_id');
		$p_upd->execute(array(':event_id' => $event_id));

		$q_ins_tags = 'INSERT INTO events_tags(event_id, tag_id, status)
			VALUES(:event_id, :tag_id, TRUE)';
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
				':event_date' => $date['event_date'],
				':event_id' => $event_id,
				':start_time' => $date['start_time'],
				':end_time' => $date['end_time']
			));
		}
	}


	//TODO: Припилить платные аккаунты и их типы уведомлений
	private static function saveNotifications($event_id, array $data, PDO $db) {

		$notifications = NotificationsCollection::filter($db, App::getCurrentUser(),
			array('event' => EventsCollection::one($db, App::getCurrentUser(), $event_id, array())),
			array('notification_type', 'done'))->getData();


		if (count($notifications) > 0){
			foreach($notifications as $notification){
				if ($notification['notification_type'] == Notification::NOTIFICATION_TYPE_NOW
					&& $notification->getNotificationTime() < time()
					&& $notification->getDone() == false){

					$notification->setNotificationTime($data['notification_at']);
				}
			}
		}else{
			$q_ins_notification = App::queryFactory()->newInsert();

			$q_ins_notification
				->into('events_notifications')
				->cols(array(
					'event_id' => $event_id,
					'notification_type_id' => Notification::NOTIFICATION_TYPE_NOW_ID,
					'notification_time' => $data['notification_at']->format('Y-m-d H:i:s'),
					'status' => 'true',
					'done' => 'false'
				));

			$p_ins_notification = $db->prepare($q_ins_notification->getStatement());
			$p_ins_notification->execute($q_ins_notification->getBindValues());
		}


	}

	public function getDates(User $user = null, array $fields, array $pagination, $order_by){
		return EventsDatesCollection::filter($this->db,
			$user,
			array('event' => $this),
			$fields,
			$pagination,
			$order_by
		);
	}

	public function getTags(){
		if ($this->tags != null) return $this->tags;
		$this->tags = TagsCollection::filter($this->db,
			App::getCurrentUser(),
			array('event_id' => $this->getId())
		)->getData();
		return $this->tags;
	}

	public function getOrganization() : Organization{
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

	public function getParams(User $user = null, array $fields = null) : Result{

		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::DATES_FIELD_NAME])){
			$result_data[self::DATES_FIELD_NAME] = $this->getDates($user,
				Fields::parseFields($fields[self::DATES_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::DATES_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::DATES_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::DATES_FIELD_NAME]['order_by']))->getData();
		}

		if (isset($fields[self::FAVORED_USERS_FIELD_NAME])){
			$result_data[self::FAVORED_USERS_FIELD_NAME] = UsersCollection::filter($this->db, $user,
				array('event' => $this),
				Fields::parseFields($fields[self::FAVORED_USERS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::FAVORED_USERS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::FAVORED_USERS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::DATES_FIELD_NAME]['order_by'])
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
				Fields::parseOrderBy($fields[self::DATES_FIELD_NAME]['order_by']))->getData();
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
			ON CONFLICT(event_id, user_id) DO UPDATE status = TRUE';
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

		$q_upd_event = App::queryFactory()->newUpdate();

		$q_upd_event
			->table('events')
			->cols(array(
				'title' => $data['title'],
				'description' => $data['description'],
				'location' => $data['location'],
				'location_object' => json_encode($data['geo'] ?? ''),
				'creator_id' => intval($data['creator_id']),
				'organization_id' => $organization->getId(),
				'latitude' => is_numeric($data['latitude']) ? (float) $data['latitude'] : null,
				'longitude' => is_numeric($data['longitude']) ? (float) $data['longitude'] : null,
				'detail_info_url' => $data['detail_info_url'],
				'registration_required' => $data['registration_required'],
				'registration_till' => $data['registration_till'],
				'public_at' => $data['public_at'] instanceof DateTime ? $data['public_at']->format('Y-m-d H:i:s') : 'null',
				'is_free' => $data['is_free'] == 'true' ? 'true' : 'false',
				'min_price' => $data['min_price'],
				'status' => $data['public_at'] instanceof DateTime ? 'false' : 'true',
			));

		$q_upd_event_mysql = 'UPDATE events SET
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
				'vertical' => App::getImageExtension($data['file_names']['vertical']),
				'horizontal' => App::getImageExtension($data['file_names']['horizontal'])
			);
		}



		$query_data = array(
			':title' => $data['title'],
			':description' => $data['description'],
			':location' => $data['location'],
			':location_object' => json_encode($data['geo'] ?? ''),
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
			&& $data['image_extensions']['horizontal'] != null)
		{
			$img_horizontal_filename = md5(App::generateRandomString() . '-horizontal') .  '.' . $data['image_extensions']['horizontal'];
			$query_data[':image_horizontal'] = $img_horizontal_filename;
			$q_upd_event_mysql .= ' image_horizontal = :image_horizontal,';
			App::saveImage($data['files']['horizontal'], $img_horizontal_filename, 16000);
			$q_upd_event->cols(array(
				'image_horizontal' => $img_horizontal_filename
			));
		}

		if (isset($data['image_extensions'])
			&& isset($data['image_extensions']['vertical'])
			&& $data['image_extensions']['vertical'] != null)
		{
			$img_vertical_filename = md5(App::generateRandomString() . '-vertical') .  '.' . $data['image_extensions']['vertical'];
			$query_data[':image_vertical'] = $img_vertical_filename;
			$q_upd_event_mysql .= ' image_vertical = :image_vertical,';
			App::saveImage($data['files']['vertical'], $img_vertical_filename, 16000);
			$q_upd_event->cols(array(
				'image_vertical' => $img_vertical_filename
			));
		}

		$q_upd_event_mysql .= ' WHERE events.id = :event_id';

		$p_upd_event = $this->db->prepare($q_upd_event_mysql);
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

	/**
	 * @return mixed
	 */
	public function getTitle() {
		return $this->title;
	}



}