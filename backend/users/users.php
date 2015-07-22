<?php

require_once 'backend/users/Class.Student.php';

$__modules['users'] = array(
	'GET' => array(
		'{/(id:[0-9]+)/phone_number}' => function ($id) use ($__db, $__user){
			$id = (int)$id;
			$student = new StudentObject($id, $__db);
			return new Result(true, '', array('phone_number' => $student->getPhoneNumber($__user)));
		},
		'{/search}' => function () use ($__db, $__request){
			return StudentObject::searchStudent($__db, $__request);
		},
		'test' => function () use ($__request, $__args, $__db) {
			require_once 'normalize_phone_numbers.php';
			return new Result(true, '');
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__db){
			$id = (int)$id;
			$student = new StudentObject($id, $__db);
			return $student->getInfo();
		},
	),
	'POST' => array(
		'{/(id:[0-9]+)/phone_number}' => function ($id) use ($__db, $__request, $__user){
			$id = (int)$id;
			$student = new StudentObject($id, $__db);
			return $student->setPhoneNumber($__request['phone_number'], $__user);
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user){
			$id = (int)$id;
			$student = new StudentObject($id, $__db);
			return $student->setInfo($__request, $__user);
		},
	)
);