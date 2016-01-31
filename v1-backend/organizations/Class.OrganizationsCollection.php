<?php

class OrganizationsCollection {

	private $db;
	private $user;


	public static function filter(PDO $db,
	                              User $user,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              $order_by = array('organization_type_order', 'organization_type_id')) {

		$statement_array = array();
		$_friend = null;
		$return_one = isset($filters['id']);
		$cols = Fields::mergeFields(Organization::getAdditionalCols(), $fields, Organization::getDefaultCols());
		$select = APP::queryFactory()->newSelect();

		$select
			->distinct()
			->from('view_organizations');


		foreach ($filters as $name => $value){
			switch ($name) {
				case 'name': {
					$select->orWhere('view_organizations.name LIKE :name');
					$statement_array[':name'] = $value . '%';
					break;
				}
				case 'description': {
					$select->orWhere('view_organizations.description LIKE :description');
					$statement_array[':description'] = $value . '%';
					break;
				}
				case 'short_name': {
					$select->orWhere('view_organizations.short_name LIKE :short_name');
					$statement_array[':short_name'] = $value . '%';
					break;
				}
				case 'type_id': {
					$select->where('view_organizations.organization_type_id = :type_id');
					$statement_array[':type_id'] = $value;
					break;
				}
				case 'id': {
					foreach(Organization::getAdditionalCols() as $key => $val){
						if (is_numeric($key)){
							$cols[] = $val;
						}else{
							$cols[] = $val;
						}
					}
					$select->where('view_organizations.id = :id');
					$statement_array[':id'] = $value;
					break;
				}
				case (Organization::IS_SUBSCRIBED_FIELD_NAME): {
					if ($return_one) break;
					if (!isset($fields[Organization::IS_SUBSCRIBED_FIELD_NAME])){
						$fields[] = Organization::getAdditionalCols()[Organization::IS_SUBSCRIBED_FIELD_NAME];
					}
					$select->where('(SELECT
						id IS NOT NULL = TRUE AS is_subscribed
						FROM subscriptions
						WHERE organization_id = "view_organizations"."id"
							AND "subscriptions"."status" = TRUE
							AND user_id = :user_id) = TRUE');
					$statement_array[':user_id'] = $user->getId();
					break;
				}
				case 'friend': {
					if ($value instanceof Friend) {
						$select->where('(SELECT
							id IS NOT NULL = TRUE AS is_subscribed
							FROM subscriptions
							WHERE organization_id = "view_organizations"."id"
								AND "subscriptions"."status" = TRUE
								AND user_id = :user_id) = TRUE');
						$statement_array[':user_id'] = $value->getId();
					}
					break;
				}
			}
		}

		$select
			->cols($cols)
			->orderBy($order_by);

		if (isset($pagination['offset'])){
			$select->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$select->limit($pagination['length']);
		}

		if (isset($fields[Organization::IS_SUBSCRIBED_FIELD_NAME])
			|| isset($fields[Organization::SUBSCRIPTION_ID_FIELD_NAME])
			|| $return_one){
			$statement_array[':user_id'] = $user->getId();
		}

		$p_search = $db->prepare($select->getStatement());
		$p_search->execute($statement_array);

		$organizations = $p_search->fetchAll(PDO::FETCH_CLASS, 'Organization');

		if ($return_one) return $organizations[0];


		$result_array = array();

		foreach ($organizations as $org) {
			$result_array[] = $org->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_array);
	}

	public static function one(PDO $db,
	                           User $user,
	                           int $id,
	                           array $fields = null) : Organization{

		$organization = self::filter($db, $user, array('id' => $id), $fields);
		Statistics::Organization(
			$organization,
			$user,
			$db,
			Statistics::ORGANIZATION_VIEW
		);
		return $organization;
	}
}