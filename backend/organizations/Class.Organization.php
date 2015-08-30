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


	public function __construct($id, PDO $db) {
		$p_get_organization = $db->prepare('SELECT id,
			description, img_url, type_id, `status`, short_name, `name`,
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
		$this->img_url = $row['img_url'];
		$this->description = $row['description'];
		$this->short_name = $row['short_name'];
		$this->background_img_url = $row['background_img_url'];
		$this->subscribed_count = $row['subscribed_count'];
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

	public function getFullParams(User $user){

		$subscribe_status = $this->getIsSubscribed($user);
		return new Result(true, '', array(
			'id' => $this->getId(),
			'name' => $this->getName(),
			'short_name' => $this->getShortName(),
			'type_id' => $this->getTypeId(),
			'img_url' => $this->getImgUrl(),
			'background_img_url' => $this->getBackgroundImgUrl(),
			'description' => $this->getDescription(),
			'is_subscribed' => $subscribe_status['is_subscribed'],
			'subscription_id' => $subscribe_status['subscription_id'],
			'subscribed_count' => $this->getSubscribedCount(),
			'subscribed_friends' => $this->getSubscribedFriends($user)->getData()
		));
	}

	private function getSubscribedFriends(User $user) {

		$q_get_subscribed_friends = 'SELECT users.first_name, users.last_name, users.avatar_url
			FROM users
			 INNER JOIN view_friends ON view_friends.friend_id = users.id
			 INNER JOIN subscriptions ON subscriptions.user_id = users.id
			 WHERE view_friends.user_id = :user_id
			 AND subscriptions.organization_id = :organization_id
			';
		$p_get_friends = $this->db->prepare($q_get_subscribed_friends);
		$result  = $p_get_friends->execute(array(
			':user_id' => $user->getId(),
			':organization_id' => $this->getId()
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_SUBSCRIBED_FRIENDS', $this->db);

		return new Result(true, '', $p_get_friends->fetchAll());

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