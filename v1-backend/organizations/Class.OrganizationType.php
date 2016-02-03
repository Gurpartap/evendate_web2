<?php

class OrganizationType extends AbstractEntity{

	protected $id;
	protected $name;
	protected $created_at;
	protected $updated_at;
	protected $order_position;

	protected static $DEFAULT_COLS = array(
		'id',
		'name',
		'order_position'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at'
	);


}