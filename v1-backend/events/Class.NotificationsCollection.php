<?php

class NotificationsCollection extends AbstractCollection{

	public static function filter(
									PDO $db,
									User $user = null,
									array $filters = null,
									array $fields = null,
									array $pagination = null,
									array $order_by = array('notification_time')) {

		$q_get_notifications = App::queryFactory()->newSelect();
		$_fields = Fields::mergeFields(Notification::getAdditionalCols(), $fields, Notification::getDefaultCols());

		$is_one_notification = false;

		$q_get_notifications
			->from('view_notifications')
			->cols($_fields)
			->where('status = TRUE')
			->orderBy($order_by);

		$statement_array = array(
			':user_id' => $user->getId()
		);

		$filtered = false;

		foreach($filters as $name => $value){
			switch ($name) {
				case 'event': {
					if ($value instanceof Event){
						$q_get_notifications
							->where('(event_id = :event_id AND user_id = :user_id)')
							->orWhere('(event_id = :event_id AND user_id IS NULL)');
						$statement_array[':event_id'] = $value->getId();
						$filtered = true;
					}
					break;
				}
				case 'uuid': {
					$q_get_notifications
						->where('uuid = :uuid')
						->where('user_id = :user_id');
					$statement_array[':uuid'] = $value;
					$is_one_notification = true;
					$filtered = true;
				}
			}
		}

		if ($filtered == false) throw new InvalidArgumentException('CANT_GET_NOTIFICATIONS:BAD_FILTERS');

		if (isset($pagination['offset'])){
			$q_get_notifications->offset($pagination['offset']);
		}

		if (isset($pagination['length'])){
			$q_get_notifications->limit($pagination['length']);
		}


		$p_get_notifications = $db->prepare($q_get_notifications->getStatement());
		$result = $p_get_notifications->execute($statement_array);

		if ($result === FALSE) throw new DBQueryException(implode(';', $db->errorInfo()), $db);

		$notifications = $p_get_notifications->fetchAll(PDO::FETCH_CLASS, 'Notification');
		if (count($notifications) == 0 && $is_one_notification) throw new LogicException('CANT_FIND_NOTIFICATION');
		$result_notifications = array();
		if ($is_one_notification) return $notifications[0];

		foreach($notifications as $device){
			$result_notifications[] = $device->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_notifications);
	}

	public static function oneByUUID(PDO $db, User $user, string $uuid, array $fields = null) : Notification {
		return static::filter($db, $user, array('uuid' => $uuid), $fields);
	}


}