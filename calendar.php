<?php
    require_once 'v1-backend/bin/db.php';
    require_once 'v1-backend/bin/Class.Result.php';
    require_once 'v1-backend/users/Class.AbstractUser.php';
    require_once 'v1-backend/users/Class.User.php';
    try{
        $user = new User($__db);
        $edit_event_btn_hidden = $user->isEditor() ? '' : 'hidden';
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
<div class="wrapper">
    <aside class="aside">
        <!-- START Sidebar (left)-->
        <div class="aside-inner">
            <nav data-sidebar-anyclick-close="" class="sidebar">
                <div class="brand-name">
                    <div class="logo"><a title="Перейти к моей ленте" href="/timeline"><img src="/app/img/logo_500.png"> Evendate</a></div>
                </div>
                <!-- END user info-->
                <ul class="nav">
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
                    <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="timeline">
                        <i class="icon-home"></i> <span>Моя лента</span>
                    </a>
                    <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn <?=$edit_event_btn_hidden?>" data-page="edit_event">
                        <i class="icon-note"></i> <span>Создать событие</span>
                    </a>
                    <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="favorites">
                        <i class="icon-pin"></i> <span>Избранное</span>
                    </a>
                    <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="organizations">
                        <i class="icon-list"></i> <span>Организаторы</span>
                    </a>
                    <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="friends">
                        <i class="icon-people"></i> <span>Мои друзья</span>
                    </a>
                    <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-controller="showSettingsModal">
                        <i class="icon-settings"></i> <span>Настройки</span>
                    </a>
                    <span class="side-block-container">Подписки</span>
                    <div class="organizations-list">

                    </div>
                </ul>
                <!-- END sidebar nav-->
            </nav>
        </div>
        <!-- END Sidebar (left)-->
    </aside>
    <!-- Main section-->
    <section id="main_section">
        <!-- Page content-->
        <div class="content-wrapper">
            <div class="head-row col-xs-10 header blurheader">
                <div class="col-md-4 col-xs-2"></div>
                <div class="col-md-4 col-xs-4">
                    <input type="text" class="form-control search-input" placeholder="Поиск мероприятий, огранизаций, #тегов">
                </div>
                <div class="col-lg-2 col-md-4 col-xs-4 pull-right user-info-block <?=$profile_is_editor?>">
                    <img class="pull-left" src="<?=$user->getAvatarUrl()?>" title="<?=$user->getLastName() . ' ' . $user->getFirstName()?>">
                    <div class="user-name">
                        <div class="log-out-icon pull-right">
                            <i class="icon-login"></i>
                        </div>
                        <p class="header-user-name"> <?=$user->getLastName() . ' ' . $user->getFirstName()?></p>
<!--                        <div class="label label-blue">Редактор</div>-->
                    </div>
                </div>
            </div>
					<div id="notification" class="-centering">
						<span id="notification_text"></span>
					</div>
            <!-- START row-->
            <div class="calendar-app hidden screen-view">
                <div class="row main-row">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-12" data-controller="MyTimeline">
                                <!-- START panel-->
                                <div class="timeline-wrapper">
                                    <div id="tl-outer-wrap" class="tl-outer-wrap hidden"><hr class="timeline"></div><div id="blocks-outer-wrap" class="blocks-outer-wrap"></div>
                                </div>
                                <!-- END panel-->
                            </div>
                        </div>
                    </div>
                    <div class="load-more-btn hidden" data-page-number="0">
                        <button class="btn btn-lg disabled btn-pink-empty"> Загрузить еще... </button>
                    </div>
                </div>
                <div class="row sad-eve hidden">
                    <img src="/app/img/sad_eve.png" title="Как насчет того, чтобы подписаться на организации?">
                    <div class="alert alert-black-blue">Событий для показа пока нет. Рекомендуем
                        <a href="#" class="show-organizations-btn">подписаться на новые организации.</a>
                    </div>
                </div>
            </div>
            <!-- END row-->

            <!-- START row-->
            <div class="day-app hidden screen-view">
                <div class="row main-row">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-12" data-controller="OneDay">
                                <!-- START panel-->
                                <div class="timeline-wrapper">
                                    <div id="tl-outer-wrap" class="tl-outer-wrap hidden"><hr class="timeline"></div><div id="blocks-outer-wrap" class="blocks-outer-wrap"></div>
                                </div>
                                <!-- END panel-->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row sad-eve hidden">
                    <img src="/app/img/sad_eve.png" title="Как насчет того, чтобы подписаться на организации?">
                    <div class="alert alert-black-blue">Событий для показа нет. Рекомендуем
                        <a href="#" class="show-organizations-btn">подписаться на новые организации.</a>
                    </div>
                </div>
            </div>
            <!-- END row-->

            <!-- START row-->
            <div class="organizations-app hidden screen-view" data-controller="OrganizationsList">
                <div class="new-organizations-categories">
                    <div class="new-categories-title">Категории</div>
                    <div class="new-organizations-categories-wrapper"></div>
                </div>
                <div class="new-organizations-list"></div>
            </div>
            <!-- END row-->

            <!-- START row-->
            <div class="friends-app hidden screen-view" data-controller="Friends">
                <div class="row">
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
            </div>
            <!-- END row-->

            <!-- START row-->
            <div class="search-app hidden screen-view" data-controller="Search">
                <div class="search-organizations"></div>
                <div class="search-events"></div>
            </div>
            <!-- END row-->

            <!-- START row-->
            <div class="favorites-app hidden screen-view">
                <div class="row main-row">
                    <div class="col-md-12">
                        <div class="row">
                            <div class="col-md-12" data-controller="FavoredEvents">
                                <!-- START panel-->
                                <div class="timeline-wrapper">
                                    <div id="tl-outer-wrap" class="tl-outer-wrap hidden"><hr class="timeline"></div><div id="blocks-outer-wrap" class="blocks-outer-wrap"></div>
                                </div>
                                <!-- END panel-->
                            </div>
                        </div>
                    </div>
                    <div class="load-more-btn hidden" data-page-number="0">
                        <button class="btn btn-lg disabled btn-pink-empty"> Загрузить еще... </button>
                    </div>
                </div>
                <div class="row sad-eve hidden">
                    <div class="alert alert-black-blue"> Избранные закончились. Вы можете выбрать новые <a href="#" class="show-timeline-btn">в ленте</a>
                    </div>
                </div>
            </div>
            <!-- END row-->

					<!-- START row-->
					<div class="edit_event-app hidden screen-view" data-controller="EditEvent">
						<div class="page_viewport">
							<div class="page_wrapper">
							</div>
						</div>
					</div>
						<!-- END row-->

					<!-- START row-->
					<div class="event-app hidden screen-view" data-controller="OneEvent">
						<div class="page_viewport">
							<div class="page_wrapper">
							</div>
						</div>
					</div>

					<!-- START row-->
					<div class="organization-app hidden screen-view" data-controller="Organization">
						<div class="page_viewport">
							<div class="page_wrapper">
							</div>
						</div>
					</div>
						<!-- END row-->

					<div class="example-app hidden screen-view" data-controller="Example">
						<div class="page_wrapper">
							<div class="page">
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
        </div>
    </section>

	<div class="modal_wrapper">
		<div class="modal_destroyer"></div>
	</div>
</div>
<!-- Button trigger modal -->

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
<script type="text/javascript" src="/app/js/add.js" charset="utf-8"></script>


<?php
require 'templates.html';
require 'footer.php';
?>

</body>

</html>