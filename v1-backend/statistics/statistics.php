<?php

$__modules['statistics'] = array(
	'POST' => array(
		'batch' => function () use ($__db, $__request, $__user){
			return Statistics::StoreBatch($__request['payload'], $__user, $__db);
		}
	)
);