<?php

class City extends AbstractEntity
{

	protected $id;
	protected $en_name;
	protected $created_at;
	protected $country_id;
	protected $updated_at;

	const COUNTRY_FIELD_NAME = 'country';
	const ORGANIZATIONS_TYPES_FIELD_NAME = 'organizations_types';
	const DISTANCE_FIELD_NAME = 'distance';

	protected static $DEFAULT_COLS = array(
		'id',
		'en_name',
		'country_id',
		'local_name'
	);

	protected static $ADDITIONAL_COLS = array(
		'timediff_seconds',
		'created_at',
		'updated_at',
		self::DISTANCE_FIELD_NAME => '(SELECT ((point(c.longitude, c.latitude) <@> point(:longitude, :latitude)))::INT AS distance 
		FROM cities AS c WHERE c.id = view_cities.id)::INT AS ' . self::DISTANCE_FIELD_NAME
	);

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::COUNTRY_FIELD_NAME])) {
			$_fields =
				Fields::parseFields($fields[self::COUNTRY_FIELD_NAME]['fields'] ?? '');
			$result_data[self::COUNTRY_FIELD_NAME] =
				CountriesCollection::one(
					App::DB(),
					$user,
					$this->country_id,
					$_fields,
					array()
				)->getParams($user, $_fields)->getData();
		}

		if (isset($fields[self::ORGANIZATIONS_TYPES_FIELD_NAME])) {
			$_fields =
				Fields::parseFields($fields[self::ORGANIZATIONS_TYPES_FIELD_NAME]['fields'] ?? '');
			$result_data[self::ORGANIZATIONS_TYPES_FIELD_NAME] =
				OrganizationTypesCollection::filter(
					App::DB(),
					$user,
					array('city_id' => $this->id),
					$_fields,
					array()
				)->getData();
		}
		return new Result(true, '', $result_data);
	}


}