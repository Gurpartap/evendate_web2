<?php

require_once $ROOT_PATH . 'backend/friends/Class.Friends.php';

$__modules['friends'] = array(
	'GET' => array(
		'all' => function () use ($__db, $__user) {
			return TagsCollection::all($__db, $__user);
		},
		'' => function () use ($__db, $__user) {
			return TagsCollection::all($__db, $__user);
		}
	)
);