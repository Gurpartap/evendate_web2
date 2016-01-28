<?php

class EventDate extends AbstractEntity{

	protected $event_date;
	protected $end_time;
	protected $start_time;
	protected $created_at;
	protected $updated_at;
	protected $event_id;
	protected $favored_count;
	protected $organization_id;


	const FAVORED_COUNT_COL_NAME = 'favored_count';
	const EVENTS_COUNT_COL_NAME = 'events_count';

	protected static $DEFAULT_COLS = array(
		'id',
		'event_date'
	);

	protected static $ADDITIONAL_COLS = array(
		'start_time',
		'end_time',
		'created_at',
		'updated_at',
		'event_id',
		'organization_id'
	);

}