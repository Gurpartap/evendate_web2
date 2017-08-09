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
		'enabled',
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at',
		'use_limit',

		self::USE_COUNT => '(SELECT COUNT(view_tickets_orders.id) 
			FROM view_tickets_orders 
			INNER JOIN events ON events.id = view_tickets_orders.event_id
		 	INNER JOIN users_organizations ON users_organizations.organizations_id = events.organization_id 
		 		AND users_organizations.user_id = :user_id AND users_organizations.status = TRUE and users_organizations.role_id = 1
			WHERE view_tickets_orders.event_id = view_promocodes.event_id
			AND (view_tickets_orders.status_id = 2 OR view_tickets_orders.status_id = 13)) AS ' . self::USE_COUNT,

		self::TOTAL_EFFORT => '(SELECT COUNT(view_tickets_orders.id) 
			FROM view_tickets_orders
			INNER JOIN events ON events.id = view_tickets_orders.event_id
		 	INNER JOIN users_organizations ON users_organizations.organizations_id = events.organization_id 
		 		AND users_organizations.user_id = :user_id AND users_organizations.status = TRUE and users_organizations.role_id = 1
			WHERE view_tickets_orders.event_id = view_promocodes.event_id
			AND (view_tickets_orders.status_id = 2 OR view_tickets_orders.status_id = 13)) AS ' . self::TOTAL_EFFORT
	);




}