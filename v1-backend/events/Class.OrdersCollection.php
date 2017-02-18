<?php


require_once $BACKEND_FULL_PATH . '/events/Class.Order.php';

class OrdersCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('event_id'))
	{

		$q_get_orders = App::queryFactory()->newSelect();
		$is_one_order = false;
		$from_table = 'view_tickets_orders';

		$cols = Fields::mergeFields(Order::getAdditionalCols(), $fields, Order::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_orders->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_orders->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'uuid': {
					$q_get_orders->where('uuid = ?', $value);
					$is_one_order = true;
					break;
				}
				case 'event': {
					if ($value instanceof Event) {
						$q_get_orders->where('event_id = ?', $value->getId());
					}
					break;
				}
			}
		}


		if (isset($getting_statistics) && $getting_statistics === true) {
			$q_get_orders->where('(SELECT COUNT(user_id) 
					FROM users_organizations
					INNER JOIN view_all_events ON view_all_events.id = view_tickets_orders.event_id 
						AND users_organizations.organization_id = view_all_events.organization_id 
					WHERE users_organizations.role_id = 1
					AND users_organization.user_id = ?
					AND status = TRUE
					) > 0', $user->getId());
		} else {
			$q_get_orders->where('user_id = ?', $user->getId());
		}


		$q_get_orders->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$tickets = $db->prepareExecute($q_get_orders)->fetchAll(PDO::FETCH_CLASS, 'Order');
		if (count($tickets) == 0 && $is_one_order) throw new LogicException('CANT_FIND_ORDER');
		if ($is_one_order) return $tickets[0];
		$result = array();
		foreach ($tickets as $ticket) {
			$result[] = $ticket->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result);
	}

	public static function one(ExtendedPDO $db,
														 AbstractUser $user,
														 int $id,
														 array $fields = null)
	{
		return self::filter($db, $user, array('id' => $id), $fields);
	}


	public static function oneByUUID(ExtendedPDO $db,
																	 AbstractUser $user,
																	 string $uuid,
																	 array $fields = null) : Order
	{
		return self::filter($db, $user, array('uuid' => $uuid), $fields);
	}


}