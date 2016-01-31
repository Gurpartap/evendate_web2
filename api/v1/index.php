<?php

use Monolog\Logger as Logger;
use Monolog\Handler\StreamHandler as StreamHandler;
use Monolog\Handler\FirePHPHandler as FirePHPHandler;


	if (isset($_SERVER['ENV']) && $_SERVER['ENV'] != 'dev'){
		ini_set("display_errors", 1);
		error_reporting(E_ALL);
	}
	require_once '../../v1-backend/bin/env_variables.php';

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Authorization');
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	@session_start();



require_once "{$BACKEND_FULL_PATH}/exceptions/AbstractException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/BadArgumentException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/DataFormatException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/DBQueryException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/FileNotFoundException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/InvalidFileException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/NoMethodException.php";
require_once "{$BACKEND_FULL_PATH}/exceptions/PrivilegesException.php";


try {

	$request_time = time();


	require_once "{$BACKEND_FULL_PATH}/bin/Class.Result.php";
	require_once "{$BACKEND_FULL_PATH}/bin/db.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.RequestsParser.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.Fields.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractEntity.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractCollection.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.AbstractUser.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.User.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.Editor.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.Friend.php";
	require_once "{$BACKEND_FULL_PATH}/statistics/Class.Statistics.php";
	require_once "{$BACKEND_FULL_PATH}/events/Class.EventsCollection.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.UsersCollection.php";

//	$logger = new Logger('my_logger');

	App::buildGlobal($__db);

	$__request = App::$__REQUEST;
	$__headers = App::$__HEADERS;
	$__fields = App::$__FIELDS;
	$__user = App::getCurrentUser();

	$act = explode('/', $_REQUEST['_url']);
	$_url = $_REQUEST['_url'];
	$_class_name = $act[1];
	$_method_name = isset($act[2]) ? $act[2] : '';
	$_args = array();

	if (count($act) > 3){
		for ($i = 3; $i < count($act); $i++){
			$_args[] = $act[$i];
		}
	}

	$_result = null;
	$_request_method = $_SERVER['REQUEST_METHOD'];
	$_http_code = 200;
	$_internal_code = 200;
	$_error_name = null;
	$_function_called = false;

	$__page    = App::$__PAGE;
	$__length  = App::$__LENGTH;
	$__offset  = App::$__OFFSET;
	$__order_by  = App::$__ORDER_BY;
	$__pagination  = array('length' => $__length, 'offset' => $__offset);
	$__modules = array();

	require_once "{$BACKEND_FULL_PATH}/{$_class_name}/{$_class_name}.php";

	if (isset($__modules[$_class_name]) && isset($__modules[$_class_name][$_request_method]) && isset($__modules[$_class_name][$_request_method][$_method_name])) {
		$_result = call_user_func_array($__modules[$_class_name][$_request_method][$_method_name], $_args);
		$_function_called = true;
	}else{
		if (isset($__modules[$_class_name]) && $__modules[$_class_name][$_request_method]){
			foreach ($__modules[$_class_name][$_request_method] as $key => $function){
                if ($_result != null) break;
				if (preg_match('/{.*?}.*?/', $key)){ // is regexp
					$pattern = preg_replace('#\((.*?):(.*?)\)#', '(?<$1>$2)', $key); // change names to PHP RegExp named groups format
					$pattern = str_replace(array('{', '}'), '', $pattern); //remove {}
					$pattern = '#' . $pattern . '#';
					preg_match_all($pattern , $_url, $matches); // store all groups (we need named groups to add to args function)
					if (preg_match($pattern, $_url)){
						$matches = array_reverse($matches); // reverse to add named groups left ro right, as in url
						foreach($matches as $group_name => $match){
							if (is_string($group_name)){ // use only named variables, coz preg_match stores all with names and indexes
								array_unshift($_args, $match[0]);
							}
						}
						$_function_called = true;
						$_result = call_user_func_array($function, $_args);
					}
				}
			}
		}
	}

}catch(AbstractException $ae){
	$_http_code = $ae->getHttpCode();
	$_internal_code = $ae->getInternalCode();
	$_error_name = $ae->getMessage();
}catch(InvalidArgumentException $iae){
	$_http_code = BadArgumentException::HTTP_CODE;
	$_internal_code = BadArgumentException::ERROR_CODE;
	$_error_name = $iae->getMessage();
}catch(BadMethodCallException $bmce){
	$_http_code = BadArgumentException::HTTP_CODE;
	$_internal_code = BadArgumentException::ERROR_CODE;
	$_error_name = $bmce->getMessage();
}catch(Exception $e){
	$_http_code = AbstractException::HTTP_CODE;
	$_internal_code = AbstractException::ERROR_CODE;
	$_error_name = $e->getMessage();
}finally{

	if (!isset($_result) || $_result instanceof Result == false){
		if (!$_function_called){
			$_http_code = 404;
			$_internal_code = 10404;
			$_error_name = 'BAD_REQUEST:NOT_IMPLEMENTED';
		}
		$_result = new Result(false, $_error_name);
	}
	$_result->setHttpCode($_http_code);
	$_result->setInternalCode($_internal_code);
	$_result->setFormat(App::$RESPONSE_FORMAT);
	$_result->setDownloadable(App::$RESPONSE_DOWNLOAD);
	$_result->setNude(App::$RESPONSE_NUDE);

	if (($_SERVER['ENV'] == 'local' || $_SERVER['ENV'] == 'test') && isset($e)){
		print_r($e);
	}
}
echo $_result;