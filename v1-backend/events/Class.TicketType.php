<?php

class TicketType extends AbstractEntity
{

	const START_AFTER_FIELD_NAME = 'start_after_ticket_type_uuid';
	const AMOUNT_FIELD_NAME = 'amount';
	const PROMOCODE_FIELD_NAME = 'promocode';
	const PROMOCODE_EFFORT_FIELD_NAME = 'promocode_effort';

	protected static $DEFAULT_COLS = array(
		'uuid',
		'event_id',
		'type_code',
		'name',
		'amount',
		'price',
		'start_after_ticket_type_code',
	);

	protected static $ADDITIONAL_COLS = array(
		'comment',
		'sell_start_date',
		'sell_end_date',
		'created_at',
		'updated_at',
		'min_count_per_user',
		'max_count_per_user',
		'is_selling',
	);

	public static $FIELDS_FOR_ADMINISTRATOR = array(
		self::START_AFTER_FIELD_NAME,
//		self::AMOUNT_FIELD_NAME,
		self::PROMOCODE_FIELD_NAME,
		self::PROMOCODE_EFFORT_FIELD_NAME,
	);

	private static function checkData(array $data, $event_extremum_dates)
	{
		$num_price_options = array(
			'options' => array(
				'min_range' => 0
			)
		);

		if (isset($data['name'])) {
			$data['name'] = trim($data['name']);
		} else throw new InvalidArgumentException('BAD_NAME');

		if (isset($data['price'])) {
			$data['price'] = filter_var($data['price'], FILTER_VALIDATE_INT, $num_price_options);
			if (!is_numeric($data['price'])) throw new InvalidArgumentException('BAD_PRICE');
		} else throw new InvalidArgumentException('BAD_PRICE');

		if (isset($data['sell_start_date']) && !is_null($data['sell_start_date'])) {
			if ($data['sell_start_date'] instanceof DateTime) {
				$data['sell_start_date'] = $data['sell_start_date']->format('Y-m-d H:i:s');
			} else {
				$data['sell_start_date'] = (new DateTime($data['sell_start_date']))->format('Y-m-d H:i:s');
			}
		} else {
			$data['sell_start_date'] = (new DateTime())->format('Y-m-d H:i:s');
		}


		if (isset($data['sell_end_date']) && !is_null($data['sell_end_date'])) {
			if ($data['sell_end_date'] instanceof DateTime) {
				$data['sell_end_date'] = $data['sell_end_date']->format('Y-m-d H:i:s');
			} else {
				$data['sell_end_date'] = (new DateTime($data['sell_end_date']))->format('Y-m-d H:i:s');
			}
		} else {
			$data['sell_end_date'] = $event_extremum_dates['last_event_date']->format('Y-m-d H:i:s');
		};

		if (isset($data['amount'])) {
			$data['amount'] = filter_var($data['amount'], FILTER_VALIDATE_INT, $num_price_options);
			if (!is_numeric($data['amount'])) throw new InvalidArgumentException('BAD_AMOUNT');
		} else {
			$data['amount'] = null;
		};

		if (isset($data['min_count_per_user']) && !is_null($data['min_count_per_user'])) {
			$data['min_count_per_user'] = filter_var($data['min_count_per_user'], FILTER_VALIDATE_INT, $num_price_options);
			if (!is_numeric($data['min_count_per_user'])) throw new InvalidArgumentException('BAD_MIN_COUNT_PER_USER');
		} else {
			$data['min_count_per_user'] = 1;
		};

		if (isset($data['max_count_per_user']) && !is_null($data['max_count_per_user'])) {
			$data['max_count_per_user'] = filter_var($data['max_count_per_user'], FILTER_VALIDATE_INT, $num_price_options);
			if (!is_numeric($data['max_count_per_user'])) throw new InvalidArgumentException('BAD_MAX_COUNT_PER_USER');
			if ($data['max_count_per_user'] < $data['min_count_per_user']) throw new InvalidArgumentException('MIN_IS_MORE_THAN_MAX');
		} else {
			$data['max_count_per_user'] = null;
		};

		if (isset($data['promocode_effort']) && !is_null($data['promocode_effort'])) {
			$data['promocode_effort'] = filter_var($data['promocode_effort'], FILTER_VALIDATE_INT, $num_price_options);
			if (!is_numeric($data['promocode_effort'])) throw new InvalidArgumentException('BAD_PROMOCODE_EFFORT');
		} else {
			$data['promocode_effort'] = null;
		};

		if (isset($data['promocode'])) {
			//TODO: check promocode
		} else {
			$data['promocode'] = null;
		};

		if (isset($data['start_after_ticket_type_uuid']) && !is_null($data['start_after_ticket_type_uuid'])) {
			//TODO: check existing
		} else {
			$data['start_after_ticket_type_uuid'] = null;
		};

		if (isset($data['start_after_ticket_type_code']) && !is_null($data['start_after_ticket_type_code'])) {
			//TODO: check existing
		} else {
			$data['start_after_ticket_type_code'] = null;
		};

		return $data;
	}

	public static function create($event_id, $ticket_type, ExtendedPDO $db)
	{
		$event_extremum_dates = Event::getExtremumDates($event_id, App::DB());

		$ticket_type = self::checkData($ticket_type, $event_extremum_dates);
		$q_ins = App::queryFactory()->newInsert();

		$cols = array(
			'event_id' => $event_id,
			'type_code' => $ticket_type['type_code'] ?? null,
			'name' => $ticket_type['name'],
			'comment' => $ticket_type['comment'] ?? null,
			'price' => $ticket_type['price'],
			'status' => isset($ticket_type['to_switch_off']) && $ticket_type['to_switch_off'] == true ? 'false' : 'true',
			'sell_start_date' => $ticket_type['sell_start_date'],
			'sell_end_date' => $ticket_type['sell_end_date'],
			'start_after_ticket_type_uuid' => null,
			'start_after_ticket_type_code' => $ticket_type['start_after_ticket_type_code'],
			'amount' => isset($ticket_type['amount']) && is_numeric($ticket_type['amount']) ? (int) $ticket_type['amount'] : 1000000,
			'min_count_per_user' => $ticket_type['min_count_per_user'],
			'max_count_per_user' => $ticket_type['max_count_per_user'],
			'promocode' => $ticket_type['promocode'],
			'promocode_effort' => $ticket_type['promocode_effort']
		);

		$q_ins
			->into('ticket_types')
			->cols($cols)
		->onConflictUpdate(array('event_id', 'type_code'), $cols);

		if (isset($ticket_type['uuid']) && !is_null($ticket_type['uuid']) && trim($ticket_type['uuid']) != '') {
			$q_ins = App::queryFactory()->newUpdate();
			$cols['updated_at'] = (new DateTime())->format('Y-m-d H:i:s');
			$q_ins->table('ticket_types')
			->cols($cols)
			->where('uuid = ?', $ticket_type['uuid']);
		}
		return $db->prepareExecute($q_ins, 'CANT_INSERT_TICKET_TYPES');
	}

	public static function update(Event $event, User $user, $uuid, $ticket_type, ExtendedPDO $db)
	{
		if ($user->isEventAdmin($event) == false) throw new PrivilegesException('CANT_CHANGE_THIS_EVENT', $db);
		$ticket_type['uuid'] = $uuid;
		self::create($event, $ticket_type, $db);
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result = parent::getParams($user, $fields)->getData();

		foreach (self::$FIELDS_FOR_ADMINISTRATOR as $field) {
			if (property_exists($this, $field)) {
				$result[$field] = $this->$field;
			}
		}

		return new Result(true, '', $result);
	}

}