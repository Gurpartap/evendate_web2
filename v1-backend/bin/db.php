<?php
	require_once 'env_variables.php';

	@session_start();
	require_once $BACKEND_FULL_PATH. '/bin/app_config.php';
	require_once $BACKEND_FULL_PATH. '/lib/aurasql/autoload.php';
	App::init();

	$driver_options = array(
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	);
	if (!isset($_SERVER['ENV']) || $_SERVER['ENV'] == 'dev' || $_SERVER['ENV'] == 'local'){
		$driver_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
	}

	$__db = new PDO(App::$DB_DSN, App::$DB_USER, App::$DB_PASSWORD, $driver_options);