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
			return ActionsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('friend' => UsersCollection::one(
					$__db,
					$__user,
					intval($id),
					array()
				))),
				$__fields,
				$__pagination,
				$__order_by
			);
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__user, $__fields, $__db) {
			$data = UsersCollection::one(
				$__db,
				$__user,
				$id,
				array())->getParams($__user, $__fields)->getData();

			return new Result(true, '', array($data));
		},
		'{me/devices}' => function () use ($__user, $__request, $__db, $__fields, $__pagination, $__order_by) {
			return DevicesCollection::filter($__db, $__user, $__request, $__fields,
				$__pagination, $__order_by ?? array());
		},
		'{me}' => function () use ($__user) {
			$data = $__user->getMainInfo()->getData();
			return new Result(true, '', array($data));
		}
	),
	'PUT' => array(
		'{me/settings}' => function () use ($__request, $__user, $__db) {
			return $__user->updateSettings($__request);
		},
		'{me/devices}' => function () use ($__request, $__user, $__db) {
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