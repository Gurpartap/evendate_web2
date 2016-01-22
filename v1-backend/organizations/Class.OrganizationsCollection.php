<?php

class OrganizationsCollection {

	private $db;
	private $user;

	public function __construct(PDO $db, User $user = null) {
		$this->db = $db;
		$this->user = $user;
	}

	public function setUser(User $user) {
		$this->user = $user;
	}

	public static function filter(PDO $db,
	                              User $user,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              $order_by = array('organization_type_order', 'organization_type_id')) {

		$statement_array = array();
		$_friend = null;
		$return_one = isset($filters['id']);
		$class_name = 'Organization';
		$cols = Fields::mergeFields(Organization::$ADDITIONAL_COLS, $fields, Organization::$DEFAULT_COLS);
		$select = APP::$QUERY_FACTORY->newSelect();

		$select
			->distinct()
			->from('view_organizations');


		foreach ($filters as $name => $value){
			switch ($name) {
				case 'name': {
					$select->orWhere('view_organizations.name LIKE :name');
					$statement_array[':name'] = '%' . $value . '%';
					break;
				}
				case 'description': {
					$select->orWhere('view_organizations.description LIKE :description');
					$statement_array[':description'] = '%' . $value . '%';
					break;
				}
				case 'short_name': {
					$select->orWhere('view_organizations.short_name LIKE :short_name');
					$statement_array[':short_name'] = '%' . $value . '%';
					break;
				}
				case 'type_id': {
					$select->where('view_organizations.organization_type_id = :type_id');
					$statement_array[':type_id'] = $value;
					break;
				}
				case 'id': {
					foreach(Organization::$ADDITIONAL_COLS as $key => $val){
						if (is_numeric($key)){
							$cols[] = $val;
						}else{
							$cols[] = $val;
						}
					}
					$select->where('view_organizations.id = :id');
					$statement_array[':id'] = $value;
				}
				case (Organization::IS_SUBSCRIBED_FIELD_NAME): {
					if ($return_one) break;
					if (!isset($fields[Organization::IS_SUBSCRIBED_FIELD_NAME])){
						$fields[] = Organization::$ADDITIONAL_COLS[Organization::IS_SUBSCRIBED_FIELD_NAME];
					}
					$select->where('(SELECT
						id IS NOT NULL = TRUE AS is_subscribed
						FROM subscriptions
						WHERE organization_id = "view_organizations"."id"
							AND "subscriptions"."status" = TRUE
							AND user_id = :user_id) = TRUE');
					$statement_array[':user_id'] = $user->getId();
					$class_name = 'Subscription';
					break;
				}
//				case 'friend': {
//					if ($value instanceof Friend) {
//						$_friend = $value;
//						$statement_array[':user_id'] = $value->getId();
//						$q_get_organizations .= ' AND subscriptions.user_id = :user_id AND is_subscribed = TRUE';
//					}
//					break;
//				}
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

		$organizations = $p_search->fetchAll(PDO::FETCH_CLASS, $class_name);

		if ($return_one){
			return $organizations[0];
		}

		$result_array = array();

		foreach ($organizations as $org) {
			$result_array[] = $org->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_array);
	}
}