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

	public static function filter(PDO $db, User $user, array $filters = null,
	                              $order_by = array('organization_type_order', 'organization_type_id'),
	                              $friends_limit = null) {

		$statement_array = array();
		$_friend = null;
		$return_one = false;

		$cols = Fields::mergeFields(Organization::$ADDITIONAL_COLS, App::$__FIELDS, Organization::$DEFAULT_COLS);
		$select = APP::$QUERY_FACTORY->newSelect();

		$select
			->distinct()
			->from('view_organizations');


		foreach ($filters as $name => $value) {
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
				case 'id':{
					$return_one = true;
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
			->orderBy($order_by)
			->limit(App::$__LENGTH)
			->offset(App::$__OFFSET);

		if (isset(App::$__FIELDS['is_subscribed'])
			|| isset(App::$__FIELDS['subscription_id'])
			|| $return_one){
			$statement_array[':user_id'] = $user->getId();
		}

		$p_search = $db->prepare($select->getStatement());
		$p_search->execute($statement_array);

		if ($return_one){
			return $p_search->fetchObject('Organization');
		}else{
			$organizations = $p_search->fetchAll();
		}
		foreach ($organizations as &$org) {
			$fr = $user;
			if ($_friend != null){
				$fr = $_friend;
			}

			if (!is_null(App::getFieldsValue(Organization::SUBSCRIBED_FIELD_NAME))){
				$org[Organization::SUBSCRIBED_FIELD_NAME] = Organization::getSubscribed($db, $fr, $org['id'], $friends_limit)->getData();
			}
		}
		return new Result(true, '', $organizations);
	}
}