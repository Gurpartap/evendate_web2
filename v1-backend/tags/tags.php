<?php

require_once $BACKEND_FULL_PATH . '/tags/Class.TagsCollection.php';

$__modules['tags'] = array(
	'GET' => array(
		'' => function () use ($__db, $__user, $__length, $__page) {
			return TagsCollection::all($__db, ' ORDER BY tags.name ASC LIMIT ' . $__length . ' OFFSET ' . ($__page * $__length), $__user);
		},
		'search' => function () use ($__request, $__db, $__user, $__length, $__page) {
			$__request['q'] = isset($__request['q']) ? $__request['q']: '';
			return TagsCollection::search($__request['q'], $__db, ' ORDER BY tags.name ASC LIMIT ' . $__length . ' OFFSET ' . ($__page * $__length), $__user);
		}
	)
);