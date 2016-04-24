<?php

	require_once 'v1-backend/bin/db.php';
	require_once 'v1-backend/bin/Class.Result.php';
	require_once 'v1-backend/users/Class.AbstractUser.php';
	require_once 'v1-backend/users/Class.User.php';
	try{
		$user = new User($__db);
		if (isset($_GET['logout']) && $_GET['logout'] == true){
			$user->logout();
		}else{
			header('Location: /timeline');
			die();
		}
	}catch(Exception $e){
		if (!isset($_GET['force_web'])){
			$useragent = $_SERVER['HTTP_USER_AGENT'];
			if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4)))
				header('Location: /mobile');
		}
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"><!--
	<meta name="viewport" content="width=device-width">-->
	<title>Evendate - наполняй жизнь событиями</title>
	<link href="landing/style.css" rel="stylesheet" type="text/css">
	<link href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,700,500|Pacifico" rel="stylesheet" type="text/css">
</head>
<body>

<header id="main-header">
	<div class="overlay v-centering">
		<a id="header-logo" class="odd unselectable" title="Evendate" href="#"><img src="landing/img/logo_500.png"><span>Evendate</span></a>
		<nav class="nav header-nav">
			<a class="nav-unit nav-active centering"><span>Главная</span></a>
			<a class="nav-unit centering" href="about.php"><span>О нас</span></a>
			<a class="nav-unit centering" href="feedback.php"><span>Поддержка</span></a>
			<a class="nav-unit centering" href="api.php"><span>API</span></a>
		</nav>
	</div>
</header>
<div id="overlay" class="overlay">
	<div id="mobiles">
		<div id="mobiles-wrap">
			<div id="mobile-1" class="mobile"><video id="mobile-1-video" width="100%" height="100%" src="landing/videos/apple_1.mp4" muted></video></div>
			<div id="mobile-2" class="mobile"><video id="mobile-2-video" width="100%" height="100%" src="landing/videos/android_1.mp4" muted autoplay></video></div>
		</div>
		<div id="mobile-switch" class="centering"><div id="mobile-switch-wrap">
			<button id="mobile-switch-android" class="mobile-switch" type="button"><img src="landing/img/mobile-switch/android.png"></button>
			<button id="mobile-switch-apple" class="mobile-switch" type="button"><img src="landing/img/mobile-switch/apple.png"></button>
		</div></div>
		<div id="vendors">
			<a class="vendor" target="_blank" href="https://itunes.apple.com/us/app/evendate/id1044975200?l=ru&ls=1&mt=8"><img src="landing/img/vendors/appstore.png"></a>
			<a class="vendor" target="_blank" href="https://play.google.com/store/apps/details?id=ru.evendate.android"><img src="landing/img/vendors/google_play.png"></a>
		</div>
	</div><!--
	--><div id="dialogues-overlay">
		<div id="dialogues">
			<div id="dialogues-wrap"></div>
		</div>
		<div id="bullets" style="visibility: hidden">
			<div class="bullet"></div>
			<div class="bullet"></div>
			<div class="bullet"></div>
		</div>
		<div id="login-field">
			<h2>Войти через</h2>
			<a class="social vk vk-auth-btn" href="#">ВКонтакте</a>
			<a class="social google google-plus-btn" href="#">Google</a>
			<a class="social facebook facebook-btn" href="#">Facebook</a>
		</div>
	</div>
	<footer>
	</footer>
</div>

<div id="loader" class="centering"><div class="dots-loader"></div></div>

<script src="vendor/jquery/dist/jquery.js"></script>
<script src="vendor/bootstrap/dist/js/bootstrap.js"></script>
<script src="landing/js/main.js" type="text/javascript"></script>

<?php
require 'footer.php';
?>
<!-- =============== APP SCRIPTS ===============-->
<script src="<?=App::$SCHEMA.App::$NODE_DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
<script src="app/js/app.js"></script>
<!-- NOTIFICATIONS API -->
<script src="vendor/notify/notify.js"></script>

<script>
	$('.vk-auth-btn,.google-plus-btn,.facebook-btn').on('click', function(){
		if (Notify.needsPermission) {
			Notify.requestPermission(function(){}, function(){
				showNotifier({status: false, text: 'Мы не можем включить уведомления в браузере. Вы запретили их для нас :('});
			});
		}
	});
</script>

</body>
</html>