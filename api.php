<?php
require_once 'backend/bin/db.php';
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"><!--
	<meta name="viewport" content="width=device-width">-->
	<title>Evendate - API</title>
	<link href="landing/style.css" rel="stylesheet" type="text/css">
	<link href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,700,500|Pacifico" rel="stylesheet" type="text/css">
</head>
<body>

<header id="main-header">
	<div class="overlay v-centering">
		<a id="header-logo" class="odd unselectable" title="Evendate" href="#"><img src="landing/img/logo_500.png"><span>Evendate</span></a>
		<nav class="nav header-nav">
			<a class="nav-unit centering" href="index.php"><span>Главная</span></a>
			<a class="nav-unit centering" href="about.php"><span>О нас</span></a>
			<a class="nav-unit centering" href="feedback.php"><span>Поддержка</span></a>
			<a class="nav-unit nav-active centering"><span>API</span></a>
		</nav>
	</div>
</header>
<div id="overlay" class="overlay h-centering">
	<div style="margin-top: 90px"></div>
	<p>Наши разработчики ежедневно дорабатывают продукт, чтобы сделать сервис интереснее.<br>Если вы хотите приобщиться к нашей миссии и сделать Evendate чуточку лучше,<br>то мы предлагаем воспользоваться нашим Beta REST API.</p>
	<p class="thin">Заполните форму, и наша команда обязательно свяжется с Вами!</p>
	<form class="form" autocomplete="off">
		<div class="form-unit form-labeled">
			<label for="name" class="form-label icon-user"></label>
			<input id="name" class="form-input" type="text" placeholder="Ваше имя" name="name" required>
		</div>
		<div class="form-unit form-labeled">
			<label for="email" class="form-label icon-mail"></label>
			<input id="email" class="form-input" type="email" placeholder="E-Mail" name="email" required>
		</div>
		<div class="form-unit">
			<textarea id="question" class="form-textarea" placeholder="Ваш вопрос" name="question" required></textarea>
		</div>
		<div class="form-unit">
			<button id="send_form" class="form-button" type="button">Отправить</button>
		</div>
	</form>
</div>

<div id="loader" class="centering"><div class="dots-loader"></div></div>

<script src="vendor/jquery/dist/jquery.js"></script>
<script src="vendor/bootstrap/dist/js/bootstrap.js"></script>

<?php
require 'footer.php';
?>
<!-- =============== APP SCRIPTS ===============-->
<script src="http://<?=App::$DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
<script src="app/js/app.js"></script>
<script src="landing/js/main.js" type="text/javascript"></script>
</body>
</html>