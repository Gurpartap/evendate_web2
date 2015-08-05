<?php
	require_once 'backend/bin/db.php';
	require_once 'backend/users/Class.AbstractUser.php';
	require_once 'backend/users/Class.User.php';
	$user = new User($db);

class DemoUser{


    public function getAvatarUrl(){
        return "http://cs622126.vk.me/v622126000/ea78/AvzbE0ET104.jpg";
    }

    public function getFirstName(){
        return "Kardanov";
    }

    public function getLastName(){
        return "Inal";
    }
}

$user = new DemoUser();
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
	<!-- Pace-->
	<link rel="stylesheet" href="vendor/pace/pace.css">
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
                               <span id="month-name"></span>
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
                 <div class="col-sm-4">
                     <span class="help-block m-b-none advanced-search-text">Расширенный поиск.</span>
                 </div>
             </div>
            <!-- START row-->
            <div class="calendar-app">
               <div class="row">
                 <div class="col-md-12">
                   <div class="row">
                     <div class="col-md-12 col-sm-6 col-xs-12 co-xs-pull-12 events-list-block animated bounceInRight">
                       <!-- START panel-->
                         <div id="wrapper">
                             <div id="tl-outer-wrap">
                                 <hr id="timeline">
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
                                     <div class="panel-heading">
                                         <div class="row">
                                             <div class="col-xs-7">Вторник, 30 июня</div>
                                             <div class="col-xs-5">
                                                 <span class="pull-right panel-events-count">Мероприятий:
                                                     <span class="label label-pink">3</span>
                                                 </span></div>
                                         </div>
                                     </div>
                                     <div class="tl-panel-block closed">
                                         <div class="row">
                                             <div class="col-xs-10">
                                                 <div class="event-title">Голос ГУУ</div>
                                                 <div class="even-attrs col-xs-6">
                                                     <div class="col-xs-12"><i class="fa fa-clock-o"></i> 17:30 - 19:00</div>
                                                     <div class="col-xs-12"><i class="fa fa-map-marker"></i> Рязанский проспект 99</div>
                                                     <div class="col-xs-12"><i class="fa fa-tags"></i> Музыка, ГУУ</div>
                                                 </div>
                                                 <div class="even-attrs col-xs-6">
	                                                 <div class="row col-xs-12" data-organization-id="1">
		                                                 <div class="col-xs-3">
			                                                 <div class="organization-img-wrapper blue">
				                                                 <img src="organizations_images/guu.png" title="Государственный университет управления">
			                                                 </div>
		                                                 </div>
		                                                 <div class="col-xs-9 organization-name">
			                                                 <span>ГУУ</span>
		                                                 </div>
	                                                 </div>
                                                     <div class="col-xs-12">
                                                         <div class="liked-users row">
                                                             <div class="user-img-wrapper">
                                                                 <img src="organizations_images/guu.png" class="liked-user-avatar">
                                                             </div>
                                                             <div class="user-img-wrapper">
                                                                 <img src="organizations_images/guu.png" class="liked-user-avatar">
                                                             </div>
                                                             <div class="user-img-wrapper">
                                                                 <img src="organizations_images/guu.png" class="liked-user-avatar">
                                                             </div>
                                                             <div class="user-img-wrapper">
                                                                 <img src="organizations_images/guu.png" class="liked-user-avatar">
                                                             </div>
                                                             <div class="user-img-wrapper">
                                                                 <img src="organizations_images/guu.png" class="liked-user-avatar">
                                                             </div>
                                                         </div>
                                                         <div class="liked-users-count">
                                                             127 участников
                                                         </div>
                                                     </div>
                                                     <div class="col-xs-12"><button class="btn btn-pink-empty">В избранное</button></div>
                                                 </div>
                                                 <div class="event-additional-attrs">
                                                 </div>
                                                 <div class="event-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</div>
                                             </div>
                                             <div class="col-xs-2">
                                                 <img src="event_images/12.jpg" class="event-image img-rounded">
                                             </div>


                                             <div class="row col-xs-12 event-bottom-block">
                                                 <div class="col-xs-5 external-link-wrapper">
                                                     <span class="external-link">
                                                         <i class="fa fa-external-link"></i> Страница мероприятия
                                                     </span>
                                                 </div>
                                                 <div class="col-xs-7">
                                                     <span class="social-links">
                                                         <i class="fa fa-vk"></i>
                                                         <i class="fa fa-facebook-f"></i>
                                                         <i class="fa fa-google-plus"></i>
                                                         <i class="fa fa-twitter"></i>
                                                     </span>
                                                 </div>
                                             </div>
                                             <div class="more-info-btn"><span class="fa fa-chevron-up"></span></div>
                                         </div>
                                     </div>
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
   </div>
   <!-- Button trigger modal -->

   <!-- Modal -->
   <div class="modal fade" id="modal-add-event" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
     <div class="modal-dialog add-event-modal" role="document">
       <div class="modal-content">
         <div class="modal-header">
           <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <h4 class="modal-title" id="myModalLabel">Новое событие</h4>
         </div>
         <div class="modal-body">
           <form class="form-horizontal" id="create-event-form">
             <div class="form-group">
               <label class="control-label">Название</label>
               <div class="col-sm-12">
                 <input type="text" class="form-control" placeholder="Название мероприятия" name="title">
               </div>
             </div>

	           <div class="form-group">
		           <label class="control-label">Дата</label>
		           <div class="col-sm-12">
			           <input type="text" class="form-control daterange" placeholder="Название мероприятия" name="title">
		           </div>
	           </div>
	           <div class="form-group row">
		           <div class="col-sm-5"><label class="control-label">Время</label></div>
		           <div class="col-sm-7">
			           <div class="checkbox c-checkbox needsclick">
				           <label class="needsclick">
					           <input type="checkbox" value="" class="needsclick">
					           <span class="fa fa-check"></span>Весь день</label>
			           </div>
		           </div>
	           </div>
	           <div class="form-group row">
		           <div class="col-xs-2">Начало</div>
		           <div class="col-xs-4 form-inline">
			           <input class="form-control input-hours">
			           :
			           <input class="form-control input-minutes">
		           </div>
		           <div class="col-xs-2">Конец</div>
		           <div class="col-xs-4 form-inline">
			           <input class="form-control input-hours">
			           :
			           <input class="form-control input-minutes">
		           </div>
	           </div>
	           <div class="form-group">
		           <label class="control-label">Ссылка на подробное описание</label>
		           <div class="col-sm-12">
			           <input type="text" class="form-control" placeholder="Ссылка на описание" name="detail_info_url">
		           </div>
	           </div>

	           <div class="form-group">
		           <label class="control-label">Описание</label>
		           <div class="col-sm-12">
			           <textarea class="form-control" rows="3" placeholder="Описание мероприятия, до 500 символов" name="description"></textarea>
		           </div>
	           </div>
	           <div class="form-group">
		           <label class="control-label">Теги</label>
		           <div class="col-sm-12">
			           <input type="text" class="form-control" data-role="tagsinput" placeholder="Теги" name="tags">
		           </div>
	           </div>
             <div class="form-group">
               <label class="control-label">Место проведения</label>
               <div class="col-sm-12">
	               <div class="form-group">
		               <input class="placepicker form-control" data-map-container-id="collapseOne"/>
	               </div>
	               <div id="collapseOne" class="collapse">
		               <div class="placepicker-map thumbnail"></div>
	               </div>
               </div>
             </div>
	           <div class="form-group">
		           <label class="control-label">Изображения</label>
		           <div class="row add-images">
                       <div class="col-sm-5">
                           <input type="file" data-classbutton="btn btn-default" data-classinput="form-control inline" class="form-control filestyle" id="filestyle-0" tabindex="-1" style="position: absolute; clip: rect(0px 0px 0px 0px);">
                           <div class="bootstrap-filestyle input-group vertical">
                               <span class="group-span-filestyle input-group-btn" tabindex="0">
                                   <label for="filestyle-0" class="btn btn-default vertical-btn" style="height: 213px;width: 153px;padding-top: 84px;">
                                       <span>Выбрать файл</span>
                                   </label>
                               </span>
                           </div>
			           </div>
                       <div class="col-sm-7">
                           <input type="file" data-classbutton="btn btn-default" data-classinput="form-control inline" class="form-control filestyle" id="filestyle-1" tabindex="-1" style="position: absolute; clip: rect(0px 0px 0px 0px);">
                           <div class="bootstrap-filestyle input-group horizontal">
                               <span class="group-span-filestyle input-group-btn" tabindex="0">
                                   <label for="filestyle-1" class="btn btn-default horizontal-btn" style="height: 143px;width: 202px;padding-top: 60px;">
                                       <span>Выбрать файл</span>
                                   </label>
                               </span>
                           </div>
                       </div>
		           </div>
	           </div>
           </form>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-pink-empty" data-dismiss="modal">Отмена</button>
           <button type="button" class="btn btn-pink create-event-btn">Создать</button>
         </div>
       </div>
     </div>
	   <div class="image-cropper-wrapper hidden">
		   <div class="image-cutter">
			   <img src="">
			   <div class="whirl duo image-cropper"></div>
			   <a href="#" class="btn btn-pink img-crop-btn disabled"> Кадрировать</a>
			   <a href="#" class="btn btn-pink-empty img-crop-cancel"> Отмена</a>
		   </div>
	   </div>
   </div>
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
   <!-- INPUTMASKS-->
   <script src="vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js"></script>
   <!-- Blur Header-->
   <script src="vendor/blurheader/html2canvas.js"></script>
   <script src="vendor/blurheader/StackBlur.js"></script>
  <!-- Google MAPS-->
   <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=true&libraries=places"></script>
   <script type="text/javascript" src="vendor/placepicker/jquery.placepicker.min.js"></script>
   <!-- INPUTMASKS-->
   <script src="vendor/pace/pace.min.js"></script>


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

   <script type="javascript/template" id="tmpl-organizations-item">
       <div class="row organizations-item"  data-organization-id="{id}" >
           <div class="organizations-item-wrapper">
               <div class="col-xs-3">
	               <div class="organization-img-wrapper">
		               <img src="{img_url}" title="{name}">
	               </div>
               </div>
               <span class="col-xs-9">{short_name}</span>
           </div>
       </div>
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

   <script type="javascript/template" id="tmpl-organization-modal">
       <div class="modal fade organization-modal" id="organization-modal" tabindex="-1" role="dialog" aria-labelledby="organization-label">
           <div class="modal-dialog" role="document">
               <div class="modal-content">
                   <div class="modal-body">
                       <div class="modal-header">
                           <span>{short_name}</span>
                       </div>
                       <div class="organization-content-header">
                           <img src="{background_img_url}">
                       </div>

                       <div class="organization-full-name">{name}</div>
                       <div class="organization-logo">
                           <img src="{img_url}">
                       </div>
                       <div class="organization-info">
                           <div class="description">
                               <div class="description-text">{description}</div>
                               <div class="col-xs-12 liked-users-wrapper">
                                   <div class="liked-users row">
                                       <div class="user-img-wrapper">
                                           <img src="http://cs624029.vk.me/v624029543/2a7b0/ZkMV14mud2s.jpg" class="liked-user-avatar" style="">
                                       </div>
                                       <div class="user-img-wrapper">
                                           <img src="http://cs629126.vk.me/v629126000/aa4e/lS7YaihK728.jpg" class="liked-user-avatar">
                                       </div>
                                       <div class="user-img-wrapper">
                                           <img src="http://cs421321.vk.me/v421321015/4c1a/pQRr1LJ31Zw.jpg" class="liked-user-avatar">
                                       </div>
                                       <div class="user-img-wrapper">
                                           <img src="http://vk.com/images/camera_50.png" class="liked-user-avatar">
                                       </div>
                                       <div class="user-img-wrapper">
                                           <img src="http://cs613529.vk.me/v613529757/1a171/6RWDHlGyFkg.jpg" class="liked-user-avatar">
                                       </div>
                                   </div>
                                   <div class="subscribe-btn-wrapper">
                                       <button class="btn btn-primary">Подписаться</button>
                                   </div>
                               </div>
                               <div class="liked-users-count">

                               </div>
                           </div>
                       </div>
	                   <div class="col-xs-12 last-events-list">
		                   {events}
	                   </div>
                   </div>
               </div>
           </div>
       </div>
</script>

   <script type="javascript/template" id="tmpl-short-event">
       <div class="col-xs-12 short-event">
           <div class="event-image-circle">
               <img src="{img_url_vertical}">
           </div>
           <div class="event-info">
               <div class="event-name">
                   {title}
               </div>
               <div class="event-attributes">
                   <span class="event-attribute">
                       <span class="fa fa-users"></span> 172
                   </span>
                   <span class="event-attribute">
                       <span class="fa fa-clock-o"></span> 30/06
                   </span>
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