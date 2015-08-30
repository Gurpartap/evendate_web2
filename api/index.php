<?php

	//error_reporting(0);
$format = (isset($_REQUEST['format']) && $_REQUEST['format'] == 'xml') ? 'xml' : 'json';
$download = (isset($_REQUEST['download']) && ($_REQUEST['download'] == '1' || $_REQUEST['download'] == 'true')) ? true : false;
$nude_data = (isset($_REQUEST['nude_data']) && ($_REQUEST['nude_data'] == '1' || $_REQUEST['nude_data'] == 'true')) ? true : false;

try {

	$req_came_time = time();

	require_once "../backend/bin/Class.RequestsParser.php";
	require_once "../backend/bin/db.php";
	require_once "../backend/bin/Class.AbstractModule.php";
	require_once "../backend/bin/Class.Result.php";
	require_once "../backend/users/Class.AbstractUser.php";
	require_once "../backend/users/Class.User.php";
	require_once "../backend/users/Class.Editor.php";



	function __autoload($class_name) {
		global $ROOT_PATH;
		$class_file_name = "{$ROOT_PATH}/backend/exceptions/{$class_name}.php";
		if (file_exists($class_file_name)) {
			/** @noinspection PhpUndefinedClassInspection */
			require_once $class_file_name;
			return;
		}
}


	$__request = array_merge($_REQUEST, RequestParser::put());
	$__request['payload'] = RequestParser::payload();
	$__headers = getallheaders();
	$__request['__files'] = '';
	$act = explode('/', $_REQUEST['_url']);
	$__url = $_REQUEST['_url'];
	$__class_name = $act[1];
	$__method_name = ($act[2] == '') ? NULL : $act[2];
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

	$class_path = "../backend/{$__class_name}/";
	$class_file_name = "{$__class_name}.php";

	if (!file_exists($class_path . $class_file_name)){
		$class_path = "../backend/{$__class_name}/";
		if (!file_exists($class_path . $class_file_name)){
			$class_file_name = null;
		}
	}

	require_once $class_path . $class_file_name;


	$q_ins_request = 'INSERT INTO log_requests(created_at, body, user_id, method, class, args, method_name, response_status, time)
		VALUES(NOW(), :request_body, :user_id, :request_method, :request_class, :request_args, :request_method_name, :response_status, FROM_UNIXTIME(:time))';
	$p_ins_req = $__db->prepare($q_ins_request);
	if (isset($__request['payload']['file'])){
		$__request['payload']['file'] = null;
	}
	if (isset($__request['payload']['cropped_file'])){
		$__request['payload']['cropped_file'] = null;
	}
	$ins_data = array(
		':request_body' => json_encode($__request),
		':user_id' => (isset($__user) && ($__user instanceof User)) ? $__user->getId(): null,
		':request_method' => $__request_method,
		':request_class' => $__class_name,
		':request_method_name' => $__method_name,
		':request_args' => json_encode($__args),
		':time' => $req_came_time

	);

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
	$__result = new Result(false, 'Ошибка! '. $e->getMessage());
	$__result->setFormat($format);
	if (isset($p_ins_req) && isset($ins_data)){
		$ins_data[':response_status'] = 0;
		$p_ins_req->execute($ins_data);
	}
}


if ((isset($__result) && $__result instanceof Result) || (isset($__class_name) && $__class_name == 'suggests')){
	$__result->setFormat($format);
	$__result->setDownloadable($download);
	$__result->setNude($nude_data);
	echo $__result;
}else{
	echo new Result(false, 'Извините, сервер не вернул никаких данных');

}
if (isset($p_ins_req) && isset($ins_data)) {
	$ins_data[':response_status'] = 1;
	$p_ins_req->execute($ins_data);
}