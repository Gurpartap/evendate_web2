<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationTypesCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationType.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'{{/(id:[0-9]+)}}' => function($id) use ($__db, $__request, $__user, $__fields){
			return $organization = OrganizationsCollection::one(
				$__db,
				$__user,
				$id,
				$__fields)->getParams($__user, $__fields);
		},
		'' => function () use ($__db, $__request, $__user, $__pagination, $__fields){
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				array('organization_type_order', 'organization_type_id')
			);
		},
		'subscriptions' => function () use ($__db, $__pagination, $__request, $__user, $__fields){
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('is_subscribed' => true)),
				$__fields,
				$__pagination,
				array('organization_type_order', 'organization_type_id')
			);
		},
		'types' => function () use ($__db, $__request, $__request, $__pagination, $__user, $__fields){
			return OrganizationTypesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				array('order_position', 'id')
			);
		}
	),
	'POST' => array(
		'subscriptions' => function () use ($__db, $__request, $__user, $__fields){
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($__request['organization_id']),
				$__fields
			);
			return $organization->addSubscription($__user);
		},
	),
	'DELETE' => array(
		'{(id:[0-9]+)/subscriptions}' => function ($id) use ($__db, $__request, $__user){
			$organization = OrganizationsCollection::one($__db, $__user, $id);
			$result = $organization->deleteSubscription($__user);
			return $result;
		},
	)
);