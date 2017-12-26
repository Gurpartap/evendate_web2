<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';

class Friend extends AbstractEntity implements UserInterface
{

	const RANDOM_FIELD_NAME = 'random';
	const LINK_FIELD_NAME = 'link';
	const ACCOUNTS_LINKS_FIELD_NAME = 'accounts_links';
	const ACCOUNTS_FIELD_NAME = 'accounts';
	const FAVORED_FIELD_NAME = 'favored';
	const INTERESTS_FIELD_NAME = 'interests';
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

//		'email' => '(SELECT CASE WHEN view_users.id IN (SELECT subscriptions.user_id
//					FROM subscriptions
//					 INNER JOIN users_organizations ON users_organizations.organization_id = subscriptions.organization_id
//					 WHERE users_organizations.role_id = 1
//					 AND users_organizations.status = TRUE
//					 AND subscriptions.status = TRUE
//					 AND users_organizations.user_id = :user_id
//					) OR view_users.id IN (SELECT ticket_orders.user_id
//					FROM ticket_orders
//						INNER JOIN events ON ticket_orders.event_id = events.id
//					 INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id
//					 WHERE users_organizations.role_id = 1
//					 AND users_organizations.status = TRUE
//					 AND events.status = TRUE
//					 AND users_organizations.user_id = :user_id
//					) THEN view_users.email ELSE null END AS email) AS email'
	'email' => 'null as email'
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
																	 array $order_by)
	{
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


	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();


		if (isset($fields[self::SUBSCRIPTIONS_FIELD_NAME])) {
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

		if (isset($fields[self::ACCOUNTS_LINKS_FIELD_NAME])) {

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

		if (isset($fields[self::ACCOUNTS_FIELD_NAME])) {

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

		if (isset($fields[self::ACTIONS_FIELD_NAME])) {
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

		if (isset($fields[self::FAVORED_FIELD_NAME])) {
			$result_data[self::FAVORED_FIELD_NAME] = EventsCollection::filter(
				App::DB(),
				App::getCurrentUser(),
				array_merge(Fields::parseFilters($fields[self::FAVORED_FIELD_NAME]['filters'] ?? ''), array(
					'favorites' => $this
				)),
				Fields::parseFields($fields[self::FAVORED_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::FAVORED_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::FAVORED_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
				),
				Fields::parseOrderBy($fields[self::FAVORED_FIELD_NAME]['order_by'] ?? ''))->getData();
		}


		if (isset($fields[self::INTERESTS_FIELD_NAME])) {
			$q_get_is_admin = App::queryFactory()->newSelect();
			$q_get_is_admin->from('subscriptions')
				->cols(array('subscriptions.created_at'))
				->join('inner', 'users_organizations', 'users_organizations.organization_id = subscriptions.organization_id')
				->where('users_organizations.role_id = 1')
				->where('users_organizations.status = TRUE')
				->where('subscriptions.status = TRUE')
				->where('users_organizations.user_id = ?', App::getCurrentUser()->getId());
			$res = App::DB()->prepareExecute($q_get_is_admin, 'CANT_CHECK_IS_ADMIN');
			if ($res->rowCount() == 0) throw new PrivilegesException('', App::DB());

			$q_get_interests = App::queryFactory()->newSelect();
			$q_get_interests->from('view_user_interests')
				->cols(array(
					'topic_id',
					'topic_name',
					'value::NUMERIC',
					'updated_at',
				))
				->where('user_id = ?', $this->getId());
			$res = App::DB()->prepareExecute($q_get_interests, 'CANT_GET_INTERESTS');


			$result_data[self::INTERESTS_FIELD_NAME] = $res->fetchAll();
		}

		return new Result(true, '', $result_data);
	}

	public function getOrders(Organization $organization, User $user, array $fields, array $pagination, array $order_by)
	{
		$db = App::DB();
		if (!$user->isAdmin($organization)) throw new PrivilegesException('', $db);
		$subscriptions = $this->getSubscriptions(array(), array('length' => 100000, 'offset' => 0), array())->getData();
		$subscribed = false;
		foreach ($subscriptions as $sub) {
			if ($sub['id'] == $organization->getId()) {
				$subscribed = true;
			}
		}
		if (!$subscribed) throw new PrivilegesException('', $db);
		return OrdersCollection::filter($db,
			$user,
			array('subscriber' => $this, 'organization' => $organization),
			$fields,
			$pagination,
			$order_by
		);
	}

}