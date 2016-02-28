<?php

require_once $BACKEND_FULL_PATH .'/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH .'/organizations/Class.Organization.php';

class Friend extends AbstractEntity{

	protected static $DEFAULT_COLS = array(
		'id',
		'first_name',
		'last_name',
		'middle_name',
		'gender',
		'avatar_url',
	);

	protected static $ADDITIONAL_COLS = array(
		'type',
		'is_friend' => 'view_friends.user_id IS NOT NULL AS is_friend',
		'blurred_image_url',
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

	public function getActions(){
		$subscriptions = OrganizationsCollection::filter(
			$this->db,
			$this->user,
			array(
				'friend' => $this
			), '', ' LIMIT 10');

		return $subscriptions;
	}

	public function getParams(User $user = null, array $fields = null) : Result{
		$result_data = parent::getParams($user, $fields)->getData();


		if (isset($fields[self::SUBSCRIPTIONS_FIELD_NAME])){
			$result_data[self::SUBSCRIPTIONS_FIELD_NAME] =
				$this->getSubscriptions(
					Fields::parseFields($fields[self::SUBSCRIPTIONS_FIELD_NAME]['fields'] ?? ''),
					array(
						'length' => $fields[self::SUBSCRIPTIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $fields[self::SUBSCRIPTIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
					),
					$fields[self::SUBSCRIPTIONS_FIELD_NAME]['order_by'] ?? array()
				)->getData();
		}

		if (isset($fields[self::ACTIONS_FIELD_NAME])){
			$result_data[self::ACTIONS_FIELD_NAME] = $this->getActions()->getData();
		}

		return new Result(true, '', $result_data);
	}

}