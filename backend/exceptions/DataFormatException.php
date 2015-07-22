<?php

class DataFormatException extends AbstractException{
	public function __construct($message, \PDO $db, $user_message ='', $file = '', $file_line = 0){
		if (is_array($message)){
			$message = implode(';', $message);
		}
		if ($user_message == ''){
			$this->user_message = 'Извините, произошла ошибка. Мы уже исправляем ситуацию.';
		}else{
			$this->user_message = $user_message;
		}
		parent::__construct($message, $db, $file, $file_line);
	}
}
