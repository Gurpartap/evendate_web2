<?php

require_once $BACKEND_FULL_PATH .'/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH .'/organizations/Class.Organization.php';

class Friend extends AbstractUser{

	public static $DEFAULT_COLS = array(
		'id',
		'first_name',
		'last_name',
		'middle_name',
		'gender',
		'avatar_url',
	);

	public static $ADDITIONAL_COLS = array(
		'type',
		'is_friend' => 'view_friends.user_id IS NOT NULL AS is_friend',
		'blurred_image_url',
	);

	private $id;
	private $db;
	private $first_name;
	private $last_name;
	private $avatar_url;
	private $type;
	private $link;

	private $user;

	const SUBSCRIPTIONS_FIELD_NAME = 'subscriptions';

	public function getId(){
		return $this->id;
	}

	public function getSubscriptions($with_user_info = false){
		$subscriptions = OrganizationsCollection::filter($this->db, $this->user, array(
			'friend' => $this
		), '', ' LIMIT 10');

		if ($with_user_info){
			return new Result(true, '', array(
				'subscriptions' => $subscriptions->getData(),
				'user' => array(
					'id' => $this->id,
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

	public function getParams(User $user, array $fields = null){
		$result_data = array();

		foreach(self::$DEFAULT_COLS as $field){
			$result_data[$field] = $this->$field;
		}

		foreach($fields as $name => $value){
			if (in_array($name, self::$ADDITIONAL_COLS) || isset(self::$ADDITIONAL_COLS[$name])){
				$result_data[$name] = $this->$name;
			}
		}

		if (isset($fields[self::SUBSCRIPTIONS_FIELD_NAME])){
			$result_data[self::SUBSCRIPTIONS_FIELD_NAME] = $this->getSubscriptions()->getData();
		}


		return new Result(true, '', $result_data);
	}

}