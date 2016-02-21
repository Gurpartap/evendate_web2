<?php

class UsersCollection extends AbstractCollection{

	public static function filter(PDO $db,
	                              User $user,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              array $order_by = array('id')){


		$default_cols = Friend::getDefaultCols();

		foreach($default_cols as &$col){
			$col = 'users.'.$col;
		}

		$q_get_users = App::queryFactory()->newSelect();


		$q_get_users
			->distinct()
			->from('users')
			->join('LEFT', 'view_friends', 'view_friends.user_id = users.id AND view_friends.friend_id = :user_id');

		if (isset($pagination['offset'])){
			$q_get_users->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_users->limit($pagination['length']);
		}

		$_fields = Fields::mergeFields(Friend::getAdditionalCols(), $fields, $default_cols);

		$q_get_users->cols($_fields);

		$statement_array = array(':user_id' => $user->getId());
		$is_one_user = false;

		foreach($filters as $name => $value){
			switch ($name){
				case 'organization': {
					if ($value instanceof Organization){
						$q_get_users
							->join('INNER', 'subscriptions', 'subscriptions.user_id = users.id')
							->where('subscriptions.organization_id = :organization_id')
							->where('subscriptions.status = TRUE');
						$statement_array[':organization_id'] = $value->getId();
					}
					break;
				}
				case 'event': {
					if ($value instanceof Event){
						$q_get_users
							->join('INNER', 'favorite_events', 'favorite_events.user_id = users.id')
							->where('favorite_events.event_id = :event_id')
							->where('favorite_events.status = TRUE');
						$statement_array[':event_id'] = $value->getId();
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
					if ($value instanceof User){
						$q_get_users
							->where('view_friends.user_id IS NOT NULL');
						$statement_array[':user_id'] = $value->getId();
					}
					break;
				}
			}
		}


		$q_get_users->orderBy($order_by);
		$p_get_events = $db->prepare($q_get_users->getStatement());
		$result = $p_get_events->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$users = $p_get_events->fetchAll(PDO::FETCH_CLASS, 'Friend');
		if (count($users) == 0 && $is_one_user) throw new LogicException('CANT_FIND_USER');
		$result_users = array();
		if ($is_one_user) return $users[0];
		foreach($users as $friend){
			$result_users[] = $friend->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_users);

	}

	public static function one(PDO $db, User $user, int $id, array $fields = null) : Friend {
		return parent::one($db, $user, $id, $fields);
	}


}