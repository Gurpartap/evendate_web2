<?php

$__modules['users'] = array(
	'GET' => array(
		'settings' => function () use ($__user) {
			return $__user->getSettings();
		},
		'feed' => function () use ($__user, $__page, $__length, $__request) {
			return $__user->getFriendsFeed($__page, $__length);
		},
		'friends' => function () use ($__user, $__page, $__length) {
			return $__user->getFriends($__page, $__length);
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
			$token = $__user->updateDeviceToken($__request['device_token'], $__request['client_type']);
			$info = $__user->getMainInfo()->getData();
			$info = array_merge($info, $token->getData());
			return new Result(true, '', $info);
		},
	)
);