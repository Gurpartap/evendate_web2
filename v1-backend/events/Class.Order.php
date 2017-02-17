<?php


class Order
{

	const STATUS_WAITING_PAYMENT = 1;
	const STATUS_PAYED = 2;
	const STATUS_RETURNED = 3;
	const STATUS_WITHOUT_PAYMENT = 4;

	private $id;


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

	public static function getById(int $id, ExtendedPDO $db): Order
	{
		$q_get = App::queryFactory()->newSelect();
		$cols = Fields::mergeFields(self::$ADDITIONAL_COLS, array(), self::$DEFAULT_COLS);
		$q_get->from('view_tickets_orders')
			->cols($cols)
			->where('id = ?', $id);
		return $db->prepareExecute($q_get, 'CANT_GET_ORDER')->fetchObject('Order');
	}

	/**
	 * @return mixed
	 */
	public function getId()
	{
		return $this->id;
	}


}