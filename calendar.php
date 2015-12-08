<?php
	require_once 'backend/bin/db.php';
	require_once 'backend/bin/Class.Result.php';
	require_once 'backend/users/Class.AbstractUser.php';
	require_once 'backend/users/Class.User.php';
	require_once 'backend/tags/Class.TagsCollection.php';
    try{
        $user = new User($db);
        $add_event_btn_hidden = $user->isEditor() ? '' : 'hidden';
        $profile_is_editor = $user->isEditor() ? 'is-editor' : '';
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
   <!-- FONT AWESOME-->
   <link rel="stylesheet" href="vendor/fontawesome/css/font-awesome.min.css">
   <!-- SIMPLE LINE ICONS-->
   <link rel="stylesheet" href="vendor/simple-line-icons/css/simple-line-icons.css">
   <!-- ANIMATE.CSS-->
   <link rel="stylesheet" href="vendor/animate.css/animate.min.css">
   <!-- WHIRL (spinners)-->
   <link rel="stylesheet" href="vendor/whirl/dist/whirl.css">
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
	<!-- DATERANGEPICKER-->
	<link rel="stylesheet" href="vendor/daterangepicker/daterangepicker.css">
	<!-- Pace -->
	<link rel="stylesheet" href="vendor/pace/pace.css">
	<!-- SELECT2 -->
    <link href="vendor/select2v3/select2.css" rel="stylesheet" />
    <link href="vendor/select2v3/select2-bootstrap.css" rel="stylesheet" />
    <!--<link href="vendor/select2/css/select2.css" rel="stylesheet" />-->
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
                           <i class="icon-list"></i> <span>Каталог организаций</span>
                       </a>
                       <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-page="friends">
                           <i class="icon-list"></i> <span>Мои друзья</span>
                       </a>
                       <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button menu-btn" data-controller="showSettingsModal">
                           <i class="icon-settings"></i> <span>Настройки</span>
                       </a>
<!--                       <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button hidden show-statistics-btn --><?//=$add_event_btn_hidden?><!--" data-page="statistics">-->
<!--                           <span>Статистика</span>-->
<!--                       </a>-->
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
                         <div class="label label-blue">Редактор</div>
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
             <div class="friends-app hidden screen-view" data-controller="FriendsList">

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
   <script src="http://<?=App::$DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
   <script src="app/js/app.js"></script>
   <script src="app/js/calendar.js"></script>
   <script src="app/js/add.js"></script>


<?php
    require 'templates.html';
    require 'footer.php';
?>

</body>

</html>