<?php

class OrganizationType extends AbstractEntity{

	protected $id;
	protected $name;
	protected $created_at;
	protected $updated_at;
	protected $order_position;
	protected $city_id;

	const RANDOM_FIELD_NAME = 'random';
	const ORGANIZATIONS_FIELD_NAME = 'organizations';

	protected static $DEFAULT_COLS = array(
		'id',
		'name',
		'order_position'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at',
		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_organization_types AS vot
			WHERE vot.id = view_organization_types.id) AS random',
	);

	public function getParams(AbstractUser $user = null, array $fields = null) : Result {
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::ORGANIZATIONS_FIELD_NAME])){
			$result_data[self::ORGANIZATIONS_FIELD_NAME] =
			OrganizationsCollection::filter(
				App::DB(),
				$user,
				array('type_id' => $this->id),
				Fields::parseFields($fields[self::ORGANIZATIONS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::ORGANIZATIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::ORGANIZATIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::ORGANIZATIONS_FIELD_NAME]['order_by'] ?? '')
			)->getData();
		}
		return new Result(true, '', $result_data);
	}



	public function getParamsWithFilters(AbstractUser $user = null, array $fields = null, $filters = array()): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();
		if (isset($fields[self::ORGANIZATIONS_FIELD_NAME])) {
			$result_data[self::ORGANIZATIONS_FIELD_NAME] =
				OrganizationsCollection::filter(
					App::DB(),
					$user,
					array_merge($filters, array('type_id' => $this->id)),
					Fields::parseFields($fields[self::ORGANIZATIONS_FIELD_NAME]['fields'] ?? ''),
					array(
						'length' => $fields[self::ORGANIZATIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $fields[self::ORGANIZATIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
					),
					Fields::parseOrderBy($fields[self::ORGANIZATIONS_FIELD_NAME]['order_by'] ?? '')
				)->getData();
		}
		return new Result(true, '', $result_data);
	}


}