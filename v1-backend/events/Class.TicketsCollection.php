<?php


require_once $BACKEND_FULL_PATH . '/events/Class.Ticket.php';

class TicketsCollection extends AbstractCollection
{


	public static function getStatement(ExtendedPDO $db,
																			AbstractUser $user = null,
																			array $filters = null,
																			array $fields = null,
																			array $pagination = null,
																			array $order_by = array('uuid'))
	{
		$q_get_tickets = App::queryFactory()->newSelect();
		$is_one_ticket = false;
		$from_table = 'view_tickets';
		$statements_array = array();

		$cols = Fields::mergeFields(Ticket::getAdditionalCols(), $fields, Ticket::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_tickets->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_tickets->limit($pagination['length']);
		}

		$getting_statistics = false;

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id':
					{
						$q_get_tickets->where('id = :id');
						$statements_array[':id'] = $value;
						$is_one_ticket = true;
						break;
					}
				case 'uuid':
					{
						$q_get_tickets->where('uuid = :uuid');
						$statements_array[':uuid'] = $value;
						$is_one_ticket = true;
						break;
					}
				case 'event':
					{
						if ($value instanceof Event) {
							$q_get_tickets->where('event_id = :event_id');
							$statements_array[':event_id'] = $value->getId();
						}
						break;
					}
				case 'user_name':
					{
						$value = '%' . trim($value) . '%';
						$q_get_tickets->where('user_id IN (SELECT id FROM view_users_names WHERE LOWER(first_last_name) LIKE LOWER(:query) OR LOWER(last_first_name) LIKE LOWER(:query) OR LOWER(last_name) LIKE LOWER(:query) OR LOWER(first_name) LIKE LOWER(:query) OR LOWER(email) = LOWER(:query))');
						$statements_array[':query'] = $value;

						$getting_statistics = true;
						break;
					}
				case 'event_id':
					{
						$event = EventsCollection::one($db, $user, intval($value), array());

						$q_get_tickets->where('event_id = :event_id');
						$q_get_tickets->where('user_id = :user_id');
						$statements_array[':event_id'] = $event->getId();
						$statements_array[':user_id'] = $user->getId();
						break;
					}
				case 'statistics_event':
					{
						if ($value instanceof Event) {
							$q_get_tickets->where('event_id = :event_id');
							$statements_array[':event_id'] = $value->getId();
							$getting_statistics = true;
						}
						break;
					}
				case 'order':
					{
						if ($value instanceof Order) {
							$q_get_tickets->where('ticket_order_uuid = :ticket_order_uuid');
							$statements_array[':ticket_order_uuid'] = $value->getUUID();
						}
						break;
					}
				case 'statistics_order':
					{
						if ($value instanceof Order) {
							$q_get_tickets->where('ticket_order_uuid = :ticket_order_uuid');
							$statements_array[':ticket_order_uuid'] = $value->getUUID();
							$getting_statistics = true;
						}
						break;
					}
				case 'statistics_order_placeholder':
					{
						if ($value === true) {
							$q_get_tickets->where('ticket_order_uuid = :statistics_order_placeholder');
							$getting_statistics = true;
						}
						break;
					}
				case 'number':
					{
						$getting_statistics = true;
						$value = '%' . intval(preg_replace("/[^0-9,.]/", "", $value)) . '%';
						$q_get_tickets->where('number LIKE :query');
						$statements_array[':query'] = $value;

						break;
					}
				case 'user':
					{
						if ($value instanceof User) {
							$q_get_tickets->where('user_id = :user_id');
							$statements_array[':user_id'] = $user->getId();

						}
						break;
					}
				case 'checkout':
					{
						$val = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
						$q_get_tickets->where('checked_out = :checked_out', $val);
						$statements_array[':checked_out'] = $val;
						break;
					}
				case 'order_status_type':
					{
						$q_get_tickets->where('order_status_type = :order_status_type');
						$statements_array[':order_status_type'] = $value;
					}
			}
		}

		if (isset($getting_statistics) && $getting_statistics === true) {
			$q_get_tickets->where('(SELECT COUNT(user_id) 
					FROM users_organizations
					INNER JOIN view_all_events ON view_all_events.id = view_tickets.event_id 
						AND users_organizations.organization_id = view_all_events.organization_id 
					WHERE users_organizations.role_id = 1
					AND users_organizations.user_id = :user_id::INT
					AND users_organizations.status = TRUE
					) > 0');
			$statements_array[':user_id'] = $user->getId();

		} else {
			if (isset($filters['uuid']) || (isset($filters['order']) && $filters['order'] instanceof Order)) {
//				$q_get_tickets->where('(SELECT COUNT(users_organizations.user_id)
//					FROM users_organizations
//					INNER JOIN view_all_events ON view_all_events.id = view_tickets.event_id
//						AND users_organizations.organization_id = view_all_events.organization_id
//					INNER JOIN view_tickets ON view_tickets.event_id = view_all_events.id
//					WHERE users_organizations.role_id = 1
//					AND users_organizations.user_id = ?
//					AND users_organizations.status = TRUE
//					AND view_tickets.uuid = ?
//					) > 0', $user->getId(), $filters['uuid']);
			} else {
				$q_get_tickets->where('user_id = :user_id::INT');
				$statements_array[':user_id'] = $user->getId();

			}
		}

		$q_get_tickets->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		return array(
			'query' => $q_get_tickets,
			'is_one' => $is_one_ticket,
			'statements' => $statements_array
		);
	}

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('uuid'))
	{
		$q_res = self::getStatement($db, $user, $filters, $fields, $pagination, $order_by);
		$q_get_tickets = $q_res['query'];
		$statements = $q_res['statements'];
		$is_one_ticket = $q_res['is_one'];
		$tickets = $db->prepareExecute($q_get_tickets, '', $statements)->fetchAll(PDO::FETCH_CLASS, 'Ticket');
		if (count($tickets) == 0 && $is_one_ticket) throw new LogicException('CANT_FIND_TICKET');
		if ($is_one_ticket) return $tickets[0];
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
																	 array $fields = null): Ticket
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
			$column_names[App::$__LANG]["ticket"]["number"],
			$column_names[App::$__LANG]["ticket"]["ticket_type.name"],
			$column_names[App::$__LANG]["ticket"]["price"],
			$column_names[App::$__LANG]["ticket"]["checkout"],
			$column_names[App::$__LANG]["order"]["number"],
			$column_names[App::$__LANG]["order"]["status_name"],
			$column_names[App::$__LANG]["order"]["status_type_code"],
			$column_names[App::$__LANG]["order"]["payed_at"],
			$column_names[App::$__LANG]["order"]["is_canceled"],
			$column_names[App::$__LANG]["order"]["canceled_at"]);
		$rows = array();
		foreach ($data as &$ticket) {
			$_row = array(
				$column_names[App::$__LANG]['user']['first_name'] => $ticket['user']['first_name'],
				$column_names[App::$__LANG]['user']['last_name'] => $ticket['user']['last_name'],
				$column_names[App::$__LANG]['user']['middle_name'] => $ticket['user']['middle_name'] ?? '',
				$column_names[App::$__LANG]['user']['gender'] => $ticket['user']['gender'] ?? '',
				$column_names[App::$__LANG]['user']['avatar_url'] => $ticket['user']['avatar_url'],
				$column_names[App::$__LANG]['user']['link'] => $ticket['user']['link'],
				$column_names[App::$__LANG]['user']['email'] => $ticket['user']['email'] ?? '',
				$column_names[App::$__LANG]["ticket"]["number"] => $ticket['number'],
				$column_names[App::$__LANG]["ticket"]["ticket_type.name"] => $ticket['ticket_type']['name'],
				$column_names[App::$__LANG]["ticket"]["price"] => $ticket['price'],
				$column_names[App::$__LANG]["ticket"]["checkout"] => $ticket['checkout'],
				$column_names[App::$__LANG]["order"]["number"] => $ticket['order']['number'],
				$column_names[App::$__LANG]["order"]["status_name"] => $ticket['order']['status_name'],
				$column_names[App::$__LANG]["order"]["status_type_code"] => $ticket['order']['status_type_code'],
				$column_names[App::$__LANG]["order"]["payed_at"] => $ticket['order']['payed_at'] ? DateTime::createFromFormat('U', $ticket['order']['payed_at'])->format('Y-m-d H:i:s') : '',
				$column_names[App::$__LANG]["order"]["is_canceled"] => $ticket['order']['is_canceled'] ? '+' : '-',
				$column_names[App::$__LANG]["order"]["canceled_at"] => $ticket['order']['canceled_at'] ? DateTime::createFromFormat('U', $ticket['order']['canceled_at'])->format('Y-m-d H:i:s') : ''
			);


			if (is_array($ticket['order']['registration_fields'])) {
				foreach ($ticket['order']['registration_fields'] as $field) {
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