<?php

abstract class AbstractException extends \Exception{
	private $db;
	protected $user_message;
	protected $internal_message;
	protected $internal_code;
	protected $http_code;
	const HTTP_CODE = 500;
	const ERROR_CODE = 10000;

	public function __construct($message, ExtendedPDO $db, $user_m = ''){
		$this->internal_message = $message;
		$this->user_message = $user_m == '' ? $message : $user_m;
		parent::__construct($this->user_message);
		$this->db = $db;
	}

	public function getInternalMessage(): string
	{
		return $this->internal_message;
	}

	public function getUserMessage(){
		return $this->user_message;
	}

	public function setInternalCode(int $code){
		$this->internal_code = $code;
	}

	public function setHttpCode(int $code){
		$this->http_code = $code;
	}

	public function getInternalCode(){
		return $this->internal_code ?? self::ERROR_CODE;
	}

	public function getHttpCode(){
		return $this->http_code ?? self::HTTP_CODE;
	}

	public function __toString(){
		return "errorMessage: {$this->user_message} \n\r
				errorCode: {$this->getCode()}";
	}
}
