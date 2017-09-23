<?php

class Promocode extends AbstractEntity
{

	const USE_COUNT = 'use_count';
	const TOTAL_EFFORT = 'total_effort';

	protected static $DEFAULT_COLS = array(
		'uuid',
		'code',
		'is_fixed',
		'is_percentage',
		'effort',
		'start_date',
		'end_date',
		'enabled'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at',
		'use_limit',

		self::USE_COUNT => '(SELECT COUNT(view_tickets_orders.id) 
			FROM view_tickets_orders 
			INNER JOIN events ON events.id = view_tickets_orders.event_id
		 	INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id 
		 		AND users_organizations.user_id = :user_id AND users_organizations.status = TRUE and users_organizations.role_id = 1
			WHERE view_tickets_orders.event_id = view_promocodes.event_id
			AND view_tickets_orders.ticket_order_status_type = \'green\') AS ' . self::USE_COUNT,

		self::TOTAL_EFFORT => '(SELECT COUNT(view_tickets_orders.id) 
			FROM view_tickets_orders
			INNER JOIN events ON events.id = view_tickets_orders.event_id
		 	INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id 
		 		AND users_organizations.user_id = :user_id AND users_organizations.status = TRUE and users_organizations.role_id = 1
			WHERE view_tickets_orders.event_id = view_promocodes.event_id
			AND view_tickets_orders.ticket_order_status_type = \'green\') AS ' . self::TOTAL_EFFORT
	);



	public static function checkData(array $data, $extremum_dates)
	{
		if (!isset($data['code']) || empty(trim($data['code']))) throw new InvalidArgumentException('PROMOCODE_NAME_REQUIRED');
		$data['is_fixed'] = filter_var($data['is_fixed'], FILTER_VALIDATE_BOOLEAN);
		$data['is_percentage'] = filter_var($data['is_percentage'], FILTER_VALIDATE_BOOLEAN);
		$data['enabled'] = filter_var($data['enabled'], FILTER_VALIDATE_BOOLEAN);

		if (($data['is_fixed'] == false && $data['is_percentage'] == false)
			|| ($data['is_fixed'] == true && $data['is_percentage'] == true)
		) throw new InvalidArgumentException('PROMOCODE_TYPE_ERROR');

		if (!isset($data['effort']) || !is_numeric($data['effort']) || ((float)$data['effort'] <= 0))
			throw new InvalidArgumentException('BAD_EFFORT_VALUE');

		if ($data['is_percentage']){
			if ($data['effort'] > 100 || $data['effort'] < 1) throw new InvalidArgumentException('BAD_EFFORT_VALUE');
		}

		if (isset($data['use_limit']) && ($data['use_limit'] != null) && (!is_numeric($data['use_limit']) || ((float) $data['use_limit'] <= 0)))
			throw new InvalidArgumentException('BAD_USE_LIMITS');

		if (isset($data['effort']) && (!is_numeric($data['effort']) || ((float)$data['effort'] <= 0)))
			throw new InvalidArgumentException('BAD_USE_LIMITS');

		if (isset($data['start_date'])) {
			try {
				$data['start_date'] = new DateTime($data['start_date']);
			} catch (Exception $e) {
				throw new InvalidArgumentException('BAD_START_DATE');
			}
		} else {
			$data['start_date'] = new DateTime();
		}

		if (isset($data['end_date'])) {
			try {
				$data['end_date'] = new DateTime($data['end_date']);
			} catch (Exception $e) {
				throw new InvalidArgumentException('BAD_END_DATE');
			}
		} else {
			$data['end_date'] = $extremum_dates['last_event_date'];
		}
		if ($data['end_date'] < $data['start_date']) throw new InvalidArgumentException('BAD_END_DATE');

		$data['is_fixed'] = $data['is_fixed'] ? 'true' : 'false';
		$data['is_percentage'] = $data['is_percentage'] ? 'true' : 'false';
		$data['enabled'] = $data['enabled'] ? 'true' : 'false';


		return $data;

	}



}