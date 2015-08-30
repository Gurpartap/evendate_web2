<?php

require_once $ROOT_PATH.'backend/tags/Class.TagsCollection.php';

$__modules['tags'] = array(
	'GET' => array(
		'all' => function () use ($__db) {
			return TagsCollection::all($__db);
		}
	)
);