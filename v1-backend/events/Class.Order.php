<?php


class Order extends AbstractEntity
{

	const STATUS_WAITING_PAYMENT = 1;
	const STATUS_PAYED = 2;
	const STATUS_RETURNED = 3;
	const STATUS_WITHOUT_PAYMENT = 4;



	const TICKETS_FIELD_NAME = 'tickets';
	const USER_FIELD_NAME = 'user';

	protected $id;
	protected $uuid;
	protected $user_id;


	protected static $DEFAULT_COLS = array(
		'uuid',
		'event_id',
		'user_id',
		'status_type_code',
	);

	protected static $ADDITIONAL_COLS = array(
		'order_content',
		'is_canceled',
		'payed_at',
		'canceled_at',
		'created_at',
		'updated_at',
		'status_name',
		'status_id'
	);


	public static function create(Event $event, AbstractUser $user, ExtendedPDO $db, array $data)
	{
		$q_get = App::queryFactory()->newInsert();
		$q_get->into('ticket_orders')
			->cols(array(
				'event_id' => $event->getId(),
				'user_id' => $user->getId(),
				'order_content' => json_encode($data),
				'sum' => 0,
				'order_status_id' => $event->getTicketingLocally() ? self::STATUS_WAITING_PAYMENT : self::STATUS_WITHOUT_PAYMENT
			))
			->returning(array('uuid', 'id'));
		$id = $db->prepareExecute($q_get, 'CANT_INSERT_ORDER')->fetchColumn(1);

		return $id;
	}

	/**
	 * @return mixed
	 */
	public function getId(): int
	{
		return $this->id;
	}

	public function getUUID(){
		return $this->uuid;
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::TICKETS_FIELD_NAME]) && $user instanceof User) {
			$result[self::TICKETS_FIELD_NAME] = TicketsCollection::filter(
				App::DB(),
				$user,
				array('order' => $this),
				Fields::parseFields($fields[self::TICKETS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::TICKETS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::TICKETS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::TICKETS_FIELD_NAME]['order_by'] ?? ''))->getData();
		}

		if (isset($fields[self::USER_FIELD_NAME]) && $user instanceof User) {
			$result[self::USER_FIELD_NAME] = UsersCollection::filter($this->db,
				$user,
				array('id' => $this->user_id),
				Fields::parseFields($fields[self::USER_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::USER_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::USER_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::USER_FIELD_NAME]['order_by'] ?? ''))->getData();
		}

		return new Result(true, '', $result);


	}


}