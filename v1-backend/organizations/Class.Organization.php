<?php


class Organization extends AbstractEntity{




	const SUBSCRIBED_FIELD_NAME = 'subscribed';
	const EVENTS_FIELD_NAME = 'events';
	const SUBSCRIPTION_ID_FIELD_NAME = 'subscription_id';
	const IS_SUBSCRIBED_FIELD_NAME = 'is_subscribed';
	const NEW_EVENTS_COUNT_FIELD_NAME = 'new_events_count';

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
		'status',
		'short_name',
		'type_name',
		'organization_type_id',
		'organization_type_order'
	);
	protected static $ADDITIONAL_COLS = array(
		'description',
		'background_medium_img_url',
		'img_medium_url',
		'img_small_url',
		'site_url',
		'subscribed_count',
		'created_at',
		'updated_at',
		'background_small_img_url',
		self::IS_SUBSCRIBED_FIELD_NAME => '(SELECT
				id IS NOT NULL = TRUE AS is_subscribed
				FROM subscriptions
				WHERE organization_id = view_organizations.id
					AND subscriptions.status = TRUE
					AND user_id = :user_id) AS is_subscribed',
		self::SUBSCRIPTION_ID_FIELD_NAME => '(SELECT
				id::int AS subscription_id
				FROM subscriptions
				WHERE organization_id = view_organizations.id
					AND subscriptions.status = TRUE
					AND user_id = :user_id) AS subscription_id'
	);

	public function __construct() {
		$this->db = App::DB();
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

	public function addSubscription(User $user) {
		$q_ins_sub = 'INSERT INTO subscriptions(organization_id, user_id, status)
			VALUES(:organization_id, :user_id, TRUE)
			ON CONFLICT DO UPDATE SET status = TRUE RETURNING id::int;';

		$p_ins_sub = $this->db->prepare($q_ins_sub);
		$result = $p_ins_sub->execute(array(':organization_id' => $this->getId(), ':user_id' => $user->getId()));

		if ($result === FALSE)
			throw new DBQueryException('SUBSCRIPTION_QUERY_ERROR', $this->db);

		$sub_id = $this->db->lastInsertId();
		Statistics::Organization($this, $user, $this->db, Statistics::ORGANIZATION_SUBSCRIBE);

		return new Result(true, 'Подписка успешно оформлена', array('subscription_id' => $sub_id));
	}

	public function deleteSubscription(User $user) {
	$q_upd_sub = 'UPDATE subscriptions
			SET status = FALSE
			WHERE user_id = :user_id
			AND organization_id = :organization_id
			RETURNING id::int';
	$p_upd_sub = $this->db->prepare($q_upd_sub);
	$p_upd_sub->execute(array(':organization_id' => $this->getId(), ':user_id' => $user->getId()));
	Statistics::Organization($this, $user, $this->db, Statistics::ORGANIZATION_UNSUBSCRIBE);
	return new Result(true, 'Подписка успешно отменена');
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

	public function getParams(User $user, array $fields = null) : Result {
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[Organization::SUBSCRIBED_FIELD_NAME])){
			$users_pagination = $fields[Organization::SUBSCRIBED_FIELD_NAME];
			$result_data[Organization::SUBSCRIBED_FIELD_NAME] = $this->getSubscribed(
				$this->db,
				$user,
				Fields::parseFields($users_pagination['fields'] ?? ''),
				$users_pagination);
		}

		$events_field = $fields[Organization::EVENTS_FIELD_NAME] ?? null;
		if (is_array($events_field)){
			$result_data[Organization::EVENTS_FIELD_NAME] = $this->getEvents(
				Fields::parseFields($events_field['fields'] ?? ''),
				array(
					'length' => $events_field['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $events_field['offset'] ?? App::DEFAULT_OFFSET
				)
			);
		}

		return new Result(true, '', $result_data);
	}

	private function getSubscribed(PDO $db, User $user, array $fields = null, array $pagination = null) {
		return UsersCollection::filter(
			$db,
			$user,
			array('organization' => $this),
			$fields,
			$pagination,
			array('last_name', 'first_name')
		)->getData();

	}

	private function getEvents(array $fields = null, array $pagination = null) {
		return EventsCollection::filter(
			$this->db,
			App::getCurrentUser(),
			array('organization' => $this),
			$fields,
			$pagination,
			array('id')
		)->getData();
	}


	private function isSubscribed(User $user) {
		$q_get_subscribed = App::queryFactory()->newSelect();
		$q_get_subscribed
			->cols(array(
				'id::INT'
			))
			->from('subscriptions')
			->where('subscriptions.user_id = :user_id')
			->where('subscriptions.organization_id = :organization_id')
			->where('subscriptions.status = TRUE');
		$p_get_subscribed = $this->db->prepare($q_get_subscribed->getStatement());

		$result = $p_get_subscribed->execute(array(
			':user_id' => $user->getId(),
			':organization_id' => $this->getId()
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_SUBSCRIBE_STATUS', $this->db);

		$result = array(
			'is_subscribed' => $p_get_subscribed->rowCount() == 1,
			'subscription_id' => $p_get_subscribed->rowCount() == 1 ? $p_get_subscribed->fetchColumn(0) : null
		);

		return $result;
	}

}