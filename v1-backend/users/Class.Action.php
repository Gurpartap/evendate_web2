<?php

class Action extends AbstractEntity{
	protected $entity;
	protected $created_at;
	protected $stat_type_id;
	protected $type_code;
	protected $user;

	protected static $DEFAULT_COLS = array(
		'entity',
		'created_at',
		'stat_type_id',
		'type_code'
	);

	protected static $ADDITIONAL_COLS = array(
		'type',
		'is_friend' => 'view_friends.user_id IS NOT NULL AS is_friend',
		'blurred_image_url',
	);

}