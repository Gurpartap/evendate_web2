<?php

class OrganizationsCollection extends AbstractCollection
{

	private $db;
	private $user;


	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('organization_type_order', 'organization_type_id'))
	{

		$statement_array = array();
		$_friend = null;
		$return_one = isset($filters['id']);
		$cols = Fields::mergeFields(Organization::getAdditionalCols(), $fields, Organization::getDefaultCols());
		$q_get_organizations = App::queryFactory()->newSelect();

		$q_get_organizations
			->distinct()
			->from('view_organizations');

		$instance_class_name = 'Organization';

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'name': {
					$q_get_organizations->orWhere('LOWER(view_organizations.name) LIKE LOWER(:name)');
					$statement_array[':name'] = $value . '%';
					break;
				}
				case 'description': {
					$q_get_organizations->orWhere('LOWER(view_organizations.description) LIKE LOWER(:description)');
					$statement_array[':description'] = $value . '%';
					break;
				}
				case 'short_name': {
					$q_get_organizations->orWhere('LOWER(view_organizations.short_name) LIKE LOWER(:short_name)');
					$statement_array[':short_name'] = $value . '%';
					break;
				}
				case 'type_id': {
					$q_get_organizations->where('view_organizations.organization_type_id = :type_id');
					$statement_array[':type_id'] = $value;
					break;
				}
				case 'city_id': {
					$q_get_organizations->where('view_organizations.city_id = :city_id');
					$statement_array[':city_id'] = $value;
					break;
				}
				case 'country_id': {
					$q_get_organizations->where('view_organizations.country_id = :country_id');
					$statement_array[':city_id'] = $value;
					break;
				}
				case 'q': {
					$q_get_organizations->where('fts @@ to_tsquery(:search_stm)');
					$statement_array[':search_stm'] = App::prepareSearchStatement($value);
					break;
				}
				case 'invitation_key': {
					if ($value == null) break;
					$getting_private_organization = true;
					$q_get_organizations->where(':invitation_key = (SELECT DISTINCT uuid 
						FROM view_invitation_links 
						WHERE view_invitation_links.organization_id=view_organizations.id 
						AND uuid = :invitation_key)');
					$statement_array[':invitation_key'] = $value;
					break;
				}
				case 'is_private': {
					$getting_private_organization = true;
					$q_get_organizations->where('id IN (SELECT organization_id 
						FROM view_users_organizations 
						WHERE user_id = :user_id)');
					$statement_array[':user_id'] = $user->getId();
					break;
				}
				case 'roles': {
					$values = explode(',', $value);
					$in_ids = [];
					foreach ($values as $curr_value) {
						if (in_array($curr_value, Roles::ROLES) == false) throw new InvalidArgumentException('CANT_FIND_ROLE: ' . $curr_value);
						$in_ids[] = Roles::getId($curr_value);
					}
					if (count($in_ids) == 0) break;

					$roles_str = [];
					foreach ($in_ids as $index => $role_id) {
						$key = ':role_id_' . $index;
						$roles_str[] = $key;
						$statement_array[$key] = $role_id;
					}
					$q_get_organizations
						->join('INNER', 'users_organizations', 'users_organizations.organization_id = view_organizations.id AND users_organizations.status = TRUE')
						->where('users_organizations.user_id = :user_id')
						->where('users_organizations.status = TRUE')
						->where('users_organizations.role_id IN (' . implode(',', $roles_str) . ')');


					$statement_array[':user_id'] = $user->getId();
					break;
				}
				case 'id': {
					$getting_private_organization = true;
					foreach (Organization::getAdditionalCols() as $key => $val) {
						if (is_numeric($key)) {
							$cols[] = $val;
						} else {
							$cols[] = $val;
						}
					}
					$q_get_organizations->where('view_organizations.id = :id');
					$statement_array[':id'] = $value;
					break;
				}
				case (Organization::IS_SUBSCRIBED_FIELD_NAME): {
					if ($return_one) break;
					if (!isset($fields[Organization::IS_SUBSCRIBED_FIELD_NAME])) {
						$fields[] = Organization::IS_SUBSCRIBED_FIELD_NAME;
					}
					$q_get_organizations->where('(SELECT
						id IS NOT NULL = ' . (filter_var($value, FILTER_VALIDATE_BOOLEAN) ? ' TRUE' : 'FALSE') . '
						FROM subscriptions
						WHERE organization_id = "view_organizations"."id"
							AND "subscriptions"."status" = TRUE
							AND user_id = :user_id) IS NOT NULL');

					$statement_array[':user_id'] = $user->getId();
					break;
				}
				case 'friend': {
					if ($value instanceof Friend || $value instanceof AbstractUser) {
						$q_get_organizations->where('(SELECT
							id IS NOT NULL = TRUE AS is_subscribed
							FROM subscriptions
							WHERE organization_id = "view_organizations"."id"
								AND "subscriptions"."status" = TRUE
								AND user_id = :friend_id) = TRUE');
						$statement_array[':friend_id'] = $value->getId();
					}
					break;
				}
				case 'recommendations': {

					if ($value instanceof NotAuthorizedUser) break;


					$fields[] = Organization::RATING_OVERALL;
					$cols[] = Organization::getAdditionalCols()[Organization::RATING_OVERALL];


					$q_get_organizations->where('(SELECT
						id
						FROM subscriptions
						WHERE organization_id = "view_organizations"."id"
							AND "subscriptions"."status" = TRUE
							AND user_id = :user_id) IS NULL');

					$statement_array[':user_id'] = $user->getId();
					$order_by = array('rating DESC');
					break;
				}
			}
		}


		if (isset($filters[Organization::IS_SUBSCRIBED_FIELD_NAME])) {
			$cols[] = Organization::getAdditionalCols()[Organization::IS_SUBSCRIBED_FIELD_NAME];
		}

		if (isset($fields[Organization::NEW_EVENTS_COUNT_FIELD_NAME]) ||
			isset($fields[Organization::IS_SUBSCRIBED_FIELD_NAME])
			|| isset($fields[Organization::SUBSCRIPTION_ID_FIELD_NAME])
			|| $return_one
		) {
			$statement_array[':user_id'] = $user->getId();
		}

		$q_get_organizations
			->where('(is_private = false OR (
				
					id IN 
						(SELECT organization_id FROM organizations_invitations WHERE 
						(user_id = :user_id OR email = :email) AND status = true) 						
					OR	 
					id IN 
					(SELECT organization_id FROM subscriptions WHERE user_id = :user_id AND status = true) 
					
					OR 
					id IN 
					(SELECT organization_id FROM users_organizations WHERE user_id = :user_id AND status = true)
					
					))');

		$statement_array[':user_id'] = $user->getId();
		if ($user instanceof User) {
			$statement_array[':email'] = $user->getEmail();
		} else {
			$statement_array[':email'] = '-';
		}


		if (isset($getting_private_organization) && $getting_private_organization == true) {
			$instance_class_name = 'PrivateOrganization';
		}


		$q_get_organizations
			->cols($cols)
			->orderBy($order_by);

		if (isset($pagination['offset'])) {
			$q_get_organizations->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_organizations->limit($pagination['length']);
		}


		$organizations = $p_search = $db
			->prepareExecute($q_get_organizations, '', $statement_array)
			->fetchAll(PDO::FETCH_CLASS, $instance_class_name);

		if ($return_one) {
			if (count($organizations) < 1) throw new LogicException('CANT_FIND_ORGANIZATION');
			return $organizations[0];
		}


		$result_array = array();

		foreach ($organizations as $org) {
			$result_array[] = $org->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_array);
	}

	public static function one(ExtendedPDO $db,
														 AbstractUser $user,
														 int $id,
														 array $fields = null,
														 array $filters = null): Organization
	{
		$organization = self::filter($db,
			$user,
			array_merge($filters ?? array(), array('id' => $id)),
			$fields
		);
		return $organization;
	}


	public static function onePrivate(ExtendedPDO $db,
																		AbstractUser $user,
																		int $id,
																		string $uuid = null,
																		array $fields = null): PrivateOrganization
	{
		$organization = self::filter($db,
			$user,
			array('id' => $id, 'invitation_key' => $uuid, 'is_private' => true),
			$fields
		);
		return $organization;
	}
}