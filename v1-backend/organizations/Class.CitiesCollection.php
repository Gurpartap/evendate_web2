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
		$getting_distance = isset($fields['distance']);
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
				case 'local_name_strict': {
					$q_get_cities->orWhere('LOWER(view_cities.local_name) = LOWER(:local_name_strict)');
					$statement_array[':local_name_strict'] = $value;
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
					if ($value instanceof Organization) {
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
					$getting_distance = true;
					$q_get_cities->where('view_cities.id = :id');
					$statement_array[':id'] = $value;
					break;
				}
			}
		}


		if ($getting_distance) {
			$statement_array[':latitude'] = $filters['latitude'] ?? 0;
			$statement_array[':longitude'] = $filters['longitude'] ?? 0;
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


		$cities = $db
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


	private static function mb_ucfirst($str)
	{
		$str = mb_strtolower($str);
		$fc = mb_strtoupper(mb_substr($str, 0, 1));
		return $fc . mb_substr($str, 1);
	}

	public static function create(ExtendedPDO $db, string $name): City
	{
		if (is_numeric($name)) {
			$filters = array('id' => $name);
			$cities = array(self::filter($db,
				App::getCurrentUser(),
				$filters,
				array(),
				array(),
				array())->getParams(App::getCurrentUser(), City::getDefaultCols())->getData());
		} else {
			$name = preg_replace('/\s+/', ' ', $name);
			$parts = explode(' ', $name);
			foreach ($parts as &$part) {
				$part = self::mb_ucfirst($part);
			}
			$name = implode(' ', $parts);
			$filters = array('local_name_strict' => $name);
			$cities = self::filter($db,
				App::getCurrentUser(),
				$filters,
				array(),
				array(),
				array())->getData();
		}

		if (count($cities) == 0) {
			$q_ins_city = 'INSERT INTO cities(en_name, local_name, timediff_seconds, country_id, latitude, longitude)
								VALUES(:name, :name, 0, 1, 100500, 100500) RETURNING id';
			$p_ins_city = $db->prepareExecuteRaw($q_ins_city, array(
				':name' => $name
			));

			$result = $p_ins_city->fetch(PDO::FETCH_ASSOC);
			$city_id = $result['id'];
		} else {
			$city_id = intval($cities[0]['id']);
		}
		return self::one($db, App::getCurrentUser(), $city_id, array());
	}
}