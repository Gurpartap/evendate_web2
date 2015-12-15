<?php
	require_once 'backend/bin/db.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta name="google-signin-client_id" content="403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com">
	<title>Evendate - Авторизация Google Plus</title>
	<!-- =============== VENDOR STYLES ===============-->
	<!-- FONT AWESOME-->
	<link rel="stylesheet" href="vendor/fontawesome/css/font-awesome.min.css">
	<!-- SIMPLE LINE ICONS-->
	<link rel="stylesheet" href="vendor/simple-line-icons/css/simple-line-icons.css">
	<!-- =============== BOOTSTRAP STYLES ===============-->
	<link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
	<!-- Loaders.css-->
	<link rel="stylesheet" href="/vendor/loaders.css/loaders.css">
	<!-- =============== APP STYLES ===============-->
	<link rel="stylesheet" href="app/css/app.css" id="maincss">
	<!-- WHIRL (spinners)-->
	<link rel="stylesheet" href="vendor/whirl/dist/whirl.css">

</head>

<body>
<div class="wrapper">
	<div class="block-center mt-xl wd-xl">
		<!-- START panel-->
		<div class="panel panel-default">
			<div class="panel-heading">Загрузка данных</div>
			<div class="panel-body loader-demo">
				<div class="whirl duo"></div>
			</div>
		</div>

		<!-- END panel-->
		<div class="p-lg text-center">
			<span>&copy;</span>
			<span>2015</span>
			<span>-</span>
			<span>Evendate</span>
		</div>
	</div>
</div>
<!-- =============== VENDOR SCRIPTS ===============-->
<!-- MODERNIZR-->
<script src="vendor/modernizr/modernizr.js"></script>
<!-- JQUERY-->
<script src="vendor/jquery/dist/jquery.js"></script>
<!-- BOOTSTRAP-->
<script src="vendor/bootstrap/dist/js/bootstrap.js"></script>
<!-- VK OPEN API FOR AUTHORIZATION-->
<script src="http://<?=App::$DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>


<?php
require_once 'footer.php';
?>
<!-- =============== APP SCRIPTS ===============-->
<script src="app/js/app.js"></script>

<script>

	window.resizeTo(530, 400);

	var data = $.extend(hashToObject(), searchToObject());
	data.type = 'google';
	socket.emit('auth.oauthDone', data);

</script>