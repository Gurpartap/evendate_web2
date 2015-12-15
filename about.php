<?php
require_once 'backend/bin/db.php';
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"><!--
	<meta name="viewport" content="width=device-width">-->
	<title>Evendate - о нас</title>
	<link href="landing/style.css" rel="stylesheet" type="text/css">
	<link href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,700,500|Pacifico" rel="stylesheet" type="text/css">
</head>
<body>

<header id="main-header">
	<div class="overlay v-centering">
		<a id="header-logo" class="odd unselectable" title="Evendate" href="#"><img src="landing/img/logo_500.png"><span>Evendate</span></a>
		<nav class="nav header-nav">
			<a class="nav-unit centering" href="index.php"><span>Главная</span></a>
			<a class="nav-unit nav-active centering"><span>О нас</span></a>
			<a class="nav-unit centering" href="feedback.php"><span>Поддержка</span></a>
			<a class="nav-unit centering" href="api.php"><span>API</span></a>
		</nav>
	</div>
</header>
<div id="overlay" class="overlay">
	<div style="margin-top: 90px"></div>
	<p>Около полугода назад мы решили объединить все мероприятия Москвы в одном простом и удобном сервисе, где в соответствии с личными интересами можно подписаться на организаторов, добавлять их мероприятия себе в календарь, получать напоминания, чтобы ничего не пропустить, а также видеть какие мероприятия посещают друзья.</p>
	<p>Итогом нашей работы стал сервис, представленный в виде веб-сайта, iOS- и Android-приложений. Теперь есть возможность быть в курсе всех интересных вам событий - в родном городе, в любимой организации, в альма-матер, в любом другом месте.</p>
	<p><strong>Мы используем Evendate ежедневно, им пользуются наши друзья и друзья друзей. Мы будем рады видеть вас в числе наших пользователей. Верим, что вы полюбите Evendate - он упростит вам жизнь. Скачивайте и пробуйте!</strong></p>
	<p>Знакомьтесь с командой, которая это все создает</p>
	<div id="persons">
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/17.png"></div><h3 class="person-name">Инал Карданов</h3><p class="person-description">Backend Delevoper</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/7.png"></div> <h3 class="person-name">Дмитрий Гордеев</h3><p class="person-description">Android Delevoper</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/5.png"></div> <h3 class="person-name">Денис Оздемир</h3><p class="person-description">UX/UI</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/18.png"></div><h3 class="person-name">Александр Сапронов</h3><p class="person-description">Designer </p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/16.png"></div><h3 class="person-name">Ибрагимов Ибрагим</h3><p class="person-description">Web-analyst</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/3.png"></div> <h3 class="person-name">Олег Минтуш</h3><p class="person-description">Evangelist</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/8.png"></div> <h3 class="person-name">Амир Абдулаев</h3><p class="person-description">Marketing manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/19.png"></div><h3 class="person-name">Енот</h3><p class="person-description">Просто енот</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/1.png"></div> <h3 class="person-name">Елена Каминская</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/2.png"></div> <h3 class="person-name">Саша Серкова</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/6.png"></div> <h3 class="person-name">Ольга Санникова</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/9.png"></div> <h3 class="person-name">Елена Власова</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/10.png"></div><h3 class="person-name">Екатерина Мысливцева</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/11.png"></div><h3 class="person-name">Дарина Киреенко</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/12.png"></div><h3 class="person-name">Галия Халилулина</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/13.png"></div><h3 class="person-name">Татьяна Иванова</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/14.png"></div><h3 class="person-name">Екатерина Андреева</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/15.png"></div><h3 class="person-name">Кристина Личинина</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/20.png"></div><h3 class="person-name">Анна Андронова</h3><p class="person-description">Content manager</p></div>
		<div class="person"><div class="person-avatar"><img src="landing/img/persons/21.png"></div><h3 class="person-name">Ярослав Попсуй-Шапко</h3><p class="person-description">Content manager</p></div>
	</div>
</div>

<div id="loader" class="centering"><div class="dots-loader"></div></div>

<script src="vendor/jquery/dist/jquery.js"></script>
<script src="vendor/bootstrap/dist/js/bootstrap.js"></script>
<script src="landing/js/main.js" type="text/javascript"></script>

<?php
require 'footer.php';
?>
<!-- =============== APP SCRIPTS ===============-->
<script src="http://<?=App::$DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
<script src="app/js/app.js"></script>
</body>
</html>