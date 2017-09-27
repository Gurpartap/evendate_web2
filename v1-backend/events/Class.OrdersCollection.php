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
				case 'statistics_event': {
					if ($value instanceof Event) {
						$q_get_orders->where('event_id = ?', $value->getId());
						$getting_statistics = true;
					}
					break;
				}
				case 'user': {
					if ($value instanceof User) {
						$q_get_orders->where('user_id = ?', $value->getId());
					}
					break;
				}
				case 'status_type': {
					$q_get_orders->where('ticket_order_status_type = ?', $value);
				}
			}
		}


		if (isset($getting_statistics) && $getting_statistics === true) {
			$q_get_orders->where('((SELECT COUNT(user_id) 
					FROM users_organizations
					INNER JOIN view_all_events ON view_all_events.id = view_tickets_orders.event_id 
						AND users_organizations.organization_id = view_all_events.organization_id 
					WHERE users_organizations.role_id = 1
					AND users_organizations.user_id = ?
					AND users_organizations.status = TRUE
					) > 0 OR (user_id = ?))', $user->getId(), $user->getId());
		} elseif (!isset($filters['uuid'])) {
			$q_get_orders->where('user_id = ?', $user->getId());
		}


		// must get promocode_id
		$cols[] = 'promocode_id';
		$cols[] = 'id';
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
																	 array $fields = null): Order
	{
		return self::filter($db, $user, array('uuid' => $uuid), $fields);
	}


	public static function export(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('created_at'),
																$format)
	{

		$data = self::filter($db,
			$user,
			$filters,
			$fields,
			$pagination,
			$order_by ?? array())->getData();


		$column_names = App::loadColumnNames();

		$index = 0;
		$headers = array(
			$column_names[App::$__LANG]['user']['first_name'],
			$column_names[App::$__LANG]['user']['last_name'],
			$column_names[App::$__LANG]['user']['middle_name'],
			$column_names[App::$__LANG]['user']['gender'],
			$column_names[App::$__LANG]['user']['avatar_url'],
			$column_names[App::$__LANG]['user']['link'],
			$column_names[App::$__LANG]['user']['email'],
			$column_names[App::$__LANG]["order"]["number"],
			$column_names[App::$__LANG]["order"]["status_name"],
			$column_names[App::$__LANG]["order"]["tickets_count"],
			$column_names[App::$__LANG]["order"]["tickets_price"],
			$column_names[App::$__LANG]["order"]["status_type_code"],
			$column_names[App::$__LANG]["order"]["payed_at"],
			$column_names[App::$__LANG]["order"]["is_canceled"],
			$column_names[App::$__LANG]["order"]["canceled_at"]);
		$rows = array();

		foreach ($data as &$order) {
			$tickets_price = 0;
			foreach ($order['tickets'] aS $ticket) {
				$tickets_price += (float)$ticket['price'];
			}
			$_row = array(
				$column_names[App::$__LANG]['user']['first_name'] => $order['user']['first_name'],
				$column_names[App::$__LANG]['user']['last_name'] => $order['user']['last_name'],
				$column_names[App::$__LANG]['user']['middle_name'] => $order['user']['middle_name'] ?? '',
				$column_names[App::$__LANG]['user']['gender'] => $order['user']['gender'] ?? '',
				$column_names[App::$__LANG]['user']['avatar_url'] => $order['user']['avatar_url'],
				$column_names[App::$__LANG]['user']['link'] => $order['user']['link'],
				$column_names[App::$__LANG]['user']['email'] => $order['user']['email'] ?? '',
				$column_names[App::$__LANG]["order"]["number"] => $order['number'],
				$column_names[App::$__LANG]["order"]["status_name"] => $order['status_name'],
				$column_names[App::$__LANG]["order"]["tickets_count"] => count($order['tickets']),
				$column_names[App::$__LANG]["order"]["tickets_price"] => $tickets_price,
				$column_names[App::$__LANG]["order"]["status_type_code"] => $order['status_type_code'],
				$column_names[App::$__LANG]["order"]["payed_at"] => $order['payed_at'] ? DateTime::createFromFormat('U', $order['payed_at'])->format('Y-m-d H:i:s') : '',
				$column_names[App::$__LANG]["order"]["is_canceled"] => $order['is_canceled'] ? '+' : '-',
				$column_names[App::$__LANG]["order"]["canceled_at"] => $order['canceled_at'] ? DateTime::createFromFormat('U', $order['canceled_at'])->format('Y-m-d H:i:s') : ''
			);


			if (is_array($order['registration_fields'])) {
				foreach ($order['registration_fields'] as $field) {
					$_row[$field['form_field_label']] = $field['value'];
					if (!in_array($field['form_field_label'], $headers)) {
						$headers[] = $field['form_field_label'];
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