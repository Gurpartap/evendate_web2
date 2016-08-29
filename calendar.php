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
    if ($_REQUEST['q'] != 'onboarding' && !isset($_REQUEST['skip_onboading'])) {
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
    } else if ($_REQUEST['q'] == 'onboarding' && isset($_COOKIE['skip_onboading'])) {
        header('Location: /feed?skip_onboading');
    } else if ($_REQUEST['q'] == 'onboarding' && !isset($_COOKIE['skip_onboading'])) {
        setcookie('onboarding', true, strtotime("+7 days"));
    }
} catch (Exception $e) {
    header('Location: /');
}
$user_full_name = $user->getLastName() . ' ' . $user->getFirstName(); ?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Evendate</title>
    <!-- =============== VENDOR STYLES ===============-->
    <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,400,400italic,500,500italic,700,700italic&subset=latin,cyrillic"
        rel="stylesheet" type="text/css">
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
    <link rel="stylesheet" href="/app/css/add_organization.css">

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
                    <h1 id="page_title" class="-unselectable">

                    </h1>
                    <div id="search_bar">
                        <input id="search_bar_input" class="search-input" type="text"
                               placeholder="Поиск мероприятий, организаторов и друзей">
                        <label class="search_block_icon fa_icon fa-search -empty" for="search_bar_input"></label>
                        <button class="search_block_icon adv_search_button fa_icon fa-sliders -empty -hidden"
                                type="button"></button>
                    </div>
                </div>
                <div id="user_bar" class="-unselectable">
                    <div class="avatar_block -align_right -size_small">
                        <span class="avatar_name" title="<?= $user_full_name ?>"><?= $user_full_name ?></span>
                        <div class="avatar -rounded -bordered"><img src="<?= $user->getAvatarUrl() ?>"></div>
                    </div>
                    <div class="user_bar_forhead">
                        <div class="avatar_block -align_right -size_small">
                            <span class="avatar_name" title="<?= $user_full_name ?>"><?= $user_full_name ?></span>
                            <div class="avatar -rounded -bordered"><img src="<?= $user->getAvatarUrl() ?>"></div>
                        </div>
                        <div class="user_bar_buttons">
                            <button class="button -color_neutral RippleEffect OpenSettingsButton Controller"
                                    type="button" data-controller="showSettingsModal"><span class="Text fa_icon fa-cog">Настройки</span>
                            </button>
                            <button class="button -color_neutral_accent RippleEffect LogoutButton" type="button"><span
                                    class="Text">Выйти</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="main_header_bottom">
            <div class="page_wrapper HeaderTabsWrapper"></div>
        </div>
    </header>
    <div id="main_section">

        <!-- START row-->
        <div class="friends-app app_view -hidden PageView" data-controller="Friends">
            <div class="page_wrapper" style="padding-top: 100px;">

                <div class="no-friends-block hidden">
                    <div class="no-friends-text">Ваших друзей пока нет в Evendate</div>
                    <div class="subtitle">Вы можете пригласить их</div>
                    <div class="share">
                        <p class="social-links">
                            <a class="fa fa-vk" target="_blank"
                               href="http://vk.com/share.php?url=http://evendate.ru/&title=Evendate.ru - будь в курсе событий&description=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&image=http://evendate.ru/app/img/logo_500.png&noparse=false"
                               data-share-type="vk"></a>
                            <a class="fa fa-facebook-f" target="_blank"
                               href="http://www.facebook.com/sharer.php?s=100&p[title]=Evendate.ru - будь в курсе событий&p[summary]=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&p[url]=http://evendate.ru/&p[images][0]=http://evendate.ru/app/img/logo_500.png"
                               data-share-type="facebook"></a>
                            <a class="fa fa-twitter" target="_blank"
                               href="https://twitter.com/share?url=http://evendate.ru/event.php?id={id}&text=Я пользуюсь Evendate, чтобы не пропустить интересные события в своих любимых местах.&via=evendate.ru&hashtags=#events #Москва #evendate"
                               data-share-type="twitter"></a>
                        </p></div>
                </div>
                <div class="friends-main-content hidden">

                    <div class="load-more-btn hidden" data-page-number="0">
                        <button class="btn btn-lg disabled btn-pink-empty"> Загрузить еще...</button>
                    </div>
                </div>
                <div class="one-friend-profile one-friend-main-content"></div>

                <div class="friends-right-bar hidden">
                    <div class="friends-bar-header">
                        Друзья <span class="label label-blue friends-count"></span>
                    </div>
                    <div class="friends-list">
                    </div>
                </div>
            </div>
        </div>
        <!-- END row-->

        <!-- START row-->
        <div class="search-app app_view -hidden PageView" data-controller="Search">
						<div class="page_wrapper"></div>
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
        <div class="organizations-app app_view -hidden PageView" data-controller="OrganizationsList">
            <div class="page_wrapper"></div>
        </div>
        <!-- END row-->

        <!-- START row-->
        <div class="organization-app app_view -hidden PageView" data-controller="Organization">
            <div class="page_wrapper"></div>
        </div>
        <!-- END row-->

        <!-- START row-->
        <div class="onboarding-app app_view -hidden PageView" data-controller="Onboarding">
            <div class="page_wrapper"></div>
        </div>
        <!-- END row-->

        <!-- START row-->
        <div class="statistics-app app_view -hidden PageView" data-controller="Statistics">
            <div class="page_wrapper"></div>
        </div>

        <!-- START row-->
        <div class="add-organization-app app_view -hidden PageView" data-controller="AddOrganization">
            <div class="page_wrapper"></div>
        </div>

    </div>
</div>

<aside id="main_sidebar" class="-unselectable">
    <div class="brand_block Controller" data-page="feed" data-tab_state="timeline" data-title="События">
        <svg width="135px" height="24.70001px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 24.70001">
            <path id="evendate_logo_text" transform="translate(-2.375 -0.69998)" fill="#9fa6b3"
                  d="M18.675,16.4c0-5.3-3-8.5-8.1-8.5a8.42015,8.42015,0,0,0-8.2,8.7,8.38058,8.38058,0,0,0,8.5,8.8,7.55515,7.55515,0,0,0,7.5-5.2l-3.7-1.2a3.57051,3.57051,0,0,1-3.7,2.5,3.98288,3.98288,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,18.675,16.4Zm-11.8-1.6a3.55717,3.55717,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Zm24.3-6.3-3.9,11-4.1-11h-4.9l6.7,16.4h4.4l6.5-16.4h-4.7Zm20.6,7.9c0-5.3-3-8.5-8.1-8.5a8.25038,8.25038,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55522,7.55522,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98293,3.98293,0,0,1-4.1-3.7h11.7A13.79661,13.79661,0,0,0,51.775,16.4Zm-11.7-1.6a3.55712,3.55712,0,0,1,3.7-3.2,3.36289,3.36289,0,0,1,3.7,3.2h-7.4ZM62.975,8a5.385,5.385,0,0,0-4.7,2.5v-2h-4.3V24.9h4.4V15.4c0-1.9,1.1-3.4,3.1-3.4,2.1,0,3,1.4,3,3.3v9.6h4.4V14.5C68.875,10.9,66.975,8,62.975,8Zm24.8,13.9V0.7h-4.4v9.4c-0.5-.9-1.8-2-4.6-2-4.6,0-7.9,3.8-7.9,8.6,0,5,3.3,8.6,8,8.6a5.101,5.101,0,0,0,4.6-2.3,7.75394,7.75394,0,0,0,.2,1.9h4.2A26.28237,26.28237,0,0,1,87.775,21.9Zm-8.3-.6c-2.4,0-4.1-1.8-4.1-4.7s1.8-4.6,4.1-4.6,4,1.6,4,4.6S81.675,21.3,79.475,21.3Zm25.2,1V14.2c0-3.3-1.9-6.2-7.1-6.2-4.4,0-6.8,2.8-7,5.4l3.9,0.8a2.92541,2.92541,0,0,1,3.1-2.7c1.9,0,2.8,1,2.8,2.1a1.19858,1.19858,0,0,1-1.2,1.2l-4,.6c-2.8.4-5,2-5,5,0,2.6,2.1,4.9,5.6,4.9a5.40058,5.40058,0,0,0,4.8-2.4,12.30577,12.30577,0,0,0,.2,2h4.1A18.36784,18.36784,0,0,1,104.675,22.3Zm-4.3-4.2c0,3-1.8,3.9-3.6,3.9a1.89565,1.89565,0,0,1-2.1-1.9,2.094,2.094,0,0,1,2-2.1l3.7-.6v0.7Zm16.3-5.8V8.5h-3.3V3.6h-4.1V5.9a2.33883,2.33883,0,0,1-2.5,2.6h-0.8v3.9h3V20c0,3.2,2,5.1,5.2,5.1a5.9567,5.9567,0,0,0,2.5-.4V21a4.92317,4.92317,0,0,1-1.4.1,1.61828,1.61828,0,0,1-1.9-1.9V12.3h3.3Zm17.2,4.1a10.91279,10.91279,0,0,0-.47-3.3h-0.03a5.49026,5.49026,0,0,1-5.47-4.98,9.60458,9.60458,0,0,0-2.13-.22,8.25043,8.25043,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55517,7.55517,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98284,3.98284,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,133.875,16.4Zm-11.7-1.6a3.55721,3.55721,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Z"></path>
            <circle id="evendate_logo_dot" cx="131" cy="6.90002" r="4" fill="#f82969"></circle>
        </svg>
        <img class="brand" src="/app/img/brand.png">
    </div>

    <div class="sidebar_main_wrapper scrollbar-outer SidebarScroll">
        <nav class="sidebar_navigation SidebarNav">
            <div class="sidebar_navigation_item -hidden SidebarNavItem Controller" data-page="statistics/overview"
                 data-title="Статистика"><span>Статистика</span></div>
            <div class="sidebar_navigation_item <?= $edit_event_btn_hidden ?> SidebarNavItem Controller"
                 data-page="edit_event" data-title="Создать событие">
                <span>Создать событие</span>
            </div>
            <div class="sidebar_navigation_item SidebarNavItem Controller" data-page="feed" data-tab_state="actual"
                 data-title="События">
                <span>События</span>
                <span class="counter sidebar_navigation_counter -hidden SidebarNavFeedCounter">50</span>
            </div>
            <div class="sidebar_navigation_item SidebarNavItem Controller" data-page="friends" data-title="Друзья">
                <span>Друзья</span>
                <span class="counter sidebar_navigation_counter -hidden SidebarNavFriendsCounter"></span>
            </div>
            <div class="sidebar_navigation_item SidebarNavItem Controller" data-page="organizations"
                 data-title="Организации"><span>Каталог организаторов</span></div>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>
<script type="text/javascript" src="/app/js/app.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/Class.Calendar.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/Class.DatePicker.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/Class.Modal.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/main.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/calendar.js" charset="utf-8"></script>
<script type="text/javascript" src="/app/js/add_organization.js" charset="utf-8"></script>


<?php
require 'templates.html';
require 'footer.php';
?>

</body>

</html>