<?php

class Tag extends AbstractEntity{

	private $name;
	private $created_at;
	private $updated_at;
	private $events_count;

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