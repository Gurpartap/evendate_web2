<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/tags/Class.Tag.php';
require_once $BACKEND_FULL_PATH . '/tags/Class.TagsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.RegistrationForm.php';
require_once $BACKEND_FULL_PATH . '/events/Class.VkPost.php';
require_once $BACKEND_FULL_PATH . '/events/Class.RegistrationFieldsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.TicketType.php';
require_once $BACKEND_FULL_PATH . '/events/Class.TicketTypesCollection.php';

class Event extends AbstractEntity
{

	const IMAGES_PATH = '/event_images/';

	const IMG_VK_POST_COVER = 'vk';


	const IMG_ORIENTATION_TYPE_VERTICAL = 'vertical';
	const IMG_ORIENTATION_TYPE_HORIZONTAL = 'horizontal';


	const IMG_SIZE_TYPE_SMALL = 'small';
	const IMG_SIZE_TYPE_MEDIUM = 'medium';
	const IMG_SIZE_TYPE_LARGE = 'large';
	const IMG_SIZE_TYPE_SQUARE = 'square';

	const TAGS_LIMIT = 5;
	const ORGANIZATION_NOTIFICATIONS_LIMIT = 2;
	const IS_FAVORITE_FIELD_NAME = 'is_favorite';
	const IS_NOW_FIELD_NAME = 'is_now';
	const TICKETS_FIELD_NAME = 'tickets';
	const TICKETS_TYPES_FIELD_NAME = 'ticket_types';
	const IS_SEEN_FIELD_NAME = 'is_seen';
	const TAGS_FIELD_NAME = 'tags';
	const DATES_FIELD_NAME = 'dates';
	const FAVORED_USERS_FIELD_NAME = 'favored';
	const FAVORED_FRIENDS_COUNT_FIELD_NAME = 'favored_friends_count';
	const ACTUALITY_FIELD_NAME = 'actuality';
	const NOTIFICATIONS_FIELD_NAME = 'notifications';
	const CAN_EDIT_FIELD_NAME = 'can_edit';
	const VK_POST_LINK_FIELD_NAME = 'vk_post_link';

	/*ONLY FOR ADMINS*/
	const STATISTICS_FIELD_NAME = 'statistics';
	const REGISTERED_USERS_FIELD_NAME = 'registered_users';
	const ORDERS_COUNT_FIELD_NAME = 'orders_count';
	/*ONLY FOR ADMINS*/

	const REGISTRATION_FIELDS_FIELD_NAME = 'registration_fields';
	const IS_REGISTERED_FIELD_NAME = 'is_registered';
	const IS_HIDDEN_FIELD_NAME = 'is_hidden';
	const REGISTRATION_APPROVE_STATUS_FIELD_NAME = 'registration_approve_status';
	const ORDERS_FIELD_NAME = 'orders';
	const MY_TICKETS_COUNT_FIELD_NAME = 'my_tickets_count';
	const SOLD_TICKETS_COUNT_FIELD_NAME = 'sold_tickets_count';


	const RANDOM_FIELD_NAME = 'random';
	const RATING_OVERALL = 'rating';
	const RATING_FAVORED_FRIENDS = 'rating_favored_friends';
	const RATING_TAGS_IN_FAVORITES = 'rating_tags_in_favorites';
	const RATING_TAGS_IN_HIDDEN = 'rating_tags_in_hidden';
	const RATING_SUBSCRIBED_IN_SOCIAL_NETWORK = 'rating_subscribed_in_social_network';
	const RATING_RECENT_CREATED = 'rating_recent_created';
	const RATING_ACTIVE_DAYS = 'rating_active_days';
	const RATING_TEXT_SIMILARITY = 'rating_texts_similarity';
	const RATING_DATE_CREATION_LIMIT = 259200; // three days in seconds

	const MY_EVENTS_QUERY_PART = '
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
						AND hidden_events.user_id = :user_id))';

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
		'registration_since',
		'registration_till',
		'registration_approvement_required',
		'registration_limit_count',
		'registration_locally',
		'ticketing_locally',
		'is_free',
		'min_price',
		'vk_image_url',
		'registration_available',
//		'registered_count',

		self::IS_FAVORITE_FIELD_NAME => '(SELECT id IS NOT NULL
			FROM favorite_events
			WHERE favorite_events.status = TRUE
			AND favorite_events.user_id = :user_id
			AND favorite_events.event_id = view_events.id) IS NOT NULL AS ' . self::IS_FAVORITE_FIELD_NAME,

		self::IS_NOW_FIELD_NAME => '(SELECT (COUNT(id) > 0) :: BOOLEAN
			FROM events_dates
			WHERE events_dates.status = TRUE
			AND NOW() BETWEEN events_dates.start_time_utc AND events_dates.end_time_utc
			AND events_dates.event_id = view_events.id) :: BOOLEAN AS ' . self::IS_NOW_FIELD_NAME,

		self::IS_REGISTERED_FIELD_NAME => '(SELECT (COUNT(view_tickets_orders.id) > 0) :: BOOLEAN
			FROM view_tickets_orders
			WHERE
			 view_tickets_orders.user_id = :user_id
			 AND view_tickets_orders.event_id = view_events.id) :: BOOLEAN AS ' . self::IS_REGISTERED_FIELD_NAME,

		self::IS_HIDDEN_FIELD_NAME => '(SELECT (COUNT(hidden_events.id) > 0) :: BOOLEAN
			FROM hidden_events
			WHERE
			 hidden_events.user_id = :user_id
			 AND status = TRUE
			 AND hidden_events.event_id = view_events.id) :: BOOLEAN AS ' . self::IS_HIDDEN_FIELD_NAME,

		self::REGISTRATION_APPROVE_STATUS_FIELD_NAME => '(SELECT view_tickets_orders.status_type_code
			FROM view_tickets_orders
			WHERE view_tickets_orders.user_id = :user_id
			AND view_tickets_orders.event_id = view_events.id) AS ' . self::REGISTRATION_APPROVE_STATUS_FIELD_NAME,

		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_events AS ve
			WHERE ve.id = view_events.id) AS ' . self::RANDOM_FIELD_NAME,

		self::VK_POST_LINK_FIELD_NAME => '(SELECT \'https://vk.com/wall-\' || vk_groups.gid || \'_\' || vk_posts.post_id
			FROM vk_posts
			 INNER JOIN vk_groups ON vk_groups.gid::TEXT = vk_posts.group_id
			WHERE vk_posts.event_id = view_events.id
			) AS ' . self::VK_POST_LINK_FIELD_NAME,


		self::CAN_EDIT_FIELD_NAME => '(SELECT id IS NOT NULL
			FROM view_editors
			WHERE id = :user_id AND organization_id = view_events.organization_id) IS NOT NULL AS ' . self::CAN_EDIT_FIELD_NAME,

		self::SOLD_TICKETS_COUNT_FIELD_NAME => '(SELECT COALESCE(COUNT(view_tickets.id)::INT, 0)
			FROM view_tickets
			INNER JOIN events ON events.id = view_tickets.event_id
			INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id
			WHERE view_tickets.event_id = view_events.id 
			AND view_tickets.status = TRUE 
			AND users_organizations.status = TRUE 
			AND view_tickets.is_active = TRUE
			AND users_organizations.user_id = :user_id)::INT AS ' . self::SOLD_TICKETS_COUNT_FIELD_NAME,

		self::ORDERS_COUNT_FIELD_NAME => '(SELECT COALESCE(COUNT(view_tickets_orders.id)::INT, 0)
			FROM view_tickets_orders
			INNER JOIN events ON events.id = view_tickets_orders.event_id
			INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id
			WHERE view_tickets_orders.event_id = view_events.id 
			AND view_tickets_orders.status = TRUE 
			AND users_organizations.status = TRUE 
			AND users_organizations.user_id = :user_id)::INT AS ' . self::ORDERS_COUNT_FIELD_NAME,

		self::MY_TICKETS_COUNT_FIELD_NAME => '(SELECT COALESCE(COUNT(view_tickets.id)::INT, 0)
			FROM view_tickets
			WHERE view_tickets.event_id = view_events.id 
			AND status = TRUE 
			AND is_active = TRUE 
			AND view_tickets.user_id = :user_id)::INT AS ' . self::MY_TICKETS_COUNT_FIELD_NAME,

		self::ORDERS_COUNT_FIELD_NAME => '(SELECT COALESCE(COUNT(view_tickets.id)::INT, 0)
			FROM view_tickets
			WHERE view_tickets.event_id = view_events.id 
			AND status = TRUE 
			AND is_active = TRUE 
			AND view_tickets.user_id = :user_id)::INT AS ' . self::ORDERS_COUNT_FIELD_NAME,

		self::IS_SEEN_FIELD_NAME => '(
		SELECT
			COUNT(ve.id)
			FROM view_events ve
			WHERE
				ve.id = view_events.id
				AND
				ve.last_event_date > DATE_PART(\'epoch\', NOW()) :: INT
				AND ve.created_at > 
					COALESCE((SELECT DATE_PART(\'epoch\', stat_organizations.created_at)::INT
					    FROM stat_organizations
					    INNER JOIN stat_event_types ON stat_organizations.stat_type_id = stat_event_types.id
					    INNER JOIN tokens ON stat_organizations.token_id = tokens.id
					    WHERE type_code=\'view\'
					    AND organization_id = view_events.organization_id
					    AND tokens.user_id = :user_id
					    AND ve.id = view_events.id
					    ORDER BY stat_organizations.id DESC LIMIT 1),0)
				AND
				id NOT IN
					(SELECT event_id
						FROM view_stat_events
					WHERE
						user_id = :user_id
						AND event_id = view_events.id
					)
				) :: INT = 1 AS ' . self::IS_SEEN_FIELD_NAME,

		self::RATING_OVERALL => 'COALESCE((SELECT 
														(COALESCE(rating_favored_friends, 0)::INT + 
														COALESCE(rating_tags_in_favorites, 0)::INT - 
														COALESCE(rating_tags_in_hidden, 0)::INT + 
														COALESCE(rating_recent_created, 0)::INT + 
														COALESCE(rating_active_days, 0)::INT + 
														COALESCE(rating_texts_similarity, 0)::INT) AS ' . Event::RATING_OVERALL . '														
														FROM recommendations_events
														WHERE user_id = :user_id 
														AND event_id = view_events.id
                        ), 0) AS ' . self::RATING_OVERALL,

		self::FAVORED_FRIENDS_COUNT_FIELD_NAME => '(SELECT COUNT(id) :: INT AS favored_friends_count
            FROM favorite_events
                WHERE status = TRUE 
                    AND event_id = view_events.id 
                    AND favorite_events.user_id IN (SELECT friend_id FROM view_friends WHERE user_id = :user_id)) AS ' . self::FAVORED_FRIENDS_COUNT_FIELD_NAME,

		self::ACTUALITY_FIELD_NAME => '(
		(SELECT
                                CASE
                                WHEN DATE_PART(\'epoch\', NOW()) > ve.created_at + 259200 :: FLOAT     THEN 0
                                ELSE (259200 :: FLOAT - (DATE_PART(\'epoch\', NOW()) - ve.created_at)) :: FLOAT /     7200::FLOAT
                                END
                              FROM view_events AS ve
                              WHERE ve.id = view_events.id) :: FLOAT 
     + 
     (SELECT (CASE
                                          WHEN (ve.registration_required = TRUE AND     ve.registration_till < DATE_PART(\'epoch\', NOW())) THEN 1 / 1000
                                          ELSE (SELECT CASE WHEN COUNT(id) :: FLOAT = 0     THEN 1 / 1000     ELSE 1 / COUNT(id) :: FLOAT
                                                       END
                                                FROM events_dates
                                                WHERE     events_dates.event_id = ve.id
                                                          AND event_date > NOW()
                                                          AND event_date < (NOW() + INTERVAL \'10 days\')
                                                          AND status = TRUE )     END) :: FLOAT * 10
                              FROM view_events AS ve
                              WHERE ve.id = view_events.id) :: FLOAT
     )::FLOAT AS ' . self::ACTUALITY_FIELD_NAME
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
	protected $registration_till;
	protected $registration_required;
	protected $is_free;
	protected $min_price;
	protected $canceled;
	protected $ticketing_locally;
	protected $registration_locally;
	protected $tickets_count;

	private $tags;

	private $organization;

	public function __construct()
	{
		$this->db = App::DB();
	}

	private static function sortDates(array $dates)
	{

		foreach ($dates as $date) {
			if (strtotime($date['start_time']) > strtotime($date['end_time']))
				throw new LogicException('START_TIME_LESS_END_TIME');
		}

		function sortFunc($a, $b)
		{
			$datea = strtotime($a['event_date'] . ' ' . $a['start_time']);
			$dateb = strtotime($b['event_date'] . ' ' . $b['start_time']);
			if ($datea == $dateb) {
				return 0;
			}
			return ($datea < $dateb) ? -1 : 1;
		}

		usort($dates, "sortFunc");
		return $dates;
	}

	/**
	 * @return mixed
	 */
	public function getOrganizationId()
	{
		return $this->organization_id;
	}

	private static function updateExtremumDates($event_id, ExtendedPDO $db)
	{
		$q_upd_first = 'UPDATE events SET first_event_date = (SELECT MIN(start_time_utc)
     FROM events_dates
     WHERE event_id = :event_id AND events_dates.status = TRUE) WHERE id = :event_id';

		$q_upd_last = 'UPDATE events SET last_event_date = (SELECT MAX(start_time_utc)
     FROM events_dates
     WHERE event_id = :event_id AND events_dates.status = TRUE) WHERE id = :event_id';


		$db->prepareExecuteRaw($q_upd_first, array(':event_id' => $event_id), 'CANT_UPDATE_DATES');
		$db->prepareExecuteRaw($q_upd_last, array(':event_id' => $event_id), 'CANT_UPDATE_DATES');
	}

	private static function saveRegistrationInfo(ExtendedPDO $db, $event_id, array $data)
	{
		if (isset($data['registration_locally']) && filter_var($data['registration_locally'], FILTER_VALIDATE_BOOLEAN) == true) {
			RegistrationForm::create($event_id, $data['registration_fields'], $db);
		}
	}

	private static function saveTicketingInfo(ExtendedPDO $db, $event_id, $data)
	{

		$_ticket_types = TicketTypesCollection::filter($db,
			App::getCurrentUser(),
			array('event' => EventsCollection::one($db, App::getCurrentUser(), $event_id, array())),
			array()
		)->getData();

		$tickets_by_uuid = array();
		$registration_ticket = null;
		foreach ($_ticket_types as $type) {
			$tickets_by_uuid[$type['uuid']] = array(
				'data' => $type,
				'to_switch_off' => true,
				'uuid' => $type['uuid']
			);
			if ($type['type_code'] == 'registration') {
				$registration_ticket = $type;
			}
		}

		if (isset($data['ticketing_locally']) && filter_var($data['ticketing_locally'], FILTER_VALIDATE_BOOLEAN) == true) {
			foreach ($data['ticket_types'] as $ticket_type) {
				//it will auto update if ticket uuid is same
				TicketType::create($event_id, $ticket_type, $db);
				if (isset($ticket_type['uuid']) && isset($tickets_by_uuid[$ticket_type['uuid']])) {
					$tickets_by_uuid[$ticket_type['uuid']]['to_switch_off'] = false;
					TicketType::create($event_id, $ticket_type, $db);
				}
			}

			//TODO: update start_after_ticket_type_uuid fields
//			foreach ($data['ticket_types'] as $ticket_type) {
//				//it will auto update if ticket uuid is same
//				TicketType::create($event_id, $ticket_type, $db);
//			}
		} else {
			if (isset($data['registration_locally']) && filter_var($data['registration_locally'], FILTER_VALIDATE_BOOLEAN) == true) {
				TicketType::create($event_id, array(
					'uuid' => $registration_ticket['uuid'],
					'type_code' => 'registration',
					'name' => 'Регистрация на событие',
					'comment' => 'Регистрация на событие ' . $data['title'],
					'price' => 0,
					'sell_start_date' => $data['registration_since'] ?? null,
					'sell_end_date' => $data['registration_till'] ?? null,
					'amount' => $data['registration_limit_count'] ?? null,
					'min_count_per_user' => 1,
					'max_count_per_user' => 1
				), $db);
			}
		}
	}

	public function setCanceled(bool $value, User $user)
	{
		$q_upd_event = App::queryFactory()->newUpdate();
		if ($user->getEditorInstance()->isEditor($this->getOrganization()) == false) throw new PrivilegesException('CANT_CHANGE_THIS_EVENT', $this->db);

		$q_upd_event
			->table('events')
			->cols(array(
				'canceled' => $value ? 'TRUE' : 'FALSE'
			))
			->where('id = ?', $this->getId());
		$this->db->prepareExecute($q_upd_event, 'CANT_SET_TICKETING_INFO');
		self::saveNotifications($this->generateNotifications(array('canceled' => $value)), $this->db);
		return new Result(true, 'Данные успешно обновлены');
	}

	private static function getAvailableNotificationTime(ExtendedPDO $db, DateTime $dt, $organization_id): DateTime
	{
		$dt_clone = clone $dt;
		$q_get_notifications = App::queryFactory()
			->newSelect()
			->cols(array(
				'COUNT(events_notifications.id) AS notifications_count',
				'events_notifications.notification_time::DATE AS available_date'
			))
			->from('events_notifications')
			->join('inner', 'events', 'events.id=events_notifications.event_id')
			->where('organization_id = ?', $organization_id)
			->where('events_notifications.status = TRUE')
			->where('events_notifications.notification_time::DATE >= NOW()::DATE')
			->where('events_notifications.notification_type_id = ?', Notification::NOTIFICATION_TYPE_NOW_ID)
			->groupBy(array('events_notifications.notification_time::DATE'))
			->orderBy(array('available_date'));
		try {
			$p_get_notifications = $db->prepareExecute($q_get_notifications, 'CANT_GET_NOTIFICATION_TIME');
		} catch (Exception $e) {
			return $dt_clone;
		}
		if ($p_get_notifications->rowCount() == 0) return $dt_clone;
		$rows = $p_get_notifications->fetchAll();


		$dt_without_time = clone $dt_clone;
		$dt_without_time->setTime(0, 0, 0);

		foreach ($rows as $index => $row) {
			$_date_time = DateTime::createFromFormat('Y-m-d H:i:s', $row['available_date'] . ' 00:00:00');

			if ($dt_without_time < $_date_time && $index == 0) return $dt_clone;
			if ($row['notifications_count'] < 2) {
				return $dt_clone->setDate(
					intval($_date_time->format('Y')),
					intval($_date_time->format('m')),
					intval($_date_time->format('d'))
				);
			}
		}
		if (isset($_date_time) && $_date_time instanceof DateTime) {
			$_date_time->add(new DateInterval('P1D'));
			return $dt_clone->setDate(
				intval($_date_time->format('Y')),
				intval($_date_time->format('m')),
				intval($_date_time->format('d'))
			);
		} else return $dt_clone;
	}

	private static function generateQueryData(&$data)
	{
		if (isset($data['description'])) {
			if (mb_strlen($data['description']) <= 50) throw new InvalidArgumentException('TOO_SHORT_DESCRIPTION');
			if (mb_strlen($data['description']) > 1000) throw new InvalidArgumentException('TOO_LARGE_DESCRIPTION');
		}

		if (isset($data['title'])) {
			if (mb_strlen($data['title']) < 3) throw new InvalidArgumentException('TOO_SHORT_TITLE');
			if (mb_strlen($data['title']) > 150) throw new InvalidArgumentException('TOO_LARGE_TITLE');
		}

		function sortByStartTime($a, $b)
		{
			$a = strtotime($a['start_time']);
			$b = strtotime($b['start_time']);
			return $a - $b;
		}

		function sortByEndTime($a, $b)
		{
			$a = strtotime($a['end_time']);
			$b = strtotime($b['end_time']);
			return $a - $b;
		}

		$data['title'] = trim($data['title']);
		$data['description'] = trim($data['description']);
		$data['detail_info_url'] = trim($data['detail_info_url']);
		if (empty($data['detail_info_url'])) {
			$data['detail_info_url'] = null;
		} else {
			$data['detail_info_url'] = filter_var($data['detail_info_url'], FILTER_VALIDATE_URL, FILTER_NULL_ON_FAILURE);
		}

		$data['location'] = isset($data['address']) ? trim($data['address']) : $data['location'];
		$data['latitude'] = isset($data['geo']['coordinates']['G']) ? $data['geo']['coordinates']['G'] : null;
		$data['longitude'] = isset($data['geo']['coordinates']['K']) ? $data['geo']['coordinates']['K'] : null;

		$data['file_names'] = $data['filenames'] ?? $data['file_names'];
		$data['vk_post_id'] = $data['vk_post_id'] ?? null;

		if (!isset($data['tags']) || !is_array($data['tags'])) throw new LogicException('TAGS_SHOULD_NOT_BE_EMPTY');

		try {
			if (isset($data['public_at']) && $data['public_at'] != null) {
				$data['public_at'] = new DateTime($data['public_at']);
				if ($data['public_at'] < new DateTime()) {
					throw new InvalidArgumentException('PUBLIC_AT_LESS_NOW');
				}
				$data['notification_at'] = clone $data['public_at'];
				$data['notification_at']->modify('+10 minutes');
			} else {
				$data['public_at'] = null;
				$data['notification_at'] = (new DateTime())->modify('+10 minutes');
			}
		} catch (Exception $e) {
			$data['public_at'] = null;
			$data['notification_at'] = (new DateTime())->modify('+10 minutes');
		}

		$data['registration_required'] = isset($data['registration_required'])
		&& filter_var($data['registration_required'], FILTER_VALIDATE_BOOLEAN)
			? 'true' : 'false';

		$data['registration_locally'] = isset($data['registration_locally'])
		&& filter_var($data['registration_locally'], FILTER_VALIDATE_BOOLEAN)
			? 'true' : 'false';

		$data['ticketing_locally'] = isset($data['ticketing_locally'])
		&& filter_var($data['ticketing_locally'], FILTER_VALIDATE_BOOLEAN)
			? 'true' : 'false';

		$data['is_online'] = isset($data['is_online'])
		&& filter_var($data['is_online'], FILTER_VALIDATE_BOOLEAN)
			? 'true' : 'false';

		if ($data['registration_locally'] === 'true') {
			$data['registration_limit_count'] = isset($data['registration_limit_count'])
			&& is_numeric($data['registration_limit_count'])
				? filter_var($data['registration_limit_count'], FILTER_VALIDATE_INT) : null;

			$data['registration_approvement_required'] = isset($data['registration_approvement_required'])
			&& filter_var($data['registration_approvement_required'], FILTER_VALIDATE_BOOLEAN)
				? 'true' : 'false';

			if (!isset($data['registration_fields'])
				|| !is_array($data['registration_fields'])
				|| count($data['registration_fields']) < 1
			) throw new InvalidArgumentException('BAD_REGISTRATION_FIELDS');

			if ($data['ticketing_locally'] === 'true') {
				if (!isset($data['ticket_types'])
					|| !is_array($data['ticket_types'])
					|| count($data['ticket_types']) < 1
				) {
					throw new InvalidArgumentException('BAD_TICKET_TYPES');
				}
			}
		} else {
			$data['registration_limit_count'] = null;
			$data['registration_approvement_required'] = null;
			$data['ticketing_locally'] = 'false';
		}

		try {
			if (isset($data['registration_required']) && $data['registration_required'] != null) {
				$data['registration_till'] = isset($data['registration_till']) ? new DateTime($data['registration_till']) : null;
			} else {
				$data['registration_till'] = null;
			}
		} catch (Exception $e) {
			$data['registration_till'] = null;
		}

		try {
			if (isset($data['additional_notification_time']) && $data['additional_notification_time'] != null) {
				$data['additional_notification_time'] = isset($data['additional_notification_time']) ? new DateTime($data['additional_notification_time']) : null;
			} else {
				$data['additional_notification_time'] = null;
			}
		} catch (Exception $e) {
			$data['additional_notification_time'] = null;
		}


		if ($data['is_online'] === 'false') {
			if (is_null($data['location']) || empty($data['location'])) throw new InvalidArgumentException('LOCATION_IS_NULL');
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

		$data['latitude'] = is_numeric($data['latitude']) ? (float)$data['latitude'] : null;
		$data['longitude'] = is_numeric($data['longitude']) ? (float)$data['longitude'] : null;


		if (is_null($data['registration_till']) && $data['registration_locally'] === 'true') {
			$first_event = $data['dates'][0];
			$data['registration_till'] = new DateTime($first_event['event_date'] . ' ' . $first_event['start_time']);
		}

		if (!isset($data['is_free'])) {
			$data['is_free'] = 'true';
		} else {
			$data['is_free'] = filter_var($data['is_free'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
		}

		$data['min_price'] = $data['is_free'] == 'false' && is_numeric($data['min_price']) ? (int)$data['min_price'] : null;

		/*VK posting data*/
		$data['vk_post'] = isset($data['vk_post']) ? filter_var($data['vk_post'], FILTER_VALIDATE_BOOLEAN) : false;
	}

	public static function create(ExtendedPDO $db, Organization $organization, array $data)
	{
		try {
			$db->beginTransaction();

			$tariff_info = Tariff::getForOrganization($db, App::getCurrentUser(), array('organization' => $organization),
				Fields::parseFields('event_publications,available_event_publications,available_additional_notifications')
			)->getData();

			if ($tariff_info['event_publications'] >= $tariff_info['available_event_publications'])
				throw new LogicException('TARIFF_LIMITATIONS');

			if (!isset($data['dates']) || count($data['dates']) == 0)
				throw new InvalidArgumentException('NO_DATES_ERROR');

			$q_ins_event = App::queryFactory()->newInsert();
			$random_string = App::generateRandomString();
			$img_horizontal_filename = md5($random_string . '-horizontal') . '.' . $data['image_extensions']['horizontal'];
			$img_vertical_filename = 'default.jpeg';

			self::generateQueryData($data);

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
					'images_domain' => 'https://dn' . rand(1, 4) . '.evendate.io/',
					'image_vertical' => $img_vertical_filename,
					'image_horizontal' => $img_horizontal_filename,
					'detail_info_url' => $data['detail_info_url'],
					'registration_required' => $data['registration_required'],
					'registration_locally' => $data['registration_locally'],
					'ticketing_locally' => $data['ticketing_locally'],
					'registration_limit_count' => $data['registration_limit_count'],
					'registration_approvement_required' => $data['registration_approvement_required'],
					'registration_till' => $data['registration_till'] instanceof DateTime ? $data['registration_till']->format('Y-m-d H:i:s') : null,
					'public_at' => $data['public_at'] instanceof DateTime ? $data['public_at']->format('Y-m-d H:i:s') : null,
					'is_free' => $data['is_free'],
					'is_online' => $data['is_online'],
					'min_price' => $data['min_price'],
					'status' => $data['public_at'] instanceof DateTime ? 'false' : 'true',
				))->returning(array('id'));

			$p_ins_event = $db->prepareExecute($q_ins_event, 'CANT_CREATE_EVENT');


			$result = $p_ins_event->fetch(PDO::FETCH_ASSOC);
			$event_id = $result['id'];


			self::saveDates($data['dates'], $db, $event_id);
			self::saveEventTags($db, $event_id, $data['tags']);
			self::saveRegistrationInfo($db, $event_id, $data);
			self::saveTicketingInfo($db, $event_id, $data);
			$data['vk']['event_id'] = $event_id;
			if (isset($data['vk_post']) && isset($data['vk']) && $data['vk_post'] === true) {
				VkPost::create(
					$data['vk'],
					App::getCurrentUser()->getEditorInstance(),
					new \GuzzleHttp\Client()
				);
			}

			$notification_date = self::getAvailableNotificationTime($db, $data['notification_at'], $organization->getId());

			//dates are already sorted
			$first_date_string = $data['dates'][0]['event_date'] . ' ' . $data['dates'][0]['start_time'];

			//if available notification time > first event date, we should sent notification NOW
			if ($notification_date > (DateTime::createFromFormat('Y-m-d H:i', $first_date_string))) {
				$notification_date = $data['notification_at'];
			}

			self::saveNotifications(array(array(
				'event_id' => $event_id,
				'notification_type_id' => Notification::NOTIFICATION_TYPE_NOW_ID,
				'notification_time' => $notification_date->format('Y-m-d H:i:s'),
				'status' => 'TRUE',
				'done' => 'FALSE'
			)), $db);

			if (isset($data['registration_till'])
				&& $data['registration_required'] == true
			) {

				$registration_date = clone $data['registration_till'];
				self::saveNotifications(array(array(
					'event_id' => $event_id,
					'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_ONE_DAY_REGISTRATION_CLOSE, $db),
					'notification_time' => $registration_date->sub(new DateInterval('P1D'))->format('Y-m-d H:i:s'),
					'status' => 'TRUE',
					'done' => 'FALSE'
				)), $db);
			}

			if ($tariff_info['available_additional_notifications'] > 0 &&
				$data['additional_notification_time'] instanceof DateTime
			) {
				self::saveNotifications(array(array(
					'event_id' => $event_id,
					'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_ADDITIONAL_FOR_ORGANIZATION, $db),
					'notification_time' => $data['additional_notification_time']->format('Y-m-d H:i:s'),
					'status' => 'TRUE',
					'done' => 'FALSE'
				)), $db);
			}

			App::saveImage($data['image_horizontal'],
				self::IMAGES_PATH . self::IMG_SIZE_TYPE_LARGE . '/' . $img_horizontal_filename,
				50000);


			$db->commit();

			@file_get_contents(App::DEFAULT_NODE_LOCATION . '/utils/events/' . $event_id . '?is_new=true');
			return new Result(true, 'Событие успешно создано', array('event_id' => $event_id));
		} catch (Exception $e) {
			$db->rollBack();
			throw $e;
		}
	}

	private static function updateVkPostInformation(ExtendedPDO $db, $event_id, array $data)
	{
		if ($data['vk_post_id'] == null) return;
		$q_upd_vk_post = App::queryFactory()->newUpdate();
		$q_upd_vk_post
			->table('vk_posts')
			->cols(array(
				'event_id' => $event_id
			))
			->where('id = ?', $data['vk_post_id']);
		$db->prepareExecute($q_upd_vk_post);
	}

	private static function saveEventTags(ExtendedPDO $db, $event_id, array $tags)
	{

		$q_ins_tags = App::queryFactory()->newUpdate();
		$q_ins_tags->table('events_tags')
			->cols(array(
					'status' => 'FALSE'
				)
			)
			->set('updated_at', 'NOW()')
			->where('event_id = ?', $event_id);

		$p_upd = $db->prepareExecute($q_ins_tags, 'CANT_DISABLE_TAGS');
		$p_upd->execute();

		$q_ins_tags = 'INSERT INTO events_tags(event_id, tag_id, status)
			VALUES(:event_id, :tag_id, TRUE) RETURNING id';

		$inserted_count = 0;

		$rows = array();

		foreach ($tags as $name) {
			if (is_numeric($name)) {
				$tag_id = intval($name);
			} else {
				$tag_id = TagsCollection::create($db, $name)->getId();
			}

			if ($inserted_count == self::TAGS_LIMIT) break;
			$rows[] = (array(
				':event_id' => $event_id,
				':tag_id' => $tag_id
			));
			$inserted_count++;
		}
		$db->bulkPrepareExecuteRaw($q_ins_tags, $rows, 'CANT_INSERT_TAGS');
	}

	private static function saveDates($dates, ExtendedPDO $db, $event_id)
	{
		$q_upd_inactive = App::queryFactory()->newUpdate();
		$q_upd_inactive->table('events_dates')
			->cols(array(
				'status' => 'false'
			))
			->where('event_id = ?', $event_id);

		$db->prepareExecute($q_upd_inactive, 'CANT_UPDATE_EVENT_DATES');

		$q_ins_dates = 'INSERT INTO events_dates(event_date, status, event_id, start_time, end_time, start_time_utc, end_time_utc)
			VALUES(:event_date, TRUE, :event_id, :start_time, :end_time, :start_time_utc, :end_time_utc) RETURNING id';

		$q_timediff = App::queryFactory()->newSelect();
		$q_timediff->from('organizations')
			->cols(array('timediff_seconds'))
			->join('inner', 'cities', 'cities.id = organizations.city_id')
			->where('organizations.id = (SELECT organization_id FROM events WHERE id = ?)', $event_id);

		try {
			$res = $db->prepareExecute($q_timediff, 'CANT_GET_TIMEDIFF');
			$timediff = $res->fetchColumn(0);
		} catch (Exception $e) {
			$timediff = 0;
		}

		$rows = array();

		foreach ($dates as $date) {
			$_start_time = new DateTime($date['event_date'] . ' ' . $date['start_time']);
			$_end_time = new DateTime($date['event_date'] . ' ' . $date['end_time']);

			$_start_time->sub(new DateInterval('PT' . $timediff . 'S'));
			$_end_time->sub(new DateInterval('PT' . $timediff . 'S'));

			$rows[] = (array(
				':event_date' => $date['event_date'],
				':event_id' => $event_id,
				':start_time' => $date['start_time'],
				':end_time' => $date['end_time'],
				':start_time_utc' => $_start_time->format('Y-m-d H:i:s'),
				':end_time_utc' => $_end_time->format('Y-m-d H:i:s')
			));
		}

		$db->bulkPrepareExecuteRaw($q_ins_dates, $rows, 'CANT_INSERT_DATES');

		self::updateExtremumDates($event_id, $db);
	}

	private static function getNotificationTypeId($name, ExtendedPDO $db): int
	{
		$q_get_type_id = App::queryFactory()->newSelect();
		$q_get_type_id
			->from('notification_types')
			->cols(array('id'))
			->where(
				'type = ?', $name
			);
		$p_get_type_id = $db->prepareExecute($q_get_type_id, 'CANT_FIND_NOTIFICATION_TYPE_ID');

		if ($p_get_type_id->rowCount() != 1) throw new BadArgumentException('CANT_FIND_TYPE', App::DB(), $name);
		$rows = $p_get_type_id->fetchAll();

		return $rows[0]['id'];
	}

	private function getNotificationTypeOffset($name): int
	{
		$q_get_type_id = App::queryFactory()->newSelect();
		$q_get_type_id
			->from('notification_types')
			->cols(array('timediff'))
			->where(
				'type = ?', $name
			);
		$p_get_type_id = $this->db->prepareExecute($q_get_type_id, 'CANT_FIND_NOTIFICATION_TYPE');
		if ($p_get_type_id->rowCount() != 1) throw new LogicException('CANT_FIND_TYPE');
		$rows = $p_get_type_id->fetchAll();

		return $rows[0]['timediff'];
	}

	private function generateNotifications(array $data)
	{

		$q_get_notifications = App::queryFactory()->newSelect();

		$q_get_notifications
			->from('view_notifications')
			->cols(array(
				'uuid', 'user_id', 'event_id', 'done', 'sent_time', 'created_at', 'updated_at',
				'notification_time', 'status', 'events_notification_id', 'notification_type_id',
				'notification_type',
			))
			->where('event_id = ?', $this->id)
			->where('done = FALSE', $this->id)
			->where('user_id IS NULL');

		$p_get_notifications = $this->db->prepareExecute($q_get_notifications, 'CANT_GET_NOTIFICATIONS_FOR_CREATION');

		$notifications = $p_get_notifications->fetchAll();

		$existing_notification_types = array();

		foreach ($notifications as $note) {
			$existing_notification_types[$note['events_notification_id']] = $note['notification_type'];
		}

		$notifications_to_add = array();
		$current_dates = $this->getDates(App::getCurrentUser(), array('start_time', 'id', 'end_time'), array(), array('length' => 10000), array())->getData();

		if (isset($data['dates']) && count($data['dates']) != count($current_dates)
			&& !in_array(Notification::NOTIFICATION_TYPE_CHANGED_DATES, $existing_notification_types)
		) {
			$notifications_to_add[] = array(
				'event_id' => $this->id,
				'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_CHANGED_DATES, $this->db),
				'notification_time' => $data['notification_at']->format('Y-m-d H:i:s'),
				'status' => 'TRUE',
				'done' => 'FALSE'
			);
		} else if (isset($data['dates'])) {
			$inline_dates = array(
				'current' => array(),
				'updated' => array()
			);

			foreach ($current_dates as $date) {
				$inline_dates['current'][] = DateTime::createFromFormat('U', $date['event_date'])->format('Y-m-d') . $date['start_time'];
			}
			foreach ($data['dates'] as $date) {
				$inline_dates['updated'][] = $date['event_date'] . DateTime::createFromFormat('U', strtotime($date['start_time']))->format('H:i:s');
			}
			$not_same = array_intersect($inline_dates['current'], $inline_dates['updated']);
			if (count($inline_dates['current']) != count($not_same)
				&& !in_array(Notification::NOTIFICATION_TYPE_CHANGED_DATES, $existing_notification_types)
			) {

				$notifications_to_add[] = array(
					'event_id' => $this->id,
					'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_CHANGED_DATES, $this->db),
					'notification_time' => $data['notification_at']->format('Y-m-d H:i:s'),
					'status' => 'TRUE',
					'done' => 'FALSE'
				);
			}
		}
		if (isset($data['location']) &&
			$data['location'] != $this->location
			&& !in_array(Notification::NOTIFICATION_TYPE_CHANGED_LOCATION, $existing_notification_types)
		) {
			$notifications_to_add[] = array(
				'event_id' => $this->id,
				'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_CHANGED_LOCATION, $this->db),
				'notification_time' => $data['notification_at']->format('Y-m-d H:i:s'),
				'status' => 'TRUE',
				'done' => 'FALSE'
			);
		}
		if (isset($data['canceled']) &&
			$data['canceled'] == true
			&& !in_array(Notification::NOTIFICATION_TYPE_CANCELED, $existing_notification_types)
		) {
			$notifications_to_add[] = array(
				'event_id' => $this->id,
				'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_CANCELED, $this->db),
				'notification_time' => DateTime::createFromFormat('U', strtotime("+15 minutes"))->format('Y-m-d H:i:s'),
				'status' => 'TRUE',
				'done' => 'FALSE'
			);
		} elseif (
			isset($data['canceled']) &&
			$data['canceled'] == false &&
			in_array(Notification::NOTIFICATION_TYPE_CANCELED, $existing_notification_types)
		) {

			//cancel notification about event EVENT CANCELLATION

			$q_upd_notification = App::queryFactory()
				->newUpdate()
				->table('events_notifications')
				->cols(array(
					'done' => 'TRUE',
					'status' => 'FALSE',
				))->where(
					'id = ?', array_search(Notification::NOTIFICATION_TYPE_CANCELED, $existing_notification_types)
				);
			$p_upd_notification = $this->db->prepareExecute($q_upd_notification);

		}

		if (isset($data['registration_till'])
			&&
			$data['registration_till'] != null
			&&
			($data['registration_till']->getTimestamp() != $this->registration_till
				|| $data['registration_required'] != $this->registration_required)
			&& !in_array(Notification::NOTIFICATION_TYPE_CHANGED_REGISTRATION, $existing_notification_types)
		) {
			$notifications_to_add[] = array(
				'event_id' => $this->id,
				'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_CHANGED_REGISTRATION, $this->db),
				'notification_time' => $data['notification_at']->format('Y-m-d H:i:s'),
				'status' => 'TRUE',
				'done' => 'FALSE'
			);
		}

		if (isset($data['registration_till'])
			&& $data['registration_required'] == true
			&& !in_array(Notification::NOTIFICATION_TYPE_CHANGED_REGISTRATION, $existing_notification_types)
		) {

			$registration_date = clone $data['registration_till'];
			$notifications_to_add[] = array(
				'event_id' => $this->id,
				'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_CHANGED_REGISTRATION, $this->db),
				'notification_time' => $registration_date->sub(new DateInterval('P1D'))->format('Y-m-d H:i:s'),
				'status' => 'TRUE',
				'done' => 'FALSE'
			);
		} elseif (isset($data['registration_till'])
			&& $data['registration_required'] == true
			&& in_array(Notification::NOTIFICATION_TYPE_CHANGED_REGISTRATION, $existing_notification_types)
		) {
			$q_upd_notification = App::queryFactory()
				->newUpdate()
				->table('events_notifications')
				->cols(array(
					'done' => 'TRUE',
					'status' => 'FALSE',
				))->where(
					'id = ?', array_search(Notification::NOTIFICATION_TYPE_CHANGED_REGISTRATION, $existing_notification_types)
				);
			$this->db->prepareExecute($q_upd_notification, 'CANT_UPDATE_NOTIFICATION: registration_till');
		}


		if (isset($data['is_free']) &&
			($data['is_free'] != $this->is_free
				|| $data['min_price'] != $this->min_price)
			&& !in_array(Notification::NOTIFICATION_TYPE_CHANGED_PRICE, $existing_notification_types)
		) {
			$notifications_to_add[] = array(
				'event_id' => $this->id,
				'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_CHANGED_PRICE, $this->db),
				'notification_time' => $data['notification_at']->format('Y-m-d H:i:s'),
				'status' => 'TRUE',
				'done' => 'FALSE'
			);
		}

		return $notifications_to_add;
	}

	//TODO: Припилить платные аккаунты и их типы уведомлений

	private static function saveNotifications(array $notifications, ExtendedPDO $db)
	{
		$q_ins_notification = App::queryFactory()->newInsert();

		foreach ($notifications as $notification) {
			$q_ins_notification
				->into('events_notifications')
				->cols($notification);
			$db->prepareExecute($q_ins_notification, 'CANT_SAVE_NOTIFICATION');
		}

	}

	public function getDates(AbstractUser $user = null, array $fields, array $filters, array $pagination, $order_by)
	{
		$filters['event'] = $this;
		return EventsDatesCollection::filter($this->db,
			$user,
			array('event' => $this),
			$fields,
			$pagination,
			$order_by
		);
	}

	public function getTags()
	{
		if ($this->tags != null) return $this->tags;
		$this->tags = TagsCollection::filter($this->db,
			App::getCurrentUser(),
			array('event_id' => $this->getId())
		)->getData();
		return $this->tags;
	}

	public function getOrganization(): Organization
	{
		if ($this->organization instanceof Organization == false) {
			$this->organization = OrganizationsCollection::one(
				$this->db,
				App::getCurrentUser(),
				$this->organization_id,
				array()
			);
		}
		return $this->organization;
	}

	public function getNotifications(User $user, array $fields = null, $length = null, $offset = null, $order_by = null): Result
	{
		return NotificationsCollection::filter($this->db,
			$user,
			array('event' => $this),
			$fields,
			array(
				'length' => $length ?? $fields[self::NOTIFICATIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
				'offset' => $offset ?? $fields[self::NOTIFICATIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
			),
			$order_by ?? $fields[self::NOTIFICATIONS_FIELD_NAME]['order_by'] ?? array()
		);
	}

	public function getRegistrationFields(AbstractUser $user, array $fields = null, $order_by = null): Result
	{
		return RegistrationFieldsCollection::filter(
			$this->db,
			$user,
			array('event' => $this),
			Fields::parseFields($fields[self::REGISTRATION_FIELDS_FIELD_NAME]['fields'] ?? ''),
			array(),
			$order_by ?? $fields[self::REGISTRATION_FIELDS_FIELD_NAME]['order_by'] ?? array()
		);
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{

		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::DATES_FIELD_NAME])) {
			$result_data[self::DATES_FIELD_NAME] = $this->getDates($user,
				Fields::parseFields($fields[self::DATES_FIELD_NAME]['fields'] ?? 'start_time,end_time'),
				Fields::parseFilters($fields[self::DATES_FIELD_NAME]['filters'] ?? ''),
				array(
					'length' => $fields[self::DATES_FIELD_NAME]['length'] ?? 1000,
					'offset' => $fields[self::DATES_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::DATES_FIELD_NAME]['order_by'] ?? 'event_date'))->getData();
		}

		if (isset($fields[self::FAVORED_USERS_FIELD_NAME])) {
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

		if (isset($fields[self::TAGS_FIELD_NAME])) {
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
		if (isset($fields[self::ORDERS_FIELD_NAME]) && $user instanceof User) {
			if ($user->isAdmin($this->getOrganization())) {
				$result_data[self::ORDERS_FIELD_NAME] = OrdersCollection::filter($this->db,
					$user,
					array('event' => $this),
					Fields::parseFields($fields[self::ORDERS_FIELD_NAME]['fields'] ?? ''),
					array(
						'length' => $fields[self::ORDERS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $fields[self::ORDERS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
					),
					Fields::parseOrderBy($fields[self::ORDERS_FIELD_NAME]['order_by'] ?? ''))->getData();
			}
		}

		if (isset($fields[self::NOTIFICATIONS_FIELD_NAME])) {
			if ($user instanceof User) {
				$result_data[self::NOTIFICATIONS_FIELD_NAME] = $this->getNotifications($user,
					Fields::parseFields($fields[self::NOTIFICATIONS_FIELD_NAME]['fields'] ?? ''))->getData();
			} else {
				$result_data[self::NOTIFICATIONS_FIELD_NAME] = array();
			}
		}

		if (isset($fields[self::REGISTRATION_FIELDS_FIELD_NAME])) {
			$result_data[self::REGISTRATION_FIELDS_FIELD_NAME] = $this->getRegistrationFields($user,
				Fields::parseFields($fields[self::REGISTRATION_FIELDS_FIELD_NAME]['fields'] ?? ''))->getData();

		}

		if (isset($fields[self::STATISTICS_FIELD_NAME])) {
			if ($user instanceof User) {
				$result_data[self::STATISTICS_FIELD_NAME] = $this->getStatistics($user,
					Fields::parseFields($fields[self::NOTIFICATIONS_FIELD_NAME]['fields'] ?? ''))->getData();
			} else {
				$result_data[self::STATISTICS_FIELD_NAME] = null;
			}
		}


		if (isset($fields[self::REGISTERED_USERS_FIELD_NAME])) {
			if ($user instanceof User) {
				$result_data[self::REGISTERED_USERS_FIELD_NAME] = UsersCollection::filter(
					$this->db,
					$user,
					array_merge(Fields::parseFilters($fields[self::REGISTERED_USERS_FIELD_NAME]['filters'] ?? ''), array('registered_users' => $this)),
					Fields::parseFields($fields[self::REGISTERED_USERS_FIELD_NAME]['fields'] ?? ''),
					array(
						'length' => $length ?? $fields[self::REGISTERED_USERS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $offset ?? $fields[self::REGISTERED_USERS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
					),
					$order_by ?? $fields[self::REGISTERED_USERS_FIELD_NAME]['order_by'] ?? array()
				)->getData();
			} else {
				$result_data[self::REGISTERED_USERS_FIELD_NAME] = null;
			}
		}

		if (isset($fields[self::TICKETS_FIELD_NAME])) {
			if ($user instanceof User) {
				$ticket_fields = Fields::parseFields($fields[self::TICKETS_FIELD_NAME]['fields'] ?? '');
				$result_data[self::TICKETS_FIELD_NAME] = TicketsCollection::filter(
					$this->db,
					$user,
					array_merge(Fields::parseFilters($fields[self::TICKETS_FIELD_NAME]['filters'] ?? ''), array('event' => $this)),
					$ticket_fields,
					array(
						'length' => $length ?? $fields[self::TICKETS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $offset ?? $fields[self::TICKETS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
					),
					$order_by ?? Fields::parseOrderBy($fields[self::TICKETS_FIELD_NAME]['order_by'] ?? '') ?? array()
				);
				if ($result_data[self::TICKETS_FIELD_NAME] instanceof Ticket) {
					$result_data[self::TICKETS_FIELD_NAME] = $result_data[self::TICKETS_FIELD_NAME]->getParams($user, $ticket_fields)->getData();
				} else {
					$result_data[self::TICKETS_FIELD_NAME] = $result_data[self::TICKETS_FIELD_NAME]->getData();
				}
			} else {
				$result_data[self::TICKETS_FIELD_NAME] = null;
			}
		}

		if (isset($fields[self::TICKETS_TYPES_FIELD_NAME])) {
			$result_data[self::TICKETS_TYPES_FIELD_NAME] = TicketTypesCollection::filter(
				$this->db,
				$user,
				array('event' => $this),
				Fields::parseFields($fields[self::TICKETS_TYPES_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $length ?? $fields[self::TICKETS_TYPES_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $offset ?? $fields[self::TICKETS_TYPES_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				$order_by ?? Fields::parseOrderBy($fields[self::TICKETS_TYPES_FIELD_NAME]['order_by'] ?? '') ?? array()
			)->getData();
		}


		return new Result(true, '', $result_data);
	}

	public function hide(User $user)
	{
		$q_ins_hidden = 'INSERT INTO hidden_events(event_id, user_id, status)
			VALUES(:event_id, :user_id, TRUE)
			ON CONFLICT(event_id, user_id) DO UPDATE SET status = TRUE';
		$this->db->prepareExecuteRaw($q_ins_hidden, array(
			':event_id' => $this->getId(),
			':user_id' => $user->getId()
		), 'CANT_HIDE_EVENT');
		$user->deleteFavoriteEvent($this);
		return new Result(true, 'Событие успешно скрыто');
	}

	public function show(User $user)
	{
		$q_upd_hidden = 'UPDATE hidden_events
			SET status = FALSE
			WHERE user_id = :user_id AND
			event_id = :event_id
			';
		$this->db->prepareExecuteRaw($q_upd_hidden, array(
			':event_id' => $this->getId(),
			':user_id' => $user->getId()
		), 'CANT_REMOVE_HIDDEN');

		return new Result(true, 'Событие успешно удалено из скрытых');
	}

	public function update(array $data, Organization $organization, Editor $editor)
	{

		try {
			$this->db->beginTransaction();

			$tariff_info = Tariff::getForOrganization($this->db, App::getCurrentUser(), array('organization' => $organization),
				Fields::parseFields('event_publications,available_event_publications,available_additional_notifications')
			)->getData();


			$q_upd_event = App::queryFactory()->newUpdate();

			self::generateQueryData($data);

			$data['creator_id'] = $editor->getId();


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
					'location_updates' => 0,
					'detail_info_url' => $data['detail_info_url'],
					'registration_required' => $data['registration_required'],
					'registration_locally' => $data['registration_locally'],
					'ticketing_locally' => $data['ticketing_locally'],
					'registration_limit_count' => $data['registration_limit_count'],
					'registration_approvement_required' => $data['registration_approvement_required'],
					'registration_till' => $data['registration_till'] instanceof DateTime ? $data['registration_till']->format('Y-m-d H:i:s') : null,
					'public_at' => $data['public_at'] instanceof DateTime ? $data['public_at']->format('Y-m-d H:i:s') : null,
					'is_free' => $data['is_free'],
					'is_online' => $data['is_online'],
					'min_price' => $data['min_price'],
					'status' => $data['public_at'] instanceof DateTime ? 'false' : 'true',
				))
				->where('id = ?', $this->getId());


			if (isset($data['file_names'])) {
				$data['image_extensions'] = array(
					/*'vertical' => App::getImageExtension($data['file_names']['vertical']),*/
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
			) {
				$img_horizontal_filename = md5(App::generateRandomString() . '-horizontal') . '.' . $data['image_extensions']['horizontal'];
				$query_data[':image_horizontal'] = $img_horizontal_filename;
				App::saveImage($data['image_horizontal'],
					self::IMAGES_PATH . self::IMG_SIZE_TYPE_LARGE . '/' . $img_horizontal_filename,
					50000);
				$q_upd_event->cols(array(
					'image_horizontal' => $img_horizontal_filename
				));
			}


			$this->db->prepareExecute($q_upd_event, 'CANT_UPDATE_EVENT');

			self::saveEventTags($this->db, $this->getId(), $data['tags']);

			if (isset($data['dates']) && count($data['dates']) > 0) {
				self::saveDates($data['dates'], $this->db, $this->getId());
			}

			self::saveRegistrationInfo($this->db, $this->getId(), $data);
			self::saveTicketingInfo($this->db, $this->getId(), $data);
			self::saveNotifications($this->generateNotifications($data), $this->db);

			$this->db->commit();


			if ($tariff_info['available_additional_notifications'] > 0 &&
				$data['additional_notification_time'] instanceof DateTime
			) {
				if ($this->disableNotificationByType(self::getNotificationTypeId(
					Notification::NOTIFICATION_TYPE_ADDITIONAL_FOR_ORGANIZATION, $this->db
				))
				) {
					self::saveNotifications(array(array(
						'event_id' => $this->id,
						'notification_type_id' => self::getNotificationTypeId(Notification::NOTIFICATION_TYPE_ADDITIONAL_FOR_ORGANIZATION, $db),
						'notification_time' => $data['additional_notification_time']->format('Y-m-d H:i:s'),
						'status' => 'TRUE',
						'done' => 'FALSE'
					)), $db);
				}
			}


			@file_get_contents(App::DEFAULT_NODE_LOCATION . '/utils/events/' . $this->getId());
		} catch (Exception $e) {
			$this->db->rollback();
			throw $e;
		}

		return new Result(true, 'Событие успешно сохранено!', array('event_id' => $this->getId()));
	}


	private function disableNotificationByType($notification_type_id)
	{
		$q_upd = App::queryFactory();
		$q_upd->newUpdate()
			->table('events_notifications')
			->cols(array(
				'status' => 'false'
			))
			->where('event_id = ?', $this->id)
			->where('status IS FALSE')
			->where('done IS FALSE')
			->where('notification_type_id = ?', $notification_type_id);

		$res = $this->db->prepareExecute($q_upd, 'CANT_UPDATE_ADDITIONAL_NOTIFICATION');
		return $res->rowCount() == 1;

	}

	public function addNotification(UserInterface $user, array $notification)
	{
		$q_ins_notification = App::queryFactory()->newInsert();
		if (isset($notification['notification_type']) && $notification['notification_type'] != null) {
			//custom predefined notifications
			if (in_array($notification['notification_type'], Notification::NOTIFICATION_PREDEFINED_CUSTOM)) {
				$first_event_date = EventsDatesCollection::filter($this->db,
					$user,
					array('event' => $this, 'future' => 'true'),
					array('start_time', 'end_time'),
					array('length' => 1),
					array('event_date', 'start_time')
				)->getData();
				if (count($first_event_date) < 1) return false;
				$first_event_date = $first_event_date[0];
				$event_date = DateTime::createFromFormat('U', $first_event_date['event_date']);
				$first_event_date = DateTime::createFromFormat('Y-m-d H:i:s', $event_date->format('Y-m-d') . ' ' . $first_event_date['start_time']);
				$time = DateTime::createFromFormat('U', $first_event_date->getTimestamp() - $this->getNotificationTypeOffset($notification['notification_type']));
				$notification_type_id = $this->getNotificationTypeId($notification['notification_type'], $this->db);
			} // notifications for registration events
			elseif (in_array($notification['notification_type'], Notification::NOTIFICATION_REGISTRATION_TYPES)) {
				$time = new DateTime($notification['notification_time']);
				$notification_type_id = $this->getNotificationTypeId($notification['notification_type'], $this->db);
				$q_upd_notifications = App::queryFactory()
					->newUpdate()
					->table('users_notifications')
					->cols(array('status' => 'false'))
					->where('user_id = ? ', $user->getId())
					->where('event_id = ? ', $this->getId())
					->where('notification_type_id = ? ', $notification_type_id)
					->where('status = true')
					->where('done = false');
				$this->db->prepareExecute($q_upd_notifications, 'CANT_UPDATE_NOTIFICATIONS');
			} else throw new InvalidArgumentException('CANT_FIND_NOTIFICATION_TYPE');
		} // notifications by exact time
		elseif (isset($notification['notification_time'])) {
			$time = new DateTime($notification['notification_time']);
			$notification_type_id = $this->getNotificationTypeId(Notification::NOTIFICATION_TYPE_CUSTOM, $this->db);
		} else throw new InvalidArgumentException('BAD_NOTIFICATION_TIME');

		if ($time <= new DateTime()) throw new InvalidArgumentException('BAD_NOTIFICATION_TIME');

		$q_ins_notification
			->into('users_notifications')
			->cols(array(
				'user_id' => $user->getId(),
				'event_id' => $this->getId(),
				'notification_time' => $time->format('Y-m-d H:i:s'),
				'notification_type_id' => $notification_type_id,
				'status' => 'true',
				'done' => 'false',
				'sent_time' => null
			))
			->returning(array('uuid'));
		$p_ins = $this->db->prepareExecute($q_ins_notification, 'CANT_ADD_NOTIFICATION');
		$result = $p_ins->fetch(PDO::FETCH_ASSOC);
		$result['notification_time'] = $time->getTimestamp();
		return new Result(true, 'Уведомление успешно добавлено', $result);
	}

	public function isInUserFeed(User $user): Result
	{
		$q_get_in_feed = App::queryFactory()->newSelect();
		$q_get_in_feed->from('view_events')
			->cols(array('id'))
			->where(self::MY_EVENTS_QUERY_PART)
			->where('id = :event_id');

		$p_get_event = $this->db->prepareExecute($q_get_in_feed, 'CANT_DETERMINE_IS_IN_USER_FEED', array(
			':event_id' => $this->getId(),
			':user_id' => $user->getId()
		));
		return new Result(true, '', array('is_in_feed' => $p_get_event->rowCount() > 0));
	}

	public function isSeenByUser(User $user): Result
	{
		$q_get_is_seen = App::queryFactory()->newSelect();
		$q_get_is_seen
			->from('stat_events')
			->cols(array('stat_events.id'))
			->join('INNER', 'tokens', 'stat_events.token_id = tokens.id')
			->where('event_id = :event_id')
			->where('user_id = :user_id')
			->limit(1);

		$p_get_event = $this->db->prepareExecute($q_get_is_seen, 'CANT_GET_IS_SEEN_BY_USER', array(
			':event_id' => $this->getId(),
			':user_id' => $user->getId()
		));
		return new Result(true, '', array('is_seen' => $p_get_event->rowCount() > 0));
	}

	public function getTicketingLocally()
	{
		return $this->ticketing_locally;
	}

	private function getRegistrationAvailable()
	{
		$q_get_available = App::queryFactory()
			->newSelect();
		$q_get_available->from('view_events')
			->cols(array('registration_available'))
			->where('id = ?', $this->getId());
		$p_get_available = $this->db->prepareExecute($q_get_available, 'CANT_GET_AVAILABILITY');
		if ($p_get_available->rowCount() != 1) throw new InvalidArgumentException('BAD_EVENT_ID');
		return $p_get_available->fetchColumn(0);
	}

	public function registerUser(AbstractUser $user, array $request)
	{
		$filled_fields = $request['registration_fields'];
		if ($user instanceof User === false) throw new PrivilegesException('NOT_AUTHORIZED_FOR_REGISTRATION', $this->db);
		if ($this->registration_locally == false) throw new InvalidArgumentException('REGISTRATION_NOT_AVAILABLE');
		if ($this->getRegistrationAvailable() == false) throw new InvalidArgumentException('REGISTRATION_FINISHED');
		$fields = $this->getRegistrationFields($user)->getData();
		$merged_fields = [];
		$return_fields = [];

		foreach ($fields as $field) {
			$merged_fields[$field['uuid']] = $field;
		}

		foreach ($filled_fields as $filled_field) {
			if (isset($merged_fields[$filled_field['uuid']])) {
				if (!is_array($filled_field['value'])) {
					$merged_fields[$filled_field['uuid']]['value'] = trim($filled_field['value']);
				} else {
					$merged_fields[$filled_field['uuid']]['value'] = $filled_field['value'];
				}
			}
		}

		$errors = array();

		foreach ($merged_fields as $key => $final_field) {

			if ($final_field['required'] == true) {
				if (!isset($final_field['value'])
					|| (is_array($final_field['value']) && count($final_field['value']) < 1)
					|| (!is_array($final_field['value']) && empty($final_field['value']))
				) {
					$final_field['error'] = 'Поле обязательно для заполнения';
					$errors[] = $final_field;
				}
			}

			switch ($final_field['type']) {
				case 'email': {
					if ($final_field['required'] == true) {
						if (filter_var($final_field['value'], FILTER_VALIDATE_EMAIL) == FALSE) {
							$final_field['error'] = 'Укажите, пожалуйста, валидный E-mail.';
							$errors[] = $final_field;
						}
					}
					break;
				}

				case 'select_multi':
				case 'select': {
					if ($final_field['required'] == true) {
						if ($final_field['type'] == 'select') {
							if (is_array($final_field['value'])) {
								if (count($final_field['value']) != 1) {
									$final_field['error'] = 'Укажите, пожалуйста, валидные значения.';
									$errors[] = $final_field;
									$final_field['value'] = null;
									break;
								}
							} elseif ($final_field['value'] == null) {
								$final_field['error'] = 'Укажите, пожалуйста, валидные значения.';
								$errors[] = $final_field;
								$final_field['value'] = null;
								break;
							}
						}
					} elseif ($final_field['value'] == null) {
						break;
					}

					$possible_by_uuid = array();

					foreach ($final_field['values'] as $possible) {
						$possible_by_uuid[$possible['uuid']] = $possible;
					}

					$final_field['value'] = array_unique($final_field['value'], SORT_STRING);
					$final_field['ins_values'] = array();
					foreach ($final_field['value'] as $selected) {
						if (!isset($possible_by_uuid[$selected])) {
							$final_field['error'] = 'Выбранное значение отсутствует в списке возможных.';
							$errors[] = $final_field;
						} else {
							$final_field['ins_values'][] = array(
								'uuid' => $selected,
								'value' => $possible_by_uuid[$selected]['value']
							);
						}
					}
					$final_field['value'] = null;
					break;
				}

			}
			$merged_fields[$key] = $final_field;
			$return_fields[] = $final_field;
		}
		if (count($errors) > 0) return new Result(false, 'Возникла ошибка во время регистрации', array('registration_fields' => $return_fields));

		if (isset($this->registration_approvement_required)) {
			$approve_required = $this->registration_approvement_required;
		} else {
			$q_get_approve_information = App::queryFactory()->newSelect();
			$q_get_approve_information->cols(array('registration_approvement_required'))
				->from('view_events')
				->where('id = ?', $this->id);
			$approve_required = $this->db->prepareExecute($q_get_approve_information)->fetchColumn(0);
		}


		if ($this->ticketing_locally == false) {
			if (!isset($request['tickets']) || !is_array($request['tickets'])) {
				$request['tickets'] = array(array(
					'count' => '1',
				));
			}
		}

		$order_info = RegistrationForm::processOrder($this, $user, $this->db, $request['tickets']);
		$result = RegistrationForm::registerUser($order_info['order_info']['id'], $user, $this, $merged_fields, $approve_required);

		$order = OrdersCollection::oneByUUID($this->db,
			$user,
			$order_info['order_info']['uuid'],
			array());

		if ($result->getStatus()) {
			try {
				$user->addFavoriteEvent($this);
				$this->addNotification($user, array('notification_type' => 'notification-before-day'));
			} catch (Exception $e) {
			}

		}

		return new Result(true, '', array(
			'registration_fields' => $return_fields,
			'order' => $order->getParams($user, Order::getDefaultCols())->getData(),
			'tickets' => TicketsCollection::filter($this->db, $user, array('order' => $order), array())->getData()
		));
	}

}