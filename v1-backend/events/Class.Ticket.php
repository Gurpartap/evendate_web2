<?php


require_once $BACKEND_FULL_PATH . '/events/Class.TicketsCollection.php';


class Ticket extends AbstractEntity
{

	private $uuid;
	private $type;
	private $created_at;
	private $updated_at;


	protected static $DEFAULT_COLS = array(
		'id',
		'user_id',
		'ticket_type_uuid',
		'ticket_order_uuid',
		'status',
		'checked_out',
		'uuid'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at'
	);

	private static function compareTicketWithType($type, $ticket_data){
		$now = (new DateTime())->format('U');

		if (!is_null($type['sold_count']) && $type['sold_count'] >= $type['amount'])
			throw new InvalidArgumentException('TICKETS_ALL_SOLD: ' . $ticket_data['uuid']);
		if (!is_null($type['sell_end_date']) && $now > $type['sell_end_date'])
			throw new InvalidArgumentException('TICKETS_SELL_FINISHED: ' . $ticket_data['uuid']);

		if (!is_null($type['sell_start_date']) && $now < $type['sell_start_date'])
			throw new InvalidArgumentException('REGISTRATION_DID_NOT_START: ' . $ticket_data['uuid']);

		if (!is_null($type['min_count_per_user']) && $ticket_data['count'] < $type['min_count_per_user'])
			throw new InvalidArgumentException('TOO_FEW_TICKETS: ' . $ticket_data['uuid']);
		if (!is_null($type['max_count_per_user']) && $ticket_data['count'] < $type['max_count_per_user'])
			throw new InvalidArgumentException('TOO_MANY_TICKETS: ' . $ticket_data['uuid']);

	}

	private static function checkTicketTypeData(TicketType $type, array $ticket_data, ExtendedPDO $db)
	{
		$q_get_ticket_type_id = App::queryFactory()->newSelect();
		$q_get_ticket_type_id->from('view_all_ticket_types')
			->cols(array('id',
				'amount',
				'sell_start_date',
				'sell_end_date',
				'min_count_per_user',
				'max_count_per_user',
				'sold_count'
			))
			->where('id = ?', $type->getId())
			->where('type_code = ?', 'registration')
			->where('status = TRUE');


		$_type = $db->prepareExecute($q_get_ticket_type_id)->fetch(PDO::FETCH_ASSOC);

		self::compareTicketWithType($_type, $ticket_data);
	}

	private static function create(TicketType $type, $order_id, ExtendedPDO $db, array $ticket_data)
	{
		self::checkTicketTypeData($type, $ticket_data, $db);

		$q_ins = App::queryFactory()->newInsert();
		$user = App::getCurrentUser();
		$q_ins->into('tickets')
			->cols(array(
				'user_id' => $user,
				'ticket_type_id' => $type->getId(),
				'ticket_order_id' => $order_id,
				'status' => 'true'
			))->returning(array('uuid'));

		$uuid = $db->prepareExecute($q_ins, 'CANT_INSERT_TICKET')->fetchColumn(0);

		return $uuid;
	}

	private static function createRegistrationTicket(Event $event, $order_id, ExtendedPDO $db, array $ticket_data)
	{
		$q_get_ticket_type_id = App::queryFactory()->newSelect();
		$q_get_ticket_type_id->from('view_all_ticket_types')
			->cols(array('id',
				'amount',
				'sell_start_date',
				'sell_end_date',
				'min_count_per_user',
				'max_count_per_user',
				'sold_count'
			))
			->where('event_id = ?', $event->getId())
			->where('type_code = ?', 'registration')
			->where('status = TRUE');


		$_type = $db->prepareExecute($q_get_ticket_type_id);

		if ($_type->rowCount() != 1) throw new InvalidArgumentException('BAD_TICKET_TYPE');

		$_type = $_type->fetch(PDO::FETCH_ASSOC);

		self::compareTicketWithType($_type, $ticket_data);

		$q_ins = App::queryFactory()->newInsert();
		$user = App::getCurrentUser();
		$q_ins->into('tickets')
			->cols(array(
				'user_id' => $user->getId(),
				'ticket_type_id' => $_type['id'],
				'ticket_order_id' => $order_id,
				'status' => 'true'
			))->returning(array('uuid'));

		$uuid = $db->prepareExecute($q_ins, 'CANT_INSERT_TICKET')->fetchColumn(0);

		return $uuid;
	}

	public static function createBatch(Event $event, $order_id, ExtendedPDO $db, array $tickets)
	{
		$ticket_types = TicketTypesCollection::filter($db,
			App::getCurrentUser(),
			array('event' => $event),
			array(
				'comment',
				'price',
				'sell_start_date',
				'sell_end_date',
				'start_after_ticket_type_uuid',
				'amount',
				'min_count_per_user',
				'max_count_per_user',
				'promocode',
				'promocode_effort'
			)
		)->getData();
		$ticket_types_uuid = array();
		$ticketing_locally = $event->getTicketingLocally();
		foreach ($ticket_types as $ticket_type) {
			$ticket_types_uuid[$ticket_type['uuid']] = $ticket_type;
		}

		$result = array();

		foreach ($tickets as $ticket) {
			if (isset($ticket['uuid']) && $ticket['uuid'] != null) {
				$type_uuid = $ticket['uuid'];
				if (!isset($ticket_types_uuid[$type_uuid])) throw new InvalidArgumentException('BAD_TICKET_TYPE_UUID');
				$result[] = self::create($ticket_types_uuid[$type_uuid], $order_id, $db, $ticket);
			} else {
				// without uuid => registration
				if ($ticketing_locally) throw new InvalidArgumentException('NULL_UUID');
				$result[] = self::createRegistrationTicket($event, $order_id, $db, $ticket);
			}
		}
	}


}