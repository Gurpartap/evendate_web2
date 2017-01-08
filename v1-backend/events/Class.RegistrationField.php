<?php


class RegistrationField extends AbstractEntity{

	protected $id;
	protected $event_id;
	protected $field_type_id;
	protected $label;
	protected $created_at;
	protected $updated_at;
	protected $required;
	protected $status;

	protected static $DEFAULT_COLS = array(
		'type',
		'label',
		'required',
		'uuid'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at'
	);
}