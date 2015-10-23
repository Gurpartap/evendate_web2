<?php

$__modules['users'] = array(
	'GET' => array(
		'settings' => function () use ($__user) {
			return $__user->getSettings();
		},
		'friends' => function () use ($__user) {
			return $__user->getFriends();
		},
		'me' => function () use ($__user) {
			return $__user->getMainInfo();
		}
	),
	'PUT' => array(
		'settings' => function () use ($__request, $__user, $__db) {
			return $__user->updateSettings($__request);
		},
		'device' => function () use ($__request, $__user, $__db) {
			$__user->updateDeviceToken($__request['device_token'], $__request['client_type']);
			return $__user->getMainInfo();
		},
	)
);