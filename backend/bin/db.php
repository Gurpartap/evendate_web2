<?php

	header('Content-Type: text/html; charset=utf-8');
	@mb_internal_encoding("UTF-8");
	@session_set_cookie_params(2592000);
	@session_start();
	date_default_timezone_set('Europe/Moscow');
	$ROOT_PATH = $_SERVER['DOCUMENT_ROOT'] . '/evendate/';
	require_once 'app_config.php';

	App::init();

	$db = new PDO('mysql:host='. App::$DB_SERVER.';dbname='. App::$DB_NAME .';charset=utf8', App::$DB_USER, App::$DB_PASSWORD);
	$db->exec("SET GLOBAL general_log = 1;");
	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$__db = $db;