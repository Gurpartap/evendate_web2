<?php


class Organization {

	private $id;
	private $description;
	private $background_medium_img_url;
	private $background_small_img_url;
	private $img_medium_url;
	private $img_small_url;
	private $site_url;
	private $name;
	private $type_id;
	private $img_url;
	private $background_img_url;
	private $status;
	private $short_name;
	private $type_name;
	private $organization_type_order;
	private $organization_type_id;
	private $updated_at;
	private $created_at;
	private $subscribed_count;

	public static $DEFAULT_COLS = array(
		'id',
		'name',
		'type_id',
		'img_url',
		'background_img_url',
		'status',
		'short_name',
		'type_name',
		'organization_type_id',
		'organization_type_order'
	);
	public static $ADDITIONAL_COLS = array(
		'description',
		'background_medium_img_url',
		'img_medium_url',
		'img_small_url',
		'site_url',
		'subscribed_count',
		'created_at',
		'updated_at',
		'background_small_img_url',
		'is_subscribed' => '(SELECT
				id IS NOT NULL = TRUE
				FROM subscriptions
				WHERE organization_id = view_organizations.id
					AND subscriptions.status = TRUE
					AND user_id = :user_id) AS is_subscribed',
		'subscription_id' => '(SELECT
				id AS subscription_id
				FROM subscriptions
				WHERE organization_id = view_organizations.id
					AND subscriptions.status = TRUE
					AND user_id = :user_id) AS subscription_id'
	);

	const SUBSCRIBED_FIELD_NAME = 'subscribed';
	const EVENTS_FIELD_NAME = 'events';


	public function __construct() {
		$this->db = App::DB();
		Statistics::Organization($this, App::getCurrentUser(), $this->db, Statistics::ORGANIZATION_VIEW);
	}

	/**
	 * @return mixed
	 */
	public function getTypeName() {
		return $this->type_name;
	}

	/**
	 * @return mixed
	 */
	public function getOrganizationTypeOrder() {
		return $this->organization_type_order;
	}

	/**
	 * @return mixed
	 */
	public function getOrganizationTypeId() {
		return $this->organization_type_id;
	}

	/**
	 * @return mixed
	 */
	public function getUpdatedAt() {
		return $this->updated_at;
	}

	/**
	 * @return mixed
	 */
	public function getCreatedAt() {
		return $this->created_at;
	}

	/**
	 * @return mixed
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @return mixed
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @return mixed
	 */
	public function getStatus() {
		return $this->status;
	}

	/**
	 * @return mixed
	 */
	public function getTypeId() {
		return $this->type_id;
	}

	/**
	 * @return mixed
	 */
	public function getImgUrl() {
		return $this->img_url;
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
	public function getShortName() {
		return $this->short_name;
	}

	/**
	 * @return mixed
	 */
	public function getBackgroundImgUrl() {
		return $this->background_img_url;
	}

	/**
	 * @return mixed
	 */
	public function getSubscribedCount() {
		return $this->subscribed_count;
	}

	/**
	 * @return mixed
	 */
	public function getSiteUrl() {
		return $this->site_url;
	}

	/**
	 * @return mixed
	 */
	public function getBackgroundMediumImgUrl() {
		return $this->background_medium_img_url;
	}

	/**
	 * @return mixed
	 */
	public function getImgMediumUrl() {
		return $this->img_medium_url;
	}

	/**
	 * @return mixed
	 */
	public function getBackgroundSmallImgUrl() {
		return $this->background_small_img_url;
	}

	/**
	 * @return mixed
	 */
	public function getImgSmallUrl() {
		return $this->img_small_url;
	}

	public function getParams(User $user, array $fields = null) {
//		$subscribe_status = $this->getIsSubscribed($user);
		$params = self::$DEFAULT_COLS;
		$result_data = array();
		$params = Fields::mergeFields(self::$ADDITIONAL_COLS, $fields, $params);

		foreach($params as $key => $field){
			$result_data[$field] = $this->$field;
		}

		if (!is_null(App::getFieldsValue(Organization::SUBSCRIBED_FIELD_NAME))){
			$result_data[Organization::SUBSCRIBED_FIELD_NAME] = self::getSubscribed($this->db, $user, $this->id, App::getFieldsParam(Organization::SUBSCRIBED_FIELD_NAME, 'limit'))->getData();
		}

		if (!is_null(App::getFieldsValue(Organization::EVENTS_FIELD_NAME))){
			$result_data[Organization::EVENTS_FIELD_NAME] = $this->getEvents();
		}

		return new Result(true, '', $result_data);
	}

	public static function getSubscribed(PDO $db, AbstractUser $user, $organization_id, $limit = null) {
		$q_get_subscribed_friends = App::$QUERY_FACTORY->newSelect();
		$cols = array(
			'users.id::int',
			'users.first_name',
			'users.last_name',
			'users.middle_name',
			'users.avatar_url',
			'users.gender',
			'view_friends.user_id IS NOT NULL' => 'is_friend'
		);

		$q_get_subscribed_friends
			->distinct()
			->cols($cols)
			->from('users')
			->join('INNER', 'subscriptions', 'subscriptions.user_id = users.id')
			->join('LEFT', 'view_friends', 'view_friends.user_id = subscriptions.user_id AND view_friends.friend_id = :user_id')
			->where('subscriptions.organization_id = :organization_id')
			->where('subscriptions.status = TRUE')
			->orderBy(array('is_friend DESC'))
			->limit($limit);
		$p_get_friends = $db->prepare($q_get_subscribed_friends->getStatement());
		$result = $p_get_friends->execute(array(':organization_id' => $organization_id, ':user_id' => $user->getId(),));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_SUBSCRIBED_FRIENDS', $db);

		$users = $p_get_friends->fetchAll();
		return new Result(true, '', $users);

	}

	private function getEvents() {
		return EventsCollection::filter($this->db, App::getCurrentUser())->getData();
	}


	private function isSubscribed(User $user) {
		$q_get_subscribed = App::$QUERY_FACTORY->newSelect();
		$q_get_subscribed
			->cols(array(
				'id::INT'
			))
			->from('subscriptions')
			->where('subscriptions.user_id = :user_id')
			->where('subscriptions.organization_id = :organization_id')
			->where('subscriptions.status = TRUE');
		$p_get_subscribed = $this->db->prepare($q_get_subscribed->getStatement());

		$result = $p_get_subscribed->execute(array(':user_id' => $user->getId(), ':organization_id' => $this->getId()));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_SUBSCRIBE_STATUS', $this->db);

		$result = array(
			'is_subscribed' => $p_get_subscribed->rowCount() == 1,
			'subscription_id' => $p_get_subscribed->rowCount() == 1 ? $p_get_subscribed->fetchColumn(0) : null
		);

		return $result;
	}

}