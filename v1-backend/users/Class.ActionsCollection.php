<?php

class ActionsCollection extends AbstractCollection{


	public static function filter(PDO $db,
																AbstractUser $user = null,
	                              array $filters = null,
	                              array $fields = null,
	                              array $pagination = null,
	                              array $order_by = array('id')){

		$q_get_actions = App::queryFactory()->newSelect();

		if (isset($pagination['offset'])){
			$q_get_actions->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_actions->limit($pagination['length']);
		}

		$q_get_actions
			->from('view_actions');
		$_fields = Fields::mergeFields(Action::getAdditionalCols(), $fields, Action::getDefaultCols());

		$cols = $_fields;
		$statement_array = array();

		foreach($filters as $name => $value){
			switch($name){
				case 'type_code': {
					$q_get_actions
						->where('type_code = :type_code');
					$statement_array[':type_code'] = $value;

					break;
				}
				case 'friend': {
					if ($value instanceof Friend){
						$q_get_actions
							->where('user_id = :friend_id');
						$statement_array[':friend_id'] = $value->getId();
					}
					break;
				}
				case 'user': {
					$q_get_actions
						->joinSubSelect(
							'INNER',
							'SELECT friend_id FROM view_friends WHERE user_id = :user_id',
							'subjoin',
							'subjoin.friend_id = view_actions.user_id');
					$statement_array[':user_id'] = $user->getId();
					break;
				}
			}
		}


		$q_get_actions
			->cols($cols)
			->orderBy($order_by);
		$p_get_actions = $db->prepare($q_get_actions->getStatement());
		$result = $p_get_actions->execute($statement_array);
		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$actions = $p_get_actions->fetchAll(PDO::FETCH_CLASS, 'Action');
		$result_dates = array();
		foreach($actions as $action) {
			$result_dates[] = $action->getParams($user, $fields)->getData();
		}

		return new Result(true, '', $result_dates);
	}

}