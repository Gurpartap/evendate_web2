<?php

class Tag extends AbstractEntity{

	protected $name;
	protected $created_at;
	protected $updated_at;
	protected $events_count;

	protected static $DEFAULT_COLS = array(
		'id',
		'name',
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at',
		'events_count'
	);


}