<?php

	require_once '../v1-backend/bin/env_variables.php';
	require_once "{$BACKEND_FULL_PATH}/bin/db.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.RequestsParser.php";
	require_once "{$BACKEND_FULL_PATH}/bin/Class.Fields.php";
	require_once "{$BACKEND_FULL_PATH}/statistics/Class.AwayRedirect.php";

	App::buildGlobal($__db);
	AwayRedirect::addAway($_REQUEST);


	header("Location: {$_REQUEST['url']}");
	die();
