<?php
	//require_once 'backend/bin/db.php';
	//require_once 'backend/users/Class.AbstractUser.php';
	//require_once 'backend/users/Class.User.php';

	//$user = new User($db);
?>
<!DOCTYPE html>
<html lang="ru">

<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
   <title>Evendate</title>
   <!-- =============== VENDOR STYLES ===============-->
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
	<!-- DATETIMEPICKER-->
	<link rel="stylesheet" href="vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css">
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
                           <img src="http://cs622126.vk.me/v622126000/ea78/AvzbE0ET104.jpg" alt="Avatar" class="img-thumbnail img-circle">
                       </div>
                       <div class="col-md-8">
                           <span class="user-block-name">Инал Карданов</span>
                           <span class="user-is-editor label label-black-blue">Редактор</span>
                       </div>
                       <div class="col-xs-1">

                       </div>
                   </div>
                   <!-- END user info-->
				   <ul class="nav">
					   <!-- Iterates over all sidebar items-->
					   <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button" data-toggle="modal" data-target="#modal-add-event">
						   <em class="fa fa-pencil"></em>
						   <span>Создать событие</span>
					   </a>
					   <a type="button" class="btn btn-black-blue btn-sm btn-menu mb-compose-button">
						   <em class="icon-settings"></em>
						   <span>Настройки</span>
					   </a>
                       <div class="panel side-calendar-panel">
                           <div class="panel-body">
                               <button type="button" class="btn btn-xs btn-black-blue pressed prev-button">
                                   <span class="fa fa-chevron-left"></span>
                               </button>
                               <div class="btn-group btn-xs">
                                   <button data-toggle="dropdown" class="btn btn-xs btn-black-blue btn-default" aria-expanded="true">
                                       <span id="month-name"></span>
                                       <b class="caret"></b>
                                   </button>
                                   <ul role="menu" class="dropdown-menu animated flipInX month-names-list">

                                   </ul>
                               </div>
                               <button type="button" class="btn btn-xs btn-black-blue pressed next-button">
                                   <span class="fa fa-chevron-right"></span>
                               </button>
                               <table class="sidebar-calendar-table" id="calendar-table">
                                   <thead>
                                   <tr class="">
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
					   <span class="side-block-container">Подписки</span>
                       <div class="whirl duo organizations-loading">

                       </div>
					   <table class="table table-striped table-bordered table-hover organizations-list"></table>
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
            <!-- START row-->
            <div class="calendar-app">
               <div class="row">
                 <div class="col-md-12">
                   <div class="row">
                     <div class="col-md-12 col-sm-6 col-xs-12 co-xs-pull-12 events-list-block animated bounceInRight">
                       <!-- START panel-->
                         <div id="wrapper">
                             <div id="tl-outer-wrap">
                                 <div id="timeline-wrap"><hr id="timeline"></div>
                                 <div class="tl-block">
                                     <div class="tl-part tl-header"><span class="tl-timespot">ВТ, 30/06</span></div>
                                     <div class="tl-part active"><span class="tl-timespot">17:30</span></div>
                                     <div class="tl-part"><span class="tl-timespot">19:30</span></div>
                                 </div>
                                 <div class="tl-block">
                                     <div class="tl-part tl-header"><span class="tl-timespot">ВТ, 30/06</span></div>
                                     <div class="tl-part"><span class="tl-timespot">17:30</span></div>
                                     <div class="tl-part"><span class="tl-timespot">19:30</span></div>
                                 </div>
                             </div><div id="blocks-outer-wrap">
                                 <div class="panel panel-default">
                                     <div class="panel-heading">Panel heading without title</div>
                                     <div class="tl-panel-block">Например блок</div>
                                     <div class="tl-panel-block">Например блок</div>
                                 </div>
                                 <div class="panel panel-default">
                                     <div class="panel-heading">Panel heading without title</div>
                                     <div class="tl-panel-block">Например блок</div>
                                     <div class="tl-panel-block">Например блок</div>
                                 </div>
                             </div>
                         </div>
                       <!-- END panel-->
                     </div>
                   </div>
                 </div>
               </div>
               <!-- END row-->
            </div>
         </div>
      </section>
      <!-- Page footer-->
      <footer>
         <span>&copy; 2015 - Evendate</span>
      </footer>
   </div>
   <!-- Button trigger modal -->

   <!-- Modal -->
   <div class="modal fade" id="modal-add-event" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
     <div class="modal-dialog" role="document">
       <div class="modal-content">
         <div class="modal-header">
           <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <h4 class="modal-title" id="myModalLabel">Новое событие</h4>
         </div>
         <div class="modal-body">
           <form class="form-horizontal" id="create-event-form">
             <div class="form-group">
               <label class="col-sm-2 control-label">Название</label>
               <div class="col-sm-10">
                 <input type="text" class="form-control" placeholder="Название мероприятия" name="title">
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label">Описание</label>
               <div class="col-sm-10">
                 <textarea class="form-control" rows="3" placeholder="Описание мероприятия, до 500 символов" name="description"></textarea>
               </div>
             </div>
	           <div class="form-group">
		           <label class="col-sm-2 control-label">Ссылка на подробное описание</label>
		           <div class="col-sm-10">
			           <input type="text" class="form-control" placeholder="Ссылка на описание" name="detail_info_url">
		           </div>
	           </div>
	           <div class="form-group">
		           <label class="col-sm-2 control-label">Теги</label>
		           <div class="col-sm-10">
			           <input type="text" class="form-control" data-role="tagsinput" placeholder="Теги" name="tags">
		           </div>
	           </div>
             <div class="form-group">
               <label class="col-sm-2 control-label">Место проведения</label>
               <div class="col-sm-10">
	               <div class="input-group">
		               <input type="text" class="form-control" id="event-place" name="location" placeholder="Введите местоположение" autocomplete="off">
		               <input type="hidden" id="longitude" name="longitude">
		               <input type="hidden" id="latitute" name="latitude">
                   <span class="input-group-btn">
                     <button type="button" class="btn btn-default btn-toggle-map">
	                     <span class="fa fa-map-marker"></span> Показать на карте
                     </button>
                   </span>
	               </div>
	               <div id="map-canvas" style="width: 100%; height: 400px;" class="hidden"></div>
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label">Дата проведения</label>
	             <div class="col-sm-10">
		             <div class="container">
			             <div class='col-md-5'>
				             <div class="form-group">
					             <div class='input-group date' id='datetimepicker1'>

                <span class="input-group-addon">
                    C
                </span>
						             <input type='text' class="form-control" id="event_start_date"/>
                <span class="input-group-addon">
                    <span class="fa fa-calendar"></span>
                </span>
					             </div>
				             </div>
			             </div>
			             <div class='col-md-5'>
				             <div class="form-group">
					             <div class='input-group date' id='datetimepicker2'>
                <span class="input-group-addon">
                    До
                </span>
						             <input type='text' class="form-control" id="event_end_date"/>
                <span class="input-group-addon">
                    <span class="fa fa-calendar"></span>
                </span>
					             </div>
				             </div>
			             </div>
		             </div>
               </div>
             </div>
             <div class="form-group">
               <label class="col-sm-2 control-label">Изображение</label>
               <div class="col-sm-10">
                 <input type="file" data-classbutton="btn btn-default" data-classinput="form-control inline" class="form-control filestyle" id="filestyle-0" tabindex="-1" style="position: absolute; clip: rect(0px 0px 0px 0px);"><div class="bootstrap-filestyle input-group">
                       <input type="text" class="form-control " disabled=""> <span class="group-span-filestyle input-group-btn" tabindex="0"><label for="filestyle-0" class="btn btn-default "><span class="glyphicon glyphicon-folder-open"></span> Выбрать файл</label></span></div>
	               <div class="panel panel-info img-preview-panel hidden">
		               <div class="panel-heading">Кадрирование изображения
		               </div>
		               <div class="panel-body img-container event-img-container">
			               <div class="ball-pulse img-loading-pulse">
				               <div></div>
				               <div></div>
				               <div></div>
			               </div>
			               <img src="" class="hidden img-cropper-preview">
			               <div class="image-preview-canvas hidden"></div>
		               </div>
		               <div class="panel-footer">
			               <button type="button" class="btn btn-labeled btn-success img-crop-btn disabled">
                           <span class="btn-label"><i class="fa fa-check"></i>
                           </span>Применить</button>
		               </div>
	               </div>
               </div>
               <div class="cropper-example-1">

               </div>
             </div>
           </form>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
           <button type="button" class="btn btn-primary create-event-btn">Создать</button>
         </div>
       </div>
     </div>
   </div>
  <!-- Modal Subscriptions-->
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
   <!-- =============== PAGE VENDOR SCRIPTS ===============-->
   <!-- JQUERY UI-->
   <script src="vendor/jquery-ui/ui/core.js"></script>
   <script src="vendor/jquery-ui/ui/widget.js"></script>
   <script src="vendor/jquery-ui/ui/mouse.js"></script>
   <script src="vendor/jquery-ui/ui/draggable.js"></script>
   <script src="vendor/jquery-ui/ui/droppable.js"></script>
   <script src="vendor/jquery-ui/ui/sortable.js"></script>
   <script src="vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js"></script>
   <!-- MOMENT JS-->
   <script src="vendor/moment/min/moment-with-locales.min.js"></script>
   <!-- DATETIMEPICKER-->
   <script type="text/javascript" src="vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
  <!-- Google MAPS-->
   <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=places"></script>
   <script type="text/javascript" src="vendor/jquery.locationpicker/locationpicker.jquery.min.js"></script>
   <!-- =============== APP SCRIPTS ===============-->
   <script src="http://localhost:8080/socket.io/socket.io.js" type="text/javascript"></script>
   <script src="app/js/app.js"></script>
   <script src="app/js/calendar.js"></script>
   <script src="app/js/add.js"></script>

   <script type="javascript/template" id="tmpl-calendar-line">
     <tr class="calendar-days-line"></tr>
   </script>
   <script type="javascript/template" id="tmpl-month-name-line">
	   <li class="set-month-item {selected}" data-month-number="{number}" data-month-index="{index}" data-yaer="{year}"><a href="#">{name}</a></li>
   </script>
   <script type="javascript/template" id="tmpl-calendar-day">
     <td class="td-day day-{day_number} {today}" data-date="{date}"><div class="content centering"><span class="day-number">{number}</span></div></td>
   </script>
   <script type="javascript/template" id="tmpl-event-type-dropdown-item">
	   <li class="event-type-line {is_active}" data-event-type-id="{event_type_id}" data-organization-id="{organization_id}"><a href="#">{event_type_name}</a></li>
   </script>

   <script type="javascript/template" id="tmpl-organizations-table-item">
	   <tr data-organization-id="{id}" class="organization-logo-16 text-center">
		   <td class="image-td"><img src="{img_url}"></td>
		   <td>{name}</td>
	   </tr>
   </script>

   <script type="javascript/template" id="tmpl-organizations-and-subs-list-item">
	   <div class="panel widget">
		   <div class="panel-body">
			   <div class="row row-table">
				   <div class="col-xs-3 text-center">
					   <img src="{img_url}" alt="{name}" class="thumb96">
				   </div>
				   <div class="col-xs-9">
					   <h3 class="mt0">{name}</h3>
					   <p class="text-muted">{type_name}</p>
					   <p class="text-muted">{description}</p>
					   <div class="pull-right"><a href="#" class="btn btn-{sub_btn_class} subscribe-to" data-organization-id="{id}" data-subscription-id="{subscription_id}">{sub_btn_text}</a></div>
				   </div>
			   </div>
		   </div>
	   </div>
   </script>

   <script type="javascript/template" id="tmpl-event">
	   <div class="panel widget">
		   <div class="event-type-line {event_type_latin_name}"></div>
		   <div class="half-float">
			   <img src="event_images/{id}.{image_ext}" style="width: 100%" class="img-responsive">
			   <h3 class="m0 text-center">{title}</h3>
		   </div>
		   <div class="panel-body text-center">
			   <p>{description}</p>

			   <div class="row row-table row-flush">
				   <div class="col-xs-6 bb br">
					   <div class="row row-table row-flush">
						   <div class="col-xs-4 text-center text-info">
							   <em class="fa fa-users fa-2x"></em>
						   </div>
						   <div class="col-xs-8">
							   <div class="panel-body text-center">
								   <h4 class="mt0">10k</h4>
								   <p class="mb0 text-muted">ЖЕЛАЮЩИХ</p>
							   </div>
						   </div>
					   </div>
				   </div>
				   <div class="col-xs-6 bb">
					   <div class="row row-table row-flush">
						   <div class="col-xs-4 text-center text-danger">
							   <em class="fa fa-calendar fa-2x"></em>
						   </div>
						   <div class="col-xs-8">
							   <div class="panel-body text-center">
								   <h4 class="mt0">{start_date}</h4>
								   <h4 class="mt0">{end_date}</h4>
							   </div>
						   </div>
					   </div>
				   </div>
			   </div>
			   <div class="row row-table row-flush">
				   <div class="col-xs-12 br">
					   <div class="row row-table row-flush">
						   <div class="col-xs-4 text-center text-inverse">
							   <em class="fa fa-map-marker fa-2x"></em>
						   </div>
						   <div class="col-xs-8">
							   <div class="panel-body text-center">
								   <h4 class="mt0">{location}</h4>
								   <p class="mb0 text-muted">Главный учебный корпус, У-214</p>
							   </div>
						   </div>
					   </div>
				   </div>
			   </div>
		   </div>
	   </div>
   </script>


</body>

</html>