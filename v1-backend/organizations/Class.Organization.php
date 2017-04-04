<?php


require_once $BACKEND_FULL_PATH . '/bin/Class.AbstractEntity.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.CitiesCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.CountriesCollection.php';

class Organization extends AbstractEntity
{


	const SUBSCRIBED_FIELD_NAME = 'subscribed';
	const EVENTS_FIELD_NAME = 'events';
	const SUBSCRIPTION_ID_FIELD_NAME = 'subscription_id';
	const IS_SUBSCRIBED_FIELD_NAME = 'is_subscribed';
	const NEW_EVENTS_COUNT_FIELD_NAME = 'new_events_count';
	const ACTUAL_EVENTS_COUNT_FIELD_NAME = 'actual_events_count';
	const STAFF_FIELD_NAME = 'staff';
	const IS_NEW_FIELD_NAME = 'is_new';
	const PRIVILEGES_FIELD_NAME = 'privileges';
	const CITY_FIELD_NAME = 'city';
	const COUNTRY_FIELD_NAME = 'country';

	const IMAGES_PATH = 'organizations_images/';
	const IMAGE_SIZE_LARGE = '/large/';
	const IMAGE_TYPE_BACKGROUND = '/backgrounds/';
	const IMAGE_TYPE_LOGO = '/logos/';
	const RANDOM_FIELD_NAME = 'random';
	const DEFAULT_LOGO_FILENAME = 'logo.png';
	const DEFAULT_BACKGROUND_FILENAME = 'background.jpg';


	const RATING_OVERALL = 'rating';
	const RATING_SUBSCRIBED_FRIENDS = 'rating_subscribed_friends';
	const RATING_ACTIVE_EVENTS = 'rating_active_events_count';
	const RATING_LAST_EVENTS_COUNT = 'rating_last_events_count';
	const RATING_SUBSCRIBED_IN_SOCIAL_NETWORK = 'rating_subscribed_in_social_network';
	const RATING_TEXT_SIMILARITY = 'rating_texts_similarity';
	const ORGANIZATION_STATE_ON_MODERATION = 0;
	const ORGANIZATION_STATE_SHOWN = 1;

	protected $description;
	protected $background_medium_img_url;
	protected $background_small_img_url;
	protected $img_medium_url;
	protected $img_small_url;
	protected $site_url;
	protected $name;
	protected $type_id;
	protected $img_url;
	protected $background_img_url;
	protected $status;
	protected $short_name;
	protected $type_name;
	protected $organization_type_order;
	protected $organization_type_id;
	protected $updated_at;
	protected $created_at;
	protected $subscribed_count;
	protected $is_subscribed;


	protected $db;

	protected static $DEFAULT_COLS = array(
		'id',
		'name',
		'type_id',
		'img_url',
		'background_img_url',
		'short_name',
		'type_name',
		'organization_type_id',
		'organization_type_order'
	);
	protected static $ADDITIONAL_COLS = array(
		'description',
		'email',
		'background_medium_img_url',
		'img_medium_url',
		'img_small_url',
		'site_url',
		'subscribed_count',
		'default_address',
		'created_at',
		'updated_at',
		'background_small_img_url',
		'facebook_url',
		'vk_url',
		'is_private',
		'brand_color',
		'country_id',
		'city_en_name',
		'city_local_name',
		'city_timediff_seconds',
		'country_en_name',
		'country_local_name',
		'country_language',
		'country_language_short',
		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_organizations AS vo
			WHERE vo.id = view_organizations.id) AS random',
		self::IS_SUBSCRIBED_FIELD_NAME => '(SELECT
				id IS NOT NULL AS is_subscribed
				FROM subscriptions
				WHERE organization_id = view_organizations.id
					AND subscriptions.status = TRUE
					AND user_id = :user_id) IS NOT NULL AS ' . self::IS_SUBSCRIBED_FIELD_NAME,
		self::IS_NEW_FIELD_NAME => '(SELECT 
				id IS NOT NULL AS is_new
				FROM view_organizations vo
				WHERE vo.created_at > DATE_PART(\'epoch\', NOW() - INTERVAL \'7 DAY\') 
				AND vo.id = view_organizations.id) IS NOT NULL AS ' . self::IS_NEW_FIELD_NAME,

		self::RATING_OVERALL => 'COALESCE((SELECT 
														(COALESCE(rating_subscribed_friends, 0)::INT + 
														COALESCE(rating_active_events_count, 0)::INT + 
														COALESCE(rating_last_events_count, 0)::INT + 
														COALESCE(rating_subscribed_in_social_network, 0)::INT + 
														COALESCE(rating_texts_similarity, 0)::INT) AS ' . Event::RATING_OVERALL . '														
														FROM recommendations_organizations
														WHERE user_id = :user_id 
														AND organization_id = view_organizations.id
                        ), 0) AS ' . self::RATING_OVERALL,
		self::NEW_EVENTS_COUNT_FIELD_NAME => '(
		SELECT
			COUNT(*)
			FROM view_events
			WHERE
				organization_id = view_organizations.id
				AND 
				view_events.last_event_date_dt < NOW()::TIMESTAMPTZ
				AND view_events.created_at > 
					COALESCE((SELECT DATE_PART(\'epoch\', stat_organizations.created_at)::INT
					    FROM stat_organizations
					    INNER JOIN stat_event_types ON stat_organizations.stat_type_id = stat_event_types.id
					    INNER JOIN tokens ON stat_organizations.token_id = tokens.id
					    WHERE type_code=\'view\'
					    AND organization_id = view_organizations.id
					    AND tokens.user_id = :user_id
					    ORDER BY stat_organizations.id DESC LIMIT 1),0)
				AND
				id NOT IN
					(SELECT event_id
						FROM view_stat_events
					WHERE
						user_id = :user_id
					)
				) :: INT AS ' . self::NEW_EVENTS_COUNT_FIELD_NAME,

		self::ACTUAL_EVENTS_COUNT_FIELD_NAME => '(
		SELECT
			COUNT(view_events.id)
			FROM view_events
			WHERE
				organization_id = view_organizations.id
				AND
				view_events.last_event_date > DATE_PART(\'epoch\', NOW()) :: INT
				) :: INT AS ' . self::ACTUAL_EVENTS_COUNT_FIELD_NAME
	);

	public function __construct()
	{
		$this->db = App::DB();
	}

	private static function addMailInfo(User $user, $data, $id, ExtendedPDO $db)
	{
		$q_ins_mail = App::queryFactory()->newInsert()
			->into('emails')
			->cols(array(
				'email_type_id' => '1', //hardcoded in SQL also,
				'recipient' => filter_var($user->getEmail(), FILTER_VALIDATE_EMAIL) === FALSE ? $data['email'] : $user->getEmail(),
				'data' => json_encode(array(
					'first_name' => $user->getFirstName(),
					'last_name' => $user->getLastName(),
					'organization_short_name' => $data['short_name'],
					'organization_id' => $id,
				)),
				'status' => 'true'
			));
		$db->prepareExecute($q_ins_mail);
	}

	/**
	 * @return mixed
	 */
	public function getTypeName()
	{
		return $this->type_name;
	}

	/**
	 * @return mixed
	 */
	public function getOrganizationTypeOrder()
	{
		return $this->organization_type_order;
	}

	/**
	 * @return mixed
	 */
	public function getOrganizationTypeId()
	{
		return $this->organization_type_id;
	}


	/**
	 * @return mixed
	 */
	public function getUpdatedAt()
	{
		return $this->updated_at;
	}

	/**
	 * @return mixed
	 */
	public function getCreatedAt()
	{
		return $this->created_at;
	}

	public function addSubscription(User $user)
	{
		$q_ins_sub = 'INSERT INTO subscriptions(organization_id, user_id, status)
			VALUES(:organization_id, :user_id, TRUE)
			ON CONFLICT(organization_id, user_id) DO UPDATE SET status = TRUE RETURNING id::INT';

		$this->db->prepareExecuteRaw($q_ins_sub, array(':organization_id' => $this->getId(), ':user_id' => $user->getId()), 'SUBSCRIPTION_QUERY_ERROR');

		return new Result(true, 'Подписка успешно оформлена');
	}

	public function deleteSubscription(User $user)
	{
		$q_upd_sub = 'UPDATE subscriptions
			SET status = FALSE, updated_at = NOW()
			WHERE user_id = :user_id
			AND organization_id = :organization_id
			RETURNING id::INT';
		$this->db->prepareExecuteRaw($q_upd_sub, array(
			':organization_id' => $this->getId(),
			':user_id' => $user->getId()
		));
		return new Result(true, 'Подписка успешно отменена');
	}

	/**
	 * @return mixed
	 */
	public function getName()
	{
		return $this->name;
	}

	/**
	 * @return mixed
	 */
	public function getStatus()
	{
		return $this->status;
	}

	/**
	 * @return mixed
	 */
	public function getTypeId()
	{
		return $this->type_id;
	}

	/**
	 * @return mixed
	 */
	public function getImgUrl()
	{
		return $this->img_url;
	}

	/**
	 * @return mixed
	 */
	public function getDescription()
	{
		return $this->description;
	}

	/**
	 * @return mixed
	 */
	public function getShortName()
	{
		return $this->short_name;
	}

	/**
	 * @return mixed
	 */
	public function getBackgroundImgUrl()
	{
		return $this->background_img_url;
	}

	/**
	 * @return mixed
	 */
	public function getSubscribedCount()
	{
		return $this->subscribed_count;
	}

	/**
	 * @return mixed
	 */
	public function getSiteUrl()
	{
		return $this->site_url;
	}

	/**
	 * @return mixed
	 */
	public function getBackgroundMediumImgUrl()
	{
		return $this->background_medium_img_url;
	}

	/**
	 * @return mixed
	 */
	public function getImgMediumUrl()
	{
		return $this->img_medium_url;
	}

	/**
	 * @return mixed
	 */
	public function getBackgroundSmallImgUrl()
	{
		return $this->background_small_img_url;
	}

	/**
	 * @return mixed
	 */
	public function getImgSmallUrl()
	{
		return $this->img_small_url;
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[Organization::SUBSCRIBED_FIELD_NAME])) {
			$users_pagination = $fields[Organization::SUBSCRIBED_FIELD_NAME];
			$result_data[Organization::SUBSCRIBED_FIELD_NAME] = $this->getSubscribed(
				$this->db,
				$user,
				Fields::parseFields($users_pagination['fields'] ?? ''),
				Fields::parseFilters($users_pagination['filters'] ?? ''),
				Fields::parseOrderBy($users_pagination['order_by'] ?? ''),
				$users_pagination['pagination'] ??
				array(
					'length' => $users_pagination['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $users_pagination['offset'] ?? App::DEFAULT_OFFSET
				));
		}

		if (isset($fields[Organization::STAFF_FIELD_NAME])) {
			$staff_pagination = $fields[Organization::STAFF_FIELD_NAME];
			$result_data[Organization::STAFF_FIELD_NAME] =
				UsersCollection::filter(
					$this->db,
					$user,
					array('staff' => $this),
					Fields::parseFields($staff_pagination['fields'] ?? ''),
					$staff_pagination['pagination'] ??
					array(
						'length' => $staff_pagination['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $staff_pagination['offset'] ?? App::DEFAULT_OFFSET
					),
					Fields::parseOrderBy($staff_pagination['order_by'] ?? '')
				)->getData();
		}

		$events_field = $fields[Organization::EVENTS_FIELD_NAME] ?? null;
		if (is_array($events_field)) {
			$result_data[Organization::EVENTS_FIELD_NAME] = $this->getEvents(
				Fields::parseFields($events_field['fields'] ?? ''),
				Fields::parseFilters($events_field['filters'] ?? ''),
				Fields::parseOrderBy($events_field['order_by'] ?? ''),
				array(
					'length' => $events_field['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $events_field['offset'] ?? App::DEFAULT_OFFSET
				)
			);
		}

		if (isset($fields[Organization::PRIVILEGES_FIELD_NAME])) {
			if ($user instanceof User) {
				$result_data[Organization::PRIVILEGES_FIELD_NAME] =
					Roles::getUsersPrivilegesInOrganization($user, $this, $this->db)->getData();
			} else {
				$_array = array();
				foreach (Roles::PRIVILEGES_COLS as $col) {
					$_array[$col] = null;
				}
				$result_data[Organization::PRIVILEGES_FIELD_NAME] = array($_array);
			}
		}


		$city_fields = $fields[Organization::CITY_FIELD_NAME] ?? null;
		if (is_array($city_fields)) {
			$result_data[Organization::CITY_FIELD_NAME] = CitiesCollection::filter(
				App::DB(),
				$user,
				array('organization' => $this),
				Fields::parseFields($city_fields['fields'] ?? ''),
				array(
					'length' => $city_fields['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $city_fields['offset'] ?? App::DEFAULT_OFFSET
				)
			)->getData();
		}

		$country_fields = $fields[Organization::COUNTRY_FIELD_NAME] ?? null;
		if (is_array($country_fields)) {
			$result_data[Organization::COUNTRY_FIELD_NAME] = CountriesCollection::filter(
				App::DB(),
				$user,
				array('organization' => $this),
				Fields::parseFields($country_fields['fields'] ?? ''),
				array(
					'length' => $country_fields['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $country_fields['offset'] ?? App::DEFAULT_OFFSET
				)
			)->getData();
		}


		return new Result(true, '', $result_data);
	}

	private function getSubscribed(ExtendedPDO $db, AbstractUser $user, array $fields = null, array $filters, array $order_by = null, array $pagination = null)
	{
		$filters['organization'] = $this;
		return UsersCollection::filter(
			$db,
			$user,
			$filters,
			$fields,
			$pagination,
			$order_by ?? array('last_name', 'first_name')
		)->getData();

	}

	private function getEvents(array $fields = null, array $filters, array $order_by = null, array $pagination = null)
	{
		$filters['organization'] = $this;
		return EventsCollection::filter(
			$this->db,
			App::getCurrentUser(),
			$filters,
			$fields,
			$pagination,
			$order_by ?? array('id')
		)->getData();
	}

	public function isSubscribed(AbstractUser $user)
	{
		if ($user instanceof User == false) return array('is_subscribed' => false, 'subscription_id' => null);
		$q_get_subscribed = App::queryFactory()->newSelect();
		$q_get_subscribed
			->cols(array('id::INT'))
			->from('subscriptions')
			->where('subscriptions.user_id = :user_id')
			->where('subscriptions.organization_id = :organization_id')
			->where('subscriptions.status = TRUE');
		$p_get_subscribed = $this->db->prepareExecute($q_get_subscribed, 'CANT_GET_SUBSCRIBE_STATUS', array(
			':user_id' => $user->getId(),
			':organization_id' => $this->getId()
		));

		$result = array(
			'is_subscribed' => $p_get_subscribed->rowCount() == 1,
			'subscription_id' => $p_get_subscribed->rowCount() == 1 ? $p_get_subscribed->fetchColumn(0) : null
		);

		return $result;
	}

	private static function checkData(&$data, $is_update = false)
	{
		if (!isset($data['name'])) throw new InvalidArgumentException('Название организации обязательно.');
		if (mb_strlen($data['name']) < 3) throw new InvalidArgumentException('Слишком короткое название. Должно быть не менее 3 символов.');
		if (mb_strlen($data['name']) > 150) throw new InvalidArgumentException('Слишком длинное название. Должно быть не более 150 символов.');
		$data['name'] = trim($data['name']);


		if (!isset($data['short_name'])) throw new InvalidArgumentException('Краткое название организации обязательно.');
		if (mb_strlen($data['short_name']) < 3) throw new InvalidArgumentException('Слишком короткое сокращение. Должно быть не менее 3 символов.');
		if (mb_strlen($data['short_name']) > 30) throw new InvalidArgumentException('Слишком длинное сокращение. Должно быть не более 30 символов.');
		$data['short_name'] = trim($data['short_name']);

		if (isset($data['site_url'])) {
			if (filter_var($data['site_url'], FILTER_VALIDATE_URL) === FALSE) {
				$data['site_url'] = null;
			} else {
				$data['site_url'] = trim($data['site_url']);
			}
		} else {
			$data['site_url'] = null;
		}

		if (isset($data['email'])) {
			if (filter_var($data['email'], FILTER_VALIDATE_EMAIL) === FALSE) {
				$data['email'] = null;
			} else {
				$data['email'] = trim($data['email']);
			}
		} else {
			$data['email'] = null;
		}

		$data['is_private'] = isset($data['is_private']) && filter_var($data['is_private'], FILTER_VALIDATE_BOOLEAN) == true ? 'true' : 'false';

		if (isset($data['brand_color'])) {
			if (preg_match('/^#[a-f0-9]{6}$/i', $data['brand_color'])) //hex color is valid
			{
				//color is valid
			} else {
				$data['brand_color'] = null;
			}
		} else {
			$data['brand_color'] = null;
		}

		if (!isset($data['description'])) throw new InvalidArgumentException('Описание название организации обязательно.');
		if (mb_strlen($data['description']) <= 50) throw new InvalidArgumentException('Слишком короткое описание. Должно быть не менее 50 символов.');
		if (mb_strlen($data['description']) > 250) throw new InvalidArgumentException('Слишком длинное описание. Должно быть не более 250 символов.');
		$data['description'] = trim($data['description']);

		if (isset($data['default_address'])) {
			$data['default_address'] = trim($data['default_address']);
		} else {
			$data['default_address'] = null;
		}

		if (isset($data['city_id'])) {
			$data['city_id'] = filter_var($data['city_id'], FILTER_VALIDATE_INT);
		} else {
			$data['city_id'] = 1;
		}


		if (isset($data['vk_url'])) {
			$data['vk_url'] = trim($data['vk_url']);
			$data['vk_url_path'] = preg_replace('/\//', '', parse_url($data['vk_url'], PHP_URL_PATH));
		} else {
			$data['vk_url'] = null;
			$data['vk_url_path'] = null;
		}

		if (isset($data['facebook_url'])) {
			$data['facebook_url'] = trim($data['facebook_url']);
			$data['facebook_url_path'] = preg_replace('/\//', '', parse_url($data['facebook_url'], PHP_URL_PATH));
		} else {
			$data['facebook_url'] = null;
			$data['facebook_url_path'] = null;
		}

		if (isset($data['background'])
			&& !empty($data['background'])
			&& $data['background'] != null
			&& $data['background_filename'] != null
			&& isset($data['background_filename'])
			&& !empty($data['background_filename'])
		) {
			$background_filename = md5(App::generateRandomString() . '-background') . '.' . App::getImageExtension($data['background_filename']);
			App::saveImage($data['background'], self::IMAGES_PATH . self::IMAGE_TYPE_BACKGROUND . self::IMAGE_SIZE_LARGE . $background_filename, 50000);
			$data['background_img_url'] = $background_filename;
			$data['background_change'] = true;
		} elseif ($is_update) {
			$data['background_change'] = false;
		} else {
			$data['background_change'] = true;
			$data['background_img_url'] = 'default.jpg';
		}

		if (isset($data['logo'])
			&& !empty($data['logo'])
			&& $data['logo'] != null
			&& $data['logo_filename'] != null
			&& isset($data['logo_filename'])
			&& !empty($data['logo_filename'])
		) {
			$logo_filename = md5(App::generateRandomString() . '-logo') . '.' . App::getImageExtension($data['logo_filename']);
			App::saveImage($data['logo'], self::IMAGES_PATH . self::IMAGE_TYPE_LOGO . self::IMAGE_SIZE_LARGE . $logo_filename, 50000);
			$data['img_url'] = $logo_filename;
			$data['logo_change'] = true;
		} elseif ($is_update) {
			$data['logo_change'] = false;
		} else throw new InvalidArgumentException('Логотип обязателен');
	}

	public function update(User $user, array $data)
	{

		if ($user->getEditorInstance()->isAdmin($this) == false) throw new PrivilegesException('NOT_ADMIN', $this->db);
		$q_upd_organization = App::queryFactory()->newUpdate();

		$q_upd_organization->table('organizations');

		self::checkData($data, true);

		$q_upd_organization->cols(array(
				'name' => $data['name'],
				'short_name' => $data['short_name'],
				'type_id' => $data['type_id'],
				'site_url' => $data['site_url'],
				'description' => $data['description'],
				'default_address' => $data['default_address'],
				'vk_url' => $data['vk_url'],
				'city_id' => $data['city_id'],
				'vk_url_path' => $data['vk_url_path'],
				'facebook_url_path' => $data['facebook_url_path'],
				'facebook_url' => $data['facebook_url'],
				'is_private' => $data['is_private'],
				'brand_color' => $data['brand_color'],
				'email' => $data['email']
			)
		);

		if ($data['background_change']) {
			$q_upd_organization->cols(array(
				'background_img_url' => $data['background_img_url'],
			));
		}

		if ($data['logo_change']) {
			$q_upd_organization->cols(array(
				'img_url' => $data['img_url'],
			));
		}

		$q_upd_organization
			->where('id = ?', $this->id);

		$this->db->prepareExecute($q_upd_organization, 'CANT_UPDATE_ORGANIZATION');
		@file_get_contents(App::DEFAULT_NODE_LOCATION . '/recommendations/organizations/' . $this->id);
		return new Result(true, '', array('organization_id' => $this->getId()));
	}

	public function addStaff(User $user, Friend $friend, $role)
	{
		if (!$user->isAdmin($this)) throw new PrivilegesException(null, $this->db);
		$q_ins_staff = App::queryFactory()
			->newInsert()
			->into('users_organizations')
			->cols(array(
				'user_id' => $friend->getId(),
				'organization_id' => $this->getId(),
				'status' => true,
				'role_id' => Roles::getId($role),
			));
		$ins_data = $q_ins_staff->getBindValues();
		$ins_data[':role_id'] = Roles::getId($role);
		$this->db->prepareExecuteRaw($q_ins_staff->getStatement() . ' ON CONFLICT (user_id, organization_id) DO UPDATE SET status = TRUE, role_id = :role_id',
			$ins_data, 'CANT_ADD_STAFF');
		return new Result(true, '');
	}

	public function deleteStaff(User $user, Friend $friend, $role)
	{

		if (!$user->isAdmin($this)) throw new PrivilegesException(null, $this->db);

		if ($role == Roles::ROLE_ADMIN) {
			$q_get_admins = App::queryFactory()
				->newSelect();
			$q_get_admins->from('users_organizations')
				->cols(array(
					'1 AS role_admin_id',
					'(SELECT COUNT(user_id) 
                        FROM users_organizations ua 
                        WHERE ua.status = TRUE 
                            AND ua.organization_id = users_organizations.organization_id
                            AND ua.role_id = ' . Roles::getId(Roles::ROLE_ADMIN) . ') AS admins_count'
				))
				->where('users_organizations.status = TRUE')
				->where('users_organizations.organization_id = ?', $this->getId());

			$p_get_admins = $this->db->prepareExecute($q_get_admins, 'CANT_GET_ADMINS');

			$admins = $p_get_admins->fetch();
			if ($admins['admins_count'] == 1) throw new LogicException('Невозможно удалить единственного администратора');
		}
		$q_upd_staff = App::queryFactory()
			->newUpdate()
			->table('users_organizations')
			->cols(array(
				'status' => 'false'
			))
			->where('user_id = ?', $friend->getId())
			->where('organization_id = ?', $this->getId())
			->where('role_id = ?', Roles::getId($role));

		$this->db->prepareExecute($q_upd_staff, 'CANT_DELETE_STAFF');
		return new Result(true, '');
	}

	private static function addOwner(User $user, int $organization_id, ExtendedPDO $db)
	{
		$q_ins_owner = App::queryFactory()->newInsert();

		$q_ins_owner
			->into('users_organizations')
			->cols(array(
				'user_id' => $user->getId(),
				'organization_id' => $organization_id,
				'by_default' => 0,
				'status' => 'TRUE',
				'role_id' => Roles::ROLE_ADMIN_ID,
			));

		$db->prepareExecute($q_ins_owner);
	}

	public static function create($data, User $user, ExtendedPDO $db)
	{
		$q_ins_organization = App::queryFactory()->newInsert();

		$q_ins_organization->into('organizations');

		self::checkData($data);

		$q_ins_organization->cols(array(
				'name' => $data['name'],
				'short_name' => $data['short_name'],
				'type_id' => $data['type_id'],
				'site_url' => $data['site_url'],
				'description' => $data['description'],
				'default_address' => $data['default_address'],
				'vk_url' => $data['vk_url'],
				'city_id' => $data['city_id'],
				'vk_url_path' => $data['vk_url_path'],
				'facebook_url_path' => $data['facebook_url_path'],
				'facebook_url' => $data['facebook_url'],
				'background_img_url' => $data['background_img_url'],
				'img_url' => $data['img_url'],
				'creator_id' => $user->getId(),
				'images_domain' => 'https://dn' . rand(1, 4) . '.evendate.ru/',
				'email' => $data['email'],
				'is_private' => $data['is_private'],
				'brand_color' => $data['brand_color'],
				'state_id' => self::ORGANIZATION_STATE_SHOWN
			)
		);

		$q_ins_organization
			->returning(array('id'));

		$result = $db->prepareExecute($q_ins_organization, 'CANT_CREATE_ORGANIZATION')->fetch(PDO::FETCH_ASSOC);
		self::addOwner($user, $result['id'], $db);
		self::addMailInfo($user, $data, $result['id'], $db);
		@file_get_contents(App::DEFAULT_NODE_LOCATION . '/recommendations/organizations/' . $result['id']);
		return new Result(true, '', array('organization_id' => $result['id']));
	}

}