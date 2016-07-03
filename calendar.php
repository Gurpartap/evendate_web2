<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);
require_once 'v1-backend/bin/env_variables.php';
require_once "{$BACKEND_FULL_PATH}/bin/Class.Result.php";
require_once "{$BACKEND_FULL_PATH}/bin/db.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.RequestsParser.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.Fields.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractEntity.php";
require_once "{$BACKEND_FULL_PATH}/bin/Class.AbstractCollection.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.AbstractUser.php";
require_once "{$BACKEND_FULL_PATH}/organizations/Class.OrganizationsCollection.php";
require_once "{$BACKEND_FULL_PATH}/organizations/Class.Organization.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.User.php";

App::buildGlobal($__db);
try {
    $user = new User($__db);
    $edit_event_btn_hidden = $user->isEditor() ? '' : '-hidden';
    $profile_is_editor = $user->isEditor() ? '' : '';
    if ($_REQUEST['q'] != 'onboarding' && !isset($_COOKIE['onboarding'])){
        $subscriptions = OrganizationsCollection::filter(
            $__db,
            $user,
            array('is_subscribed' => true),
            array('created_at'),
            array(),
            array()
        )->getData();
        if (count($subscriptions) == 0) {
            header('Location: /onboarding');
        };
    }else if ($_REQUEST['q'] == 'onboarding' && isset($_COOKIE['onboarding'])){
        header('Location: /feed');
    }else if ($_REQUEST['q'] == 'onboarding' && !isset($_COOKIE['onboarding'])){
        setcookie('onboarding', true, strtotime("+7 days"));
    }
} catch (Exception $e) {
    header('Location: /');
}
$user_full_name = $user->getLastName().' '.$user->getFirstName(); ?>
<!DOCTYPE html>
<html lang="ru">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Evendate</title>
	<!-- =============== VENDOR STYLES ===============-->
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,400,400italic,500,500italic,700,700italic&subset=latin,cyrillic" rel="stylesheet" type="text/css">
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
	<link rel="stylesheet" href="/app/css/friends.css">
	<!-- DATERANGEPICKER-->
	<link rel="stylesheet" href="/vendor/daterangepicker/daterangepicker.css">
	<!-- Pace -->
	<link rel="stylesheet" href="/vendor/pace/pace.css">
	<!-- SELECT2 -->
	<link href="/vendor/select2v3/select2.css" rel="stylesheet">
	<link href="/vendor/select2v3/select2-bootstrap.css" rel="stylesheet">
	<!--<link href="/vendor/select2/css/select2.css" rel="stylesheet" />-->
	<!-- SCROLLBAR -->
	<link href="/vendor/jquery.scrollbar/jquery.scrollbar.css" rel="stylesheet">

	<link rel="stylesheet" href="/app/css/main.css">
</head>

<body>
<div id="main_overlay">
	<header id="main_header">
		<div id="main_header_top">
			<div class="page_wrapper">
				<div class="main_header_wrapper">
					<h1 id="page_title" class="-unselectable">

					</h1><div id="search_bar">
						<input id="search_bar_input" class="search-input" type="text" placeholder="Поиск мероприятий, организаторов и друзей">
						<label class="search_block_icon fa_icon fa-search -empty" for="search_bar_input"></label>
						<button class="search_block_icon adv_search_button fa_icon fa-sliders -empty -hidden" type="button"></button>
					</div>
				</div><div id="user_bar" class="-unselectable">
					<div class="avatar_block -align_right -size_small">
						<span class="avatar_name" title="<?=$user_full_name ?>"><?=$user_full_name ?></span>
						<div class="avatar -rounded -bordered"><img src="<?= $user->getAvatarUrl() ?>"></div>
					</div>
					<div class="user_bar_forhead">
						<div class="avatar_block -align_right -size_small">
							<span class="avatar_name" title="<?=$user_full_name ?>"><?=$user_full_name ?></span>
							<div class="avatar -rounded -bordered"><img src="<?=$user->getAvatarUrl() ?>"></div>
						</div>
						<div class="user_bar_buttons">
							<button class="button -color_neutral RippleEffect OpenSettingsButton Controller" type="button" data-controller="showSettingsModal"><span class="Text fa_icon fa-cog">Настройки</span></button>
							<button class="button -color_neutral_accent RippleEffect LogoutButton" type="button"><span class="Text">Выйти</span></button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="main_header_bottom"><div class="page_wrapper HeaderTabsWrapper"></div></div>
	</header>
	<div id="main_section">

		<!-- START row-->
		<div class="organizations-app app_view -hidden PageView" data-controller="OrganizationsList">
			<div class="new-organizations-categories">
				<div class="new-categories-title">Категории</div>
				<div class="new-organizations-categories-wrapper"></div>
			</div>
			<div class="new-organizations-list"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="friends-app app_view -hidden PageView" data-controller="Friends">
			<div class="col-md-12" data-controller="Friends" style="padding-top: 100px;">

				<div class="no-friends-block hidden">
					<div class="no-friends-text">Ваших друзей пока нет в Evendate</div>
					<div class="subtitle">Вы можете пригласить их</div>
					<div class="share">
						<p class="social-links">
							<a class="fa fa-vk" target="_blank" href="http://vk.com/share.php?url=http://evendate.ru/&title=Evendate.ru - будь в курсе событий&description=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&image=http://evendate.ru/app/img/logo_500.png&noparse=false" data-share-type="vk"></a>
							<a class="fa fa-facebook-f" target="_blank" href="http://www.facebook.com/sharer.php?s=100&p[title]=Evendate.ru - будь в курсе событий&p[summary]=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&p[url]=http://evendate.ru/&p[images][0]=http://evendate.ru/app/img/logo_500.png" data-share-type="facebook"></a>
							<a class="fa fa-twitter" target="_blank" href="https://twitter.com/share?url=http://evendate.ru/event.php?id={id}&text=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&via=evendate.ru&hashtags=#events #Москва #evendate" data-share-type="twitter"></a>
						</p></div>
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
						<button class="btn btn-lg disabled btn-pink-empty"> Загрузить еще...</button>
					</div>
				</div>
				<div class="one-friend-profile one-friend-main-content"></div>
			</div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="search-app app_view -hidden PageView" data-controller="Search">
			<div class="search-organizations"></div>
			<div class="search-events"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="edit_event-app app_view -hidden PageView" data-controller="EditEvent">
			<div class="page_wrapper"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="event-app app_view -hidden PageView" data-controller="OneEvent">
			<div class="page_wrapper"></div>
		</div>

		<!-- START row-->
		<div class="feed-app app_view -hidden PageView" data-controller="Feed">
			<div class="page_wrapper"></div>
		</div>

		<!-- START row-->
		<div class="organization-app app_view -hidden PageView" data-controller="Organization">
			<div class="page_wrapper"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="onboarding-app -hidden PageView" data-controller="Onboarding">
			<div class="page_wrapper"></div>
		</div>
		<!-- END row-->

		<!-- START row-->
		<div class="statistics-app app_view -hidden PageView" data-controller="Statistics">
			<div class="page_wrapper"></div>
		</div>

	</div>
</div>

<aside id="main_sidebar" class="-unselectable">
	<div class="brand_block Controller" data-page="feed" data-feed_state="timeline" data-title="События">
		<svg width="140px" height="25px" viewBox="0 0 140 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<defs>
				<circle id="evendate_logo_dot" cx="131" cy="7" r="4.3"></circle>
			</defs>
			<g fill="none" fill-rule="evenodd">
				<path id="evendate_logo_text" fill="#9fa6b3" d="M4.50442993,14.1854218 C4.60423908,12.6878788 5.8684882,10.9573847 8.16409844,10.9573847 C10.6925967,10.9573847 11.7572275,12.5547639 11.823767,14.1854218 L4.50442993,14.1854218 Z M12.2562732,18.4450996 C11.7239578,19.9093639 10.5927875,20.9410046 8.53006529,20.9410046 C6.33426419,20.9410046 4.50442993,19.3769042 4.40462079,17.2137865 L16.11556,17.2137865 C16.11556,17.147229 16.1820994,16.4816544 16.1820994,15.8493584 C16.1820994,10.5913186 13.1545555,7.36328146 8.09755902,7.36328146 C3.90557509,7.36328146 0.0462882973,10.7577123 0.0462882973,15.9824734 C0.0462882973,21.5067431 4.00538423,24.7347802 8.49679558,24.7347802 C12.5224309,24.7347802 15.1174686,22.3719902 15.9492115,19.5432978 L12.2562732,18.4450996 Z M33.5250226,7.86246246 L28.8672627,7.86246246 L24.9747062,18.8444444 L20.9158011,7.86246246 L16.0584229,7.86246246 L22.7456353,24.2355992 L27.1705073,24.2355992 L33.5250226,7.86246246 Z M37.6931391,14.1854218 C37.7929482,12.6878788 39.0571974,10.9573847 41.3528076,10.9573847 C43.8813059,10.9573847 44.9459367,12.5547639 45.0124761,14.1854218 L37.6931391,14.1854218 Z M45.4449824,18.4450996 C44.912667,19.9093639 43.7814967,20.9410046 41.7187745,20.9410046 C39.5229734,20.9410046 37.6931391,19.3769042 37.59333,17.2137865 L49.3042692,17.2137865 C49.3042692,17.147229 49.3708086,16.4816544 49.3708086,15.8493584 C49.3708086,10.5913186 46.3432647,7.36328146 41.2862682,7.36328146 C37.0942843,7.36328146 33.2349975,10.7577123 33.2349975,15.9824734 C33.2349975,21.5067431 37.1940934,24.7347802 41.6855048,24.7347802 C45.7111401,24.7347802 48.3061778,22.3719902 49.1379206,19.5432978 L45.4449824,18.4450996 Z M56.0341537,14.8177177 C56.0341537,12.9208299 57.1653239,11.4232869 59.0949673,11.4232869 C61.224229,11.4232869 62.1225113,12.8542725 62.1225113,14.6846028 L62.1225113,24.2355992 L66.5473832,24.2355992 L66.5473832,13.9191919 C66.5473832,10.3250887 64.6842792,7.42983893 60.6253742,7.42983893 C58.8620793,7.42983893 56.8991662,8.1952498 55.9010748,9.89246519 L55.9010748,7.86246246 L51.6092817,7.86246246 L51.6092817,24.2355992 L56.0341537,24.2355992 L56.0341537,14.8177177 Z M85.3874435,0.141796342 L81.029111,0.141796342 L81.029111,9.49312039 C80.563335,8.62787333 79.2325464,7.46311766 76.4046208,7.46311766 C71.7801305,7.46311766 68.5529683,11.2236145 68.5529683,16.0157521 C68.5529683,20.9742834 71.8799397,24.634944 76.5376996,24.634944 C78.7335007,24.634944 80.3969864,23.636582 81.1289201,22.3387114 C81.1289201,23.1041223 81.2287292,23.9028119 81.2952687,24.2355992 L85.5205223,24.2355992 C85.4539829,23.5700246 85.3874435,22.3719902 85.3874435,21.273792 L85.3874435,0.141796342 Z M73.01111,16.0157521 C73.01111,13.0872236 74.8076745,11.4232869 77.070015,11.4232869 C79.3323556,11.4232869 81.0956504,13.0539449 81.0956504,15.9824734 C81.0956504,18.9442806 79.3323556,20.6747748 77.070015,20.6747748 C74.7411351,20.6747748 73.01111,18.9442806 73.01111,16.0157521 L73.01111,16.0157521 Z M87.8255349,19.776249 C87.8255349,22.3387114 89.9547965,24.7015015 93.4481165,24.7015015 C95.8768056,24.7015015 97.4404821,23.5700246 98.272225,22.272154 C98.272225,22.9044499 98.3387644,23.8029757 98.4385735,24.2355992 L102.497479,24.2355992 C102.397669,23.6698608 102.29786,22.5051051 102.29786,21.639858 L102.29786,13.5864046 C102.29786,10.29181 100.368217,7.36328146 95.1781416,7.36328146 C90.7865394,7.36328146 88.4243897,10.1919738 88.158232,12.7544363 L92.0840582,13.5864046 C92.2171371,12.1554191 93.2817679,10.9241059 95.2114113,10.9241059 C97.0745153,10.9241059 97.9727975,11.8891892 97.9727975,13.0539449 C97.9727975,13.6196833 97.6733701,14.0855856 96.7418181,14.2187005 L92.7161828,14.8177177 C89.9880662,15.2170625 87.8255349,16.8477204 87.8255349,19.776249 L87.8255349,19.776249 Z M94.3796685,21.4069069 C92.9490708,21.4069069 92.2504068,20.4751024 92.2504068,19.5100191 C92.2504068,18.2454272 93.148689,17.6131313 94.2798593,17.4467376 L97.9727975,16.8809992 L97.9727975,17.6131313 C97.9727975,20.5083811 96.2427724,21.4069069 94.3796685,21.4069069 L94.3796685,21.4069069 Z M110.857579,2.97048867 L106.865213,2.97048867 L106.865213,5.26672127 C106.865213,6.73098553 106.06674,7.86246246 104.336715,7.86246246 L103.504972,7.86246246 L103.504972,11.789353 L106.465977,11.789353 L106.465977,19.4101829 C106.465977,22.5716626 108.46216,24.4685504 111.656052,24.4685504 C112.953571,24.4685504 113.752044,24.2355992 114.151281,24.0692056 L114.151281,20.4085449 C113.918393,20.4751024 113.319538,20.5416598 112.787222,20.5416598 C111.522973,20.5416598 110.857579,20.0757576 110.857579,18.644772 L110.857579,11.789353 L114.151281,11.789353 L114.151281,7.86246246 L110.857579,7.86246246 L110.857579,2.97048867 Z M119.783265,14.1854218 C119.883074,12.6878788 121.147323,10.9573847 123.442933,10.9573847 C125.971431,10.9573847 127.036062,12.5547639 127.102602,14.1854218 L119.783265,14.1854218 Z M127.535108,18.4450996 C127.002792,19.9093639 125.871622,20.9410046 123.8089,20.9410046 C121.613099,20.9410046 119.783265,19.3769042 119.683455,17.2137865 L131.394395,17.2137865 C131.394395,17.147229 131.460934,16.4816544 131.460934,15.8493584 C131.460934,10.5913186 128.43339,7.36328146 123.376394,7.36328146 C119.18441,7.36328146 115.325123,10.7577123 115.325123,15.9824734 C115.325123,21.5067431 119.284219,24.7347802 123.77563,24.7347802 C127.801266,24.7347802 130.396303,22.3719902 131.228046,19.5432978 L127.535108,18.4450996 Z"></path>
				<g>
					<use fill="#f82969" fill-rule="evenodd" xlink:href="#evendate_logo_dot"></use>
					<use stroke="#fff" stroke-width="1.5" xlink:href="#evendate_logo_dot"></use>
				</g>
			</g>
		</svg>
		<img class="brand" src="/app/img/brand.png">
	</div>

	<div class="sidebar_main_wrapper scrollbar-outer SidebarScroll">
		<nav class="sidebar_navigation SidebarNav">
			<div class="sidebar_navigation_item -hidden SidebarNavItem Controller" data-page="statistics/overview" data-title="Статистика"><span>Статистика</span></div>
			<div class="sidebar_navigation_item <?= $edit_event_btn_hidden ?> SidebarNavItem Controller" data-page="edit_event" data-title="Создать событие">
				<span>Создать событие</span>
			</div>
			<div class="sidebar_navigation_item SidebarNavItem Controller" data-page="feed" data-feed_state="actual" data-title="События">
				<span>События</span>
				<span class="counter sidebar_navigation_counter -hidden SidebarNavFeedCounter">50</span>
			</div>
			<div class="sidebar_navigation_item SidebarNavItem Controller" data-page="friends" data-title="Друзья">
				<span>Друзья</span>
				<span	class="counter sidebar_navigation_counter -hidden SidebarNavFriendsCounter"></span>
			</div>
			<div class="sidebar_navigation_item SidebarNavItem Controller" data-page="organizations" data-title="Организации"><span>Каталог организаторов</span></div>
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
<script src="<?= App::$SCHEMA . App::$NODE_DOMAIN ?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
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