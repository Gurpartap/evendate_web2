<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta name="description" content="Bootstrap Admin App + jQuery">
	<meta name="keywords" content="app, responsive, jquery, bootstrap, dashboard, admin">
	<meta name="google-signin-client_id" content="403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com">
	<title>Angle - Bootstrap Admin Template</title>
	<!-- =============== VENDOR STYLES ===============-->
	<!-- FONT AWESOME-->
	<link rel="stylesheet" href="vendor/fontawesome/css/font-awesome.min.css">
	<!-- SIMPLE LINE ICONS-->
	<link rel="stylesheet" href="vendor/simple-line-icons/css/simple-line-icons.css">
	<!-- =============== BOOTSTRAP STYLES ===============-->
	<link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
	<!-- Loaders.css-->
	<link rel="stylesheet" href="app/vendor/loaders.css/loaders.css">
	<!-- =============== APP STYLES ===============-->
	<link rel="stylesheet" href="app/css/app.css" id="maincss">
</head>

<body>
<div class="wrapper">
	<div class="block-center mt-xl wd-xl">
		<!-- START panel-->

			<div class="panel panel-default">
				<div class="panel-heading">Загрузка данных</div>
				<div class="panel-body loader-demo">
					<div class="ball-pulse">
						<div></div>
						<div></div>
						<div></div>
					</div>
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
<!-- STORAGE API-->
<script src="vendor/jQuery-Storage-API/jquery.storageapi.js"></script>
<!-- PARSLEY-->
<script src="vendor/parsleyjs/dist/parsley.min.js"></script>
<!-- GOOGLE PLATFORM FOR GOOGLE PLUS AUTHORIZATION-->
<script src="https://apis.google.com/js/platform.js" async defer></script>
<!-- VK OPEN API FOR AUTHORIZATION-->
<script src="https://vk.com/js/api/openapi.js" type="text/javascript"></script>
<script src="http://localhost:8080/socket.io/socket.io.js" type="text/javascript"></script>


<!-- =============== APP SCRIPTS ===============-->
<script src="app/js/app.js"></script>

<script>
	window.resizeTo(530, 400);
	socket.emit('auth.vkOauthDone', searchToObject());
	socket.on('auth', function(data){
		$.ajax({
			url: 'auth.php',
			type: 'POST',
			data: data,
			success: function(res){
				if (res.status){
					window.opener.location = 'calendar.php';
					window.close();
				}else{
					alert(res.text);
				}
			}
		});
	});

</script>