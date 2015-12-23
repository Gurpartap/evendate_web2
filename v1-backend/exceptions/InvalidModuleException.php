<?php


class InvalidModuleException extends AbstractException{
	public function __construct($message = 'MODULE_NOT_EXIST', PDO $db, $user_message = 'Указанный модуль не существует', $file = '', $file_line = 0){
		if (is_array($message)){
			$message = implode(';', $message);
		}
		if (!$user_message){
			$this->user_message = 'Извините, произошла ошибка. Мы уже исправляем ситуацию';
		}else{
			$this->user_message = $user_message;
		}
		parent::__construct($this->user_message, $db, $file, $file_line);
	}
}