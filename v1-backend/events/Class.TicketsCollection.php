<?php


require_once $BACKEND_FULL_PATH . '/events/Class.Ticket.php';

class TicketsCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$q_get_tickets = App::queryFactory()->newSelect();
		$is_one_ticket = false;
		$from_table = 'view_tickets';

		$cols = Fields::mergeFields(Ticket::getAdditionalCols(), $fields, Ticket::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_tickets->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_tickets->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id': {
					$q_get_tickets->where('id = ?', $value);
					$is_one_ticket = true;
					break;
				}
				case 'uuid': {
					$q_get_tickets->where('uuid = ?', $value);
					$is_one_ticket = true;
					break;
				}
				case 'event': {
					if ($value instanceof Event) {
						$q_get_tickets->where('event_id = ?', $value->getId());
						$q_get_tickets->where('user_id = ?', $user->getId());
					}
					break;
				}
			}
		}


		$q_get_tickets->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$tickets = $db->prepareExecute($q_get_tickets)->fetchAll(PDO::FETCH_CLASS, 'Ticket');
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
														 array $fields = null) : Ticket
	{
		return self::filter($db, $user, array('uuid' => $uuid), $fields);
	}


}