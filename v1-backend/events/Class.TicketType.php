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

		return $data;
	}

	public static function create($event_id, $ticket_type, ExtendedPDO $db)
	{
		self::checkData($ticket_type);
		$q_ins = App::queryFactory()->newInsert();

		$cols = array(
			'event_id' => $event_id,
			'type_code' => $ticket_type['type_code'],
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
			$q_ins->onConflictUpdate(array('uuid'), $cols);
		}
	}

	public static function update(Event $event, User $user, $uuid, $ticket_type, ExtendedPDO $db)
	{
		if ($user->isEventAdmin($event) == false) throw new PrivilegesException('', $db);
		$ticket_type['uuid'] = $uuid;
		self::checkData($ticket_type);
		self::create($event, $ticket_type, $db);
	}

	public static function delete(Event $event, User $user, $uuid, $ticket_type, ExtendedPDO $db)
	{
		if ($user->isEventAdmin($event) == false) throw new PrivilegesException('', $db);
	}
}