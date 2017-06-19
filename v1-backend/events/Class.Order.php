<?php


class Order extends AbstractEntity
{

	const STATUS_WAITING_PAYMENT = 'waiting_for_payment';
	const STATUS_PAYED = 'payed';
	const STATUS_RETURNED_BY_ORGANIZATION = 'returned_by_organization';
	const STATUS_WITHOUT_PAYMENT = 'without_payment';
	const STATUS_PAYMENT_CANCELED_AUTO = 'payment_canceled_auto';
	const STATUS_PAYMENT_CANCELED_BY_CLIENT = 'payment_canceled_by_client';
	const STATUS_RETURNED_BY_CLIENT = 'returned_by_client';
	const STATUS_COMPLETED = 'completed';

	const REGISTRATION_STATUS_IS_PENDING = 'is_pending';
	const REGISTRATION_STATUS_APPROVED = 'approved';
	const REGISTRATION_STATUS_REJECTED = 'rejected';
	const REGISTRATION_STATUS_COMPLETED = 'completed';


	const STATUS_WAITING_PAYMENT_ID = 1;
	const STATUS_PAYED_ID = 2;
	const STATUS_RETURNED_ID = 3;
	const STATUS_WITHOUT_PAYMENT_ID = 4;
	const STATUS_PAYMENT_CANCELED_AUTO_ID = 5;
	const STATUS_PAYMENT_CANCELED_BY_CLIENT_ID = 6;
	const STATUS_RETURNED_BY_CLIENT_ID = 7;

	const REGISTRATION_STATUS_COMPLETED_ID = 8;
	const REGISTRATION_STATUS_IS_PENDING_ID = 9;
	const REGISTRATION_STATUS_APPROVED_ID = 10;
	const REGISTRATION_STATUS_REJECTED_ID = 11;


	const REGISTRATION_STATUSES = array(
		self::REGISTRATION_STATUS_IS_PENDING,
		self::REGISTRATION_STATUS_APPROVED,
		self::REGISTRATION_STATUS_REJECTED
	);


	const STATUSES = array(
		self::STATUS_WAITING_PAYMENT => self::STATUS_WAITING_PAYMENT_ID,
		self::STATUS_PAYED => self::STATUS_PAYED_ID,
		self::STATUS_RETURNED_BY_ORGANIZATION => self::STATUS_RETURNED_ID,
		self::STATUS_WITHOUT_PAYMENT => self::STATUS_WITHOUT_PAYMENT_ID,
		self::STATUS_PAYMENT_CANCELED_AUTO => self::STATUS_PAYMENT_CANCELED_AUTO_ID,
		self::STATUS_PAYMENT_CANCELED_BY_CLIENT => self::STATUS_PAYMENT_CANCELED_BY_CLIENT_ID,
		self::STATUS_RETURNED_BY_CLIENT => self::STATUS_RETURNED_BY_CLIENT_ID,
		self::REGISTRATION_STATUS_COMPLETED => self::REGISTRATION_STATUS_COMPLETED_ID,
		self::REGISTRATION_STATUS_IS_PENDING => self::REGISTRATION_STATUS_IS_PENDING_ID,
		self::REGISTRATION_STATUS_APPROVED => self::REGISTRATION_STATUS_APPROVED_ID,
		self::REGISTRATION_STATUS_REJECTED => self::REGISTRATION_STATUS_REJECTED_ID,

	);

	const STATUSES_FOR_ORGANIZATIONS = array(
		self::STATUS_RETURNED_BY_ORGANIZATION,
		self::STATUS_PAYED,
		self::REGISTRATION_STATUS_COMPLETED
	);

	const STATUSES_FOR_CLIENT = array(
		self::STATUS_PAYMENT_CANCELED_BY_CLIENT,
		self::STATUS_RETURNED_BY_CLIENT,
	);

	const TICKETS_FIELD_NAME = 'tickets';
	const USER_FIELD_NAME = 'user';
	const REGISTRATION_FIELDS_FIELD_NAME = 'registration_fields';
	const REGISTRATION_STATUS_FIELD_NAME = 'registration_status';

	protected $id;
	protected $uuid;
	protected $user_id;


	protected static $DEFAULT_COLS = array(
		'uuid',
		'event_id',
		'user_id',
		'status_type_code',
		'payed_at',
		'created_at',
		'number',
		'status_name',
	);

	protected static $ADDITIONAL_COLS = array(
		'order_content',
		'is_canceled',
		'payed_at',
		'canceled_at',
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
				'order_status_id' => $event->getTicketingLocally() ? self::STATUS_WAITING_PAYMENT_ID : self::STATUS_WITHOUT_PAYMENT_ID
			))
			->returning(array('uuid', 'id'));
		$res = $db->prepareExecute($q_get, 'CANT_INSERT_ORDER')->fetch();

		return array('id' => $res['id'], 'uuid' => $res['uuid']);
	}

	/**
	 * @return mixed
	 */
	public function getId(): int
	{
		return $this->id;
	}

	public function getUUID()
	{
		return $this->uuid;
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::TICKETS_FIELD_NAME]) && $user instanceof User) {
			$result[self::TICKETS_FIELD_NAME] = TicketsCollection::filter(
				App::DB(),
				$user,
				array('statistics_order' => $this),
				Fields::parseFields($fields[self::TICKETS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::TICKETS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::TICKETS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::TICKETS_FIELD_NAME]['order_by'] ?? ''))->getData();
		}

		if (isset($fields[self::USER_FIELD_NAME]) && $user instanceof User) {
			$user_fields = Fields::parseFields($fields[self::USER_FIELD_NAME]['fields'] ?? '');
			$result[self::USER_FIELD_NAME] = UsersCollection::filter(App::DB(),
				$user,
				array('id' => $this->user_id),
				$user_fields,
				array(
					'length' => $fields[self::USER_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::USER_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::USER_FIELD_NAME]['order_by'] ?? ''))->getParams($user, $user_fields)->getData();
		}

		if (isset($fields[self::REGISTRATION_FIELDS_FIELD_NAME]) && $user instanceof User) {
			$result[self::REGISTRATION_FIELDS_FIELD_NAME] = RegistrationForm::getFilledFields(App::DB(),
				$this)->getData();
		}

		return new Result(true, '', $result);
	}


	public function setStatus(string $status_code, User $user, Event $event)
	{

		$available_codes = array();

		if ($user->isAdmin($event->getOrganization())) {
			$available_codes = array_merge($available_codes, self::STATUSES_FOR_ORGANIZATIONS);
		}

		if ($event->getTicketingLocally() == false) {
			$available_codes = array_merge($available_codes, self::REGISTRATION_STATUSES);
		}

		if ($this->user_id == $user->getId()) {
			$available_codes = array_merge($available_codes, $available_codes = self::STATUSES_FOR_CLIENT);
		}


		if (in_array($status_code, $available_codes) == false) throw new InvalidArgumentException('STATUS_NOT_FOUND');

		$q_upd_order = App::queryFactory()->newUpdate();

		$q_upd_order->table('ticket_orders')
			->cols(array(
				'order_status_id' => self::STATUSES[$status_code]
			))
			->where('event_id = ?', $event->getId())
			->where('user_id = ?', $user->getId())
			->where('uuid = ?', $this->uuid);

		App::DB()->prepareExecute($q_upd_order, 'CANT_UPDATE_ORDER');

		return new Result(true, 'Данные успешно обновлены');
	}

}