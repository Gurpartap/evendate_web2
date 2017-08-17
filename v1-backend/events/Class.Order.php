<?php

require_once "{$BACKEND_FULL_PATH}/events/Class.OrdersCollection.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.PromocodesCollection.php";


class Order extends AbstractEntity
{

	const STATUS_WAITING_PAYMENT = 'waiting_for_payment';
	const STATUS_WAITING_PAYMENT_LEGAL_ENTITY = 'order_waiting_for_payment_legal_entity';
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


	const EMAIL_PAYED_TYPE_CODE = 'order_payed';
	const EMAIL_APPROVED_TYPE_CODE = 'order_approved';
	const EMAIL_NOT_APPROVED_TYPE_CODE = 'order_not_approved';
	const EMAIL_AFTER_EVENT_TYPE_CODE = 'order_after_event';
	const EMAIL_WAITING_FOR_PAYMENT = 'order_waiting_for_payment';
	const EMAIL_WAITING_FOR_PAYMENT_LEGAL_ENTITY = 'order_waiting_for_payment_legal_entity';


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
	const STATUS_WAITING_PAYMENT_LEGAL_ENTITY_ID = 12;


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
		self::STATUS_WAITING_PAYMENT_LEGAL_ENTITY => self::STATUS_WAITING_PAYMENT_LEGAL_ENTITY_ID,

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
		self::STATUS_WAITING_PAYMENT_LEGAL_ENTITY,
	);

	const TICKETS_FIELD_NAME = 'tickets';
	const USER_FIELD_NAME = 'user';
	const PROMOCODE_FIELD_NAME = 'promocode';
	const PAYER_LEGAL_ENTITY_FIELD_NAME = 'payer_legal_entity';
	const REGISTRATION_FIELDS_FIELD_NAME = 'registration_fields';
	const REGISTRATION_STATUS_FIELD_NAME = 'registration_status';
	const BITCOIN_ADDRESS_FIELD_NAME = 'bitcoin_address';
	const BITCOIN_AMOUNT_FIELD_NAME = 'bitcoin_amount';

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
		'sum',
		'final_sum',
	);

	protected static $ADDITIONAL_COLS = array(
		'order_content',
		'is_canceled',
		'payed_at',
		'canceled_at',
		'updated_at',
		'status_id',
		self::BITCOIN_ADDRESS_FIELD_NAME => '(SELECT address FROM bitcoin_addresses WHERE ticket_order_id = view_tickets_orders.id ORDER BY id DESC LIMIT 1) AS ' . self::BITCOIN_ADDRESS_FIELD_NAME,
		self::BITCOIN_AMOUNT_FIELD_NAME => '(SELECT waiting_amount FROM bitcoin_addresses WHERE ticket_order_id = view_tickets_orders.id ORDER BY id DESC LIMIT 1) AS ' . self::BITCOIN_AMOUNT_FIELD_NAME,
	);


	public static function create(Event $event, AbstractUser $user, ExtendedPDO $db, array $data, $promocode = null)
	{

		if (isset($promocode)) {
			try {
				$promocode = PromocodesCollection::filter($db, $user, array('event_id' => $event->getId(), 'code' => $promocode, 'is_active' => 'true'), array('id'), array(), array());
				$promocode_id = $promocode->getId();
			} catch (Exception $e) {
				$promocode_id = null;
			}
		} else {
			$promocode_id = null;
		}

		$q_get = App::queryFactory()->newInsert();
		$q_get->into('ticket_orders')
			->cols(array(
				'event_id' => $event->getId(),
				'user_id' => $user->getId(),
				'order_content' => json_encode($data),
				'sum' => 0,
				'order_status_id' => $event->getTicketingLocally() ? self::STATUS_WAITING_PAYMENT_ID : self::STATUS_WITHOUT_PAYMENT_ID,
				'promocode_id' => $promocode_id
			))
			->returning(array('uuid', 'id'));
		$res = $db->prepareExecute($q_get, 'CANT_INSERT_ORDER')->fetch();

		return array('id' => $res['id'], 'uuid' => $res['uuid']);
	}

	public static function updateSum($id, ExtendedPDO $db)
	{
		$q_upd = 'UPDATE ticket_orders SET sum = subquery.sum,
			final_sum = subquery.final_sum
			FROM (
				SELECT 
				COALESCE(view_tickets_orders.sum, 0) AS sum,
				promocodes.effort,
				promocodes.is_fixed, 
				promocodes.is_percentage,
				CASE 
			WHEN promocodes.enabled = FALSE THEN COALESCE(view_tickets_orders.sum, 0) 
			WHEN promocodes.enabled = TRUE AND promocodes.is_fixed = TRUE 
				THEN (COALESCE(view_tickets_orders.sum, 0) - promocodes.effort)
			WHEN promocodes.enabled = TRUE AND promocodes.is_percentage = TRUE 
				THEN (COALESCE(view_tickets_orders.sum, 0) - (promocodes.effort / 100 * COALESCE(view_tickets_orders.sum, 0)))
				END AS final_sum,
				promocodes.enabled
				FROM view_tickets_orders
				LEFT JOIN promocodes ON promocodes.id = view_tickets_orders.promocode_id
				WHERE view_tickets_orders.id = :order_id) AS subquery
				WHERE ticket_orders.id = :order_id
				RETURNING *';

		$upd = $db->prepareExecuteRaw($q_upd, array(':order_id' => $id), 'CANT_INSERT_ORDER_SUM')->fetch();

	}

	private static function avisoBitcoin(array $request, ExtendedPDO $db)
	{
		$key_part = '4d0480efc15c10be631bceee3a36ebed8b101827df4f41009fc98b0672fa1153';
		$key = implode('', array($request['address'], $request['waiting_amount'], $request['uuid'], $key_part));
		if ($request['key'] == md5($key)) {
			$payment_info = self::getPaymentInfo($request, $db);
			$request['orderSumAmount'] = $request['waiting_amount'];
			$request['shopSumAmount'] = $request['waiting_amount'];
			$db->beginTransaction();
			try {
				self::setPaymentStatus($request, $db, $payment_info);
				$db->commit();
			} catch (Exception $e) {
				$db->rollBack();
				return new Result(false, '');
			}
		} else {
			throw new InvalidArgumentException('BAD_KEY_STOP_DUDE!');
		}
		return new Result(true, '');
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

		if (isset($fields[self::PROMOCODE_FIELD_NAME]) && $user instanceof User) {
			$promocode_fields = Fields::parseFields($fields[self::PROMOCODE_FIELD_NAME]['fields'] ?? '');
			try {
				$promccode = PromocodesCollection::filter(App::DB(),
					$user,
					array('ticket_order' => $this),
					$promocode_fields,
					array(
						'length' => $fields[self::PROMOCODE_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $fields[self::PROMOCODE_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
					),
					Fields::parseOrderBy($fields[self::PROMOCODE_FIELD_NAME]['order_by'] ?? ''));
				$result[self::PROMOCODE_FIELD_NAME] = $promccode->getParams($user, $promocode_fields)->getData();
			} catch (Exception $e) {
				$result[self::PROMOCODE_FIELD_NAME] = null;
			}


		}

		if (isset($fields[self::REGISTRATION_FIELDS_FIELD_NAME]) && $user instanceof User) {
			$result[self::REGISTRATION_FIELDS_FIELD_NAME] = RegistrationForm::getFilledFields(App::DB(),
				$this)->getData();
		}
		if (isset($fields[self::PAYER_LEGAL_ENTITY_FIELD_NAME]) && $user instanceof User) {
			$result[self::PAYER_LEGAL_ENTITY_FIELD_NAME] = $this->getLegalEntityData();
		}

		return new Result(true, '', $result);
	}

	public function setStatus(string $status_code, User $user, Event $event, string $email = null)
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
			->where('uuid = ?', $this->uuid);

		$result = App::DB()->prepareExecute($q_upd_order, 'CANT_UPDATE_ORDER');

		if ($result->rowCount() > 0) {
			$notification_type = null;
			$email_type = null;
			$data = array();
			switch ($status_code) {
				case self::REGISTRATION_STATUS_APPROVED: {
					$notification_type = Notification::NOTIFICATION_TYPE_REGISTRATION_APPROVED;
					$email_type = self::EMAIL_APPROVED_TYPE_CODE;
					$data['tickets'] = TicketsCollection::filter(App::DB(), $user, array('order' => $this), array(), array(), array())->getData();
					break;
				}
				case self::REGISTRATION_STATUS_REJECTED: {
					$notification_type = Notification::NOTIFICATION_TYPE_REGISTRATION_NOT_APPROVED;
					$email_type = self::EMAIL_NOT_APPROVED_TYPE_CODE;
					$data['tickets'] = array();
					break;
				}
				case self::STATUS_WAITING_PAYMENT_LEGAL_ENTITY: {
					$email_type = self::EMAIL_WAITING_FOR_PAYMENT_LEGAL_ENTITY;
					break;
				}
			}
			if ($notification_type != null) {
				$event->addNotification(UsersCollection::one(App::DB(), $user, $this->user_id, array()),
					array(
						'notification_type' => $notification_type,
						'notification_time' => (new DateTime())->add(new DateInterval('P1M'))->format(App::DB_DATETIME_FORMAT)
					));
			}
			if ($email_type != null) {
				$current_user = UsersCollection::one(App::DB(), $user, $this->user_id, array())
					->getParams($user, array())->getData();

				$user_email = $email ?? self::getOrderEmail($this->uuid);
				$data['first_name'] = $current_user['first_name'];
				$data['event_title'] = $event->getTitle();
				$data['event_id'] = $event->getId();
				$data['uuid'] = $this->uuid;
				$data[$status_code . '_text'] = $event->getEmailTexts()[$status_code] ?? '';
				Emails::schedule($email_type, $user_email, $data);
			}
		}

		return new Result(true, 'Данные успешно обновлены');
	}

	private static function getPaymentInfo(array $request, ExtendedPDO $db)
	{
		if (!isset($request['uuid'])) {
			$request['uuid'] = str_replace('order-', '', $request['evendate_payment_id']);
		}
		$q_get_order = App::queryFactory()->newSelect();
		$q_get_order->cols(array(
			'view_tickets_orders.id',
			'view_tickets_orders.order_content',
			'view_tickets_orders.uuid',
			'view_tickets_orders.event_id',
			'users.first_name',
			'users.last_name',
			'view_tickets_orders.sum',
			'view_tickets_orders.final_sum'
		))
			->from('view_tickets_orders')
			->join('inner', 'users', 'users.id = view_tickets_orders.user_id')
			->where('uuid = ?', $request['uuid'])
			->where('is_canceled = FALSE')
			->where('canceled_at IS NULL');
		return $db->prepareExecute($q_get_order, 'CANT_GET_PAYMENT_INFO')->fetch();

	}

	public static function checkPayment(array $request, ExtendedPDO $db)
	{
		try {
			if (!Payment::checkMd5($request)) throw new BadArgumentException('', $db);
			$result = self::getPaymentInfo($request, $db);
			if ($result == false) throw new NoMethodException('', $db);
			if ((float)$result['final_sum'] != (float)$request['orderSumAmount']) throw new InvalidArgumentException('', $db);


			return Payment::buildResponse(Payment::ACTION_CHECK_ORDER, 0, 'ok', $request['invoiceId']);
		} catch (NoMethodException $nmte) {
			return Payment::buildResponse(Payment::ACTION_CHECK_ORDER, 100, 'PAYMENT NOT FOUND', $request['invoiceId']);
		} catch (BadArgumentException $be) {
			return Payment::buildResponse(Payment::ACTION_CHECK_ORDER, 1, 'MD5 ERROR', $request['invoiceId']);
		} catch (InvalidArgumentException $ie) {
			return Payment::buildResponse(Payment::ACTION_CHECK_ORDER, 101, 'WRONG SUM', $request['invoiceId']);
		} catch (Exception $e) {
			return Payment::buildResponse(Payment::ACTION_CHECK_ORDER, 102, $e->getMessage(), $request['invoiceId']);
		}
	}

	private static function getOrderEmail($order_uuid)
	{
		$q_get_email = App::queryFactory()->newSelect();
		$q_get_email->from('users')
			->join('inner', 'ticket_orders', 'users.id = ticket_orders.user_id')
			->cols(array('users.email',
				'(SELECT value 
					FROM view_registration_field_values 
					WHERE view_registration_field_values.ticket_order_id = ticket_orders.id
					AND view_registration_field_values.form_field_type = \'email\'
					ORDER BY value DESC LIMIT 1) AS form_email'))
			->where('ticket_orders.uuid = ?', $order_uuid);

		$emails = App::DB()->prepareExecute($q_get_email)->fetch();

		if (!filter_var($emails['email'], FILTER_VALIDATE_EMAIL)) {
			if (!filter_var($emails['form_email'], FILTER_VALIDATE_EMAIL)) {
				return null;
			} else {
				return $emails['form_email'];
			}
		} else {
			return $emails['email'];
		}

	}

	private static function setPaymentStatus(array $request, ExtendedPDO $db, array $payment_info)
	{
		$q_ins = App::queryFactory()->newInsert();

		$new_cols = array(
			'finished' => 'true',
			'sum' => $request['orderSumAmount'],
			'ticket_order_id' => $payment_info['id'],
			'aviso_data' => json_encode($request),
			'payed_at' => (new DateTime())->format(App::DB_DATETIME_FORMAT)
		);

		$q_ins->into('orders_payments')
			->cols($new_cols)
			->onConflictUpdate(array('ticket_order_id', 'finished', 'canceled'), $new_cols);
		$db->prepareExecute($q_ins, 'CANT_UPDATE_PAYMENT');

		$q_upd_order = App::queryFactory()->newUpdate();
		$q_upd_order->table('ticket_orders')
			->cols(array(
				'order_status_id' => self::STATUSES[self::STATUS_PAYED],
				'payed_at' => (new DateTime())->format(App::DB_DATETIME_FORMAT),
				'shop_sum_amount' => $request['shopSumAmount']
			))
			->where('uuid = ?', $request['uuid']);


		$db->prepareExecute($q_upd_order, '');
		$q_get_event = App::queryFactory()->newSelect();
		$q_get_event->from('events')
			->cols(array('events.title', 'events.id', 'email_texts.payed'))
			->join('left', 'email_texts', 'events.id = email_texts.event_id')
			->where('events.id = ?', $payment_info['event_id']);

		$event = $db->prepareExecute($q_get_event, 'CANT_GET_EVENT')->fetch();

		$payed_text = $event['payed'];

		$tickets = TicketsCollection::filter($db, App::getCurrentUser(), array(
			'order' => OrdersCollection::oneByUUID($db, App::getCurrentUser(), $request['uuid'], array())
		), array(), array(), array())->getData();


		Emails::schedule(self::EMAIL_PAYED_TYPE_CODE, self::getOrderEmail($request['uuid']), array(
			'first_name' => $payment_info['first_name'],
			'event_title' => $event['title'],
			'event_id' => $event['id'],
			'payed_text' => $payed_text,
			'tickets' => $tickets
		));

	}

	public static function avisoPayment(array $request, ExtendedPDO $db)
	{
		if (isset($request['bitcoin']) && $request['bitcoin'] == true) {
			return self::avisoBitcoin($request, $db);
		}
		try {
			$db->beginTransaction();
			$request['uuid'] = str_replace('order-', '', $request['evendate_payment_id']);
			$payment_info = self::getPaymentInfo($request, $db);

			$q_get = App::queryFactory()->newSelect();
			$q_get->from('orders_payments')
				->cols(array('id'))
				->where('ticket_order_id = ?', $payment_info['id'])
				->where('finished = TRUE');


			$payments = $db->prepareExecute($q_get, '')->rowCount();
			if ($payments > 0) throw new LogicException();

			self::setPaymentStatus($request, $db, $payment_info);

			$db->commit();
			return Payment::buildResponse(Payment::ACTION_PAYMENT_AVISO, 0, 'ok', $request['invoiceId']);

		} catch (NoMethodException $nmte) {
			$db->rollBack();
			return Payment::buildResponse(Payment::ACTION_PAYMENT_AVISO, 100, 'PAYMENT NOT FOUND', $request['invoiceId']);
		} catch (BadArgumentException $be) {
			$db->rollBack();
			return Payment::buildResponse(Payment::ACTION_PAYMENT_AVISO, 1, 'MD5 ERROR', $request['invoiceId']);
		} catch (InvalidArgumentException $ie) {
			$db->rollBack();
			return Payment::buildResponse(Payment::ACTION_PAYMENT_AVISO, 100, 'WRONG SUM', $request['invoiceId']);
		} catch (LogicException $le) {
			$db->rollBack();
			return Payment::buildResponse(Payment::ACTION_PAYMENT_AVISO, 100, 'INVOICE PAYED', $request['invoiceId']);
		} catch (Exception $e) {
			$db->rollBack();
			return Payment::buildResponse(Payment::ACTION_PAYMENT_AVISO, 100, $e->getMessage(), $request['invoiceId']);
		}

	}

	private function getLegalEntityFields()
	{
		return array(
			'participants',
			'company_name',
			'company_inn',
			'company_kpp',
			'company_address',
			'company_zipcode',
			'bank_name',
			'bank_bik',
			'bank_correspondent_account',
			'bank_payment_account',
			'signer_full_name',
			'signer_position',
			'contact_full_name',
			'contact_email',
			'contact_phone_number'
		);
	}

	public function getLegalEntityData()
	{
		$q_get = App::queryFactory()->newSelect();
		$q_get->from('orders_legal_entities')
			->cols($this->getLegalEntityFields())
			->where('ticket_order_id = ? ', $this->getId());
		$db = App::DB();
		return $db->prepareExecute($q_get, 'CANT_GET_LEGAL_ENTITY_PAYMENT')->fetch();
	}

	public function makeLegalEntityPayment(array $data, Event $event)
	{
		if ($this->status_type_code != self::STATUS_WAITING_PAYMENT
			&& $this->status_type_code != self::STATUS_WAITING_PAYMENT_LEGAL_ENTITY
		) throw new InvalidArgumentException('CANT_MAKE_LEGAL_ENTITY');

		$current_user = App::getCurrentUser();
		$db = App::DB();

		if ($this->user_id != $current_user->getId() && !$current_user->isEventAdmin($event))
			throw new PrivilegesException('', $db);

		$check_fields = $this->getLegalEntityFields();
		$field_names = App::loadColumnNames();
		$cols = array();
		foreach ($check_fields as $field) {
			if (!isset($data[$field]) || empty(trim($data[$field]))) {
				$field_name = $field_names[App::$__LANG]['legal_entity_fields'][$field];
				throw new InvalidArgumentException(Errors::getDescription(App::$__LANG, 'UNEXPECTED_VALUES') . ': ' . $field_name);
			} else {
				$cols[$field] = $data[$field];
			}
		}
		$cols['ticket_order_id'] = $this->getId();
		$q_ins = App::queryFactory()->newInsert();
		$q_ins->into('orders_legal_entities')
			->cols($cols)
			->onConflictUpdate(array('ticket_order_id'), $cols)
			->returning(array('id'));
		$prep = $db->prepareExecute($q_ins, 'CANT_SET_LEGAL_ENTITY_PAYMENT');
		if ($prep->rowCount() != 1) throw new LogicException('CANT_SET_LEGAL_ENTITY_PAYMENT');
		$this->setStatus(self::STATUS_WAITING_PAYMENT_LEGAL_ENTITY, App::getCurrentUser(), $event, $data['contact_email']);
		return new Result(true, 'Данные успешно обновлены');
	}


	public function makeBitcoinPayment($fields, Event $event)
	{
		if ($this->status_type_code != self::STATUS_WAITING_PAYMENT
			&& $this->status_type_code != self::STATUS_WAITING_PAYMENT_LEGAL_ENTITY
		) throw new InvalidArgumentException('CANT_MAKE_BITCOIN_PAYMENT');

		$current_user = App::getCurrentUser();
		$db = App::DB();

		if ($this->user_id != $current_user->getId() && !$current_user->isEventAdmin($event))
			throw new PrivilegesException('', $db);

		$order_details = $this->getParams(App::getCurrentUser(), $fields)->getData();

		$currency = json_decode(file_get_contents('https://blockchain.info/ticker'), true)['RUB']['buy'];
		$btc_price = round($order_details['final_sum'] / $currency, 8);
		$q_ins_bitcoin_address = 'UPDATE bitcoin_addresses SET 
			waiting_amount = :waiting_amount,
			is_used = TRUE,
			ticket_order_id = :ticket_order_id
			WHERE id = (SELECT id FROM bitcoin_addresses WHERE is_used = FALSE AND waiting_amount IS NULL ORDER BY id LIMIT 1)
			RETURNING address';

		$data = $db->prepareExecuteRaw($q_ins_bitcoin_address, array(
			':waiting_amount' => $btc_price,
			':ticket_order_id' => $this->getId()), 'CANT_ADD_BITCOIN_ADDRESS')->fetch();
		return new Result(true, '', array(
			'address' => $data['address'],
			'amount' => $btc_price
		));
	}

}