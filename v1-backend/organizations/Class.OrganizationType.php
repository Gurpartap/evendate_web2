<?php

class OrganizationType extends AbstractEntity{

	protected $id;
	protected $name;
	protected $created_at;
	protected $updated_at;
	protected $order_position;

	const ORGANIZATIONS_FIELD_NAME = 'organizations';

	protected static $DEFAULT_COLS = array(
		'id',
		'name',
		'order_position'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at'
	);

	public function getParams(User $user = null, array $fields = null) : Result {
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::ORGANIZATIONS_FIELD_NAME])){
			$result_data[self::ORGANIZATIONS_FIELD_NAME] =
			OrganizationsCollection::filter(
				App::DB(),
				$user,
				array('type_id' => $this->id),
				Fields::parseFields($fields[self::ORGANIZATIONS_FIELD_NAME]['fields'] ?? ''),
				$fields[self::ORGANIZATIONS_FIELD_NAME]['pagination'] ?? array(),
				$fields[self::ORGANIZATIONS_FIELD_NAME]['order_by'] ?? array()
			)->getData();
		}
		return new Result(true, '', $result_data);
	}


}