<?php


class AuthorizationException extends AbstractException{
	const HTTP_CODE = 401;
	const ERROR_CODE = 10401;
	public function __construct($message = 'Извините, пользователь с такими данными не найден', PDO $db, $user_message = '', $file = '', $file_line = 0){
		if (is_array($message)){
			$message = implode(';', $message);
		}
		if (!$user_message){
			$this->user_message = 'Извините, произошла ошибка. Мы уже исправляем ситуацию.';
		}else{
			$this->user_message = $user_message;
		}
		parent::__construct($this->user_message, $db, $file, $file_line);
	}
}