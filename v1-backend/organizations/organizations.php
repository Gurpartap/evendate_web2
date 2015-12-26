<?php

require_once $ROOT_PATH. $BACKEND_FOLDER . '/organizations/Class.OrganizationsCollection.php';
require_once $ROOT_PATH. $BACKEND_FOLDER . '/organizations/Class.Organization.php';
require_once $ROOT_PATH. $BACKEND_FOLDER . '/events/Class.EventsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'my' => function() use ($__db, $__request, $__user){

		},
		'{{/(id:[0-9]+)}}' => function($id) use ($__db, $__request, $__user){
			$organization = new Organization($id, $__db);
			$result = $organization->getFullParams($__user)->getData();
			if (isset($__request['with_events']) && $__request['with_events'] == true){
				$result['events'] = EventsCollection::filter($__db, $__user, array(
					'organization' => $organization,
					'type' => 'future'
				), ' ORDER BY first_date, events.event_start_date, events.begin_time ')->getData();
			}
			return new Result(true, '', $result);
		},
		'' => function () use ($__db, $__request, $__user) {
			if (isset($__request['without_friends'])){
				$limit_friends = ' LIMIT 0';
			}else{
				$limit_friends = '';
			}
			return OrganizationsCollection::filter($__db, $__user, array(), ' ORDER BY organization_types.order, organization_types.id ', $limit_friends);
		},
		'all' => function () use ($__db, $__request, $__user) {
			if (isset($__request['without_friends'])){
				$limit_friends = ' LIMIT 0';
			}else{
				$limit_friends = '';
			}
			return OrganizationsCollection::filter($__db, $__user, array(), ' ORDER BY organization_types.order, organization_types.id ', $limit_friends);
		},
	)
);