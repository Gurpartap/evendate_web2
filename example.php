<?php
require_once 'v1-backend/bin/db.php';
require_once 'v1-backend/bin/Class.Result.php';
require_once 'v1-backend/users/Class.AbstractUser.php';
require_once 'v1-backend/users/Class.User.php';
require_once 'v1-backend/tags/Class.TagsCollection.php';
try{
	$user = new User($__db);
	$add_event_btn_hidden = $user->isEditor() ? '' : 'hidden';
	$profile_is_editor = $user->isEditor() ? '' : '';
}catch(exception $e){
	echo $e;
	//header('Location: /');
}
?>
<!DOCTYPE html>
<html lang="ru">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Evendate</title>
	<!-- =============== VENDOR STYLES ===============-->
	<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,800italic,800,700italic,700,600italic,600,400italic,300italic,300' rel='stylesheet' type='text/css'>
	<link href='https://fonts.googleapis.com/css?family=Didact+Gothic&subset=latin,cyrillic,cyrillic-ext' rel='stylesheet' type='text/css'>
	<link href='https://fonts.googleapis.com/css?family=Roboto:300,300italic,400,400italic,500,500italic&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
	<!-- FONT AWESOME-->
	<link rel="stylesheet" href="vendor/fontawesome/css/font-awesome.min.css">
	<!-- SIMPLE LINE ICONS-->
	<link rel="stylesheet" href="vendor/simple-line-icons/css/simple-line-icons.css">
	<!-- ANIMATE.CSS-->
	<link rel="stylesheet" href="vendor/animate.css/animate.min.css">
	<!-- =============== PAGE VENDOR STYLES ===============-->
	<!-- TAGS INPUT-->
	<link rel="stylesheet" href="vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css">
	<!-- FULLCALENDAR-->
	<link rel="stylesheet" href="vendor/fullcalendar/dist/fullcalendar.css">
	<!-- =============== CROPPER STYLES ===============-->
	<link rel="stylesheet" href="vendor/cropper/css/cropper.css">
	<!-- =============== BOOTSTRAP STYLES ===============-->
	<!--<link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">-->
	<!-- Loaders.css-->
	<link rel="stylesheet" href="/vendor/loaders.css/loaders.css">
	<!-- =============== APP STYLES ===============-->
	<link rel="stylesheet" href="app/css/app.css" id="maincss">
	<link rel="stylesheet" href="app/css/friends.css"">
	<!-- DATERANGEPICKER-->
	<link rel="stylesheet" href="vendor/daterangepicker/daterangepicker.css">
	<!-- Pace -->
	<link rel="stylesheet" href="vendor/pace/pace.css">
	<!-- SELECT2 -->
	<link href="vendor/select2v3/select2.css" rel="stylesheet" />
	<link href="vendor/select2v3/select2-bootstrap.css" rel="stylesheet" />
	<!--<link href="vendor/select2/css/select2.css" rel="stylesheet" />-->

	<link rel="stylesheet" href="app/css/main.css">
</head>

<body>
<div id="wrapper">
	<header id="overview_header">
		<div class="header_brand -centering">
			<a title="Перейти к моей ленте" href="/timeline"><img src="app/img/logo_500.png"><span>Evendate</span></a>
		</div>
		<div class="header_search_block -centering">
			<input class="form_input" placeholder="Поиск мероприятий, огранизаций, #тегов">
		</div>
		<div class="header_login_block -centering">
			<div class="user_block <?=$profile_is_editor?>">
				<img class="user_pic -rounded -size_40x40" src="<?=$user->getAvatarUrl()?>" title="<?="{$user->getLastName()} {$user->getFirstName()}"?>">
				<span class="user_name"><?="{$user->getLastName()} {$user->getFirstName()}"?></span>
			</div>
			<button class="icon-login"></button>
			<button class="glyphicon-cog"></button>
		</div>
	</header>
	<aside id="sidebar_wrapper">
		<div id="Sidebar" data-sidebar-anyclick-close="">
			<div class="panel side-calendar-panel">
				<div class="panel-body">
					<button type="button" class="btn btn-xs btn-black-blue pressed prev-button">
						<span class="icon-arrow-left"></span>
					</button>
					<span id="month-name"></span>
					<button type="button" class="btn btn-xs btn-black-blue pressed next-button">
						<span class="icon-arrow-right"></span>
					</button>
					<table class="sidebar-calendar-table" id="calendar-table">
						<thead>
							<tr>
								<th>Пн</th>
								<th>Вт</th>
								<th>Ср</th>
								<th>Чт</th>
								<th>Пт</th>
								<th>Сб</th>
								<th>Вс</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
			<!-- END user info-->
			<div class="nav">
				<button type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="timeline">
					<i class="icon-home"></i> <span>Моя лента</span>
				</button>
				<button type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn <?=$add_event_btn_hidden?>" data-controller="showAddEventModal">
					<i class="icon-note"></i> <span>Создать событие</span>
				</button>
				<button type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="favorites">
					<i class="icon-pin"></i> <span>Избранное</span>
				</button>
				<button type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="organizations">
					<i class="icon-list"></i> <span>Организаторы</span>
				</button>
				<button type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="friends">
					<i class="icon-people"></i> <span>Мои друзья</span>
				</button>
				<button type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-controller="showSettingsModal">
					<i class="icon-settings"></i> <span>Настройки</span>
				</button>
				<span class="side-block-container">Подписки</span>
				<div class="organizations-list">

				</div>
			</div>
			<!-- END sidebar nav-->
		</div>
	</aside>
	<!-- Main section-->
	<section id="content_wrapper">
		<!-- Page content-->
		<div class="example-app screen-view" data-controller="Example">
			<div class="page_wrapper">
				<div class="page -shifted">
					<h1>h1 - Main title</h1>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dapibus felis nec condimentum condimentum.</p>
					<h2>h2 - Subtitle</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dapibus felis nec condimentum condimentum.</p>
					<h3>h3 - Section title</h3>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dapibus felis nec condimentum condimentum.</p>
					<h4>h4 - Section subtitle</h4>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dapibus felis nec condimentum condimentum.</p>

					<form class="form">

						<div class="form_group -parts_1_2">
							<div class="form_unit">
								<label class="form_label">Организация</label>
								<select class="organizations ToSelect2" name="organization_id" title="Выберите организацию">
									<option>Организация</option>
									<option>Организация</option>
									<option>Организация</option>
								</select>
							</div>
							<div class="form_unit">
								<label class="form_label">Организация</label>
								<select class="form_select" name="organization_id" title="Выберите организацию">
									<option>Организация</option>
									<option>Организация</option>
									<option>Организация</option>
								</select>
							</div>
							<div class="form_unit">
								<label class="form_label">Организация</label>
								<div class="form_select -v_centering">Дата</div>
							</div>
							<div class="form_unit">
								<label class="form_label">Организация</label>
								<select class="form_select" name="organization_id" title="Выберите организацию">
									<option>Организация</option>
									<option>Организация</option>
									<option>Организация</option>
								</select>
							</div>
						</div>


						<div class="form_group -parts_e_2">
							<div class="form_unit">
								<div class="form_unit">
									<input id="radio1" class="form_radio" type="radio" name="radio">
									<label class="form_label" for="radio1"><span>Организация</span></label>
								</div>
								<div class="form_unit">
									<input id="radio2" class="form_radio" type="radio" name="radio">
									<label class="form_label" for="radio2"><span>Организация</span></label>
								</div>
								<div class="form_unit">
									<input id="radio3" class="form_radio" type="radio" name="radio">
									<label class="form_label" for="radio3"><span>Организация</span></label>
								</div>
							</div>
							<div class="form_unit">
								<div class="form_unit">
									<input id="checkbox1" class="form_checkbox" type="checkbox" name="checkbox">
									<label class="form_label" for="checkbox1"><span>Организация</span></label>
								</div>
								<div class="form_unit">
									<input id="checkbox2" class="form_checkbox" type="checkbox" name="checkbox">
									<label class="form_label" for="checkbox2"><span>Организация</span></label>
								</div>
								<div class="form_unit">
									<input id="checkbox3" class="form_checkbox" type="checkbox" name="checkbox">
									<label class="form_label" for="checkbox3"><span>Организация</span></label>
								</div>
							</div>
						</div>


						<div class="form_unit">
							<label class="form_label">Организация</label>
							<input class="form_input" type="text" autocomplete="off" placeholder="Название мероприятия" name="title">
						</div>

						<div class="form_unit -inline">
							<label class="form_label">Организация</label>
							<div class="form_group -parts_2_1">
								<div class="form_unit">
									<input class="form_input" type="text" autocomplete="off" placeholder="Название мероприятия" name="title" disabled>
									<p class="form_prompt">Это поле задисейблено</p>
								</div>
								<div class="form_unit">
									<button class="button -fill RippleEffect" type="button" tabindex="-1" disabled>Отправить</button>
								</div>
							</div>
						</div>

						<div class="form_unit -inline">
							<label class="form_label">Организация</label>
							<div class="form_unit ">
								<div class="-unite -parts_1_e_3">
									<button class="button -color-default RippleEffect fa_icon fa-map-marker" type="button" tabindex="-1"></button>
									<input class="form_input" type="text" autocomplete="off" placeholder="Название мероприятия" name="title">
									<button class="button -color-default RippleEffect" type="button" tabindex="-1">Отправить</button>
								</div>
								<p class="form_prompt">А это вообще что-то непонятное</p>
							</div>
						</div>

						<div class="form_unit -inline">
							<label class="form_label">Организация</label>
							<input class="form_input" type="text" autocomplete="off" placeholder="Название мероприятия" name="title">
						</div>

						<div class="form_unit -inline -status_error">
							<label class="form_label">Организация</label>
							<textarea class="form_textarea" placeholder="Название мероприятия" name="title"></textarea>
							<p class="form_prompt">Могу покраситься в красный</p>
						</div>


					</form>
					<div class="Calendar"></div>
				</div>
			</div>
		</div>
	</section>
</div>
<!-- Button trigger modal -->

<!-- =============== VENDOR SCRIPTS ===============-->
<!-- MODERNIZR-->
<script src="vendor/modernizr/modernizr.js"></script>
<!-- JQUERY-->
<script src="vendor/jquery/dist/jquery.js"></script>
<!-- BOOTSTRAP-->
<script src="vendor/bootstrap/dist/js/bootstrap.js"></script>
<!-- JQUERY EASING-->
<script src="vendor/jquery.easing/js/jquery.easing.js"></script>
<!-- ANIMO-->
<script src="vendor/animo.js/animo.js"></script>
<!-- SLIMSCROLL-->
<script src="vendor/slimScroll/jquery.slimscroll.min.js"></script>
<!-- IMG CROPPER-->
<script src="vendor/cropper/js/cropper.js"></script>
<!-- TAGS INPUT-->
<script src="vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js"></script>
<!-- MOMENT JS-->
<script src="vendor/moment/min/moment-with-locales.min.js"></script>
<!-- DATERANGEINPUTS-->
<script src="vendor/daterangepicker/daterangepicker.js"></script>
<!-- INPUTMASKS -->
<script src="vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js"></script>
<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places"></script>
<script src="vendor/placepicker/jquery.placepicker.min.js"></script>
<!-- INPUTMASKS -->
<script src="vendor/pace/pace.min.js"></script>
<!-- SELECT2 -->
<script src="vendor/select2v3/select2.min.js"></script>
<script src="vendor/select2v3/select2_locale_ru.js"></script>
<!-- HISTORY API -->
<script src="vendor/history/jquery.history.js"></script>
<!-- NOTIFICATIONS API -->
<script src="vendor/notify/notify.js"></script>
<!-- JQUERY APPEAR-->
<script src="vendor/appear/jquery.appear.js"></script>


<!-- =============== APP SCRIPTS ===============-->
<script src="<?=App::$SCHEMA.App::$NODE_DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
<script src="app/js/app.js"></script>
<script src="app/js/calendar.js"></script>
<script src="app/js/add.js"></script>
<script src="app/js/Class.Calendar.js"></script>
<script src="app/js/main.js"></script>


<?php
require 'templates.html';
require 'footer.php';
?>

</body>

</html>