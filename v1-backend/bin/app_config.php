<?php
/**
 * Created by PhpStorm.
 * User: Инал
 * Date: 18.10.2014
 * Time: 23:09
 */

class App {

	private static $obj;
	public static $DB_SERVER;
	public static $DB_USER;
	public static $DB_PASSWORD;
	public static $DB_NAME;
	public static $DOMAIN;
	public static $NODE_DOMAIN;
	public static $SCHEMA;


	/*
	 * init config options for deploy and visioning
	 * */
	static function init(){
		$_SERVER['ENV'] = isset($_SERVER['ENV']) ? $_SERVER['ENV'] : 'local';
		$filename = 'v1-config.json';
		$counter = 0;
		if (file_exists($filename) == false){
			do{
				$filename = '../' . $filename;
				$counter++;
			}while(file_exists($filename) == false && $counter < 5);
		}
		$config_json = file_get_contents($filename);
		self::$obj = json_decode($config_json);

		self::$obj = self::$obj->$_SERVER['ENV'];
		self::$DB_NAME = self::$obj->db->database;
		self::$DB_SERVER = self::$obj->db->host;
		self::$DB_USER = self::$obj->db->user;
		self::$DB_PASSWORD = self::$obj->db->password;
		self::$DOMAIN = self::$obj->domain;
		self::$NODE_DOMAIN = self::$obj->node_domain;
		self::$SCHEMA = self::$obj->schema;
	}

	static function getVar($name){
		return self::$obj->$name;
	}
}