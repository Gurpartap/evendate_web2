<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.City.php';


class CitiesCollection extends AbstractCollection
{


	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$statement_array = array();
		$_friend = null;
		$return_one = isset($filters['id']);
		$cols = Fields::mergeFields(City::getAdditionalCols(), $fields, City::getDefaultCols());
		$q_get_cities = App::queryFactory()->newSelect();

		$q_get_cities
			->distinct()
			->from('view_cities');

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'local_name': {
					$q_get_cities->orWhere('LOWER(view_cities.local_name) LIKE LOWER(:local_name)');
					$statement_array[':local_name'] = $value . '%';
					break;
				}
				case 'en_name': {
					$q_get_cities->orWhere('LOWER(view_cities.en_name) LIKE LOWER(:en_name)');
					$statement_array[':en_name'] = $value . '%';
					break;
				}
				case 'country_id': {
					$q_get_cities->where('view_cities.country_id = :country_id');
					$statement_array[':country_id'] = $value;
					break;
				}
				case 'organization': {
					if ($value instanceof Organization){
						$q_get_cities->where('view_cities.id = (SELECT city_id FROM organizations WHERE organizations.id = :organization_id)');
						$statement_array[':organization_id'] = $value->getId();
					}
					break;
				}
				case 'id': {
					foreach (City::getAdditionalCols() as $key => $val) {
						if (is_numeric($key)) {
							$cols[] = $val;
						} else {
							$cols[] = $val;
						}
					}
					$q_get_cities->where('view_cities.id = :id');
					$statement_array[':id'] = $value;
					break;
				}
			}
		}


		if (isset($fields['distance'])){
			$statement_array[':latitude'] = $filters['latitude'];
			$statement_array[':longitude'] = $filters['longitude'];
		}

		$q_get_cities
			->cols($cols)
			->orderBy($order_by);

		if (isset($pagination['offset'])) {
			$q_get_cities->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_cities->limit($pagination['length']);
		}


		$cities = $p_search = $db
			->prepareExecute($q_get_cities, '', $statement_array)
			->fetchAll(PDO::FETCH_CLASS, 'City');

		if ($return_one) {
			if (count($cities) < 1) throw new LogicException('CANT_FIND_CITY');
			return $cities[0];
		}


		$result_array = array();

		foreach ($cities as $org) {
			$result_array[] = $org->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_array);
	}

	public static function one(ExtendedPDO $db,
														 AbstractUser $user,
														 int $id,
														 array $fields = null,
														 array $filters = null): City
	{
		return self::filter($db,
			$user,
			array_merge($filters ?? array(), array('id' => $id)),
			$fields
		);
	}
}