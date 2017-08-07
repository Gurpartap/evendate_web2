<?php

require_once "{$BACKEND_FULL_PATH}/events/Class.OrdersCollection.php";


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


	const EMAIL_PAYED_TYPE_CODE = 'order_payed';
	const EMAIL_APPROVED_TYPE_CODE = 'order_approved';
	const EMAIL_NOT_APPROVED_TYPE_CODE = 'order_not_approved';
	const EMAIL_AFTER_EVENT_TYPE_CODE = 'order_after_event';
	const EMAIL_WAITING_FOR_PAYMENT = 'order_waiting_for_payment';


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
		'status_id',
		'sum'
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
			->where('uuid = ?', $this->uuid);

		$result = App::DB()->prepareExecute($q_upd_order, 'CANT_UPDATE_ORDER');

		if ($result->rowCount() > 0) {
			$notification_type = null;
			$email_type = null;
			switch ($status_code) {
				case self::REGISTRATION_STATUS_APPROVED: {
					$notification_type = Notification::NOTIFICATION_TYPE_REGISTRATION_APPROVED;
					$email_type = self::EMAIL_APPROVED_TYPE_CODE;
					$tickets = TicketsCollection::filter(App::DB(), $user, array('order' => $this), array(), array(), array())->getData();
					break;
				}
				case self::REGISTRATION_STATUS_REJECTED: {
					$notification_type = Notification::NOTIFICATION_TYPE_REGISTRATION_NOT_APPROVED;
					$email_type = self::EMAIL_NOT_APPROVED_TYPE_CODE;
					$tickets = array();
					break;
				}
			}
			if ($notification_type != null) {
				$event->addNotification(UsersCollection::one(App::DB(), $user, $this->user_id, array()),
					array(
						'notification_type' => $notification_type,
						'notification_time' => (new DateTime())->add(new DateInterval('P1M'))->format(App::DB_DATETIME_FORMAT)
					));

				$current_user = UsersCollection::one(App::DB(), $user, $this->user_id, array())
					->getParams($user, array())->getData();

				$user_email = self::getOrderEmail($this->uuid);

				Emails::schedule($email_type, $user_email, array(
					'first_name' => $current_user['first_name'],
					'event_title' => $event->getTitle(),
					'event_id' => $event->getId(),
					$status_code . '_text' => $event->getEmailTexts()[$status_code] ?? '',
					'tickets' => $tickets
				));
			}
		}

		return new Result(true, 'Данные успешно обновлены');
	}

	private static function getPaymentInfo(array $request, ExtendedPDO $db)
	{
		$request['uuid'] = str_replace('order-', '', $request['evendate_payment_id']);
		$q_get_order = App::queryFactory()->newSelect();
		$q_get_order->cols(array(
			'view_tickets_orders.id',
			'view_tickets_orders.order_content',
			'view_tickets_orders.uuid',
			'view_tickets_orders.event_id',
			'users.first_name',
			'users.last_name',
			'(SELECT SUM(price) FROM view_tickets WHERE view_tickets.status = TRUE AND view_tickets.is_canceled = FALSE AND view_tickets.ticket_order_id = view_tickets_orders.id)'
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
			if ((float)$result['sum'] != (float)$request['orderSumAmount']) throw new InvalidArgumentException('', $db);


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

	public static function avisoPayment(array $request, ExtendedPDO $db)
	{
		try {
			$db->beginTransaction();
			$uuid = str_replace('order-', '', $request['evendate_payment_id']);
			$result = self::getPaymentInfo($request, $db);

			$q_get = App::queryFactory()->newSelect();
			$q_get->from('orders_payments')
				->cols(array('id'))
				->where('ticket_order_id = ?', $result['id'])
				->where('finished = TRUE');


			$payments = $db->prepareExecute($q_get, '')->rowCount();
			if ($payments > 0) throw new LogicException();

			$q_ins = App::queryFactory()->newInsert();

			$new_cols = array(
				'finished' => 'true',
				'sum' => $request['orderSumAmount'],
				'ticket_order_id' => $result['id'],
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
				->where('uuid = ?', $uuid);

			$db->prepareExecute($q_upd_order, '');
			$q_get_event = App::queryFactory()->newSelect();
			$q_get_event->from('events')
				->cols(array('events.title', 'events.id', 'email_texts.payed'))
				->join('left', 'email_texts', 'events.id = email_texts.event_id')
				->where('events.id = ?', $result['event_id']);

			$event = $db->prepareExecute($q_get_event, 'CANT_GET_EVENT')->fetch();

			$payed_text = $event['payed'];

			$tickets = TicketsCollection::filter($db, App::getCurrentUser(), array(
				'order' => OrdersCollection::oneByUUID($db, App::getCurrentUser(), $uuid, array())
			), array(), array(), array())->getData();

			Emails::schedule(self::EMAIL_PAYED_TYPE_CODE, self::getOrderEmail($uuid), array(
				'first_name' => $result['first_name'],
				'event_title' => $event['title'],
				'event_id' => $event['id'],
				'payed_text' => $payed_text,
				'tickets' => $tickets
			));
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


}