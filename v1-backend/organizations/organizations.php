<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationTypesCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationType.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'{{/(id:[0-9]+)}}' => function($id) use ($__db, $__request, $__user, $__fields){
			$result = $organization = OrganizationsCollection::one(
				$__db,
				$__user,
				$id,
				$__fields)->getParams($__user, $__fields)->getData();
			return new Result(true, '', array($result));
		},
		'subscriptions' => function () use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by){
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('is_subscribed' => true)),
				$__fields,
				$__pagination,
				$__order_by ?? array('organization_type_order', 'organization_type_id')
			);
		},
		'recommendations' => function () use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by){
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('recommendations' => true)),
				$__fields,
				$__pagination,
				$__order_by ?? array(Organization::RATING_OVERALL)
			);
		},
		'types' => function () use ($__db, $__request, $__request, $__pagination, $__user, $__fields, $__order_by){
			return OrganizationTypesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('order_position', 'id')
			);
		},
		'' => function () use ($__db, $__request, $__user, $__pagination, $__fields, $__order_by){
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('organization_type_order', 'organization_type_id')
			);
		}
	),
	'PUT' => array(
		'{(id:[0-9]+)}' => function ($organization_id) use ($__db, $__request, $__user, $__fields){
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			return $organization->update($__user, $__request['payload']);
		}
	),
	'POST' => array(
		'{(id:[0-9]+)/subscriptions}' => function ($organization_id) use ($__db, $__request, $__user, $__fields){
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			return $organization->addSubscription($__user);
		},
		'' => function () use ($__db, $__request, $__user, $__fields){
			return $organization = Organization::create(
				$__request['payload'],
				$__user,
				$__db
			);
		},
	),
	'DELETE' => array(
		'{(id:[0-9]+)/subscriptions}' => function ($id) use ($__db, $__request, $__user){
			$organization = OrganizationsCollection::one($__db, $__user, intval($id), array());
			$result = $organization->deleteSubscription($__user);
			return $result;
		},
	)
);