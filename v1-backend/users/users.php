<?php

require_once $BACKEND_FULL_PATH . '/users/Class.Device.php';
require_once $BACKEND_FULL_PATH . '/users/Class.DevicesCollection.php';
require_once $BACKEND_FULL_PATH . '/users/Class.Action.php';
require_once $BACKEND_FULL_PATH . '/users/Class.ActionsCollection.php';
require_once $BACKEND_FULL_PATH . '/users/Class.EventAction.php';
require_once $BACKEND_FULL_PATH . '/users/Class.OrganizationAction.php';

$__modules['users'] = array(
	'GET' => array(
		'settings' => function () use ($__user) {
			return $__user->getSettings();
		},
		'feed' => function () use ($__user, $__page, $__length, $__request) {
			return $__user->getFriendsFeed($__page, $__length);
		},
		'friends' => function () use ($__user, $__request, $__fields, $__pagination, $__order_by, $__db) {
			return UsersCollection::filter(
				$__db,
				$__user,
				array('user' => $__user),
				$__fields,
				$__pagination,
				$__order_by
			);
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__user, $__fields, $__db) {
			$friend = UsersCollection::one(
				$__db,
				$__user,
				$id,
				array());
			return $friend->getParams($__user, $__fields);
		},
		'{me/devices}' => function () use ($__user, $__request, $__db, $__fields, $__pagination, $__order_by) {
			return DevicesCollection::filter($__db, $__user, $__request, $__fields,
				$__pagination, $__order_by);
		},
		'{me}' => function () use ($__user) {
			return $__user->getMainInfo();
		}
	),
	'PUT' => array(
		'{me/settings}' => function () use ($__request, $__user, $__db) {
			return $__user->updateSettings($__request);
		},
		'{me/status}' => function () use ($__request, $__user, $__db) {
			$token = $__user->updateDeviceToken($__request['device_token'], $__request['client_type']);
			$info = $__user->getMainInfo()->getData();
			$info = array_merge($info, $token->getData());
			return new Result(true, '', $info);
		}
	),
	'DELETE' => array(
		'{me/devices/(id:[0-9]+)}' => function ($id) use ($__user, $__request, $__db, $__fields, $__pagination, $__order_by) {
			$device = DevicesCollection::one($__db, $__user, intval($id), $__fields);
			return $device->delete();
		}
	)
);