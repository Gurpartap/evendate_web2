<?php

require_once $ROOT_PATH.'backend/tags/Class.TagsCollection.php';

$__modules['tags'] = array(
	'GET' => array(
		'all' => function () use ($__db, $__user) {
			return TagsCollection::all($__db, $__user);
		},
		'' => function () use ($__db, $__user) {
			return TagsCollection::all($__db, $__user);
		}
	)
);