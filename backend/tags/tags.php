<?php

require_once $ROOT_PATH.'backend/tags/Class.TagsCollection.php';

$__modules['tags'] = array(
	'GET' => array(
		'all' => function () use ($__db, $__user, $__length, $__page) {
			return TagsCollection::all($__db, ' ORDER BY tags.name ASC LIMIT ' . ($__page * $__length) . ' , ' . $__length, $__user);
		},
		'' => function () use ($__db, $__user, $__length, $__page) {
			return TagsCollection::all($__db, ' ORDER BY tags.name ASC LIMIT ' . ($__page * $__length) . ' , ' . $__length, $__user);
		},
		'search' => function () use ($__request, $__db, $__user, $__length, $__page) {
			$__request['q'] = isset($__request['q']) ? $__request['q']: '';
			return TagsCollection::search($__request['q'], $__db, ' ORDER BY tags.name ASC LIMIT ' . ($__page * $__length) . ' , ' . $__length, $__user);
		}
	)
);