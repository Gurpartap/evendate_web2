<?php

require_once $BACKEND_FULL_PATH . '/bin/vendor/Class.Array2xml.php';

/*
 *
 *
 * */
class Result{

	const XML_RESPONSE_ROOT = 'response';

	protected $uuid;
	protected $exception;
	private $status;
	private $text;
	private $data;
	private $error_code;
	private $format;
	private $filename;
	private $downloadable;
	private $is_nude;
	private $http_code;
	private $internal_code;

	/*
	 * */
	public function __construct($status, $text = '', $data = array(), $error_code = 0, $format = 'json'){
		$this->setStatus($status);
		$this->setText($text);
		$this->setErrorCode($error_code);
		$this->setData($data);
		$this->setFormat($format);
	}

	public function setFileName($filename){
		$this->filename = $filename;
	}

	public function setStatus($status){
		$this->status = ($status == true || $status == 1) ? true : false;
	}

	public function setText($text){
		if (empty($text)){
			$text = $this->status ? 'Данные успешно получены' : 'Извините, произошла ошибка';
		}
		$this->text = $text;
	}

	public function setErrorCode($error_code){
		$this->error_code = $error_code;
	}

	public function setData($data){
		$this->data = $data;
	}

	public function getData(){
		return $this->data;
	}

	public function addProp($name, $value){
		$this->data[$name] = $value;
	}

	public function __toString(){
		header("Content-Type: application/json");
		http_response_code($this->http_code ?? 200);
		if ($this->getNude()){
			$arr = $this->data;
		}else{
			$arr = array(
				'status' => $this->status,
				'text' => $this->text,
				'code' => $this->internal_code,
				'data' => $this->data
			);
			if ($this->uuid != null){
				$arr['request_id'] = $this->uuid;
			}
			if ($this->exception != null){
				$arr['exception'] = $this->exception;
			}
		}
		$res = json_encode($arr);
		return $res;
	}

	public function setFormat($format) {
		$this->format = $format == 'xml' ? 'xml' : 'json';
	}

	public function setDownloadable($downloadable) {
		$this->downloadable = $downloadable;
	}

	private function getFileName() {
		if ($this->filename && $this->filename != ''){
			return $this->filename;
		}else{
			return 'file';
		}
	}

	public function setNude($nude_data) {
		$this->is_nude = $nude_data;
	}

	public function setRequestUUID(string $uuid){
		$this->uuid = $uuid;
	}

	public function setException(Exception $e){
		$this->exception = $e;
	}

	//Only data without any additional status information
	private function getNude() {
		return $this->is_nude ? $this->is_nude : false;
	}

	public function setHttpCode(int $code){
		$this->http_code = $code;
	}

	public function setInternalCode(int $internal_code){
		$this->internal_code = $internal_code;
	}
}