<?php


require_once 'v1-backend/bin/db.php';
require_once 'v1-backend/bin/Class.Result.php';
require_once 'v1-backend/auth/Class.NewUser.php';

if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'get_urls') {
	if (isset($_REQUEST['mobile']) && $_REQUEST['mobile'] == 'true') {
		$type = 'mobile';
	} else {
		$type = 'popup';
	}
	echo App::getAuthURLs($type);
	exit();
}

try {

	$q_get_user = 'SELECT users.id AS user_id, tokens.token, users.email
				FROM users
				INNER JOIN tokens ON users.id = tokens.user_id
				WHERE (users.email = :email
					AND tokens.token = :token) 
					OR 
					(users.id = :user_id
					AND tokens.token = :token)';
	$p_get_user = $__db->prepareExecuteRaw($q_get_user, array(
		':email' => $_REQUEST['email'] ?? null,
		':user_id' => $_REQUEST['user_id'] ?? null,
		':token' => $_REQUEST['token'] ?? null
	), 'CANT_FIND_USER');

	if ($p_get_user->rowCount() == 0) throw new LogicException('Пользователь с такими данными не найден');


	if ($row_user_info = $p_get_user->fetch()) {
		NewUser::setSession($row_user_info);
		echo new Result(true, 'Данные успешно получены');
	} else {
		echo new Result(false, 'Пользователь с такими данными не найден');
	}
} catch (Exception $e) {
	header("Content-Type: application/json");
	echo json_encode(array('status' => false, 'text' => $e->getMessage()));
}