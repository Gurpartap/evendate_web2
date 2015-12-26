<?php

	if (isset($_SERVER['ENV']) && $_SERVER['ENV'] != 'dev'){
		ini_set("display_errors", 1);
		error_reporting(E_ALL);
	}

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Authorization');
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

	$format = (isset($_REQUEST['format']) && $_REQUEST['format'] == 'xml') ? 'xml' : 'json';
	$download = (isset($_REQUEST['download']) && ($_REQUEST['download'] == '1' || $_REQUEST['download'] == 'true')) ? true : false;
	$nude_data = (isset($_REQUEST['nude_data']) && ($_REQUEST['nude_data'] == '1' || $_REQUEST['nude_data'] == 'true')) ? true : false;

try {

	$req_came_time = time();

	$BACKEND_FOLDER = '/v1-backend';

	require_once "../..{$BACKEND_FOLDER}/bin/Class.RequestsParser.php";
	require_once "../..{$BACKEND_FOLDER}/bin/db.php";
	require_once "../..{$BACKEND_FOLDER}/bin/Class.AbstractModule.php";
	require_once "../..{$BACKEND_FOLDER}/bin/Class.Result.php";
	require_once "../..{$BACKEND_FOLDER}/users/Class.AbstractUser.php";
	require_once "../..{$BACKEND_FOLDER}/users/Class.User.php";
	require_once "../..{$BACKEND_FOLDER}/users/Class.Editor.php";
	require_once "../..{$BACKEND_FOLDER}/users/Class.Friend.php";
	require_once "../..{$BACKEND_FOLDER}/statistics/Class.Statistics.php";
	require_once "../..{$BACKEND_FOLDER}/events/Class.EventsCollection.php";


	function __autoload($class_name) {
		global $ROOT_PATH;
		global $BACKEND_FOLDER;
		$class_file_name = "{$ROOT_PATH}/{$BACKEND_FOLDER}/exceptions/{$class_name}.php";
		if (file_exists($class_file_name)) {
			/** @noinspection PhpUndefinedClassInspection */
			require_once $class_file_name;
			return;
		}
	}

	$__request = $_REQUEST;
	$input = file_get_contents('php://input');
	$__request['payload'] = RequestParser::payload($input);
	if ($_SERVER['REQUEST_METHOD'] == 'PUT' && $__request['payload'] == null){
		$__request = array_merge($_REQUEST, RequestParser::put($input));
	}
	$__headers = getallheaders();
	$__request['__files'] = '';
	$act = explode('/', $_REQUEST['_url']);
	$__url = $_REQUEST['_url'];
	$__class_name = $act[1];
	$__method_name = isset($act[2]) ? $act[2] : '';
	$__args = array();
	$__api_app = null;
	$__ip = $_SERVER['REMOTE_ADDR'] ? : ($_SERVER['HTTP_X_FORWARDED_FOR']?:$_SERVER['HTTP_CLIENT_IP']);
	if (count($act) > 3){
		for ($i = 3; $i < count($act); $i++){
			$__args[] = $act[$i];
		}
	}
	$__result = '';
	$__db = $db;

	$__request_method = $_SERVER['REQUEST_METHOD'];
	try{
		$token = isset($__headers['Authorization']) ? $__headers['Authorization'] : null;
		$__user = new User($__db, $token);
	}catch(Exception $e){
		try{
			//if (!isset($__request['public_key']) || !isset($__request['time'])) throw new LogicException("You should set time and public_key");
			//$__api_app = new ApiApplication($__db, $__request['public_key'], $__request['time'],$__request['token']);
		}catch(Exception $e){
			echo new Result(false, $e->getMessage(), array('refresh' => true));
			die();
		}
	}

	$__page    = (isset($_REQUEST['page']))    ? (int) $_REQUEST['page']    : 0;
	$__length  = (isset($_REQUEST['length']))  ? (int) $_REQUEST['length']  : 10;
	$__user_id = (isset($_REQUEST['id'])) ? (int) $_REQUEST['id'] : 0;
	$__modules = array();

	/** @noinspection PhpUndefinedNamespaceInspection */
	/** @noinspection PhpUndefinedClassInspection */


	/*
	 * We have to check first does module exist in core or not.
	 * If module not exist in core than we will check in backend folder
	 * */

	$class_path = "../../{$BACKEND_FOLDER}/{$__class_name}/";
	$class_file_name = "{$__class_name}.php";

	if (!file_exists($class_path . $class_file_name)){
		$class_path = "../../{$BACKEND_FOLDER}/{$__class_name}/";
		if (!file_exists($class_path . $class_file_name)){
			$class_file_name = null;
		}
	}


	require_once $class_path . $class_file_name;

	if (isset($__modules[$__class_name]) && isset($__modules[$__class_name][$__request_method]) && isset($__modules[$__class_name][$__request_method][$__method_name])) {
		$__result = call_user_func_array($__modules[$__class_name][$__request_method][$__method_name], $__args);
	}else{
		if (isset($__modules[$__class_name]) && $__modules[$__class_name][$__request_method]){
			foreach ($__modules[$__class_name][$__request_method] as $key => $function){
                if (!empty($__result)) break;
				if (preg_match('/{.*?}.*?/', $key)){ // is regexp
					$pattern = preg_replace('#\((.*?):(.*?)\)#', '(?<$1>$2)', $key); // change names to PHP RegExp named groups format
					$pattern = str_replace(array('{', '}'), '', $pattern); //remove {}
					$pattern = '#' . $pattern . '#';
					preg_match_all($pattern , $__url, $matches); // store all groups (we need named groups to add to args function)
					if (preg_match($pattern, $__url)){
						$matches = array_reverse($matches); // reverse to add named groups left ro right, as in url
						foreach($matches as $group_name => $match){
							if (is_string($group_name)){ // use only named variables, coz preg_match stores all with names and indexes
								array_unshift($__args, $match[0]);
							}
						}
						$__result = call_user_func_array($function, $__args);
					}
				}
			}
		}
	}



}catch(Exception $e){
	if ($_SERVER['ENV'] == 'local'){
		print_r($e);
	}
	$__result = new Result(false, 'Ошибка! '. $e->getMessage());
	$__result->setFormat($format);
}


if (isset($__result) && $__result instanceof Result){
	$__result->setFormat($format);
	$__result->setDownloadable($download);
	$__result->setNude($nude_data);
	echo $__result;
}else{
	echo new Result(false, 'Извините, сервер не вернул никаких данных');
}