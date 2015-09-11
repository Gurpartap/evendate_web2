<?php

require_once $ROOT_PATH.'backend/organizations/Class.OrganizationsCollection.php';
require_once $ROOT_PATH.'backend/organizations/Class.Organization.php';
require_once $ROOT_PATH.'backend/events/Class.EventsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'my' => function() use ($__db, $__request, $__user){

		},
		'{{/(id:[0-9]+)}}' => function($id) use ($__db, $__request, $__user){
			$organization = new Organization($id, $__db);
			$result = $organization->getFullParams($__user)->getData();
			if (isset($__request['with_events']) && $__request['with_events'] == true){
				$result['events'] = EventsCollection::filter($__db, $__user, array(
					'organization' => $organization
				), ' ORDER BY events.id DESC')->getData();
			}
			return new Result(true, '', $result);
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
		'all' => function () use ($__db, $__request, $__user) {
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