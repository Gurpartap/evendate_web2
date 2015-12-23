<?php

abstract class AbstractModule{

	private static $dependencies;
	private static $name;
	private static $version;

	public static function initModule($path_to, PDO $db){
		$file_name = $path_to . 'module.json';
		if (!file_exists($file_name)){
			$folders = explode('/', $path_to);
			self::$name = $folders[count($folders) - 2];
			self::$version = 0;
			self::$dependencies = array();
		}else{
			$json_module = json_decode(file_get_contents($file_name));
			self::$name = $json_module->name;
			self::$version = $json_module->version;
			self::$dependencies = $json_module->dependencies;
		}
	}

	/**
	 * @return mixed
	 */
	public static function getModuleDependencies() {
		return self::$dependencies;
	}

	/**
	 * @return mixed
	 */
	public static function getModuleName() {
		return self::$name;
	}

	/**
	 * @return mixed
	 */
	public static function getModuleVersion() {
		return self::$version;
	}


}