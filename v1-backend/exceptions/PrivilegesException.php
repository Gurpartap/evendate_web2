<?php


class PrivilegesException extends AbstractException{
	const HTTP_CODE = 403;
	const ERROR_CODE = 10003;
	public function __construct($message = 'Извините, у вас нет прав для данного действия', ExtendedPDO $db, $user_message = 'Извините, у вас нет прав для данного действия', $file = '', $file_line = 0){
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