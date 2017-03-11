<?php

class OrganizationTypesCollection extends AbstractCollection{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id')){

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


		if (isset($pagination['offset'])){
			$q_get_types->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_types->limit($pagination['length']);
		}

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
					break;
				}
				case 'name': {
					if (isset($filters['strict']) && $filters['strict'] == true){
						$q_get_types->where('LOWER(name) = LOWER(:name)');
						$statements[':name'] = $value;
					}else{
						$q_get_types->where('LOWER(name) LIKE LOWER(:name)');
						$statements[':name'] = $value . '%';
					}
					break;
				}
			}
		}
		$types = $db->prepareExecute($q_get_types, '', $statements)->fetchAll(PDO::FETCH_CLASS, 'OrganizationType');
		if (count($types) == 0 && $is_one_type) throw new LogicException('CANT_FIND_TYPE');
		$result_events = array();
		foreach($types as $type){
			$result_events[] = $type->getParamsWithFilters($user, $fields, $filters)->getData();
		}
		return new Result(true, '', $result_events);
	}
}