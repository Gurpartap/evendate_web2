<?php



class Organization {

	private $id;
	private $name;
	private $short_name;
	private $status;
	private $type_id;
	private $img_url;
	private $description;
	private $is_subscribed;
	private $background_img_url;
	private $subscribed_count;
	private $subscribed_friends;
	private $site_url;
	private $background_medium_img_url;
	private $img_medium_url;
	private $background_small_img_url;
	private $img_small_url;


	public function __construct($id, PDO $db) {
		$p_get_organization = $db->prepare('SELECT id, site_url,
			description, img_url, type_id, `status`, short_name, `name`,
			background_medium_img_url, background_small_img_url,
			img_medium_url, img_small_url,
			background_img_url, (
				SELECT COUNT(id) AS subscribed_count
				FROM subscriptions
				WHERE subscriptions.status = 1
				AND subscriptions.organization_id = organizations.id
			) as subscribed_count
			FROM organizations
			WHERE organizations.id = :id');

		$result = $p_get_organization->execute(array(
			':id' => $id
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_ORGANIZATION_QUERY_ERROR', $db);
		if ($p_get_organization->rowCount() == 0) throw new InvalidArgumentException('CANT_GET_ORGANIZATION');

		$row = $p_get_organization->fetch();
		$this->db = $db;
		$this->id = $row['id'];
		$this->status = $row['status'];
		$this->name = $row['name'];
		$this->type_id = $row['type_id'];
		$this->subscribed_count = $row['subscribed_count'];
		$this->site_url = $row['site_url'];
		$this->description = $row['description'];
		$this->short_name = $row['short_name'];
		$this->background_img_url = $row['background_img_url'];
		$this->img_url = $row['img_url'];
		$this->background_medium_img_url = $row['background_medium_img_url'];
		$this->img_medium_url = $row['img_medium_url'];
		$this->background_small_img_url = $row['background_small_img_url'];
		$this->img_small_url = $row['img_small_url'];

		global $__user;
		Statistics::Organization($this, $__user, $db, Statistics::ORGANIZATION_VIEW);
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

	private static function getPathWithURL($path){
		if ($path == null || $path == '' || trim($path) == '') return null;
		return App::$SCHEMA . App::$DOMAIN . '/' . $path;
	}

	public static function normalizeOrganization(array $organization){
		$organization['id'] = (int) $organization['id'];

		if (isset($organization['type_id'])){
			$organization['type_id'] = (int) $organization['type_id'];
		}
		if (isset($organization['subscribed_count'])){
			$organization['subscribed_count'] = (int) $organization['subscribed_count'];
		}
		if (isset($organization['status'])){
			$organization['status'] = (boolean) $organization['status'];
		}
		if (isset($organization['subscription_id'])){
			$organization['subscription_id'] = (int) $organization['subscription_id'];
		}

		$organization['background_img_url'] =  self::getPathWithURL($organization['background_img_url']);
		$organization['img_url'] = self::getPathWithURL($organization['img_url']);

		$organization['background_medium_img_url'] = self::getPathWithURL($organization['background_medium_img_url']);
		$organization['img_medium_url'] = self::getPathWithURL($organization['img_medium_url']);

		$organization['background_small_img_url'] = self::getPathWithURL($organization['background_small_img_url']);
		$organization['img_small_url'] = self::getPathWithURL($organization['img_small_url']);

		if (isset($organization['timestamp_created_at'])){
			$organization['timestamp_created_at'] = intval($organization['timestamp_created_at']);
		}
		if (isset($organization['timestamp_updated_at'])){
			$organization['timestamp_updated_at'] = intval($organization['timestamp_updated_at']);
		}
		if (isset($organization['is_subscribed'])){
			$organization['is_subscribed'] = $organization['is_subscribed'] == 1;
		}
		return $organization;
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

	public function getFullParams(User $user){
		$subscribe_status = $this->getIsSubscribed($user);
		return new Result(true, '', self::normalizeOrganization(array(
			'id' => $this->getId(),
			'name' => $this->getName(),
			'short_name' => $this->getShortName(),
			'type_id' => $this->getTypeId(),
			'description' => $this->getDescription(),
			'is_subscribed' => $subscribe_status['is_subscribed'],
			'subscription_id' => $subscribe_status['subscription_id'],
			'subscribed_count' => $this->getSubscribedCount(),
			'site_url' => $this->getSiteUrl(),
			'subscribed_friends' => self::getSubscribedFriends($this->db, $user, $this->getId())->getData(),

			'img_url' => $this->getImgUrl(),
			'img_url_path' => $this->getImgUrl(),

			'background_img_url' => $this->getBackgroundImgUrl(),
			'background_img_url_path' => $this->getBackgroundImgUrl(),

			'img_medium_url' => $this->getImgMediumUrl(),
			'background_medium_img_url' => $this->getBackgroundMediumImgUrl(),

			'img_small_url' => $this->getImgSmallUrl(),
			'background_small_img_url' => $this->getBackgroundSmallImgUrl()
		)));
	}

	public static function getSubscribedFriends(PDO $db, AbstractUser $user, $organization_id) {
		$q_get_subscribed_friends = 'SELECT DISTINCT
			users.first_name, users.last_name,
			users.middle_name, users.id, view_friends.friend_id, users.avatar_url, view_friends.friend_uid,
			view_friends.type,
			IF (
				(SELECT COUNT(view_friends.friend_id) FROM view_friends WHERE view_friends.user_id = :user_id AND view_friends.friend_id = users.id) > 0,
			1, 0)
				AS is_friend
 			FROM users
			 INNER JOIN subscriptions ON subscriptions.user_id = users.id
			 LEFT JOIN view_friends ON view_friends.friend_id = users.id
			 WHERE
			 subscriptions.organization_id = :organization_id
			 AND subscriptions.status = 1
			 AND view_friends.friend_id IS NOT NULL
			GROUP BY view_friends.friend_id
			ORDER BY is_friend DESC ';
		$p_get_friends = $db->prepare($q_get_subscribed_friends);
		$result  = $p_get_friends->execute(array(
			':user_id' => $user->getId(),
			':organization_id' => $organization_id
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_SUBSCRIBED_FRIENDS', $db);

		$users = $p_get_friends->fetchAll();

		foreach($users as &$friend){
			$friend['id'] = intval($friend['id']);
			$friend['friend_id'] = intval($friend['friend_id']);
			$friend['is_friend'] = $friend['is_friend'] == 1;
			$friend['link'] = User::getLinkToSocialNetwork($friend['type'], $friend['friend_uid']);
		}

		return new Result(true, '', $users);

	}

	private function getIsSubscribed(User $user) {
		$p_get_subscribed = $this->db->prepare('SELECT id
			FROM subscriptions
			WHERE subscriptions.user_id = :user_id
			AND subscriptions.organization_id = :organization_id
			AND subscriptions.status = 1');
		$result = $p_get_subscribed->execute(array(
			':user_id' => $user->getId(),
			':organization_id' => $this->getId()
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_SUBSCRIBE_STATUS', $this->db);

		$result = array(
			'is_subscribed' => $p_get_subscribed->rowCount() == 1,
			'subscription_id' => null
		);
		if ($result['is_subscribed']){
			$result['subscription_id'] = $p_get_subscribed->fetchColumn(0);
		}

		return $result;
	}

}