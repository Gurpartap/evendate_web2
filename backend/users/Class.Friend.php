<?php

require_once $ROOT_PATH.'backend/organizations/Class.OrganizationsCollection.php';
require_once $ROOT_PATH.'backend/organizations/Class.Organization.php';

class Friend extends AbstractUser{

	private $id;
	private $db;
	private $first_name;
	private $last_name;
	private $avatar_url;
	private $type;
	private $link;

	private $user;


	public function __construct($id, User $user, PDO $db) {
		$q_get_friend = 'SELECT users.id, users.first_name, users.last_name,
			users.avatar_url, users.vk_uid, users.facebook_uid, users.google_uid
			FROM users
			WHERE users.id = :id';
		$p_get = $db->prepare($q_get_friend);

		$result = $p_get->execute(array(
			':id' => $id
		));


		if ($result === FALSE) throw new DBQueryException('', $db);
		if ($p_get->rowCount() == 0) throw new LogicException('User is not your friend');
		$row = $p_get->fetch();
		$this->id = $id;
		$this->db = $db;
		$this->user = $user;
		$this->first_name = $row['first_name'];
		$this->last_name = $row['last_name'];
		$social_info = self::getLinkToSocialNetwork($row);
		$this->link = $social_info['link'];
		$this->type = $social_info['type'];
		$this->avatar_url = $row['avatar_url'];
	}

	private static function getLinkToSocialNetwork($row) {
		if ($row['vk_uid'] != null){
			return array(
				'type' => 'vk.com',
				'link' => User::getLinkToSocialNetwork('vk', $row['vk_uid'])
			);
		}elseif($row['facebook_uid'] != null){
			return array(
				'type' => 'Facebook',
				'link' => User::getLinkToSocialNetwork('facebook', $row['facebook_uid'])
			);
		}elseif($row['google_uid'] != null){
			return array(
				'type' => 'Google +',
				'link' => User::getLinkToSocialNetwork('google', $row['google_uid'])
			);
		}else{
			return array(
				'type' => '',
				'link' => '',
			);
		}
	}

	public function getId(){
		return $this->id;
	}

	public function getSubscriptions($with_user_info = false){
		$subscriptions = OrganizationsCollection::filter($this->db, $this->user, array(
			'friend' => $this
		));

		if ($with_user_info){
			return new Result(true, '', array(
				'subscriptions' => $subscriptions->getData(),
				'user' => array(
					'id' => intval($this->id),
					'first_name' => $this->first_name,
					'last_name' => $this->last_name,
					'link' => $this->link,
					'type' => $this->type,
					'avatar_url' => $this->avatar_url,
				)
			));
		}
		return $subscriptions;
	}

}