<?php

require_once $BACKEND_FULL_PATH . '/users/Class.Device.php';
require_once $BACKEND_FULL_PATH . '/users/Class.DevicesCollection.php';
require_once $BACKEND_FULL_PATH . '/users/Class.Action.php';
require_once $BACKEND_FULL_PATH . '/users/Class.ActionsCollection.php';
require_once $BACKEND_FULL_PATH . '/users/Class.EventAction.php';
require_once $BACKEND_FULL_PATH . '/users/Class.OrganizationAction.php';

$__modules['users'] = array(
	'GET' => array(
		'' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return UsersCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'settings' => function () use ($__user, $__request) {
			if (isset($__request['as_array']) && filter_var($__request['as_array'], FILTER_VALIDATE_BOOLEAN)) {
				$settings = $__user->getSettings();
				return new Result(true,
					'Данные успешно получены',
					array($settings->getData())
				);
			} else {
				return $__user->getSettings();
			}
		},
		'feed' => function () use ($__user, $__db, $__order_by, $__fields, $__pagination) {
			return ActionsCollection::filter(
				$__db,
				$__user,
				array('user' => $__user),
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'friends' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return UsersCollection::filter(
				$__db,
				$__user,
				array('user' => $__user),
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'{/(id:[0-9]+)/actions}' => function ($id) use ($__request, $__user, $__fields, $__db, $__pagination, $__order_by) {
			$friend = UsersCollection::one(
				$__db,
				$__user,
				intval($id),
				array()
			);
			Statistics::Friend($friend, $__user, $__db, Statistics::FRIEND_VIEW_ACTIONS);

			return ActionsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('friend' => $friend)),
				$__fields ?? array(),
				$__pagination ?? array(),
				$__order_by ?? array()
			);
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__user, $__fields, $__db) {
			$friend = UsersCollection::one(
				$__db,
				$__user,
				$id,
				$__fields);

			Statistics::Friend($friend, $__user, $__db, Statistics::FRIEND_VIEW_SUBSCRIPTIONS);

			$data = $friend->getParams($__user, $__fields)->getData();

			return new Result(true, '', array($data));
		},
		'{me/devices}' => function () use ($__user, $__request, $__db, $__fields, $__pagination, $__order_by) {
			return DevicesCollection::filter($__db, $__user, $__request, $__fields,
				$__pagination, $__order_by ?? array());
		},
		'{me/settings}' => function () use ($__user, $__request) {
			if (isset($__request['as_array']) && filter_var($__request['as_array'], FILTER_VALIDATE_BOOLEAN)) {
				$settings = $__user->getSettings();
				return new Result(true,
					'Данные успешно получены',
					array($settings->getData())
				);
			} else {
				return $__user->getSettings();
			}
		},
		'{me}' => function () use ($__user, $__fields) {
			return $__user->getMainInfo($__fields);
		},
		'subscriptions' => function () use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by) {
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('is_subscribed' => true)),
				$__fields,
				$__pagination,
				$__order_by ?? array('organization_type_order', 'organization_type_id')
			);
		},
	),
	'PUT' => array(
		'{settings}' => function () use ($__request, $__user, $__db) {
			return $__user->updateSettings($__request);
		},
		'{me/settings}' => function () use ($__request, $__user, $__db) {
			return $__user->updateSettings($__request);
		},
		'{me/devices}' => function () use ($__request, $__user, $__db) {
			$token = $__user->updateDeviceToken($__request['device_token'], $__request['client_type'], $__request['model'], $__request['os_version']);
			$info = $__user->getMainInfo()->getData();
			$info = array_merge($info, $token->getData());
			return new Result(true, '', $info);
		},
		'{(id:[0-9]+)/subscriptions}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			$result = $organization->addSubscription($__user);
			Statistics::Organization($organization, $__user, $__db, Statistics::ORGANIZATION_SUBSCRIBE);
			return $result;
		},
	),
	'POST' => array(
		'{(id:[0-9]+)/subscriptions}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			$result = $organization->addSubscription($__user);
			Statistics::Organization($organization, $__user, $__db, Statistics::ORGANIZATION_SUBSCRIBE);
			return $result;
		}
	),
	'DELETE' => array(
		'{me/devices/(id:[0-9]+)}' => function ($id) use ($__user, $__request, $__db, $__fields, $__pagination, $__order_by) {
			$device = DevicesCollection::one($__db, $__user, intval($id), $__fields);
			return $device->delete();
		}
	)
);