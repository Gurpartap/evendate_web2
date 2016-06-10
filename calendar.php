<?php
    require_once 'v1-backend/bin/db.php';
    require_once 'v1-backend/bin/Class.Result.php';
    require_once 'v1-backend/users/Class.AbstractUser.php';
    require_once 'v1-backend/users/Class.User.php';
    try{
        $user = new User($__db);
        $edit_event_btn_hidden = $user->isEditor() ? '' : '-hidden';
        $profile_is_editor = $user->isEditor() ? '' : '';
    }catch(exception $e){
        header('Location: /');
    }
?>
<!DOCTYPE html>
<html lang="ru">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Evendate</title>
	<!-- =============== VENDOR STYLES ===============-->
	<link href='https://fonts.googleapis.com/css?family=Roboto:300,300italic,400,400italic,500,500italic,700,700italic&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
	<!-- FONT AWESOME-->
	<link rel="stylesheet" href="/vendor/fontawesome/css/font-awesome.min.css">
	<!-- SIMPLE LINE ICONS-->
	<link rel="stylesheet" href="/vendor/simple-line-icons/css/simple-line-icons.css">
	<!-- ANIMATE.CSS-->
	<link rel="stylesheet" href="/vendor/animate.css/animate.min.css">
	<!-- =============== PAGE VENDOR STYLES ===============-->
	<!-- TAGS INPUT-->
	<link rel="stylesheet" href="/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css">
	<!-- FULLCALENDAR-->
	<link rel="stylesheet" href="/vendor/fullcalendar/dist/fullcalendar.css">
	<!-- =============== CROPPER STYLES ===============-->
	<link rel="stylesheet" href="/vendor/cropper/css/cropper.min.css">
	<!-- =============== BOOTSTRAP STYLES ===============-->
	<link rel="stylesheet" href="/app/css/bootstrap.css" id="bscss">
	<!-- Loaders.css-->
	<link rel="stylesheet" href="/vendor/loaders.css/loaders.css">
	<!-- =============== APP STYLES ===============-->
	<link rel="stylesheet" href="/app/css/app.css" id="maincss">
	<link rel="stylesheet" href="/app/css/friends.css"">
	<!-- DATERANGEPICKER-->
	<link rel="stylesheet" href="/vendor/daterangepicker/daterangepicker.css">
	<!-- Pace -->
	<link rel="stylesheet" href="/vendor/pace/pace.css">
	<!-- SELECT2 -->
	<link href="/vendor/select2v3/select2.css" rel="stylesheet" />
	<link href="/vendor/select2v3/select2-bootstrap.css" rel="stylesheet" />
	<!--<link href="/vendor/select2/css/select2.css" rel="stylesheet" />-->
	<!-- SCROLLBAR -->
	<link href="/vendor/jquery.scrollbar/jquery.scrollbar.css" rel="stylesheet" />

	<link rel="stylesheet" href="/app/css/main.css">
</head>

<body>
<div id="main_overlay">
	<header id="main_header">
		<div id="notification" class="-centering">
			<span id="notification_text"></span>
		</div>
		<div id="main_header_top">
			<div class="page_wrapper">
				<div class="main_header_wrapper">
					<h1 id="page_title" class="-unselectable"></h1><div id="search_bar">
						<input id="search_bar_input" class="search-input" type="text" placeholder="Поиск мероприятий, организаторов и друзей">
						<label class="search_block_icon fa_icon fa-search -empty" for="search_bar_input"></label>
						<button class="search_block_icon adv_search_button fa_icon fa-sliders -empty -hidden" type="button"></button>
					</div>
				</div><div id="user_bar" class="-unselectable">
					<div class="avatar_block">
						<div class="avatar -size_small -rounded -bordered"><img src="<?=$user->getAvatarUrl()?>"></div>
						<span class="avatar_name" title="<?=$user->getLastName() . ' ' . $user->getFirstName()?>"><?=$user->getLastName() . ' ' . $user->getFirstName()?></span>
					</div>
					<div class="user_bar_forhead">
						<div class="avatar_block">
							<div class="avatar -size_small -rounded -bordered"><img src="<?=$user->getAvatarUrl()?>"></div>
							<span class="avatar_name" title="<?=$user->getLastName() . ' ' . $user->getFirstName()?>"><?=$user->getLastName() . ' ' . $user->getFirstName()?></span>
							<small class="avatar_subname">armxaz@gmail.com</small>
						</div>
						<div class="user_bar_buttons">
							<button class="button -color_neutral RippleEffect OpenSettingsButton Controller" type="button" data-controller="showSettingsModal"><span class="Text fa_icon fa-cog">Настройки</span></button>
							<button class="button -color_neutral_secondary RippleEffect LogoutButton" type="button"><span class="Text">Выйти</span></button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="main_header_bottom">
			<div class="page_wrapper HeaderTabsWrapper">
				<div class="tabs_header -color_default">
					<span class="tab -active">Актуальные</span>
					<span class="tab">Избранное</span>
				</div>
			</div>
		</div>
	</header>
	<div id="main_section">

		<!-- START row-->
		<div class="organizations-app app_view hidden screen-view" data-controller="OrganizationsList">
			<div class="new-organizations-categories">
				<div class="new-categories-title">Категории</div>
				<div class="new-organizations-categories-wrapper"></div>
			</div>
			<div class="new-organizations-list"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="friends-app app_view hidden screen-view" data-controller="Friends">
			<div class="col-md-12" data-controller="Friends" style="padding-top: 100px;">

				<div class="no-friends-block hidden">
					<div class="no-friends-text">Ваших друзей пока нет в Evendate</div>
					<div class="subtitle">Вы можете пригласить их</div>
					<div class="share">
						<p class="social-links">
							<a class="fa fa-vk" target="_blank" href="http://vk.com/share.php?url=http://evendate.ru/&title=Evendate.ru - будь в курсе событий&description=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&image=http://evendate.ru/app/img/logo_500.png&noparse=false" data-share-type="vk"></a>
							<a class="fa fa-facebook-f" target="_blank" href="http://www.facebook.com/sharer.php?s=100&p[title]=Evendate.ru - будь в курсе событий&p[summary]=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&p[url]=http://evendate.ru/&p[images][0]=http://evendate.ru/app/img/logo_500.png" data-share-type="facebook"></a>
							<a class="fa fa-twitter" target="_blank" href="https://twitter.com/share?url=http://evendate.ru/event.php?id={id}&text=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&via=evendate.ru&hashtags=#events #Москва #evendate" data-share-type="twitter"></a></p></div>
				</div>

				<div class="friends-right-bar hidden">
					<div class="friends-bar-header">
						Друзья <span class="label label-blue friends-count"></span>
					</div>
					<div class="friends-list">
					</div>
				</div>
				<div class="friends-main-content hidden">

					<div class="load-more-btn hidden" data-page-number="0">
						<button class="btn btn-lg disabled btn-pink-empty"> Загрузить еще... </button>
					</div>
				</div>
				<div class="one-friend-profile one-friend-main-content"></div>
			</div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="search-app app_view hidden screen-view" data-controller="Search">
			<div class="search-organizations"></div>
			<div class="search-events"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="edit_event-app app_view hidden screen-view" data-controller="EditEvent">
			<div class="page_wrapper"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="event-app app_view hidden screen-view" data-controller="OneEvent">
			<div class="page_wrapper"></div>
		</div>

		<!-- START row-->
		<div class="feed-app app_view hidden screen-view" data-controller="Feed">
			<div class="page_wrapper"></div>
		</div>

		<!-- START row-->
		<div class="organization-app app_view hidden screen-view" data-controller="Organization">
			<div class="page_wrapper"></div>
		</div>
		<!-- END row-->
	</div>
</div>

<aside id="main_sidebar" class="-unselectable">
	<div class="logo_block Controller" data-page="feed" data-feed_state="timeline" data-title="События">
		<span class="logo">Evendate</span>
	</div>

	<div class="sidebar_main_wrapper scrollbar-outer SidebarScroll">
		<nav class="sidebar_navigation SidebarNav">
			<div class="sidebar_navigation_item -hidden SidebarNavItem"><span>Аналитика мероприятий</span></div>
			<div class="sidebar_navigation_item <?=$edit_event_btn_hidden?> SidebarNavItem" data-page="edit_event" data-title="Создать событие"><span>Создать событие</span></div>
			<div class="sidebar_navigation_item SidebarNavItem" data-page="feed" data-feed_state="actual" data-title="События"><span>События</span><span class="counter sidebar_navigation_counter -color_marginal -hidden SidebarNavFeedCounter">50</span></div>
			<div class="sidebar_navigation_item SidebarNavItem" data-page="friends" data-title="Друзья"><span>Друзья</span><span class="counter sidebar_navigation_counter -color_marginal -hidden SidebarNavFriendsCounter"></span></div>
			<div class="sidebar_navigation_item SidebarNavItem" data-page="organizations" data-title="Организации"><span>Каталог организаторов</span></div>
		</nav>
		<hr class="sidebar_divider">
		<div class="sidebar_organizations_wrapper scrollbar-outer SidebarOrganizationsScroll">
			<div class="sidebar_wrapper">
				<span class="sidebar_section_heading">Подписки</span>
				<div class="sidebar_organizations_list SidebarOrganizationsList"></div>
			</div>
		</div>
	</div>

</aside>

<div class="modal_wrapper">
	<div class="modal_destroyer"></div>
</div>


<!-- =============== VENDOR SCRIPTS ===============-->
<!-- MODERNIZR-->
<script src="/vendor/modernizr/modernizr.js"></script>
<!-- JQUERY-->
<script src="/vendor/jquery/dist/jquery.js"></script>
<!-- BOOTSTRAP-->
<script src="/vendor/bootstrap/dist/js/bootstrap.js"></script>
<!-- JQUERY EASING-->
<script src="/vendor/jquery.easing/js/jquery.easing.js"></script>
<!-- ANIMO-->
<script src="/vendor/animo.js/animo.js"></script>
<!-- SLIMSCROLL-->
<script src="/vendor/slimScroll/jquery.slimscroll.min.js"></script>
<!-- IMG CROPPER-->
<script src="/vendor/cropper/js/cropper.min.js"></script>
<!-- TAGS INPUT-->
<script src="/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js"></script>
<!-- MOMENT JS-->
<script src="/vendor/moment/min/moment-with-locales.min.js"></script>
<!-- DATERANGEINPUTS-->
<script src="/vendor/daterangepicker/daterangepicker.js"></script>
<!-- INPUTMASKS -->
<script src="/vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js"></script>
<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places"></script>
<script src="/vendor/placepicker/jquery.placepicker.min.js"></script>
<!-- PACE -->
<script src="/vendor/pace/pace.min.js"></script>
<!-- SELECT2 -->
<script src="/vendor/select2v3/select2.min.js"></script>
<script src="/vendor/select2v3/select2_locale_ru.js"></script>
<!-- HISTORY API -->
<script src="/vendor/history/jquery.history.js"></script>
<!-- SCROLLBAR -->
<script src="/vendor/jquery.scrollbar/jquery.scrollbar.js"></script>
<!-- NOTIFICATIONS API -->
<script src="/vendor/notify/notify.js"></script>
<!-- JQUERY APPEAR-->
<script src="/vendor/appear/jquery.appear.js"></script>


<!-- =============== APP SCRIPTS ===============-->
<script src="<?=App::$SCHEMA.App::$NODE_DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
<script type="text/javascript" src="/app/js/app.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/Class.Calendar.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/Class.DatePicker.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/Class.Modal.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/main.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/calendar.js" charset="utf-8"></script>


<?php
require 'templates.html';
require 'footer.php';
?>

</body>

</html>