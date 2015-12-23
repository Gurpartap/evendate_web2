<?php

class UserObjException extends AbstractException{
	public function __construct($message = 'Извините, но мы не смогли распознать в Вас пользователя', PDO $db, $user_message ='', $file = '', $file_line = 0){
		parent::__construct($message, $db, $file, $file_line);
	}
}