<?php

class DBQueryException extends AbstractException{
	const ERROR_CODE = 10001;
	const HTTP_CODE = 500;
	public function __construct($message, \PDO $db, $user_message = '', $file = '', $file_line = 0){
		if (is_array($message)){
			$message = implode(';', $message);
		}elseif ($message == '' || $message == null){
			$message = implode(';', $db->errorInfo());
		}
		if ($user_message == ''){
			$this->user_message = 'Извините, произошла ошибка. Повторите, пожалуйста, еще раз';
		}else{
			$this->user_message = $user_message;
		}
		$description = "FILE:\n {$this->getFile()}\n LINE: \n {$this->getLine()}\n Description: \n {$this->message}.\n Trace: \n {$this->getTraceAsString()}";
		parent::__construct($message, $db, $file, $file_line);
	}
}
