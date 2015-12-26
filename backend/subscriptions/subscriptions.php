<?php

require_once $ROOT_PATH. $BACKEND_FOLDER . '/subscriptions/Class.Subscription.php';
require_once $ROOT_PATH. $BACKEND_FOLDER . '/subscriptions/Class.SubscriptionsCollection.php';
require_once $ROOT_PATH. $BACKEND_FOLDER . '/organizations/Class.Organization.php';
require_once $ROOT_PATH. $BACKEND_FOLDER . '/organizations/Class.OrganizationsCollection.php';

$__modules['subscriptions'] = array(
	'GET' => array(
		'my' => function() use ($__db, $__request, $__user){
			return OrganizationsCollection::filter($__db, $__user, array('is_subscribed' => true));
		}
	),
	'POST' => array(
		'' => function () use ($__db, $__request, $__user){
			$organization = new Organization($__request['organization_id'], $__db);
			return Subscription::create($__user, $organization, $__db);
		},
	),
	'DELETE' => array(
		'{/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user){
			$subscription = new Subscription($id, $__db);
			$result = $subscription->delete($__user);
			return $result;
		},
	)
);