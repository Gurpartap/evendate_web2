<?php

require_once $BACKEND_FULL_PATH .'/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH .'/organizations/Class.Organization.php';

class Friend extends AbstractEntity implements UserInterface {

	const RANDOM_FIELD_NAME = 'random';
	const LINK_FIELD_NAME = 'link';
	const ACCOUNTS_LINKS_FIELD_NAME = 'accounts_links';
	const ACCOUNTS_FIELD_NAME = 'accounts';
	const FAVORED_FIELD_NAME = 'favored';
	const SUBSCRIPTIONS_FIELD_NAME = 'subscriptions';
	const ACTIONS_FIELD_NAME = 'actions';

	protected static $DEFAULT_COLS = array(
		'id',
		'first_name',
		'last_name',
		'middle_name',
		'gender',
		'avatar_url',
		'vk_uid',
		'facebook_uid',
		'google_uid',
		'blurred_img_url'
	);

	protected static $ADDITIONAL_COLS = array(
		'type',
		'is_friend' => 'view_friends.user_id IS NOT NULL AS is_friend',
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
	protected $vk_uid;
	protected $google_uid;
	protected $facebook_uid;

	private $user;


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

		if (isset($fields[self::ACCOUNTS_LINKS_FIELD_NAME])){

			$account_links = array();

			if ($this->vk_uid != null) {
				$account_links['vk'] = 'https://vk.com/id' . $this->vk_uid;
			}
			if ($this->google_uid != null) {
				$account_links['google'] = 'https://plus.google.com/u/0/' . $this->google_uid;
			}
			if ($this->facebook_uid != null) {
				$account_links['facebook'] = 'https://facebook.com/' . $this->facebook_uid;
			}
			$result_data[self::ACCOUNTS_LINKS_FIELD_NAME] = $account_links;
		}

		if (isset($fields[self::ACCOUNTS_FIELD_NAME])){

			$account_types = array();

			if ($this->vk_uid != null) {
				$account_types[] = 'vk';
			}
			if ($this->google_uid != null) {
				$account_types[] = 'google';
			}
			if ($this->facebook_uid != null) {
				$account_types[] = 'facebook';
			}
			$result_data[self::ACCOUNTS_FIELD_NAME] = $account_types;
		}

		if (isset($fields[self::ACTIONS_FIELD_NAME])){
			$result_data[self::ACTIONS_FIELD_NAME] = ActionsCollection::filter(
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

		if (isset($fields[self::FAVORED_FIELD_NAME])){
			$result_data[self::FAVORED_FIELD_NAME] = EventsCollection::filter(
				App::DB(),
				App::getCurrentUser(),
				array(
					'favorites' => $this
				),
				Fields::parseFields($fields[self::FAVORED_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::FAVORED_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::FAVORED_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
				),
				Fields::parseOrderBy($fields[self::FAVORED_FIELD_NAME]['order_by'] ?? ''))->getData();
		}

		return new Result(true, '', $result_data);
	}

}