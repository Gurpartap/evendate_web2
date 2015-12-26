<?php

	header('Content-Type: text/html; charset=utf-8');
	@mb_internal_encoding("UTF-8");
	@session_set_cookie_params(2592000);
	@ini_set('session.gc_maxlifetime', 2592000);
	@session_start();

	date_default_timezone_set('Europe/Moscow');
	$ROOT_PATH = $_SERVER['DOCUMENT_ROOT'] . '/';
	$BACKEND_FOLDER = 'v1-backend';

	require_once 'app_config.php';
	App::init();

	$db = new PDO('pgsql:host='. App::$DB_SERVER.';dbname='. App::$DB_NAME, App::$DB_USER, App::$DB_PASSWORD);
	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

	if (!isset($_SERVER['ENV']) || $_SERVER['ENV'] == 'dev' || $_SERVER['ENV'] == 'local'){
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	$__db = $db;