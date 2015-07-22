<?php

require_once $ROOT_PATH.'backend/organizations/Class.OrganizationsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'all' => function () use ($__db, $__request, $__user) {
		},
		'my' => function() use ($__db, $__request, $__user){
			//return $collection->
		},
		'' => function () use ($__db, $__request, $__user) { /*MY EVENTS!*/
			$collection = new OrganizationsCollection($__db, $__user);
			if (isset($__request['with_subscriptions'])){
				$collection->setUser($__user);
				return $collection->getUserOrganizations();
			}else{
				return $collection->getAllActive();
			}
		},
	),
	'POST' => array(
		'' => function () use ($__db, $__request, $__user){
			return $__user->createEvent($__request['payload']);
		},
	)
);