<?php
/**
 * Created by PhpStorm.
 * User: Инал
 * Date: 18.10.2014
 * Time: 23:09
 */

use Aura\SqlQuery\QueryFactory;


require_once "{$BACKEND_FULL_PATH}/exceptions/AbstractException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/BadArgumentException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/DataFormatException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/DBQueryException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/FileNotFoundException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/InvalidFileException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/NoMethodException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/PrivilegesException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/AuthorizationException.php";



class App {

	private static $obj;
	public static $DB_SERVER;
	public static $DB_USER;
	public static $DB_PASSWORD;
	public static $DB_NAME;
	public static $DOMAIN;
	public static $NODE_DOMAIN;
	public static $SCHEMA;
	public static $DB_DSN;
	public static $DB_PORT;
	public static $__ORDER_BY;

	public static $QUERY_FACTORY;


	public static $RESPONSE_FORMAT;
	public static $RESPONSE_DOWNLOAD;
	public static $RESPONSE_NUDE;

	public static $__REQUEST;
	public static $__HEADERS;
	public static $__FIELDS;
	public static $__PAGE;
	public static $__LENGTH;
	public static $__OFFSET;

	private static $__USER;
	private static $__DB;
	private static $__IP;


	const DEFAULT_LENGTH = 100;
	const DEFAULT_OFFSET = 0;

	/*
	 * init config options for deploy and visioning
	 * */
	static function init() {
		$_SERVER['ENV'] = isset($_SERVER['ENV']) ? $_SERVER['ENV'] : 'local';
		$filename = 'v1-config.json';
		$counter = 0;
		if (file_exists($filename) == false) {
			do {
				$filename = '../' . $filename;
				$counter++;
			} while (file_exists($filename) == false && $counter < 5);
		}
		$config_json = file_get_contents($filename);
		self::$obj = json_decode($config_json, false);

		self::$obj = self::$obj->{$_SERVER['ENV']};
		self::$DB_NAME = self::$obj->db->database;
		self::$DB_SERVER = self::$obj->db->host;
		self::$DB_USER = self::$obj->db->user;
		self::$DB_PASSWORD = self::$obj->db->password;
		self::$DB_PORT = self::$obj->db->port;
		self::$DOMAIN = self::$obj->domain;
		self::$NODE_DOMAIN = self::$obj->node_domain;
		self::$SCHEMA = self::$obj->schema;

		self::$DB_DSN = 'pgsql:host=' . self::$DB_SERVER . ';dbname=' . self::$DB_NAME . ';port=' . self::$DB_PORT;
	}

	static function getVar($name) {
		return self::$obj->$name;
	}

	public static function queryFactory() : QueryFactory{
		return self::$QUERY_FACTORY;
	}

	static function buildGlobal(PDO $db) {
		self::$RESPONSE_FORMAT = (isset($_REQUEST['format']) && $_REQUEST['format'] == 'xml') ? 'xml' : 'json';
		self::$RESPONSE_DOWNLOAD = (isset($_REQUEST['download']) && ($_REQUEST['download'] == '1' || $_REQUEST['download'] == 'true')) ? true : false;
		self::$RESPONSE_NUDE = (isset($_REQUEST['nude_data']) && ($_REQUEST['nude_data'] == '1' || $_REQUEST['nude_data'] == 'true')) ? true : false;

		self::$__REQUEST = $_REQUEST;
		$input = file_get_contents('php://input');
		self::$__REQUEST['payload'] = RequestParser::payload($input);
		self::$__REQUEST['__files'] = '';
		if ($_SERVER['REQUEST_METHOD'] == 'PUT' && self::$__REQUEST['payload'] == null) {
			self::$__REQUEST = array_merge($_REQUEST, RequestParser::put($input));
		}

		self::$__HEADERS = getallheaders();

		self::$__FIELDS = Fields::parseFields(self::$__REQUEST['fields'] ??  '');
		self::$__ORDER_BY = Fields::parseOrderByFields(self::$__REQUEST['order_by'] ??  '', (bool) (self::$__REQUEST['desc'] ?? false));

		self::$__PAGE = (isset($_REQUEST['page'])) ? (int)$_REQUEST['page'] : 0;
		self::$__LENGTH = (isset($_REQUEST['length'])) ? (int)$_REQUEST['length'] : self::DEFAULT_LENGTH;
		self::$__OFFSET = (isset($_REQUEST['offset'])) ? (int)$_REQUEST['offset'] : self::$__PAGE * self::$__LENGTH;

		self::$__DB = $db;
		self::$__IP = $__ip = $_SERVER['REMOTE_ADDR'] ?: ($_SERVER['HTTP_X_FORWARDED_FOR'] ?: $_SERVER['HTTP_CLIENT_IP']);;

		self::$QUERY_FACTORY = new QueryFactory('pgsql');
	}

	static function getCurrentUser() : User {
		if (self::$__USER instanceof User)
			return self::$__USER;
		$token = isset(self::$__HEADERS['Authorization']) ? self::$__HEADERS['Authorization'] : null;
		self::$__USER = new User(self::$__DB, $token);
		return self::$__USER;
	}

	static public function getFieldsValue($name) {
		return isset(self::$__FIELDS[$name]) ? self::$__FIELDS[$name] : null;
	}

	static public function getFieldsParam($name, $param) {
		$field = isset(self::$__FIELDS[$name]) ? self::$__FIELDS[$name] : null;
		if (is_array($field) && isset($field[$param])) {
			return $field[$param];
		}
		else {
			return null;
		}
	}

	static public function DB() : PDO {
		return self::$__DB;
	}

	static public function saveImage(&$file, $filename, $size){
		$start_memory = memory_get_usage();
		$tmp = unserialize(serialize($file));
		$img_size = memory_get_usage() - $start_memory;

		if ($img_size / 1024 > $size){
			throw new InvalidArgumentException('Файл слишком большого размера. Максимальный размер - ' . $size . ' кбайт');
		}
		$file = explode(',', $file);
		$file = $file[1];

		if ($file) {
			global $ROOT_PATH;
			$result = file_put_contents($ROOT_PATH . $filename, base64_decode($file));
			if (!$result) throw new RuntimeException('FILE_SAVING_ERROR');
			return $result;
		}else{
			throw new InvalidArgumentException('IMAGE_FILE_NOT_FOUND');
		}
	}

	static public function getImageExtension($file_name){
		if (!isset($file_name) || $file_name == ''){
			return '';
		}else{
			$file_name_parts = explode('.', $file_name);
			return end($file_name_parts);
		}
	}

	public static function generateRandomString($length = 10) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
}