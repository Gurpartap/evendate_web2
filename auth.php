<?php

error_reporting(E_ALL);

try{
	if (!isset($_REQUEST['email']) || trim($_REQUEST['email']) == '' ||
		!isset($_REQUEST['token']) || trim($_REQUEST['token']) == ''){
		throw new InvalidArgumentException('Пользователь с указанными данными не существует');
	}

	require_once 'backend/bin/db.php';
	require_once 'backend/bin/Class.Result.php';

	$q_get_user = 'SELECT users.id as user_id, users.token, users.email
				FROM users
				WHERE users.email = :email
					AND users.token = :token';
	$p_get_user = $db->prepare($q_get_user);
	$p_get_user->execute(array(
		':email' => $_REQUEST['email'],
		':token' => $_REQUEST['token']
	));

	if (!isset($p_get_user) || $p_get_user === FALSE) throw new DBQueryException(null, $db);
	if ($p_get_user->rowCount() != 1) throw new LogicException('Пользователь с такими данными не найден');



	if ($row_user_info = $p_get_user->fetch()){
		$_SESSION['email'] = $row_user_info['email'];
		$_SESSION['id'] = $row_user_info['user_id'];
		$_SESSION['token'] = $row_user_info['token'];
		echo new Result(true, 'Данные успешно получены');
	}else{
		echo new Result(false, 'Пользователь с такими данными не найден');
	}
}catch(Exception $e){
	header("Content-Type: application/json");
	echo json_encode(array('status' => false, 'text' => $e->getMessage()));
}