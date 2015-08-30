<?php

$__modules['users'] = array(
	'GET' => array(
		'{/(id:[0-9]+)/phone_number}' => function ($id) use ($__db, $__user){
			$id = (int)$id;
			$student = new StudentObject($id, $__db);
			return new Result(true, '', array('phone_number' => $student->getPhoneNumber($__user)));
		},
		'settings' => function () use ($__request) {
			return new Result(true, '');
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