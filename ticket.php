<?php


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
require_once "{$BACKEND_FULL_PATH}/events/Class.EventsCollection.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.Event.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.NotAuthorizedUser.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.User.php";
/*
require_once "{$BACKEND_FULL_PATH}/vendor/Mobile_Detect/Mobile_Detect.php";
$detect = new Mobile_Detect();

if ($detect->isMobile() && !isset($_GET['full_version'])){
	header('Location: /mobile?from=' . urlencode($_SERVER['REQUEST_URI']));
}*/

if (App::$ENV == 'prod' || App::$ENV == 'test') {
	$DEBUG_MODE = isset( $_GET['debug'] ) ? true : false;
} else {
	$DEBUG_MODE = true;
	ini_set("display_errors", 1);
	error_reporting(E_ALL);
}
App::buildGlobal($__db);

try {
	$user = new User($__db);
} catch (Exception $e) {
	$user = App::getCurrentUser();
}

$is_user_not_auth = $user instanceof NotAuthorizedUser;
if ($is_user_not_auth) {
	$is_user_editor = false;
	$user_full_name = '';
} else {
	$is_user_editor = $user->isEditor();
	$user_full_name = $user->getLastName() . ' ' . $user->getFirstName();
}
$url = parse_url($_SERVER['REQUEST_URI'])['path'];
$url_parts = explode('/', $url);
?>
<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Evendate</title>

	<?php
	require_once( 'parts/styles.php' );
	?>

	<?php
	try {
		if (count($url_parts) > 2) {
			switch ($url_parts[1]) {
				case 'organization': {
					$item = OrganizationsCollection::one($__db, $user, intval($url_parts[2]), array('description', 'subscribed_count'));
					$data = array(
						'title' => htmlspecialchars($item->getName()),
						'description' => htmlspecialchars($item->getName() . ' в Evendate это больше ' . $item->getSubscribedCount() . ' подписчиков и самые интересные события! ' . $item->getDescription()),
						'image' => htmlspecialchars($item->getBackgroundImgUrl())
					);
					break;
				}
				case 'event': {
					$item = EventsCollection::one($__db, $user, intval($url_parts[2]), array('description', 'organization_short_name'));
					$params = $item->getParams($user, array('title', 'description', 'organization_short_name'))->getData();
					$data = array(
						'title' => htmlspecialchars($params['title'] . ' в ' . $params['organization_short_name'] . ' на Evendate'),
						'description' => htmlspecialchars($params['description']),
						'image' => htmlspecialchars($params['image_horizontal_url'])
					);
					break;
				}
				case 'organizations': {
					$data = array(
						'title' => htmlspecialchars('Каталог организаторов Evendate'),
						'description' => htmlspecialchars('Сотни организаций публикуют свои события на Evendate. Не пропускайте ничего важного и интересного вокруг.'),
						'image' => htmlspecialchars('https://evendate.ru/app/img/brand_2560x1600.jpg')
					);
					break;
				}
			}
			if (isset($data)) {
				$current_url = App::getVar('schema') . "$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
				echo "
			<meta name=\"twitter:card\" content=\"summary\" />
			<meta name=\"twitter:description\" content=\"{$data['description']}\">
    	<meta name=\"twitter:app:country\" content=\"RU\">
    	<meta name=\"twitter:app:name:iphone\" content=\"Evendate\">
    	<meta name=\"twitter:app:id:iphone\" content=\"1044975200\">
    	<meta name=\"twitter:app:name:ipad\" content=\"Evendate\">
    	<meta name=\"twitter:app:name:googleplay\" content=\"Evendate\">
    	<meta name=\"twitter:app:id:googleplay\" content=\"ru.evendate.android\">

    	<meta property=\"og:url\" content=\"{$current_url}\">
    	<meta property=\"og:title\" content=\"{$data['title']}\">
    	<meta property=\"og:description\" content=\"{$data['description']}\">
    	<meta property=\"og:image\" content=\"{$data['image']}\"/>";
			}
		}
	} catch (Exception $e) {
//		header('Location: /');
	}

	?>

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

<?php
require_once( 'parts/sidebar.php' );
?>
<div id="main_overlay">
  <header id="main_header">
    <div id="main_header_top">
			<div class="page_wrapper">
				<div id="main_header_overlay" class="TopBarOverlay">

					<div class="main_header_wrapper">

						<button id="sidebar_burger" class="header_button fa_icon fa-bars -empty SidebarBurger"></button>
						<div id="page_title" class="-unselectable"></div>

					</div>
					<div class="main_header_wrapper">

						<div id="search_block" class="TopBarSearchBar">
							<div id="search_bar">
								<input id="search_bar_input" class="form_input -rounded TopBarSearchInput" type="text" placeholder="Поиск мероприятий и организаторов">
								<button id="search_block_button" class="header_button fa_icon fa-search -empty TopBarSearchButton" type="button"></button>
							</div>
						</div><?php

						if ($is_user_not_auth) { ?>
							<div id="header_login_block">
								<button class="button login_button -size_low -color_neutral_accent RippleEffect LoginButton" type="button">
									<span class="Text">Войти</span>
								</button>
							</div><?php
						} else { ?>
							<div id="user_bar" class="-unselectable">
								<a class="avatar -size_40x40 -rounded -bordered Link" href="/my/profile"><img src="<?= $user->getAvatarUrl() ?>" title="<?= $user_full_name ?>"></a>
							</div><?php
						} ?>

					</div>

				</div>
			</div>

			<div class="page_wrapper -hidden">
				<div id="title">
					<button class="sidebar_burger fa_icon fa-bars -empty"></button>
					<div id="page_title" class="-unselectable"></div>
				</div>
				<div id="search_bar_wrapper">
					<button class="search_block_icon fa_icon fa-search -empty"></button>
					<div id="search_bar">
						<input id="search_bar_input" class="form_input -rounded" type="text" placeholder="Поиск мероприятий, организаторов и друзей">
						<button class="search_block_icon adv_search_button fa_icon fa-sliders -empty -hidden" type="button"></button>
					</div>
				</div><?php
				if ($is_user_not_auth) { ?>
					<div id="header_login_block">
						<button class="button login_button -size_low -color_neutral_accent RippleEffect LoginButton" type="button">
							<span class="Text">Войти</span>
						</button>
					</div><?php
				} else { ?>
					<a id="user_bar" href="/my/profile" class="-unselectable link Link">
						<div class="avatar_block -align_right -size_small">
							<span class="avatar_name" title="<?= $user_full_name ?>"><?= $user_full_name ?></span>
							<div class="avatar -rounded -bordered"><img src="<?= $user->getAvatarUrl() ?>"></div>
						</div>
					</a><?php
				} ?>
			</div>
    </div>
    <div id="main_header_bottom">
      <div class="page_wrapper HeaderTabsWrapper"></div>
    </div>
  </header>
  <div id="main_section">
		<div class="app_inspectors_wrapper AppInspectorsWrapper"></div>
    <div class="app_view PageView">
			<div class="page_wrapper -fadeable">
				<header class="ticket_page_header">
					<h2 class="ticket_page_title">Электронный билет на событие</h2>
					<h3 class="ticket_page_subtitle">
						<span>Вы можете распечатать этот билет, либо воспользоваться нашим приложением для</span>
						<a class="-text_color_accent" href="https://itunes.apple.com/us/app/evendate/id1044975200?mt=8" target="_blank">iOS</a><span> или </span>
						<a class="-text_color_accent" href="https://play.google.com/store/apps/details?id=ru.evendate.android" target="_blank">Android</a><span>.</span>
					</h3>
					<button class="button -size_huge -color_accent Print" type="button">Распечатать билет</button>
				</header>
				<div class="ticket_page print_page material -floating_material"><?php
					require_once('print_ticket.php');	?>
				</div>
			</div>
    </div>
		<div id="main_section_cap" class="MainSectionCap"></div>

  </div>
</div>

<div id="download_app_band" class="material -floating_material DownloadAppBand">
	<div id="download_app_wrapper">
		<span>Скачайте приложение прямо сейчас!</span>
		<a href="https://itunes.apple.com/us/app/evendate/id1044975200?mt=8" class="button -color_default fa_icon fa-apple -empty"></a>
		<a href="https://play.google.com/store/apps/details?id=ru.evendate.android" class="button -color_default fa_icon fa-android -empty"></a>
	</div>
	<button id="download_app_close_button" class="CloseDownloadAppBand" type="button">&times;</button>
</div>

<div class="modal_wrapper">
  <div class="modal_destroyer"></div>
</div>

<?php
require_once( 'parts/scripts.php' );
require_once( 'dist/templates.html' );
require_once( 'footer.php' );
?>

</body>

</html>