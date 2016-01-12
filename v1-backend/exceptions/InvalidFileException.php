<?php


class InvalidFileException extends AbstractException{
	const ERROR_CODE = 500;
	public function __construct($message = 'Извините, но мы не смогли открыть этот файл', PDO $db, $user_message ='', $file = '', $file_line = 0){
		parent::__construct($message, $db, $file, $file_line);
	}
}