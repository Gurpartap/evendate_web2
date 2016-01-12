<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'{{/(id:[0-9]+)}}' => function($id) use ($__db, $__request, $__user){

			$organization = OrganizationsCollection::filter(
				$__db,
				$__user,
				array('id' => $id),
				array('organization_type_order', 'organization_type_id'),
				App::getFieldsParam('subscribed', 'limit'));

			return new Result(true, '', array($organization->getParams($__user, App::$__FIELDS)->getData()));
		},
		'' => function () use ($__db, $__request, $__user){
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				$__request,
				array('organization_type_order', 'organization_type_id'),
				App::getFieldsParam('subscribed', 'limit'));
		}
	)
);