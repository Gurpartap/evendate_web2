<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);
$DEBUG_MODE = true;
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
require_once "{$BACKEND_FULL_PATH}/users/Class.NotAuthorizedUser.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.User.php";

App::buildGlobal($__db);

try {
	$user = new User($__db);
	if ($_REQUEST['q'] != 'onboarding' && !isset($_COOKIE['skip_onboarding']) && !isset($_COOKIE['open_add_organization'])) {
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
	} else if ($_REQUEST['q'] == 'onboarding' && isset($_COOKIE['skip_onboarding'])) {
		header('Location: /feed');
	}
} catch (Exception $e) {
	$user = App::getCurrentUser();
//    header('Location: /');
}

$is_user_not_auth = $user instanceof NotAuthorizedUser;
if($is_user_not_auth){
	$is_user_editor = false;
	$user_full_name = '';
} else {
	$is_user_editor = $user->isEditor();
	$user_full_name = $user->getLastName() . ' ' . $user->getFirstName();
}
if(App::$ENV == 'prod' || App::$ENV == 'test'){
	$DEBUG_MODE = false;
}
?>
<!DOCTYPE html>
<html lang="ru">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Evendate</title>
	<!-- =============== VENDOR STYLES ===============-->
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i&subset=cyrillic" rel="stylesheet">

	<?php
	if($DEBUG_MODE) { ?>
		<link rel="stylesheet" href="/dist/vendor.css?rev=5602b9b9f8cddbb4f8133131a270a5ae">
		<link rel="stylesheet" href="/dist/app.css?rev=625137e8b24f659e96e485888326cfea"><?php
	} else { ?>
		<link rel="stylesheet" href="/dist/vendor.min.css?rev=d48eec79ba0dcb66d3491c6bccde5f11">
		<link rel="stylesheet" href="/dist/app.min.css?rev=d71f7219fe8e59f34f8377e2375f2711"><?php
	}	?>

	<link rel="apple-touch-icon" sizes="57x57" href="/app/img/favicon/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="/app/img/favicon/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="/app/img/favicon/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="/app/img/favicon/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="/app/img/favicon/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="/app/img/favicon/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="/app/img/favicon/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="/app/img/favicon/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="/app/img/favicon/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192" href="/app/img/favicon/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/app/img/favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="/app/img/favicon/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/app/img/favicon/favicon-16x16.png">

	<link rel="manifest" href="/manifest.json">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="msapplication-TileImage" content="/app/img/favicon/ms-icon-144x144.png">
	<meta name="theme-color" content="#ffffff">
	<!--    Push notifications in browser    -->
	<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"></script>
</head>

<body>
<div id="main_overlay">
	<header id="main_header">
		<div id="main_header_top">
			<div class="page_wrapper">
				<div class="main_header_wrapper">
					<h1 id="page_title" class="-unselectable"></h1>
					<div id="search_bar">
						<input id="search_bar_input" class="search-input" type="text" placeholder="Поиск мероприятий, организаторов и друзей">
						<label class="search_block_icon fa_icon fa-search -empty" for="search_bar_input"></label>
						<button class="search_block_icon adv_search_button fa_icon fa-sliders -empty -hidden" type="button"></button>
					</div>
				</div><?php
				if($is_user_not_auth){ ?>
					<div id="header_login_block">
						<button class="button login_button -size_low -color_neutral_accent RippleEffect LoginButton" type="button"><span class="Text">Войти</span></button>
					</div><?php
				} else { ?>
					<div id="user_bar" class="-unselectable">
						<div class="avatar_block -align_right -size_small">
							<span class="avatar_name" title="<?=$user_full_name?>"><?=$user_full_name?></span>
							<div class="avatar -rounded -bordered"><img src="<?=$user->getAvatarUrl()?>"></div>
						</div>
						<div class="user_bar_forhead">
							<div class="avatar_block -align_right -size_small">
								<span class="avatar_name" title="<?=$user_full_name?>"><?=$user_full_name?></span>
								<div class="avatar -rounded -bordered"><img src="<?=$user->getAvatarUrl()?>"></div>
							</div>
							<div class="user_bar_buttons">
								<button class="button -color_neutral RippleEffect OpenSettingsButton" type="button"><span class="Text fa_icon fa-cog">Настройки</span></button>
								<button class="button -color_neutral_accent RippleEffect LogoutButton" type="button"><span class="Text">Выйти</span></button>
							</div>
						</div>
					</div><?php
				} ?>
			</div>
		</div>
		<div id="main_header_bottom">
			<div class="page_wrapper HeaderTabsWrapper"></div>
		</div>
	</header>
	<div id="main_section">

		<div class="app_view -hidden PageView">
			<div class="page_wrapper Content -fadeable"></div>
		</div>

	</div>
</div>

<aside id="main_sidebar" class="-unselectable">
	<a href="/feed" class="brand_block link Link">
		<svg width="135px" height="24.70001px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 24.70001">
			<path id="evendate_logo_text" transform="translate(-2.375 -0.69998)" fill="#9fa6b3" d="M18.675,16.4c0-5.3-3-8.5-8.1-8.5a8.42015,8.42015,0,0,0-8.2,8.7,8.38058,8.38058,0,0,0,8.5,8.8,7.55515,7.55515,0,0,0,7.5-5.2l-3.7-1.2a3.57051,3.57051,0,0,1-3.7,2.5,3.98288,3.98288,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,18.675,16.4Zm-11.8-1.6a3.55717,3.55717,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Zm24.3-6.3-3.9,11-4.1-11h-4.9l6.7,16.4h4.4l6.5-16.4h-4.7Zm20.6,7.9c0-5.3-3-8.5-8.1-8.5a8.25038,8.25038,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55522,7.55522,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98293,3.98293,0,0,1-4.1-3.7h11.7A13.79661,13.79661,0,0,0,51.775,16.4Zm-11.7-1.6a3.55712,3.55712,0,0,1,3.7-3.2,3.36289,3.36289,0,0,1,3.7,3.2h-7.4ZM62.975,8a5.385,5.385,0,0,0-4.7,2.5v-2h-4.3V24.9h4.4V15.4c0-1.9,1.1-3.4,3.1-3.4,2.1,0,3,1.4,3,3.3v9.6h4.4V14.5C68.875,10.9,66.975,8,62.975,8Zm24.8,13.9V0.7h-4.4v9.4c-0.5-.9-1.8-2-4.6-2-4.6,0-7.9,3.8-7.9,8.6,0,5,3.3,8.6,8,8.6a5.101,5.101,0,0,0,4.6-2.3,7.75394,7.75394,0,0,0,.2,1.9h4.2A26.28237,26.28237,0,0,1,87.775,21.9Zm-8.3-.6c-2.4,0-4.1-1.8-4.1-4.7s1.8-4.6,4.1-4.6,4,1.6,4,4.6S81.675,21.3,79.475,21.3Zm25.2,1V14.2c0-3.3-1.9-6.2-7.1-6.2-4.4,0-6.8,2.8-7,5.4l3.9,0.8a2.92541,2.92541,0,0,1,3.1-2.7c1.9,0,2.8,1,2.8,2.1a1.19858,1.19858,0,0,1-1.2,1.2l-4,.6c-2.8.4-5,2-5,5,0,2.6,2.1,4.9,5.6,4.9a5.40058,5.40058,0,0,0,4.8-2.4,12.30577,12.30577,0,0,0,.2,2h4.1A18.36784,18.36784,0,0,1,104.675,22.3Zm-4.3-4.2c0,3-1.8,3.9-3.6,3.9a1.89565,1.89565,0,0,1-2.1-1.9,2.094,2.094,0,0,1,2-2.1l3.7-.6v0.7Zm16.3-5.8V8.5h-3.3V3.6h-4.1V5.9a2.33883,2.33883,0,0,1-2.5,2.6h-0.8v3.9h3V20c0,3.2,2,5.1,5.2,5.1a5.9567,5.9567,0,0,0,2.5-.4V21a4.92317,4.92317,0,0,1-1.4.1,1.61828,1.61828,0,0,1-1.9-1.9V12.3h3.3Zm17.2,4.1a10.91279,10.91279,0,0,0-.47-3.3h-0.03a5.49026,5.49026,0,0,1-5.47-4.98,9.60458,9.60458,0,0,0-2.13-.22,8.25043,8.25043,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55517,7.55517,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98284,3.98284,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,133.875,16.4Zm-11.7-1.6a3.55721,3.55721,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Z"></path>
			<circle id="evendate_logo_dot" cx="131" cy="6.90002" r="4" fill="#f82969"></circle>
		</svg>
		<img class="brand" src="/app/img/brand.png?v=f7ff6c58ee76c1a3a7ed091510e9e288">
	</a>

	<div class="sidebar_main_wrapper scrollbar-outer SidebarScroll">
		<nav class="sidebar_navigation SidebarNav"><?php
			if($is_user_editor){ ?>
				<a href="/statistics" class="sidebar_navigation_item SidebarNavItem link Link"><span>Статистика</span></a>
				<a href="/event/add" class="sidebar_navigation_item SidebarNavItem link Link"><span>Создать событие</span></a><?php
			} ?>
			<a href="/feed" class="sidebar_navigation_item SidebarNavItem link Link"><span>События</span><span class="counter sidebar_navigation_counter -hidden SidebarNavFeedCounter"></span></a><?php
			if(!$is_user_not_auth){ ?>
				<a href="/friends" class="sidebar_navigation_item SidebarNavItem link Link"><span>Друзья</span><span class="counter sidebar_navigation_counter -hidden SidebarNavFriendsCounter"></span></a><?php
			} ?>
			<a href="/organizations" class="sidebar_navigation_item SidebarNavItem link Link"><span>Каталог организаторов</span></a>
		</nav>
		<hr class="sidebar_divider">
		<div class="sidebar_organizations_wrapper scrollbar-outer SidebarOrganizationsScroll"><?php
			if(!$is_user_not_auth){ ?>
				<div class="sidebar_wrapper">
					<span class="sidebar_section_heading">Подписки</span>
					<div class="sidebar_organizations_list SidebarOrganizationsList"></div>
				</div><?php
			} ?>
		</div>
	</div>

</aside>

<div class="modal_wrapper">
	<div class="modal_destroyer"></div>
</div>


<!-- =============== VENDOR SCRIPTS ===============-->
<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=5d62249ad946b3ba8b16654408edcd64" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=b288d8c972a95e500e9d055f34e8e94b" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=119c4c625740e81f7305b7eafaf874c2" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=795faed30858931cf0d65450149c37cb" charset="utf-8"></script><?php
}	?>

<?php
require 'templates.html';
require 'footer.php';
?>

</body>

</html>