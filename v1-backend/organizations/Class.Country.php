<?php

class Country extends AbstractEntity{

	protected $id;
	protected $en_name;
	protected $created_at;
	protected $updated_at;
	protected $order_position;

	protected static $DEFAULT_COLS = array(
		'id',
		'en_name',
		'language_short',
		'local_name'
	);

	protected static $ADDITIONAL_COLS = array(
		'language',
		'cities_count',
		'created_at',
		'updated_at'
	);
}