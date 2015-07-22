<?php

abstract class AbstractException extends \Exception{
	protected $user_message;
	private $db;

	public function __construct($message, PDO $db, $user_m = ''){
		parent::__construct($message);
		$this->user_message = $user_m;
		$this->db = $db;
	}
	public function write(){
		$this->db->prepare('');
	}

	public function getUserMessage(){
		return $this->user_message;
	}

	public function __toString(){
		return "errorMessage: {$this->user_message} \n\r
				errorCode: {$this->getCode()}";
	}
}
