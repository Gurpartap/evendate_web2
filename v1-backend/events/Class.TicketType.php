<?php

class TicketType extends AbstractEntity
{

	protected static $DEFAULT_COLS = array(
		'uuid',
		'event_id',
		'type_code',
		'name',
	);

	protected static $ADDITIONAL_COLS = array(
		'comment',
		'price',
		'sell_start_date',
		'sell_end_date',
		'start_after_ticket_type_uuid',
		'amount',
		'min_count_per_user',
		'max_count_per_user',
		'promocode',
		'promocode_effort',
		'created_at',
		'updated_at'
	);


	private static function checkData(array $data)
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
			}else{
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
			$data['sell_end_date'] = (new DateTime())->format('Y-m-d H:i:s');
		};

		if (isset($data['amount'])) {
			$data['amount'] = filter_var($data['amount'], FILTER_VALIDATE_INT, $num_price_options);
			if (!is_numeric($data['amount'])) throw new InvalidArgumentException('BAD_AMOUNT');
		} else throw new InvalidArgumentException('BAD_AMOUNT');

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

		return $data;
	}

	public static function create($event_id, $ticket_type, ExtendedPDO $db)
	{
		$ticket_type = self::checkData($ticket_type);
		$q_ins = App::queryFactory()->newInsert();

		$cols = array(
			'event_id' => $event_id,
			'type_code' => $ticket_type['type_code'] ?? null,
			'name' => $ticket_type['name'],
			'comment' => $ticket_type['comment'],
			'price' => $ticket_type['price'],
			'sell_start_date' => $ticket_type['sell_start_date'],
			'sell_end_date' => $ticket_type['sell_end_date'],
			'start_after_ticket_type_uuid' => $ticket_type['start_after_ticket_type_uuid'],
			'amount' => $ticket_type['amount'],
			'min_count_per_user' => $ticket_type['min_count_per_user'],
			'max_count_per_user' => $ticket_type['max_count_per_user'],
			'promocode' => $ticket_type['promocode'],
			'promocode_effort' => $ticket_type['promocode_effort'],
		);

		$q_ins
			->into('ticket_types')
			->cols($cols);

		if (isset($ticket_type['uuid']) && !is_null($ticket_type['uuid']) && trim($ticket_type['uuid']) != '') {
			$cols['updated_at'] = (new DateTime())->format('Y-m-d H:i:s');
			$q_ins->onConflictUpdate(array('uuid'), $cols);
		}
		return $db->prepareExecute($q_ins, 'CANT_INSERT_TICKET_TYPES');
	}

	public static function update(Event $event, User $user, $uuid, $ticket_type, ExtendedPDO $db)
	{
		if ($user->isEventAdmin($event) == false) throw new PrivilegesException('', $db);
		$ticket_type['uuid'] = $uuid;
		self::create($event, $ticket_type, $db);
	}

}