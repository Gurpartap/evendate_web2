<?php

require_once $ROOT_PATH.'backend/search/Class.Search.php';

$__modules['search'] = array(
	'GET' => array(
		'' => function () use ($__db, $__request, $__user) {
			if (isset($__request['q'])){
				$gs = new GlobalSearch($__request['q'], $__db);
				return $gs->find($__user);
			}
		}
	)
);