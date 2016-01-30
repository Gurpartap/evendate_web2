<?php

class EventDate extends AbstractEntity{

	protected $event_date;
	protected $end_time;
	protected $start_time;
	protected $created_at;
	protected $updated_at;
	protected $event_id;
	protected $favored_count;
	protected $events_count;
	protected $organization_id;


	const FAVORED_COUNT_FIELD_NAME = 'favorites_count';
	const EVENTS_COUNT_FIELD_NAME = 'events_count';

	protected static $DEFAULT_COLS = array(
		'event_date'
	);

	protected static $ADDITIONAL_COLS = array(
		'id',
		'start_time',
		'end_time',
		'created_at',
		'updated_at',
		'event_id',
		EventDate::EVENTS_COUNT_FIELD_NAME => ' COUNT(event_date) AS ' . EventDate::EVENTS_COUNT_FIELD_NAME,
		EventDate::FAVORED_COUNT_FIELD_NAME => ' COUNT(favorite_events.id) AS ' . EventDate::FAVORED_COUNT_FIELD_NAME,
		'organization_id'
	);



}