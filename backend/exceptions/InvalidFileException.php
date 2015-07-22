<?php


class InvalidFileException extends AbstractException{
	public function __construct($message = 'Извините, но мы не смогли открыть этот файл', PDO $db, $user_message ='', $file = '', $file_line = 0){
		parent::__construct($message, $db, $file, $file_line);
	}
}