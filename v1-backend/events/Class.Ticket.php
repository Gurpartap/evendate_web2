<?php


require_once $BACKEND_FULL_PATH . '/events/Class.TicketsCollection.php';


class Ticket extends AbstractEntity
{

	protected $uuid;
	protected $type;
	protected $user_id;
	protected $created_at;
	protected $updated_at;
	protected $ticket_type_uuid;
	protected $type_code;
	protected $ticket_order_uuid;

	const ORDER_FIELD_NAME = 'order';
	const TYPE_FIELD_NAME = 'ticket_type';
	const USER_FIELD_NAME = 'user';

	protected static $DEFAULT_COLS = array(
		'user_id',
		'type_code',
		'ticket_type_uuid',
		'ticket_order_uuid',
		'status',
		'checkout',
		'event_id',
		'uuid',
		'number',
		'price'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at'
	);

	private static function getTicketTypeInfo(Event $event, ExtendedPDO $db, string $uuid = null, string $type_code = null): array
	{
		$q_get_ticket_type_id = App::queryFactory()->newSelect();
		$q_get_ticket_type_id->from('view_all_ticket_types')
			->cols(array('id',
				'amount',
				'price',
				'sell_start_date',
				'sell_end_date',
				'min_count_per_user',
				'max_count_per_user',
				'sold_count'
			))
			->where('event_id = ?', $event->getId())
			->where('status = TRUE');

		if ($type_code != null) {
			$q_get_ticket_type_id->where('type_code = ?', $type_code);
		} elseif ($uuid != null) {
			$q_get_ticket_type_id->where('uuid = ?', $uuid);
		}


		$_type = $db->prepareExecute($q_get_ticket_type_id);
		if ($_type->rowCount() != 1) throw new InvalidArgumentException('BAD_TICKET_TYPE');

		return $_type->fetch(PDO::FETCH_ASSOC);

	}

	private static function compareTicketWithType($type, $ticket_data)
	{
		$now = (new DateTime())->format('U');

		if (!is_null($type['sold_count']) && $type['sold_count'] >= $type['amount'] && !is_null($type['amount']))
			throw new BadArgumentException('TICKETS_ALL_SOLD', App::DB(), $ticket_data['uuid']);
		if (!is_null($type['sell_end_date']) && $now > $type['sell_end_date'])
			throw new BadArgumentException('TICKETS_SELL_FINISHED', App::DB(), $ticket_data['uuid']);

		if (!is_null($type['sell_start_date']) && $now < $type['sell_start_date'])
			throw new BadArgumentException('REGISTRATION_DID_NOT_START', App::DB(), $ticket_data['uuid']);

		if (!is_null($type['min_count_per_user']) && $ticket_data['count'] < $type['min_count_per_user'])
			throw new BadArgumentException('TOO_FEW_TICKETS', App::DB(), $ticket_data['uuid']);
		if (!is_null($type['max_count_per_user']) && $ticket_data['count'] < $type['max_count_per_user'])
			throw new BadArgumentException('TOO_MANY_TICKETS', App::DB(), $ticket_data['uuid']);

	}

	private static function checkTicketTypeData($type, array $ticket_data, ExtendedPDO $db)
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
			->where('id = ?', $type['id'])
			->where('type_code = ?', 'registration')
			->where('status = TRUE');


		$_type = $db->prepareExecute($q_get_ticket_type_id)->fetch(PDO::FETCH_ASSOC);

		self::compareTicketWithType($_type, $ticket_data);
	}

	private static function create(Event $event, $order_id, ExtendedPDO $db, array $ticket_data)
	{

		if (!isset($ticket_data['uuid'])) throw new InvalidArgumentException('BAD_TICKET_TYPE_UUID');

		$type = self::getTicketTypeInfo($event, $db, $ticket_data['uuid']);

		self::checkTicketTypeData($type, $ticket_data, $db);

		$q_ins = App::queryFactory()->newInsert();
		$user = App::getCurrentUser();
		$q_ins->into('tickets')
			->cols(array(
				'user_id' => $user->getId(),
				'ticket_type_id' => $type['id'],
				'ticket_order_id' => $order_id,
				'price' => $type['price'],
				'status' => 'true'
			))->returning(array('uuid'));

		$uuid = $db->prepareExecute($q_ins, 'CANT_INSERT_TICKET')->fetchColumn(0);

		return $uuid;
	}

	private static function createRegistrationTicket(Event $event, $order_id, ExtendedPDO $db, array $ticket_data)
	{

		$_type = self::getTicketTypeInfo($event, $db, null, 'registration');
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

		$ticketing_locally = $event->getTicketingLocally();
		$result = array();

		foreach ($tickets as $ticket) {
			if (isset($ticket['uuid']) && $ticket['uuid'] != null) {

				$type = self::getTicketTypeInfo($event, $db, $ticket['uuid']);
				self::checkTicketTypeData($type, $ticket, $db);

				$tickets_count = $tickets['count'] ?? 1;
				for($k = 0; $k < $tickets_count; $k++){
					$result[] = self::create($event, $order_id, $db, $ticket);
				}
			} else {
				// without uuid => registration
				if ($ticketing_locally) throw new InvalidArgumentException('NULL_UUID');
				$result[] = self::createRegistrationTicket($event, $order_id, $db, $ticket);
			}
		}
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{

		$result_data = parent::getParams($user, $fields)->getData();


		if (isset($fields[self::TYPE_FIELD_NAME])) {
			if ($user instanceof User) {
				if ($this->type_code == 'registration') {
					$result_data[self::TYPE_FIELD_NAME] = array(
						'type_code' => 'registration',
						'uuid' => null,
						'name' => 'Регистрация на событие'
					);
				} else {
					$_fields = Fields::parseFields($fields[self::TYPE_FIELD_NAME]['fields'] ?? '');
					$result_data[self::TYPE_FIELD_NAME] = TicketTypesCollection::oneByUUID(
						App::DB(),
						$user,
						$this->ticket_type_uuid,
						$_fields)
						->getParams($user, $_fields)
						->getData();
				}
			} else {
				$result_data[self::TYPE_FIELD_NAME] = null;
			}
		}

		if (isset($fields[self::ORDER_FIELD_NAME])) {
			$order_fields = Fields::parseFields($fields[self::ORDER_FIELD_NAME]['fields'] ?? '');
			$result_data[self::ORDER_FIELD_NAME] = OrdersCollection::oneByUUID(
				App::DB(),
				$user,
				$this->ticket_order_uuid,
				$order_fields
			)->getParams($user, $order_fields)
				->getData();
		}

		if (isset($fields[self::USER_FIELD_NAME])) {
			if ($user instanceof User) {
				$user_fields = Fields::parseFields($fields[self::USER_FIELD_NAME]['fields'] ?? '');
				$result_data[self::USER_FIELD_NAME] = UsersCollection::one(
					App::DB(),
					$user,
					$this->user_id,
					$user_fields
				)->getParams($user, $user_fields)
					->getData();
			} else {
				$result_data[self::USER_FIELD_NAME] = null;
			}
		}

		return new Result(true, '', $result_data);
	}

	public function setCheckOut($checkout){

		$db = App::DB();
		$value = filter_var($checkout, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
		$q_upd_col = App::queryFactory()->newUpdate()
			->table('tickets')
			->cols(array(
				'checked_out' => $value
			))
			->where('uuid = ?', $this->uuid);
		$p_upd_col = $db->prepareExecute($q_upd_col, 'CANT_UPDATE_INFO');
		if ($p_upd_col->rowCount() != 1) throw new InvalidArgumentException('BAD_REGISTRATION_UUID', $db);

		return new Result(true, 'Данные успешно обновлены');

	}

	public function getUserId(){
		return $this->user_id;
	}

}