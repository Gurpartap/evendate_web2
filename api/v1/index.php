<?php

	$request_time = new DateTime();

	$_function_called = false;


	require_once '../../v1-backend/bin/env_variables.php';

	@session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
	http_response_code(200);
	return;
}

try {

	require_once "{$BACKEND_FULL_PATH}/bin/Class.Result.php";
	require_once "{$BACKEND_FULL_PATH}/bin/db.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.RequestsParser.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.Fields.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractEntity.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractCollection.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.AbstractUser.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.User.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.NotAuthorizedUser.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.Editor.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.Friend.php";
	require_once "{$BACKEND_FULL_PATH}/statistics/Class.Statistics.php";
	require_once "{$BACKEND_FULL_PATH}/events/Class.EventsCollection.php";
	require_once "{$BACKEND_FULL_PATH}/events/Class.EventDate.php";
	require_once "{$BACKEND_FULL_PATH}/events/Class.EventsDatesCollection.php";
	require_once "{$BACKEND_FULL_PATH}/users/Class.UsersCollection.php";
	require_once "{$BACKEND_FULL_PATH}/users/Interface.UserInterface.php";

	if (App::$ENV == 'prod') {
		$DEBUG_MODE = false;
	}else{
		ini_set("display_errors", 1);
		error_reporting(E_ALL);
	}

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

	$__page    = App::$__PAGE;
	$__length  = App::$__LENGTH;
	$__offset  = App::$__OFFSET;
	$__order_by  = App::$__ORDER_BY;
	$__pagination  = array('length' => $__length, 'offset' => $__offset);
	$__modules = array();

	if (isset($__request['tz']) && $_request_method == 'GET'){
		App::setSessionTimezone($__request['tz']);
	}

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

}catch(InvalidArgumentException $iae){
	$_http_code = BadArgumentException::HTTP_CODE;
	$_internal_code = BadArgumentException::ERROR_CODE;
	$_error_name = $iae->getMessage();
	$_function_called = true;
	$_exception = $iae;
}catch(BadMethodCallException $bmce){
	$_http_code = BadArgumentException::HTTP_CODE;
	$_internal_code = BadArgumentException::ERROR_CODE;
	$_error_name = $bmce->getMessage();
	$_function_called = true;
	$_exception = $bmce;
}catch(AuthorizationException $authe){
	$_http_code = AuthorizationException::HTTP_CODE;
	$_internal_code = AuthorizationException::ERROR_CODE;
	$_error_name = $authe->getMessage();
	$_function_called = true;
	$_exception = $authe;
}catch(PrivilegesException $pe){
	$_http_code = PrivilegesException::HTTP_CODE;
	$_internal_code = PrivilegesException::ERROR_CODE;
	$_error_name = $pe->getMessage();
	$_function_called = true;
	$_exception = $pe;
}catch(DBQueryException $dbe){
	$_http_code = DBQueryException::HTTP_CODE;
	$_internal_code = DBQueryException::ERROR_CODE;
	$_error_name = $dbe->getMessage();
	$_function_called = true;
	$_exception = $dbe;
}catch(AbstractException $ae){
	$_http_code = $ae->getHttpCode();
	$_internal_code = $ae->getInternalCode();
	$_error_name = $ae->getMessage();
	$_function_called = true;
	$_exception = $ae;
}catch(Exception $e){
	$_http_code = AbstractException::HTTP_CODE;
	$_internal_code = AbstractException::ERROR_CODE;
	$_error_name = $e->getMessage();
	$_function_called = true;
	$_exception = $e;
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


	$q_ins_log = App::queryFactory()->newInsert();
	$q_ins_log
		->into('log_requests')
		->cols(array(
			'body' => json_encode($__request ?? array()),
			'body_json' => json_encode($__request ?? array()),
			'user_id' => isset($__user) && ($__user instanceof User) ? $__user->getId() : null,
			'method' => $_request_method ?? '',
			'class' => $_class_name ?? '',
			'args' => json_encode($_args ?? array()),
			'method_name' => $_method_name ?? '',
			'response_status' => null,
			'headers' => json_encode($__headers ?? array()),
			'response_http_status' => $_http_code,
			'time' => $request_time->format('Y-m-d H:i:s'),
			'exception_text' => isset($_exception) ? $_exception->getMessage() : null,
			'exception_trace' => isset($_exception) ? $_exception->getTraceAsString() : null,
			'exception_file' => isset($_exception) ? $_exception->getFile() : null,
			'exception_line' => isset($_exception) ? $_exception->getLine() : null
		))
		->returning(array('uuid'));
	$p_ins_log = $__db->prepare($q_ins_log->getStatement());
	$p_ins_log->execute($q_ins_log->getBindValues());
	$log_res = $p_ins_log->fetch(PDO::FETCH_ASSOC);

	if ($log_res != FALSE){
		$_result->setRequestUUID($log_res['uuid']);
	}

	if (($_SERVER['ENV'] == 'local' || $_SERVER['ENV'] == 'dev' || $_SERVER['ENV'] == 'test') && isset($e)){
		$_result->setException($_exception);
	}elseif(isset($__request['show_debug']) && isset($_exception)){
		$_result->setException($_exception);
	}
	echo $_result;
}
