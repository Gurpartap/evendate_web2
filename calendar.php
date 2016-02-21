<?php
    require_once 'v1-backend/bin/db.php';
    require_once 'v1-backend/bin/Class.Result.php';
    require_once 'v1-backend/users/Class.AbstractUser.php';
    require_once 'v1-backend/users/Class.User.php';
    try{
        $user = new User($__db);
        $add_event_btn_hidden = $user->isEditor() ? '' : 'hidden';
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
	<link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
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
<div class="wrapper">
    <aside class="aside">
        <!-- START Sidebar (left)-->
        <div class="aside-inner">
            <nav data-sidebar-anyclick-close="" class="sidebar">
                <div class="brand-name">
                    <div class="logo"><a title="Перейти к моей ленте" href="/timeline"><img src="app/img/logo_500.png"> Evendate</a></div>
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
                    <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn <?=$add_event_btn_hidden?>" data-controller="showAddEventModal">
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
    <section>
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
						<div class="add_event-app hidden screen-view" data-controller="AddEvent">
							<div class="page_viewport">
								<div class="page_wrapper">
									<div class="page shifted">
										<form class="form-horizontal" id="create-event-form">

											<h3>Новое мероприятие</h3>

											<h4 class="form_label"><label for="event_title">Название</label></h4>

											<div class="form_unit">
												<input id="event_title" class="form_input LimitSize" type="text" name="title" autocomplete="off" placeholder="Название мероприятия" data-maxlength="60">
												<p class="form_prompt">0/60</p>
											</div>

											<h4 class="form_label">Дата</h4>

											<div class="event_datepicker">
												<div class="EventDatesCalendar event_datepicker_calendar"></div>
												<div class="event_datepicker_form">
													<p>Выбраны даты:</p>
													<div class="selected_days EventSelectedDaysText"><p>Даты не выбраны</p></div>
													<div class="form_unit">
														<input id="different_time" class="form_checkbox" type="checkbox" name="checkbox" tabindex="-1">
														<label class="form_label" for="different_time"><span>Разное время каждый день</span></label>
													</div>
													<div class="form_group MainTime -parts_e_2">
														<div class="form_unit -inline">
															<label class="form_label">Начало</label>
															<div class="form_unit">
																<div class="form_group -time_input TimeInput">
																	<div class="form_unit">
																		<input class="form_input StartHours">
																	</div>
																	<span class="divider">:</span>
																	<div class="form_unit">
																		<input class="form_input StartMinutes">
																	</div>
																</div>
															</div>
														</div>
														<div class="form_unit -inline">
															<label class="form_label">Конец</label>
															<div class="form_unit">
																<div class="form_group -time_input TimeInput">
																	<div class="form_unit">
																		<input class="form_input EndHours">
																	</div>
																	<span class="divider">:</span>
																	<div class="form_unit">
																		<input class="form_input EndMinutes">
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div class="event_selected_days_wrapper">
												<div class="event_selected_days_content">
													<table class="event_selected_days_table">
														<colgroup>
															<col width="7%">
															<col width="21%">
															<col width="10%">
															<col width="31%">
															<col width="31%">
														</colgroup>
														<thead>
															<tr>
																<th></th>
																<th>День</th>
																<th></th>
																<th>Время начала</th>
																<th>Время конца</th>
															</tr>
														</thead>
														<tbody class="SelectedDaysRows">
														</tbody>
													</table>
													<div style="display: inline-block">
														<input id="new_date" type="hidden">
														<button class="button -color_default event_selected_days_add_date AddDayToTable DatePicker RippleEffect" type="button"><span>Добавить день</span></button>
													</div>
												</div>
											</div>

											<h4 class="form_label"><label for="add_event_placepicker">Место проведения</label></h4>

											<div class="form_group -parts_3_1">
												<div class="form_unit">
													<input class="form_input placepicker" id="add_event_placepicker" data-map-container-id="collapseOne">
												</div>
												<div class="form_unit">
													<button class="button -color_primary -fill RippleEffect" type="button" tabindex="-1">По умолчанию</button>
												</div>
											</div>
											<div id="collapseOne" class="collapse">
												<div class="placepicker-map thumbnail"></div>
											</div>

											<h4 class="form_label"><label>Описание</label></h4>

											<div class="form_unit">
												<textarea class="form_textarea LimitSize" data-maxlength="150"></textarea>
											</div>

											<h4 class="form_label">Регистрация</h4>

											<div class="form_unit">
												<input id="add_event_registration_needed" class="form_checkbox" type="checkbox" name="registration_needed">
												<label class="form_label" for="add_event_registration_needed"><span>Обязательная регистрация</span></label>
											</div>

											<p>Крайний срок регистрации до:</p>
											<div class="form_group -parts_2_3 RegistrationTill">
												<div class="form_unit -inline -status_disabled">
													<label class="form_label">Дата</label>
													<div class="form_select -v_centering DatePicker"><label>Дата</label><input type="hidden" disabled></div>
												</div>
												<div class="form_unit -status_disabled">
													<div class="form_group -parts_e_2">
														<div class="form_unit -inline -status_disabled">
															<label class="form_label">Время</label>
															<div class="form_unit -status_disabled">
																<div class="form_group -time_input TimeInput">
																	<div class="form_unit -status_disabled">
																		<input class="form_input" disabled>
																	</div>
																	<span class="divider">:</span>
																	<div class="form_unit -status_disabled">
																		<input class="form_input" disabled>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<h4 class="form_label"><label for="event_title">Ссылка на страницу мероприятия</label></h4>
											<div class="form_unit">
												<input id="event_title" class="form_input" type="text" name="title" autocomplete="off" placeholder="Ссылка">
											</div>

											<h4 class="form_label"><label for="event_tags">Теги</label></h4>
											<div class="form_unit">
												<input id="event_tags" class="form_input" type="text" name="title" autocomplete="off" >
											</div>

											<h4 class="form_label"><label for="event_tags">Обложка для мероприятия</label></h4>
											<div class="add_event_img_load_wrap form_group -parts_e_2">
												<div class="form_unit -centering">

													<div class="wrapper">
														<div class="form_unit">
															<label class="form_label">Загрузка по ссылке</label>
															<div class="-unite -parts_e_3">
																<input class="form_input" type="text" autocomplete="off" placeholder="Ссылка на изображение" name="h_image_url">
																<button class="button -color_primary RippleEffect" type="button" tabindex="-1">Загрузить</button>
															</div>
														</div>
														<div class="form_unit">
															<button class="button -color_primary RippleEffect FileLoadButton" type="button"><input class="hidden" type="file">Загрузить</button>
														</div>

													</div>

												</div>
												<div class="form_unit">
													<img src="http://www.gsati.com/sites/default/files/logo_dsa2lines.jpg">
												</div>
												<div class="form_unit">

												</div>
												<div class="form_unit">

												</div>
											</div>


											<h4 class="form_label"><label for="event_title">Уведомления для пользователей</label></h4>
											<div class="form_group -parts_2_3">

												<div class="form_unit">
													<div class="form_select -v_centering DatePicker"><label>Дата</label><input type="hidden"></div>
												</div>

												<div class="form_unit -inline">
													<label class="form_label">Точное время</label>
													<div class="form_unit">
														<div class="form_group -time_input TimeInput">
															<div class="form_unit">
																<input class="form_input">
															</div>
															<span class="divider">:</span>
															<div class="form_unit">
																<input class="form_input">
															</div>
														</div>
													</div>
												</div>

											</div>

											<h4 class="form_label"></h4>

											<div class="form_group -parts_e_2">

												<div class="form_unit">
													<input id="add_event_delayed_publication" class="form_checkbox" type="checkbox" name="delayed_publication">
													<label class="form_label" for="add_event_delayed_publication"><span>Отложенная публикация</span></label>
												</div>

												<div class="form_unit DelayedPublication -status_disabled">

													<div class="form_unit -inline">
														<label class="form_label">Дата</label>
														<div class="form_select -v_centering DatePicker"><label>Дата</label><input type="hidden" disabled></div>
													</div>

													<div class="form_unit -inline">
														<label class="form_label">Точное время</label>
														<div class="form_unit">
															<div class="form_group -time_input TimeInput">
																<div class="form_unit">
																	<input class="form_input" disabled>
																</div>
																<span class="divider">:</span>
																<div class="form_unit">
																	<input class="form_input" disabled>
																</div>
															</div>
														</div>
													</div>

												</div>
											</div>

											<div class="form_unit" align="center">
												<button id="add_event_submit" class="button -color_alternative" type="button">Опубликовать</button>
											</div>

										</form>
									</div>
								</div>
							</div>
							<div class="image-cropper-wrapper hidden">
								<div class="image-cutter">
									<img src="">

									<div class="whirl duo image-cropper"></div>
									<a href="#" class="btn btn-pink img-crop-btn disabled hidden"> Кадрировать</a>
									<a href="#" class="btn btn-pink-empty img-crop-cancel hidden"> Отмена</a>
								</div>
							</div>
						</div>
						<!-- END row-->
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
<!-- PACE -->
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
<script src="app/js/Class.DatePicker.js"></script>
<script src="app/js/main.js"></script>


<?php
require 'templates.html';
require 'footer.php';
?>

</body>

</html>