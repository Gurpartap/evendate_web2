<?php

require_once "{$BACKEND_FULL_PATH}/auth/Class.AuthHandler.php";

$__modules['auth'] = array(
	'GET' => array(
		'' => function () use ($__db, $__user, $__length, $__page, $__request, $__fields, $__pagination, $__order_by) {
			$auth_handler = new AuthHandler($__request);
			$auth_handler->startAuth();
			return new Result(true, '', array(
				'token' => $auth_handler->getProvider()->getUserToken(),
				'email' => $auth_handler->getProvider()->getToInsData()['email'],
				'user_id' => $auth_handler->getUserId()
			));
		}
	)
);