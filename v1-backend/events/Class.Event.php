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
	const RANDOM_FIELD_NAME = 'random';


	protected static $DEFAULT_COLS = array(
		'id',
		'title',
		'first_event_date',
		'last_event_date',
		'nearest_event_date',
		'image_vertical_url',
		'image_horizontal_url',
		'organization_id',
		'canceled',
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
		'image_square_vertical_url',
		'image_square_horizontal_url',
		'organization_name',
		'organization_type_name',
		'organization_short_name',
		'organization_logo_large_url',
		'organization_logo_medium_url',
		'organization_logo_small_url',
		'is_same_time',
		'created_at',
		'updated_at',
		'favored_users_count',

		'public_at',
		'registration_required',
		'registration_till',
		'is_free',
		'min_price',
		'vk_image_url',

		self::IS_FAVORITE_FIELD_NAME => '(SELECT id IS NOT NULL
			FROM favorite_events
			WHERE favorite_events.status = TRUE
			AND favorite_events.user_id = :user_id
			AND favorite_events.event_id = view_events.id) IS NOT NULL AS is_favorite',
		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_events AS ve
			WHERE ve.id = view_events.id) AS random',
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

	private static function sortDates(array $dates){

		foreach($dates as $date){
			if (strtotime($date['start_time']) > strtotime($date['end_time']))
				throw new LogicException('Время начала не может быть больше времени окончания события');
		}

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

	public function setCanceled(bool $value, User $user){
        $q_upd_event = App::queryFactory()->newUpdate();
		if ($user->getEditorInstance()->isEditor($this->getOrganization()) == false) throw new PrivilegesException('', $this->db);

        $q_upd_event
            ->table('events')
            ->cols(array(
                'canceled' => $value
            ))
            ->where('id = ?', $this->getId());
        $p_upd = $this->db->prepare($q_upd_event->getStatement());
        $result = $p_upd->execute($q_upd_event->getBindValues());
        if ($result === FALSE) throw new DBQueryException('CANT_UPDATE_EVENT', $this->db);
        return new Result(true, 'Данные успешно обновлены');
	}

	private static function generateQueryData(&$data){


		if (isset($data['description'])){
			if (mb_strlen($data['description']) <= 50) throw new InvalidArgumentException('Слишком короткое описание. Должно быть не менее 50 символов.');
			if (mb_strlen($data['description']) > 500) throw new InvalidArgumentException('Слишком длинное описание. Должно быть не более 500 символов.');
		}

		if (isset($data['title'])){
			if (mb_strlen($data['title']) <= 5) throw new InvalidArgumentException('Слишком короткое название. Должно быть не менее 5 символов.');
			if (mb_strlen($data['title']) > 500) throw new InvalidArgumentException('Слишком длинное название. Должно быть не более 150 символов.');
		}

		function sortByStartTime($a, $b){
			$a = strtotime($a['start_time']);
			$b = strtotime($b['start_time']);
			return $a - $b;
		}
		function sortByEndTime($a, $b){
			$a = strtotime($a['end_time']);
			$b = strtotime($b['end_time']);
			return $a - $b;
		}

		$data['title'] = trim($data['title']);
		$data['description'] = trim($data['description']);
		$data['detail_info_url'] = trim($data['detail_info_url']);

		$data['location'] = isset($data['address']) ? trim($data['address']) : $data['location'];
		$data['latitude'] = isset($data['geo']['coordinates']['G']) ? $data['geo']['coordinates']['G'] : null;
		$data['longitude'] = isset($data['geo']['coordinates']['K']) ? $data['geo']['coordinates']['K'] : null;

		$data['file_names'] = $data['filenames'] ?? $data['file_names'];
		$data['vk_post_id'] = $data['vk_post_id'] ?? null;

		if (!isset($data['tags'])) throw new LogicException('Укажите хотя бы один тег');
		if (!is_array($data['tags'])) throw new LogicException('Укажите хотя бы один тег');

		try{
			if (isset($data['public_at']) && $data['public_at'] != null){
				$data['public_at'] = new DateTime($data['public_at']);
				if ($data['public_at'] < new DateTime()){

				}
			}else{
				$data['public_at'] = new DateTime();
			}
			$data['notification_at'] = clone $data['public_at'];
			$data['notification_at']->modify('+10 minutes');
			$data['public_at'] = $data['public_at']->format('Y-m-d H:i:s');
		}catch(Exception $e){
			$data['public_at'] = null;
			$data['notification_at'] = (new DateTime())->modify('+10 minutes');
		}

		$data['registration_required'] = isset($data['registration_required'])
			&& (strtolower($data['registration_required']) == 'true'
				|| strtolower($data['registration_required']) == '1')
					? 'true' : 'false';

		try{
			if (isset($data['registration_required']) && $data['registration_required'] != null){
				$data['registration_till'] = isset($data['registration_till']) ? new DateTime($data['registration_till']) : null;
			}else{
				$data['registration_till'] =  null;
			}
		}catch(Exception $e){
			$data['registration_till'] =  null;
		}

		$sorted_by_start_time = $data['dates'];
		$sorted_by_end_time = $data['dates'];

		usort($sorted_by_start_time, 'sortByStartTime');
		usort($sorted_by_end_time, 'sortByEndTime');

		$data['dates'] = self::sortDates($data['dates']);
		$data['begin_time'] = DateTime::createFromFormat('H:i', $sorted_by_start_time[0]['start_time']);
		$data['end_time'] = DateTime::createFromFormat('H:i', $sorted_by_end_time[count($sorted_by_end_time) - 1]['end_time']);

		$data['begin_time'] = $data['begin_time']->format('H:i:s');
		$data['end_time'] = $data['end_time']->format('H:i:s');

		$data['latitude'] = is_numeric($data['latitude']) ? (float) $data['latitude'] : null;
		$data['longitude'] = is_numeric($data['longitude']) ? (float) $data['longitude'] : null;

		$data['is_free'] = isset($data['is_free']) && strtolower($data['is_free']) == 'true';
		$data['min_price'] = $data['is_free'] == false && is_numeric($data['min_price']) ? (int) $data['min_price'] : null;

		/*VK posting data*/
		$data['vk_post'] = $data['is_free'] == true && is_numeric($data['min_price']) ? (int) $data['min_price'] : null;
	}

	public static function create(PDO $db, Organization $organization, array $data){

		try{

			$db->beginTransaction();
			if (!isset($data['dates']) || count($data['dates']) == 0)
				throw new InvalidArgumentException('Укажите, пожалуйста, даты','Укажите, пожалуйста, даты');

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
					'latitude' => $data['latitude'],
					'longitude' => $data['longitude'],
					'image_vertical' => $img_vertical_filename,
					'image_horizontal' => $img_horizontal_filename,
					'detail_info_url' => $data['detail_info_url'],
					'registration_required' => $data['registration_required'],
					'registration_till' => $data['registration_till'] instanceof DateTime ? $data['registration_till']->format('Y-m-d H:i:s') : null,
					'public_at' => $data['public_at'] instanceof DateTime ? $data['public_at']->format('Y-m-d H:i:s') : null,
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
			self::updateVkPostInformation($db, $event_id, $data);

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

	private static function updateVkPostInformation(PDO $db, $event_id, array $data){
		if ($data['vk_post_id'] == null) return;
		$q_upd_vk_post = App::queryFactory()->newUpdate();
		$q_upd_vk_post
			->table('vk_posts')
			->cols(array(
				'event_id' => $event_id
			))
			->where('id = ?', $data['vk_post_id']);
		$p_upd_post = $db->prepare($q_upd_vk_post->getStatement());
		$result = $p_upd_post->execute($q_upd_vk_post->getBindValues());
	}

	private static function saveEventTags(PDO $db, $event_id, array $tags) {

		$p_upd = $db->prepare('UPDATE events_tags SET status = FALSE WHERE event_id = :event_id');
		$p_upd->execute(array(':event_id' => $event_id));

		$q_ins_tags = 'INSERT INTO events_tags(event_id, tag_id, status)
			VALUES(:event_id, :tag_id, TRUE) RETURNING id';
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

			$result = $p_ins_tags->fetch(PDO::FETCH_ASSOC);

			$inserted_count++;
		}
	}

	private static function saveDates($dates, PDO $db, $event_id) {
		$p_set_inactive = $db->prepare('UPDATE events_dates SET status = FALSE WHERE event_id = :event_id');
		$p_set_inactive->execute(array(':event_id' => $event_id));

		$q_ins_dates = 'INSERT INTO events_dates(event_date, status, event_id, start_time, end_time)
			VALUES(:event_date, TRUE, :event_id, :start_time, :end_time) RETURNING id';
		$p_ins_dates = $db->prepare($q_ins_dates);

		foreach($dates as $date){
			$p_ins_dates->execute(array(
				':event_date' => $date['event_date'],
				':event_id' => $event_id,
				':start_time' => $date['start_time'],
				':end_time' => $date['end_time']
			));

			$result = $p_ins_dates->fetch(PDO::FETCH_ASSOC);
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
					'status' => 'TRUE',
					'done' => 'FALSE'
				));

			$p_ins_notification = $db->prepare($q_ins_notification->getStatement());
			$p_ins_notification->execute($q_ins_notification->getBindValues());
		}


	}

	public function getDates(User $user = null, array $fields, array $filters, array $pagination, $order_by){
		$filters['event'] = $this;
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
			$this->organization = OrganizationsCollection::one(
				$this->db,
				App::getCurrentUser(),
				$this->organization_id,
				array()
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
				Fields::parseFields($fields[self::DATES_FIELD_NAME]['fields'] ?? 'start_time,end_time'),
				Fields::parseFilters($fields[self::DATES_FIELD_NAME]['filters'] ?? ''),
				array(
					'length' => $fields[self::DATES_FIELD_NAME]['length'] ?? 1000,
					'offset' => $fields[self::DATES_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::DATES_FIELD_NAME]['order_by'] ?? 'event_date'))->getData();
		}

		if (isset($fields[self::FAVORED_USERS_FIELD_NAME])){
			$result_data[self::FAVORED_USERS_FIELD_NAME] = UsersCollection::filter($this->db, $user,
				array('event' => $this),
				Fields::parseFields($fields[self::FAVORED_USERS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::FAVORED_USERS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::FAVORED_USERS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::FAVORED_USERS_FIELD_NAME]['order_by'] ?? '')
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
				Fields::parseOrderBy($fields[self::TAGS_FIELD_NAME]['order_by'] ?? ''))->getData();
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
			ON CONFLICT(event_id, user_id) DO UPDATE SET status = TRUE';
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

		try{
			$q_upd_event = App::queryFactory()->newUpdate();

			self::generateQueryData($data, $this->db);

			$data['creator_id'] = $editor->getId();

			$this->db->beginTransaction();

			$q_upd_event
				->table('events')
				->cols(array(
					'title' => $data['title'],
					'description' => $data['description'],
					'location' => $data['location'],
					'location_object' => json_encode($data['geo'] ?? ''),
					'creator_id' => intval($data['creator_id']),
					'organization_id' => $organization->getId(),
					'latitude' => $data['latitude'],
					'longitude' => $data['longitude'],
					'detail_info_url' => $data['detail_info_url'],
					'registration_required' => $data['registration_required'],
					'registration_till' => $data['registration_till'] instanceof DateTime ? $data['registration_till']->format('Y-m-d H:i:s') : null,
					'public_at' => $data['public_at'] instanceof DateTime ? $data['public_at']->format('Y-m-d H:i:s') : null,
					'is_free' => $data['is_free'] == 'true' ? 'true' : 'false',
					'min_price' => $data['min_price'],
					'status' => $data['public_at'] instanceof DateTime ? 'false' : 'true',
				))
				->where('id = ?', $this->getId());



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
				':creator_id' => $editor->getId(),
				':organization_id' => $organization->getId(),
				':detail_info_url' => $data['detail_info_url'],
				':begin_time' => $data['begin_time'],
				':end_time' => $data['end_time'],
				':event_id' => $this->getId()
			);

			if (isset($data['image_extensions'])
				&& isset($data['image_extensions']['horizontal'])
				&& $data['image_extensions']['horizontal'] != null
				&& !empty($data['image_extensions']['horizontal'])
				&& $data['image_horizontal'] != null
			)
			{
				$img_horizontal_filename = md5(App::generateRandomString() . '-horizontal') .  '.' . $data['image_extensions']['horizontal'];
				$query_data[':image_horizontal'] = $img_horizontal_filename;
				App::saveImage($data['image_horizontal'],
					self::IMAGES_PATH . self::IMG_SIZE_TYPE_LARGE . '/' . $img_horizontal_filename,
					14000);
				$q_upd_event->cols(array(
					'image_horizontal' => $img_horizontal_filename
				));
			}

			if (isset($data['image_extensions'])
				&& isset($data['image_extensions']['vertical'])
				&& $data['image_extensions']['vertical'] != null
				&& !empty($data['image_extensions']['vertical'])
				&& $data['image_vertical'] != null)
			{
				$img_vertical_filename = md5(App::generateRandomString() . '-vertical') .  '.' . $data['image_extensions']['vertical'];
				$query_data[':image_vertical'] = $img_vertical_filename;

				App::saveImage($data['image_vertical'],
					self::IMAGES_PATH . self::IMG_SIZE_TYPE_LARGE . '/' . $img_vertical_filename,
					14000);
				$q_upd_event->cols(array(
					'image_vertical' => $img_vertical_filename
				));
			}

			$p_upd_event = $this->db->prepare($q_upd_event->getStatement());

			$result =$p_upd_event->execute($q_upd_event->getBindValues());


			if ($result === FALSE) throw new DBQueryException(implode(';', $this->db->errorInfo()), $this->db);

			self::saveEventTags($this->db, $this->getId(), $data['tags']);
			if (isset($data['dates']) && count($data['dates']) > 0){
				self::saveDates($data['dates'], $this->db, $this->getId());
			}


			self::saveNotifications($this->getId(), $data, $this->db);
			self::updateVkPostInformation($this->db, $this->getId(), $data);

			$this->db->commit();
		}catch(Exception $e){
			$this->db->rollback();
			throw $e;
		}

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