<?php

require_once 'Class.RegisteredUser.php';


class UsersCollection extends AbstractCollection
{

	public static function getStatement(ExtendedPDO $db,
																			AbstractUser $user = null,
																			array $filters = null,
																			array $fields = null,
																			array $pagination = null,
																			array $order_by = array('id'))
	{
		$q_get_users = App::queryFactory()->newSelect();

		$default_cols = Friend::getDefaultCols();
		foreach ($default_cols as &$col) {
			$col = 'view_users.' . $col;
		}
		$_fields = Fields::mergeFields(Friend::getAdditionalCols(), $fields, $default_cols);
		$class_name = 'Friend';


		$q_get_users
			->distinct()
			->from('view_users');

		if (isset($filters['user']) || in_array('is_friend', $fields) || isset($fields['is_friend'])) {
			$q_get_users->join('LEFT', 'view_friends', 'view_friends.user_id = view_users.id AND view_friends.friend_id = :user_id');
		}

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
				case 'organization':
					{
						if ($value instanceof Organization) {
							$q_get_users
								->join('INNER', 'subscriptions', 'subscriptions.user_id = view_users.id')
								->where('subscriptions.organization_id = :organization_id')
								->where('subscriptions.status = TRUE');
							$statement_array[':organization_id'] = $value->getId();
						}
						break;
					}
				case 'event':
					{
						if ($value instanceof Event) {
							$q_get_users
								->join('INNER', 'favorite_events', 'favorite_events.user_id = view_users.id')
								->where('favorite_events.event_id = :event_id')
								->where('favorite_events.status = TRUE');
							$statement_array[':event_id'] = $value->getId();
						}
						break;
					}
				case 'staff':
					{
						if ($value instanceof Organization) {
							if (!$user->hasRights($value, array(Roles::ROLE_ADMIN, Roles::ROLE_MODERATOR))) throw new PrivilegesException('NOT_ADMIN_OR_MODERATOR', $db);
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
				case 'id':
					{
						$q_get_users->where('id = :id');
						$statement_array[':id'] = $value;
						$is_one_user = true;
						break;
					}
				case 'user':
					{
						if ($value instanceof User) {
							$q_get_users
								->where('view_friends.user_id IS NOT NULL');
							$statement_array[':user_id'] = $value->getId();
						}
						break;
					}
				case 'first_name':
					{
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
				case 'last_name':
					{
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
				case 'email':
					{
						$value = mb_strtolower(trim($value));
						if (empty($value)) break;
						$q_get_users->where('LOWER(email) = LOWER(:email)');
						$statement_array[':email'] = $value;
						break;
					}
				case 'name':
					{
						$value = mb_strtolower(trim($value));
						$lat_translit = App::transliterate('cyr', $value);
						$cyr_translit = App::transliterate('lat', $value);

						if ($value == $lat_translit) {
							$transliterated = $cyr_translit;
						} elseif ($value == $cyr_translit) {
							$transliterated = $lat_translit;
						} else {
							$transliterated = $cyr_translit;
						}
						if (empty($value)) break;
						if (isset($filters['strict']) && filter_var($filters['strict'], FILTER_VALIDATE_BOOLEAN) == true) {
							$q_get_users->where('
						(LOWER(CONCAT(last_name, \' \', first_name)) = LOWER(:name) 
							OR 
							LOWER(CONCAT(first_name, \' \', last_name)) = LOWER(:name)
						) 
						OR 
						(LOWER(CONCAT(last_name, \' \', first_name)) = LOWER(:transliterated_name) 
							OR 
						LOWER(CONCAT(first_name, \' \', last_name)) = LOWER(:transliterated_name)
						)
						');
							$statement_array[':name'] = $value;
							$statement_array[':transliterated_name'] = $transliterated;
						} else {
							$q_get_users->where('
						(LOWER(CONCAT(last_name,\' \', first_name)) LIKE LOWER(:name)
							OR 
							LOWER(CONCAT(first_name,\' \', last_name)) LIKE LOWER(:name)
						)
						OR
						(LOWER(CONCAT(last_name,\' \', first_name)) LIKE LOWER(:transliterated_name)
							OR 
						LOWER(CONCAT(first_name,\' \', last_name)) LIKE LOWER(:transliterated_name)
						)');
							$statement_array[':name'] = $value . '%';
							$statement_array[':transliterated_name'] = $transliterated . '%';
						}
						break;
					}
				case 'participants':
					{
						$getting_registered_users = true;
						$class_name = 'RegisteredUser';
						$default_cols = RegisteredUser::getDefaultCols();
						foreach ($default_cols as &$col) {
							$col = 'view_users.' . $col;
						}
						$_fields = Fields::mergeFields(RegisteredUser::getAdditionalCols(), $fields, $default_cols);

						if ($value instanceof Event == false) throw new InvalidArgumentException('BAD_EVENT');
						if ($user->isAdmin($value->getOrganization()) == false) throw new PrivilegesException('', $db);
						$fields['event_id'] = 'event_id';
						$q_get_users
							->join('INNER', 'view_tickets', 'view_tickets.user_id = view_users.id')
							->join('INNER', 'view_tickets_orders', 'view_tickets.ticket_order_id = view_tickets_orders.id')
							->where('view_tickets_orders.event_id = :event_id')
							->where('view_tickets_orders.is_active = TRUE');
						$statement_array[':event_id'] = $value->getId();
						break;
					}
//				case 'registered_status': {
//					if (!array_key_exists('registered_users', $filters)) throw new InvalidArgumentException('registered_users filter is required for ' . $name);
//					$_val = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
//					$q_get_users
//						->where('users_registrations.status = :registered_status');
//					$statement_array[':registered_status'] = $_val;
//					break;
//				}
				case 'organization_approved':
					{
						if (!array_key_exists('registered_users', $filters)) throw new BadArgumentException('REGISTERED_USERS_REQUIRED', $db, $name);
						$_val = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
						$q_get_users
							->where('users_registrations.organization_approved = :organization_approved');
						$statement_array[':organization_approved'] = $_val;
						break;
					}
				case 'registered_checked_out':
					{
						if (!array_key_exists('registered_users', $filters)) throw new BadArgumentException('REGISTERED_USERS_REQUIRED', $db, $name);
						$_val = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
						$q_get_users
							->where('users_registrations.checked_out = :checked_out');
						$statement_array[':checked_out'] = $_val;
						break;
					}
			}
		}

		$q_get_users->where(':user_id = :user_id');

//		print_r($_fields);
		$q_get_users->cols($_fields);

		$q_get_users->orderBy($order_by);

		return array(
			'query' => $q_get_users,
			'statements' => $statement_array,
			'is_one' => $is_one_user,
			'class_name' => $class_name
		);
	}

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{
		$_filtering = self::getStatement($db, $user, $filters, $fields, $pagination, $order_by);
		$is_one_user = $_filtering['is_one'];
		$q_get_users = $_filtering['query'];
		$statement_array = $_filtering['statements'];
		$class_name = $_filtering['class_name'];

		$users = $db->prepareExecute($q_get_users, '', $statement_array)->fetchAll(PDO::FETCH_CLASS, $class_name);
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

	public static function one(ExtendedPDO $db, AbstractUser $user, int $id, array $fields = null): Friend
	{
		$friend = parent::one($db, $user, $id, $fields);
		return $friend;
	}


	public static function export(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('created_at'),
																$format)
	{

		$q_get_users = App::queryFactory()->newSelect();
		$q_get_users->from('view_users')
			->cols(array(
				'first_name',
				'last_name',
				'middle_name',
				'gender',
				'avatar_url',
				'(SELECT  CASE 
					WHEN u.vk_uid IS NOT NULL THEN \'https://vk.com/id\' || u.vk_uid
					WHEN u.facebook_uid IS NOT NULL THEN \'https://facebook.com/\' || u.facebook_uid
					WHEN u.google_uid IS NOT NULL THEN \'https://plus.google.com/\' || u.google_uid
					ELSE NULL
				END
				FROM users AS u
				WHERE u.id = view_users.id) AS link',
				'email',
				'(SELECT COUNT(id) FROM subscriptions WHERE user_id = view_users.id AND status = TRUE) AS subscriptions_count',
				'(SELECT COUNT(view_favorite_events.event_id) 
					FROM view_favorite_events
					 INNER JOIN events ON events.id = view_favorite_events.event_id 
					WHERE user_id = view_users.id 
					AND events.organization_id = :organization_id
					AND status = TRUE) AS favored_count',
				'vk_uid',
				'facebook_uid',
				'google_uid',
				'(SELECT array_to_json(array_agg(row_to_json(t)))
				FROM (
					SELECT auditory_interests.tg_topic_id, tg_topics.keyword AS topic_name, auditory_interests.value
					FROM auditory_interests
					INNER JOIN tg_topics ON auditory_interests.tg_topic_id = tg_topics.id
					WHERE auditory_interests.user_id = view_users.id
					) t)  AS interests'
			))
			->join('INNER', 'subscriptions', 'view_users.id = subscriptions.user_id')
			->where('subscriptions.status = TRUE')
			->where('subscriptions.organization_id = :organization_id ');

		$data = $db->prepareExecute($q_get_users, '', array(':organization_id' => $filters['organization']->getId()))->fetchAll();

		global $BACKEND_FULL_PATH;

		$column_names = json_decode(file_get_contents($BACKEND_FULL_PATH . '/events/column_names.json'), true);

		$index = 0;
		$headers = array(
			$column_names[App::$__LANG]['user']['first_name'],
			$column_names[App::$__LANG]['user']['last_name'],
			$column_names[App::$__LANG]['user']['middle_name'],
			$column_names[App::$__LANG]['user']['gender'],
			$column_names[App::$__LANG]['user']['avatar_url'],
			$column_names[App::$__LANG]['user']['link'],
			$column_names[App::$__LANG]['user']['email'],
			$column_names[App::$__LANG]['user']['subscriptions_count'],
			$column_names[App::$__LANG]['user']['favored_count'],
			$column_names[App::$__LANG]['user']['vk_uid'],
			$column_names[App::$__LANG]['user']['facebook_uid'],
			$column_names[App::$__LANG]['user']['google_uid']);
		$rows = array();

		foreach ($data as &$user) {
			$_row = array(
				$column_names[App::$__LANG]['user']['first_name'] => $user['first_name'],
				$column_names[App::$__LANG]['user']['last_name'] => $user['last_name'],
				$column_names[App::$__LANG]['user']['middle_name'] => $user['middle_name'] ?? '',
				$column_names[App::$__LANG]['user']['gender'] => $user['gender'] ?? '',
				$column_names[App::$__LANG]['user']['avatar_url'] => $user['avatar_url'],
				$column_names[App::$__LANG]['user']['link'] => $user['link'],
				$column_names[App::$__LANG]['user']['email'] => $user['email'] ?? '',
				$column_names[App::$__LANG]['user']['subscriptions_count'] => $user['subscriptions_count'],
				$column_names[App::$__LANG]['user']['favored_count'] => $user['favored_count'],
				$column_names[App::$__LANG]['user']['vk_uid'] => $user['vk_uid'],
				$column_names[App::$__LANG]['user']['facebook_uid'] => $user['facebook_uid'],
				$column_names[App::$__LANG]['user']['google_uid'] => $user['google_uid']
			);

			try {
				$user['interests'] = json_decode($user['interests'], true);
			} catch (Exception $e) {
				$user['interests'] = array();
			}

			if (is_array($user['interests'])) {
				foreach ($user['interests'] as $interest) {
					$_row[$interest['topic_name']] = $interest['value'];
					if (!in_array($interest['topic_name'], $headers)) {
						$headers[] = $interest['topic_name'];
					}
				}
				$index++;
			}
			$rows[] = $_row;
		}
		$res = array($headers);
		foreach ($rows as &$user) {
			$_row = array();
			foreach ($headers as $col) {
				$_row[] = $user[$col] ?? '';
			}
			$res[] = $_row;
		}
		parent::send($format, $res);
		die();
	}


}