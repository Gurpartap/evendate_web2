<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Subscription.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'{{/(id:[0-9]+)}}' => function($id) use ($__db, $__request, $__user){
			$organization = OrganizationsCollection::filter(
				$__db,
				$__user,
				array('id' => $id),
				App::$__FIELDS,
				array('organization_type_order', 'organization_type_id'));

			return new Result(true, '', array($organization->getParams($__user, App::$__FIELDS)->getData()));
		},
		'' => function () use ($__db, $__request, $__user){
			return OrganizationsCollection::filter (
				$__db,
				$__user,
				$__request,
				App::$__FIELDS,
				array('length' => App::$__LENGTH, 'offset' => App::$__OFFSET),
				array('organization_type_order', 'organization_type_id')
			);
		},
		'subscriptions' => function () use ($__db, $__request, $__user){
			return OrganizationsCollection::filter (
				$__db,
				$__user,
				array_merge($__request, array('is_subscribed' => true)),
				App::$__FIELDS,
				array('length' => App::$__LENGTH, 'offset' => App::$__OFFSET),
				array('organization_type_order', 'organization_type_id')
			);
		}
	),
	'POST' => array(
		'subscriptions' => function () use ($__db, $__request, $__user){
			$organization = OrganizationsCollection::filter (
				$__db,
				$__user,
				array_merge($__request, array('is_subscribed' => true)),
				App::$__FIELDS,
				array('length' => App::$__LENGTH, 'offset' => App::$__OFFSET),
				array('organization_type_order', 'organization_type_id')
			);;
			return Subscription::create($__user, $organization, $__db);
		},
	),
	'DELETE' => array(
		'{subscriptions/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user){
			$subscription = new Subscription($id, $__db);
			$result = $subscription->delete($__user);
			return $result;
		},
	)
);