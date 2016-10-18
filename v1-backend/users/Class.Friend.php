<?php

require_once $BACKEND_FULL_PATH .'/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH .'/organizations/Class.Organization.php';

class Friend extends AbstractEntity{

	const RANDOM_FIELD_NAME = 'random';
	const LINK_FIELD_NAME = 'link';

	protected static $DEFAULT_COLS = array(
		'id',
		'first_name',
		'last_name',
		'middle_name',
		'gender',
		'avatar_url',
		'blurred_img_url'
	);

	protected static $ADDITIONAL_COLS = array(
		'type',
		'is_friend' => 'view_friends.user_id IS NOT NULL AS is_friend',
		'blurred_img_url',
		'uid',
		self::RANDOM_FIELD_NAME => '(SELECT DATE_PART(\'epoch\', u.created_at) / (random() * 9 + 1)
			FROM users AS u
			WHERE u.id = view_users.id) AS ' . self::RANDOM_FIELD_NAME,
		self::LINK_FIELD_NAME => '(SELECT 
			CASE 
				WHEN u.vk_uid IS NOT NULL THEN \'https://vk.com/id\' || u.vk_uid
				WHEN u.facebook_uid IS NOT NULL THEN \'https://facebook.com/\' || u.facebook_uid
				WHEN u.google_uid IS NOT NULL THEN \'https://plus.google.com/\' || u.google_uid
				ELSE NULL
			END
			FROM users AS u
			WHERE u.id = view_users.id) AS ' . self::LINK_FIELD_NAME,
	);

	protected $first_name;
	protected $last_name;
	protected $avatar_url;
	protected $gender;
	protected $middle_name;
	protected $type;
	protected $is_friend;
	protected $blurred_image_url;
	protected $link;

	private $user;

	const SUBSCRIPTIONS_FIELD_NAME = 'subscriptions';
	const ACTIONS_FIELD_NAME = 'actions';

	public function getSubscriptions(array $fields,
	                                 array $pagination,
	                                 array $order_by){
		$subscriptions = OrganizationsCollection::filter(
			App::DB(),
			App::getCurrentUser(),
			array(
				'friend' => $this
			), $fields,
			$pagination,
			$order_by);
		return $subscriptions;
	}


	public function getParams(AbstractUser $user = null, array $fields = null) : Result{
		$result_data = parent::getParams($user, $fields)->getData();


		if (isset($fields[self::SUBSCRIPTIONS_FIELD_NAME])){
			$result_data[self::SUBSCRIPTIONS_FIELD_NAME] =
				$this->getSubscriptions(
					Fields::parseFields($fields[self::SUBSCRIPTIONS_FIELD_NAME]['fields'] ?? ''),
					array(
						'length' => $fields[self::SUBSCRIPTIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $fields[self::SUBSCRIPTIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
					),
					Fields::parseOrderBy($fields[self::SUBSCRIPTIONS_FIELD_NAME]['order_by'] ?? '')
				)->getData();
		}

		if (isset($fields[self::ACTIONS_FIELD_NAME])){
			$result_data[self::ACTIONS_FIELD_NAME] = OrganizationsCollection::filter(
				App::DB(),
				App::getCurrentUser(),
				array(
					'friend' => $this
				),
				Fields::parseFields($fields[self::ACTIONS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::ACTIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::ACTIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
				),
				Fields::parseOrderBy($fields[self::ACTIONS_FIELD_NAME]['order_by'] ?? ''))->getData();
		}

		return new Result(true, '', $result_data);
	}

}