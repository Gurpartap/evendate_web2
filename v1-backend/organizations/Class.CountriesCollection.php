<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.Country.php';


class CountriesCollection extends AbstractCollection
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
		$cols = Fields::mergeFields(Country::getAdditionalCols(), $fields, Country::getDefaultCols());
		$q_get_countries = App::queryFactory()->newSelect();

		$q_get_countries
			->distinct()
			->from('view_countries');

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'local_name': {
					$q_get_countries->orWhere('LOWER(view_countries.local_name) LIKE LOWER(:local_name)');
					$statement_array[':local_name'] = $value . '%';
					break;
				}
				case 'language': {
					$q_get_countries->orWhere('LOWER(view_countries.language) LIKE LOWER(:language)');
					$statement_array[':language'] = $value . '%';
					break;
				}
				case 'language_short': {
					$q_get_countries->where('view_countries.language_short = :language_short');
					$statement_array[':language_short'] = $value;
					break;
				}
				case 'id': {
					foreach (Country::getAdditionalCols() as $key => $val) {
						if (is_numeric($key)) {
							$cols[] = $val;
						} else {
							$cols[] = $val;
						}
					}
					$q_get_countries->where('view_countries.id = :id');
					$statement_array[':id'] = $value;
					break;
				}
				case 'organization': {
					if ($value instanceof Organization) {
						$q_get_countries->where('view_countries.id = (SELECT country_id FROM view_organizations WHERE view_organizations.id = :organization_id)');
						$statement_array[':organization_id'] = $value->getId();
					}
					break;
				}
			}
		}


		$q_get_countries
			->cols($cols)
			->orderBy($order_by);

		if (isset($pagination['offset'])) {
			$q_get_countries->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_countries->limit($pagination['length']);
		}


		$countries = $p_search = $db
			->prepareExecute($q_get_countries, '', $statement_array)
			->fetchAll(PDO::FETCH_CLASS, 'Country');

		if ($return_one) {
			if (count($countries) < 1) throw new LogicException('CANT_FIND_COUNTRY');
			return $countries[0];
		}


		$result_array = array();

		foreach ($countries as $org) {
			$result_array[] = $org->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_array);
	}

	public static function one(ExtendedPDO $db,
														 AbstractUser $user,
														 int $id,
														 array $fields = null,
														 array $filters = null): Country
	{
		return self::filter($db, $user, array_merge($filters ?? array(), array('id' => $id)), $fields);
	}
}