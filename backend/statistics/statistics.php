<?php

$__modules['statistics'] = array(
	'GET' => array(
		'my' => function() use ($__db, $__request, $__user){
			$collection = new SubscriptionsCollection($__db, $__user);
			return $collection->get();
		}
	),
	'POST' => array(
		'batch' => function () use ($__db, $__request, $__user){
			return Statistics::StoreBatch($__request['payload'], $__user, $__db);
		}
	),
	'DELETE' => array(
		'{/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user){
			$subscription = new Subscription($id, $__db);
			$result = $subscription->delete($__user);
			return $result;
		},
	)
);