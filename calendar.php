<?php
	require_once 'backend/bin/db.php';
	require_once 'backend/bin/Class.Result.php';
	require_once 'backend/users/Class.AbstractUser.php';
	require_once 'backend/users/Class.User.php';
	require_once 'backend/tags/Class.TagsCollection.php';
	$user = new User($db);
    $add_event_btn_hidden = $user->isEditor() ? '' : 'hidden';
?>
<!DOCTYPE html>
<html lang="ru">

<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
   <title>Evendate</title>
   <!-- =============== VENDOR STYLES ===============-->
    <!-- Google ROBOTO-->
    <link href='http://fonts.googleapis.com/css?family=Roboto&subset=latin,cyrillic-ext' rel='stylesheet' type='text/css'>
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
   <link rel="stylesheet" href="vendor/cropper/css/cropper.min.css">
   <!-- =============== BOOTSTRAP STYLES ===============-->
   <link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
	<!-- Loaders.css-->
	<link rel="stylesheet" href="app/vendor/loaders.css/loaders.css">
   <!-- =============== APP STYLES ===============-->
   <link rel="stylesheet" href="app/css/app.css" id="maincss">
	<!-- DATERANGEPICKER-->
	<link rel="stylesheet" href="vendor/daterangepicker/daterangepicker.css">
	<!-- Pace -->
	<link rel="stylesheet" href="vendor/pace/pace.css">
	<!-- SELECT2 -->
    <link href="vendor/select2/css/select2.css" rel="stylesheet" />
</head>

<body>
   <div class="wrapper">
	   <aside class="aside">
		   <!-- START Sidebar (left)-->
		   <div class="aside-inner">
			   <nav data-sidebar-anyclick-close="" class="sidebar">
				   <!-- START sidebar nav-->
                   <!-- START user info-->
                   <div class="user-info">
                       <div class="col-md-3">
                           <img src="<?=$user->getAvatarUrl()?>" alt="Avatar" class="img-thumbnail img-circle">
                       </div>
                       <div class="col-md-8">
                           <span class="user-block-name"><?=$user->getFirstName().' '.$user->getLastName()?></span>
                           <span class="user-is-editor label label-black-blue <?=$add_event_btn_hidden?>">Редактор</span>
                       </div>
                       <div class="col-xs-1 log-out-icon">
                           <i class="fa fa-sign-out"></i>
                       </div>
                   </div>
                   <!-- END user info-->
				   <ul class="nav">
					   <!-- Iterates over all sidebar items-->
                       <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button active show-my-timeline-btn">
                           <span>Моя лента</span>
                       </a>
					   <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button create-event-menu-btn <?=$add_event_btn_hidden?>">
						   <span>Создать событие</span>
					   </a>
                       <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button show-organizations-btn">
                           <span>Каталог организаций</span>
                       </a>
                       <div class="panel side-calendar-panel">
                           <div class="panel-body">
                               <button type="button" class="btn btn-xs btn-black-blue pressed prev-button">
                                   <span class="fa fa-chevron-left"></span>
                               </button>
                               <span id="month-name"></span>
                               <button type="button" class="btn btn-xs btn-black-blue pressed next-button">
                                   <span class="fa fa-chevron-right"></span>
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
					   <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button show-favorites-btn">
						   <span>Избранное</span>
					   </a>
                       <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button">
                           <span>Настройки</span>
                       </a>
                       <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button hidden show-statistics-btn <?=$add_event_btn_hidden?>">
                           <span>Статистика</span>
                       </a>
					   <span class="side-block-container">Подписки</span>
                       <div class="whirl duo organizations-loading"></div>
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
                 <div class="col-sm-4"></div>
                 <div class="col-sm-4">
                     <input type="text" class="form-control search-input" placeholder="Поиск мероприятий, огранизаций, #тегов">
                 </div>
                 <div class="col-sm-2">
                     <span class="help-block m-b-none advanced-search-text hidden">Расширенный поиск</span>
                 </div>
             </div>
            <!-- START row-->
            <div class="calendar-app screen-view">
               <div class="row main-row">
                 <div class="col-md-12">
                   <div class="row">
                     <div class="col-md-12">
                       <!-- START panel-->
                         <div id="wrapper" class="timeline-wrapper">
                             <div id="tl-outer-wrap" class="tl-outer-wrap"><hr id="timeline" class="timeline"></div><div id="blocks-outer-wrap" class="blocks-outer-wrap"></div>
                         </div>
                       <!-- END panel-->
                     </div>
                   </div>
                 </div>
               </div>
                <div class="row sad-eve hidden">
                    <img src="/app/img/sad_eve.png" title="Как насчет того, чтобы подписаться на организации?">
                    <div class="alert alert-black-blue">Событий для показа пока нет. Можем рекомендовать
                        <a href="#" class="show-organizations-btn">подписаться на новые организации.</a>
                    </div>
                </div>
               <!-- END row-->
            </div>
             <div class="organizations-app hidden screen-view">
             </div>

             <div class="search-app hidden screen-view">
                 <div class="search-organizations"></div>
                 <div class="search-events"></div>
             </div>

             <div class="favorites-app hidden screen-view">
                 <div class="row main-row">
                     <div class="col-md-12">
                         <div class="row">
                             <div class="col-md-12">
                                 <!-- START panel-->
                                 <div class="wrapper timeline-wrapper">
                                     <div class="tl-outer-wrap"><hr class="timeline"></div><div class="blocks-outer-wrap"></div>
                                 </div>
                                 <!-- END panel-->
                             </div>
                         </div>
                     </div>
                 </div>
                 <div class="row no-favorites hidden">
                     <div class="alert alert-black-blue">События в избранном отсутсвуют.
                     </div>
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
   <!-- STORAGE API-->
   <script src="vendor/jQuery-Storage-API/jquery.storageapi.js"></script>
   <!-- JQUERY EASING-->
   <script src="vendor/jquery.easing/js/jquery.easing.js"></script>
   <!-- ANIMO-->
   <script src="vendor/animo.js/animo.js"></script>
   <!-- SLIMSCROLL-->
   <script src="vendor/slimScroll/jquery.slimscroll.min.js"></script>
   <!-- LOCALIZE-->
   <script src="vendor/jquery-localize-i18n/dist/jquery.localize.js"></script>
   <!-- IMG CROPPER-->
   <script src="vendor/cropper/js/cropper.min.js"></script>
   <!-- RTL demo-->
   <script src="app/js/demo/demo-rtl.js"></script>
   <!-- TAGS INPUT-->
   <script src="vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js"></script>
   <!-- MOMENT JS-->
   <script src="vendor/moment/min/moment-with-locales.min.js"></script>
   <!-- DATERANGEINPUTS-->
   <script src="vendor/daterangepicker/daterangepicker.js"></script>
   <!-- INPUTMASKS -->
   <script src="vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js"></script>
   <!-- Blur Header -->
   <script src="vendor/blurheader/html2canvas.js"></script>
   <script src="vendor/blurheader/StackBlur.js"></script>
  <!-- Google MAPS -->
   <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places"></script>
   <script type="text/javascript" src="vendor/placepicker/jquery.placepicker.min.js"></script>
   <!-- INPUTMASKS -->
   <script src="vendor/pace/pace.min.js"></script>
   <!-- SELECT2 -->
   <script src="vendor/select2/js/select2.full.min.js"></script>


   <!-- =============== APP SCRIPTS ===============-->
   <script src="http://localhost:8080/socket.io/socket.io.js" type="text/javascript"></script>
   <script src="app/js/app.js"></script>
   <script src="app/js/calendar.js"></script>
   <script src="app/js/add.js"></script>


<?php
    require 'templates.html';
?>

</body>

</html>