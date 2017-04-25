<?php

class OrganizationTypesCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$q_get_types = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_type = false;

		$q_get_types->distinct()
			->cols(Fields::mergeFields(OrganizationType::getAdditionalCols(),
				$fields,
				OrganizationType::getDefaultCols())
			)
			->from('view_organization_types')
			->orderBy($order_by);


		if (isset($pagination['offset'])) {
			$q_get_types->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_types->limit($pagination['length']);
		}

		$city_part = '';

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id': {
					$q_get_types->where('id = :id');
					$statements[':id'] = $value;
					$is_one_type = true;
					break;
				}
				case 'city_id': {
					$q_get_types->where('id IN (SELECT DISTINCT type_id FROM organizations WHERE city_id = :city_id)');
					$statements[':city_id'] = $value;
					$city_part = ' AND city_id = :city_id';
					break;
				}
				case 'name': {
					if (isset($filters['strict']) && $filters['strict'] == true) {
						$q_get_types->where('LOWER(name) = LOWER(:name)');
						$statements[':name'] = $value;
					} else {
						$q_get_types->where('LOWER(name) LIKE LOWER(:name)');
						$statements[':name'] = $value . '%';
					}
					break;
				}
			}
		}


		$q_get_types->where('(view_organization_types.id IN (
			SELECT type_id FROM organizations WHERE is_private = FALSE ' . $city_part . '
		) 
		OR 
		
			view_organization_types.id IN (SELECT organizations.type_id
				FROM organizations
				INNER JOIN subscriptions ON organizations.id = subscriptions.organization_id
				WHERE subscriptions.status = TRUE AND subscriptions.user_id = :user_id))');
		$statements[':user_id'] = $user->getId();

		$types = $db->prepareExecute($q_get_types, '', $statements)->fetchAll(PDO::FETCH_CLASS, 'OrganizationType');
		if (count($types) == 0 && $is_one_type) throw new LogicException('CANT_FIND_TYPE');
		$result_events = array();
		foreach ($types as $type) {
			$result_events[] = $type->getParamsWithFilters($user, $fields, $filters)->getData();
		}
		return new Result(true, '', $result_events);
	}
}