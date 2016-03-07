<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);
	require_once 'v1-backend/bin/env_variables.php';
	require_once 'v1-backend/bin/db.php';
	require_once 'v1-backend/statistics/Class.Statistics.php';
	require_once 'v1-backend/bin/Class.Result.php';
	require_once 'v1-backend/users/Class.AbstractUser.php';
	require_once 'v1-backend/users/Class.User.php';
	require_once 'v1-backend/events/Class.Event.php';
	require_once 'v1-backend/events/Class.EventsCollection.php';
	require_once 'v1-backend/events/Class.EventDate.php';
	require_once 'v1-backend/events/Class.EventsDatesCollection.php';
	require_once 'v1-backend/users/Class.UsersCollection.php';
	require_once 'v1-backend/users/Class.Friend.php';
	require_once "v1-backend/bin/Class.RequestsParser.php";
	require_once "v1-backend/bin/Class.Fields.php";

	App::buildGlobal($__db);
	$event_id = isset($_REQUEST['id']) ? intval($_REQUEST['id']): null;

	try {
		$user = new User($__db);
		$hide_auth_btn = 'hidden';
	}catch (Exception $e){
		$user = null;
		$hide_auth_btn = '';
	}
	$event = EventsCollection::one($__db, $user, $event_id, array('favored'))
		->getParams($user, Fields::parseFields('organization_logo_large_url,organization_logo_medium_url,organization_logo_small_url,organization_name,organization_id,detail_info_url,dates,favored,location,address,description,tags,link'))->getData();


	$trans = array(
		"January" => "января",
		"February" => "февраля",
		"March" => "марта",
		"April" => "апреля",
		"May" => "мая",
		"June" => "июня",
		"July" => "июля",
		"August" => "августа",
		"September" => "сентября",
		"October" => "октября",
		"November" => "ноября",
		"December" => "декабря"
	);

	$days = array(
		"Monday" => "Понедельник",
		"Tuesday" => "Вторник",
		"Wednesday" => "Среда",
		"Thursday" => "Четверг",
		"Friday" => "Пятница",
		"Saturday" => "Суббота",
		"Sunday" => "Воскресенье"
	);


?>
<!DOCTYPE html>
<html lang="ru">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Evendate - <?=$event['title']?></title>
	<!-- =============== VENDOR STYLES ===============-->
	<!-- Google ROBOTO-->
	<link href='http://fonts.googleapis.com/css?family=Roboto&subset=latin,cyrillic-ext' rel='stylesheet' type='text/css'>
	<!-- FONT AWESOME-->
	<link rel="stylesheet" href="vendor/fontawesome/css/font-awesome.min.css">
	<!-- ANIMATE.CSS-->
	<link rel="stylesheet" href="vendor/animate.css/animate.min.css">
	<!-- =============== BOOTSTRAP STYLES ===============-->
	<link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
	<!-- =============== APP STYLES ===============-->
	<link rel="stylesheet" href="app/css/app.css" id="maincss">
	<!-- Pace -->
	<link rel="stylesheet" href="vendor/pace/pace.css">
	<!-- SELECT2 -->
	<link href="vendor/select2/css/select2.css" rel="stylesheet" />
</head>

<body>
<div class="event">
	<!-- Main section-->
	<section class="single-event">
		<!-- Page content-->
		<div class="content-wrapper">
			<div class="head-row col-xs-12 header blurheader">
				<div class="col-sm-4 brand-name">
					<a href="/">
						<img src="app/img/logo_500.png" width="30" height="30">
						<span>Evendate</span>
					</a>
				</div>
				<div class="col-sm-3">

				</div>
				<div class="col-sm-5 auth-type-wrapper <?=$hide_auth_btn?>">
					<div class="col-xs-6 text-right">
						Войти через
					</div>
					<div class="col-xs-6">
						<span class="social-links auth-links">
							<i class="fa fa-vk vk-auth-btn" data-auth-type="vk"></i>
							<i class="fa fa-facebook-f facebook-btn" data-auth-type="facebook"></i>
							<i class="fa fa-google-plus google-plus-btn" data-auth-type="google-plus"></i>
						</span>
					</div>
				</div>
			</div>
			<!-- START row-->
			<div class="text-center">
				<div class="event-alone full-height">
					<div class="left-col">
						<div class="event-image" style="max-width: 100%; background-image: url('<?=$event['image_vertical_url']?>');" title="<?=$event['title']?>"></div>
						<div class="event-left-info">
							<div class="day-name">
								<?php
									$begin_date = DateTime::createFromFormat('U', $event['first_event_date']);
									$end_date = DateTime::createFromFormat('U', $event['last_event_date']);

										if ($begin_date->format('Y-m-d') == $end_date->format('Y-m-d')){
											echo strtr($begin_date->format('l'), $days) . '<br>' . $end_date->format('j') . ' ' . strtr($begin_date->format('F'), $trans);
										}else{
											if ($begin_date->format('m') == $end_date->format('m')){
												echo $begin_date->format('j') . ' - ' . $end_date->format('j') . ' ' .strtr($begin_date->format('F'), $trans);
											}else{
												echo $begin_date->format('j') . ' ' . strtr($begin_date->format('F'), $trans) .  ' - ';
												echo $end_date->format('j') . ' ' .strtr($end_date->format('F'), $trans);
											}
										}

								?>
							</div>
							<div class="time">
								<?php
//									if ($event->getEndTime() == null){
//										$begin_dt = new DateTime($event->getBeginTime());
//										echo $begin_dt->format('H:i');
//									}else{
//										if ($event->getBeginTime() == '00:00:00' && $event->getEndTime() == '00:00:00'){
//											echo 'Весь день';
//										}else {
//											$begin_dt = new DateTime($event->getBeginTime());
//											$end_dt = new DateTime($event->getEndTime());
//											echo $begin_dt->format('H:i') . ' - ' . $end_dt->format('H:i');
//										}
//									}
								?>
							</div>
							<div class="address">
								<?=$event['location']?>
							</div>
						</div>
					</div><div class="middle-col">
						<div class="event-title">
							<?=$event['title']?>
						</div>
						<div class="event-description">
							<?=$event['description']?>
						</div>
						<div class="tags">
							<i class="fa fa-tags"></i>
							<?php
								$tags = $event['tags'];
								$_tags = array();
								foreach($tags as $tag){
									$_tags[] = $tag['name'];
								}
								echo count($_tags) > 0 ? implode(', ', $_tags): 'Нет тегов';
							?>
						</div>
						<div class="event-buttons">
							<?php
								if ($user != null && $user->hasFavoriteEvent($event)->getData()){
									$btn_text = 'Убрать из избранного';
									$btn_class = 'no-borders';
								}else{
									$btn_text = 'В избранное';
									$btn_class = '';
								}


							if ($user == null){
								echo "<div class='btn-group'>
											<button data-toggle='dropdown' class='btn btn-pink-empty' aria-expanded='true'>В избранное <b class='caret'></b></button>
											<ul role='menu' class='dropdown-menu social-links auth-links'>
												<span style='width: 100%; display: inherit; color: #ccc' class='text-center'>Войти с помощью</span>
												<li><a href='#' class='vk-auth-btn'><i class='fa fa-vk' data-auth-type='vk'></i> VK</a></li>
												<li><a href='#' class='facebook-btn'><i class='fa fa-facebook-f' data-auth-type='facebook'></i> Facebook</a></li>
												<li><a href='#' class='google-plus-btn'><i class='fa fa-google-plus' data-auth-type='google-plus'></i> Google+</a></li>

											</ul>
									  </div>";
									}else{
										echo "<button class='btn modal-subscribe-btn btn-pink-empty {$btn_class}' data-event-id='{$event_id}' data-organization-id='{$event['organization_id']}'>";
										echo $btn_text;
										echo '</button>';
									}
								?>
						</div>
						<div class="event-bottom-block row">
							<div class="col-xs-7">
								Поделиться:
								<span class="social-links">

									<a href="http://vk.com/share.php?url=<?=$event['link']?>&title=<?=$event['title']?>&description=<?=$event['description']?>&image=<?=$event['image_horizontal_url']?>"
									   onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
										<i class="fa fa-vk" data-share-type="vk"></i>
									</a>

									<a href="https://www.facebook.com/sharer/sharer.php?u=<?=$event['link']?>"
									   onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
										<i class="fa fa-facebook-f" data-share-type="facebook"></i>
									</a>

									<a href="https://plus.google.com/share?url=<?=$event['link']?>" class="hidden"
									   onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
										<i class="fa fa-google-plus" data-share-type="google-plus"></i>
									</a>

									<a href="https://twitter.com/share?url=<?=$event['link']?>&text=<?=$event['description']?>&via=evendate.ru&hashtags=#evendate <?=implode(',', $_tags)?>"
									    onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
										<i class="fa fa-twitter" data-share-type="twitter"></i>
									</a>

								</span>
							</div>
							<div class="col-xs-5 external-link-wrapper">
								<a title="Перейти на страницу мероприятия" href="<?=$event['detail_info_url']?>" target="_blank"><i class="fa fa-external-link"></i> Подробнее</a>
							</div>
						</div>
					</div><div class="right-col">
						<div class="organization-logo-wrapper pull-right">
							<img title="<?=htmlspecialchars($event['title'])?>" src="<?=$event['organization_logo_small_url']?>" title="<?=$event['organization_name']?>">
						</div>
						<div class="liked-users-big-count">
							Добавили в избранное:
							<?php
								$count = count($event['favored']);
								if ($count > 0){
									echo "<span class='label label-blue'>{$count}</span>";
								}else{
									echo ' пока никто...';
								}
							?>
						</div>
						<?php
							foreach($event['favored'] as $_user){
								if ($user != null && $_user['id'] == $user->getId()) continue;
								echo "
									<div class='liked-users-big'>
										<div class='liked-user-big'>
											<div class='user-image'>
												<img src='{$_user['avatar_url']}'>
											</div>
											<div class='user-name'>{$_user['last_name']} {$_user['first_name']}</div>
										</div>
									</div>";
							}
						?>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
<!-- Button trigger modal -->

<!-- =============== VENDOR SCRIPTS ===============-->
<script src="vendor/modernizr/modernizr.js"></script>
<script src="vendor/jquery/dist/jquery.js"></script>
<script src="vendor/bootstrap/dist/js/bootstrap.js"></script>
<script src="vendor/jquery.easing/js/jquery.easing.js"></script>
<script src="vendor/animo.js/animo.js"></script>
<script src="vendor/slimScroll/jquery.slimscroll.min.js"></script>
<script src="vendor/moment/min/moment-with-locales.min.js"></script>


<!-- =============== APP SCRIPTS ===============-->
<script src="<?=App::$SCHEMA.App::$NODE_DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
<script src="app/js/app.js"></script>
</body>

<script>
	$(document).ready(function(){
		$('.right-col, .middle-col').css('height', $('.left-col').height() + $('.event-bottom-block').outerHeight());

		$('.event-alone').css('margin-bottom', '40px');

		$('.modal-subscribe-btn').on('click', function(){
			var $this = $(this);
			if ($this.find('ul').length != 0){
				$this.toggleClass('open');
			}else{
				toggleFavorite($this, $(), false);
			}
		})

	});
</script>

<?php
require 'footer.php';
?>



</html>