<?php

$__modules['users'] = array(
	'GET' => array(
		'settings' => function () use ($__user) {
			return $__user->getSettings();
		},
		'me' => function () use ($__user) {
			return $__user->getMainInfo();
		}
	),
	'PUT' => array(
		'settings' => function () use ($__request, $__user, $__db) {
			return $__user->updateSettings($__request);
		}
	)
);