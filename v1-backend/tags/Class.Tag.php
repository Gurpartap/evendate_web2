<?php

class Tag extends AbstractEntity{

	protected $name;
	protected $created_at;
	protected $updated_at;
	protected $events_count;
	
	const RANDOM_FIELD_NAME = 'random';

	protected static $DEFAULT_COLS = array(
		'id',
		'name',
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at',
		'events_count',
		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_tags AS vt
			WHERE vt.id = view_tags.id) AS random',
	);


}