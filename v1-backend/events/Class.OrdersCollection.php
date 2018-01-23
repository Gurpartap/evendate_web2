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
		$statements_array = array();

		$cols = Fields::mergeFields(Order::getAdditionalCols(), $fields, Order::getDefaultCols());

		if (isset($fields['user'])) {
			$user_fields = Fields::parseFields($fields[Order::USER_FIELD_NAME]['fields'] ?? '');
			$_user_st = UsersCollection::getStatement(App::DB(),
				$user,
				array('id' => $user->getId()),
				$user_fields,
				array(
					'length' => $fields[Order::USER_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[Order::USER_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[Order::USER_FIELD_NAME]['order_by'] ?? ''));
			$user_query = str_replace('= :id',' = view_tickets_orders.user_id',$_user_st['query']);
			$cols[] = "(select row_to_json(t) from ({$user_query}) t) AS "  . Order::USER_FIELD_NAME;
		}

		if (isset($fields['registration_fields'])) {
			$fields_query = RegistrationForm::getFilledFieldsQuery();
			$fields_query = str_replace('= :ticket_order_uuid',' = view_tickets_orders.uuid', $fields_query->getStatement());
			$cols[] = "(select array_to_json(array_agg(row_to_json(f))) from ({$fields_query}) f) AS "  . Order::REGISTRATION_FIELDS_FIELD_NAME;
		}


		if (isset($fields['tickets'])) {
			$user_fields = Fields::parseFields($fields[Order::TICKETS_FIELD_NAME]['fields'] ?? '');
			$_user_st = TicketsCollection::getStatement(App::DB(),
				$user,
				array('statistics_order_placeholder' => true),
				$user_fields,
				array(
					'length' => $fields[Order::TICKETS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[Order::TICKETS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[Order::TICKETS_FIELD_NAME]['order_by'] ?? ''));
			$tickets_query = str_replace('= :statistics_order_placeholder',' = view_tickets_orders.uuid', $_user_st['query']);
			$cols[] = "(select array_to_json(array_agg(row_to_json(tickets_t))) from ({$tickets_query}) tickets_t) AS "  . Order::TICKETS_FIELD_NAME;
		}



		if (isset($pagination['offset'])) {
			$q_get_orders->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_orders->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'uuid':
					{
						$q_get_orders->where('uuid = :uuid');
						$statements_array[':uuid'] = $value;
						$is_one_order = true;
						break;
					}
				case 'event':
					{
						if ($value instanceof Event) {
							$q_get_orders->where('event_id = :event_id');
							$statements_array[':event_id'] = $value->getId();
						}
						break;
					}
				case 'statistics_event':
					{
						if ($value instanceof Event) {
							$q_get_orders->where('event_id = :event_id');
							$statements_array[':event_id'] = $value->getId();
							$getting_statistics = true;
						}
						break;
					}
				case 'user':
					{
						if ($value instanceof User) {
							$q_get_orders->where('user_id = :user_id');
							$statements_array[':user_id'] = $value->getId();
						}
						break;
					}
				case 'subscriber':
					{
						if ($value instanceof Friend
							&& isset($filters['organization'])
							&& $filters['organization'] instanceof Organization
							&& $user->isAdmin($filters['organization'])
						) {
							$q_get_orders->where('user_id = :user_id');
							$q_get_orders->where('event_id IN (SELECT id FROM events WHERE organization_id = :organization_id)');
							$statements_array[':user_id'] = $value->getId();
							$statements_array[':organization_id'] = $filters['organization']->getId();
							$getting_statistics = true;

						}
						break;
					}
				case 'status_type':
					{
						$q_get_orders->where('ticket_order_status_type = ?', $value);
						$statements_array[':ticket_order_status_type'] = $value;

					}
			}
		}


		if (isset($getting_statistics) && $getting_statistics === true) {
			$q_get_orders->where('((SELECT COUNT(user_id) 
					FROM users_organizations
					INNER JOIN view_all_events ON view_all_events.id = view_tickets_orders.event_id 
						AND users_organizations.organization_id = view_all_events.organization_id 
					WHERE users_organizations.role_id = 1
					AND users_organizations.user_id::INT = :user_id::INT
					AND users_organizations.status = TRUE
					) > 0 OR (user_id = :user_id::INT))');
			$statements_array[':user_id'] = $user->getId();
		} elseif (!isset($filters['uuid'])) {
			$q_get_orders->where('user_id = :user_id::INT');
			$statements_array[':user_id'] = $user->getId();
		}


		// must get promocode_id
		$cols[] = 'promocode_id';
		$cols[] = 'id';
		$q_get_orders
//			->distinctOn(array('uuid'))
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$tickets = $db->prepareExecute($q_get_orders, '', $statements_array)->fetchAll(PDO::FETCH_CLASS, 'Order');
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