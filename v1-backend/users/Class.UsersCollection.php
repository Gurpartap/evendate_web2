<?php

require_once 'Class.RegisteredUser.php';


class UsersCollection extends AbstractCollection
{

	public static function filter(PDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{


		$q_get_users = App::queryFactory()->newSelect();


		$q_get_users
			->distinct()
			->from('view_users')
			->join('LEFT', 'view_friends', 'view_friends.user_id = view_users.id AND view_friends.friend_id = :user_id');

		if (isset($pagination['offset'])) {
			$q_get_users->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_users->limit($pagination['length']);
		}


		if ($user instanceof User) {
			$statement_array = array(':user_id' => $user->getId());
		} else {
			$statement_array = array(':user_id' => NULL);
		}
		$is_one_user = false;

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'organization': {
					if ($value instanceof Organization) {
						$q_get_users
							->join('INNER', 'subscriptions', 'subscriptions.user_id = view_users.id')
							->where('subscriptions.organization_id = :organization_id')
							->where('subscriptions.status = TRUE');
						$statement_array[':organization_id'] = $value->getId();
					}
					break;
				}
				case 'event': {
					if ($value instanceof Event) {
						$q_get_users
							->join('INNER', 'favorite_events', 'favorite_events.user_id = view_users.id')
							->where('favorite_events.event_id = :event_id')
							->where('favorite_events.status = TRUE');
						$statement_array[':event_id'] = $value->getId();
					}
					break;
				}
				case 'staff': {
					if ($value instanceof Organization) {
						if (!$user->isAdmin($value)) throw new PrivilegesException('', $db);
						$q_get_users
							->join('INNER', 'users_organizations', 'users_organizations.user_id = view_users.id')
							->join('INNER', 'users_roles', 'users_roles.id = users_organizations.role_id')
							->where('users_organizations.organization_id = :organization_id')
							->where('users_organizations.status = TRUE');
						$statement_array[':organization_id'] = $value->getId();
						$_fields[] = 'users_roles.name AS role';
						$fields[] = 'role';

						if (isset($filters['roles'])) {
							$roles = $filters['roles'];
							$values = explode(',', $roles);
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
							$q_get_users->where('users_organizations.role_id IN (' . implode(',', $roles_str) . ')');
						}

					}
					break;
				}
				case 'id': {
					$q_get_users->where('id = :id');
					$statement_array[':id'] = $value;
					$is_one_user = true;
					break;
				}
				case 'user': {
					if ($value instanceof User) {
						$q_get_users
							->where('view_friends.user_id IS NOT NULL');
						$statement_array[':user_id'] = $value->getId();
					}
					break;
				}
				case 'first_name': {
					$value = mb_strtolower(trim($value));
					if (empty($value)) break;
					if (isset($filters['strict']) && filter_var($filters['strict'], FILTER_VALIDATE_BOOLEAN) == true) {
						$q_get_users->where('LOWER(first_name) = LOWER(:first_name)');
						$statement_array[':first_name'] = $value;
					} else {
						$q_get_users->where('LOWER(first_name) LIKE LOWER(:first_name)');
						$statement_array[':first_name'] = $value . '%';
					}
					break;
				}
				case 'last_name': {
					$value = mb_strtolower(trim($value));
					if (empty($value)) break;
					if (isset($filters['strict']) && filter_var($filters['strict'], FILTER_VALIDATE_BOOLEAN) == true) {
						$q_get_users->where('LOWER(last_name) = LOWER(:last_name)');
						$statement_array[':first_name'] = $value;
					} else {
						$q_get_users->where('LOWER(last_name) LIKE LOWER(:last_name)');
						$statement_array[':last_name'] = $value . '%';
					}
					break;
				}
				case 'name': {
					$value = mb_strtolower(trim($value));
					if (empty($value)) break;
					if (isset($filters['strict']) && filter_var($filters['strict'], FILTER_VALIDATE_BOOLEAN) == true) {
						$q_get_users->where('LOWER(CONCAT(last_name, \' \', first_name)) = LOWER(:name) 
                                OR 
                                    LOWER(CONCAT(first_name, \' \', last_name)) = LOWER(:name) ');
						$statement_array[':name'] = $value;
					} else {
						$q_get_users->where('LOWER(CONCAT(last_name,\' \', first_name)) LIKE LOWER(:name)
                            OR 
                            LOWER(CONCAT(first_name,\' \', last_name)) LIKE LOWER(:name)');
						$statement_array[':name'] = $value . '%';
					}
					break;
				}
				case 'registered_users': {
					$getting_registered_users = true;
					if ($value instanceof Event == false) throw new InvalidArgumentException('BAD_EVENT');
					if ($user->isAdmin($value->getOrganization()) == false) throw new PrivilegesException('', $db);
					$fields['event_id'] = 'event_id';
					$q_get_users
						->join('INNER', 'users_registrations', 'users_registrations.user_id = view_users.id')
						->where('users_registrations.event_id = :event_id');
					$statement_array[':event_id'] = $value->getId();
					break;
				}
				case 'registered_status': {
					if (!array_key_exists('registered_users', $filters)) throw new InvalidArgumentException('registered_users filter is required for ' . $name);
					$_val = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
					$q_get_users
						->where('users_registrations.status = :registered_status');
					$statement_array[':registered_status'] = $_val;
					break;
				}
				case 'organization_approved': {
					if (!array_key_exists('registered_users', $filters)) throw new InvalidArgumentException('registered_users filter is required for ' . $name);
					$_val = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
					$q_get_users
						->where('users_registrations.organization_approved = :organization_approved');
					$statement_array[':organization_approved'] = $_val;
					break;
				}
				case 'registered_checked_out': {
					if (!array_key_exists('registered_users', $filters)) throw new InvalidArgumentException('registered_users filter is required for ' . $name);
					$_val = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
					$q_get_users
						->where('users_registrations.checked_out = :checked_out');
					$statement_array[':checked_out'] = $_val;
					break;
				}
			}
		}

		if (isset($getting_registered_users) && $getting_registered_users === true) {
			$class_name = 'RegisteredUser';
			$default_cols = RegisteredUser::getDefaultCols();
			foreach ($default_cols as &$col) {
				$col = 'view_users.' . $col;
			}
			$_fields = Fields::mergeFields(RegisteredUser::getAdditionalCols(), $fields, $default_cols);
		} else {
			$default_cols = Friend::getDefaultCols();
			foreach ($default_cols as &$col) {
				$col = 'view_users.' . $col;
			}
			$_fields = Fields::mergeFields(Friend::getAdditionalCols(), $fields, $default_cols);
			$class_name = 'Friend';
		}


//		print_r($_fields);
		$q_get_users->cols($_fields);

		$q_get_users->orderBy($order_by);
		$p_get_events = $db->prepare($q_get_users->getStatement());
//		echo $q_get_users->getStatement();
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$users = $p_get_events->fetchAll(PDO::FETCH_CLASS, $class_name);
		if (count($users) == 0 && $is_one_user) throw new LogicException('CANT_FIND_USER');
		$result_users = array();
		if ($is_one_user) {
			return $users[0];
		}
		foreach ($users as $friend) {
			$result_users[] = $friend->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_users);

	}

	public static function one(PDO $db, AbstractUser $user, int $id, array $fields = null): Friend
	{
		$friend = parent::one($db, $user, $id, $fields);
		return $friend;
	}


}