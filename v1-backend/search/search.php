<?php

require_once $BACKEND_FULL_PATH . '/search/Class.Search.php';

$__modules['search'] = array(
	'GET' => array(
		'' => function () use ($__db, $__request, $__user, $__fields) {
            $gs = new GlobalSearch($__request['q'] ?? null, $__request['tags'] ?? null, $__db);
            return $gs->find($__user, $__fields);
		}
	)
);