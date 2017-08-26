<?php

require_once '../v1-backend/bin/env_variables.php';
require_once "{$BACKEND_FULL_PATH}/bin/db.php";


if (App::$ENV == 'prod' || App::$ENV == 'test') {
	$DEBUG_MODE = isset( $_GET['debug'] ) ? true : false;
} else {
	$DEBUG_MODE = true;
	ini_set("display_errors", 1);
	error_reporting(E_ALL);
}
//$DEBUG_MODE = false; ?>
<!DOCTYPE html>
<html lang="ru">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Evendate</title>

	<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet">
	<?php
	if ($DEBUG_MODE) { ?>
		<link rel="stylesheet" href="/dist/orders_widget/widget.css"><?php
	} else { ?>
		<style type="text/css" media="all"><?php require_once( $ROOT_PATH . '/dist/orders_widget/widget.min.css' ); ?></style><?php
	} ?>
</head>

<body class="widget_view">

<div class="app_view PageView">
	<div class="page_wrapper Content -fadeable"></div>
</div>

<div class="modal_wrapper">
	<div class="modal_destroyer"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if ($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/orders_widget/widget.js" charset="utf-8"></script><?php
} else { ?>
	<script type="application/javascript" charset="utf-8"><?php require_once( $ROOT_PATH . '/dist/orders_widget/widget.min.js' ); ?></script><?php
}

require_once( $ROOT_PATH . '/dist/orders_widget/templates.html' );
require_once( $ROOT_PATH . '/footer.php' );
?>

</body>

</html>