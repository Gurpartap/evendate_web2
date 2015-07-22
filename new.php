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
	<!-- top navbar-->
	<header class="topnavbar-wrapper">
		<!-- START Top Navbar-->
		<nav role="navigation" class="navbar topnavbar">
			<!-- START navbar header-->
			<div class="navbar-header">
				<a href="#" class="navbar-brand">
					<div class="brand-logo">
						<img src="app/img/logo.png" style="max-height: 47px;" alt="App Logo" class="img-responsive">
					</div>
					<div class="brand-logo-collapsed">
						<img src="app/img/logo-single.png" alt="App Logo" class="img-responsive">
					</div>
				</a>
			</div>
			<!-- END navbar header-->
			<!-- START Nav wrapper-->
			<div class="nav-wrapper">
				<!-- START Left navbar-->
				<ul class="nav navbar-nav">
				</ul>
				<!-- END Left navbar-->
				<!-- START Right Navbar-->
				<ul class="nav navbar-nav navbar-right">
					<!-- Search icon-->
					<li>
						<a href="#" data-search-open="">
							<em class="icon-magnifier"></em>
						</a>
					</li>
					<li>
						<a href="#" class="exit-btn">
							<em class="icon-notebook"></em>
						</a>
					</li>
					<!-- START Alert menu-->
					<li class="dropdown dropdown-list hidden">
						<a href="#" data-toggle="dropdown">
							<em class="icon-bell"></em>
							<div class="label label-danger">11</div>
						</a>
						<!-- START Dropdown menu-->
						<ul class="dropdown-menu animated flipInX">
							<li>
								<!-- START list group-->
								<div class="list-group">
									<!-- list item-->
									<a href="#" class="list-group-item">
										<div class="media-box">
											<div class="pull-left">
												<em class="fa fa-twitter fa-2x text-info"></em>
											</div>
											<div class="media-box-body clearfix">
												<p class="m0">New followers</p>
												<p class="m0 text-muted">
													<small>1 new follower</small>
												</p>
											</div>
										</div>
									</a>
									<!-- list item-->
									<a href="#" class="list-group-item">
										<div class="media-box">
											<div class="pull-left">
												<em class="fa fa-envelope fa-2x text-warning"></em>
											</div>
											<div class="media-box-body clearfix">
												<p class="m0">New e-mails</p>
												<p class="m0 text-muted">
													<small>You have 10 new emails</small>
												</p>
											</div>
										</div>
									</a>
									<!-- list item-->
									<a href="#" class="list-group-item">
										<div class="media-box">
											<div class="pull-left">
												<em class="fa fa-tasks fa-2x text-success"></em>
											</div>
											<div class="media-box-body clearfix">
												<p class="m0">Pending Tasks</p>
												<p class="m0 text-muted">
													<small>11 pending task</small>
												</p>
											</div>
										</div>
									</a>
									<!-- last list item -->
									<a href="#" class="list-group-item">
										<small>More notifications</small>
										<span class="label label-danger pull-right">14</span>
									</a>
								</div>
								<!-- END list group-->
							</li>
						</ul>
						<!-- END Dropdown menu-->
					</li>
					<!-- END Alert menu-->
					<!-- START Contacts button-->
					<li class="hidden">
						<a href="#" data-toggle-state="offsidebar-open" data-no-persist="true">
							<em class="icon-notebook"></em>
						</a>
					</li>
					<!-- END Contacts menu-->
				</ul>
				<!-- END Right Navbar-->
			</div>
			<!-- END Nav wrapper-->
			<!-- START Search form-->
			<form role="search" action="app/search.html" class="navbar-form">
				<div class="form-group has-feedback">
					<input type="text" placeholder="Введите и нажмите Enter ..." class="form-control">
					<div data-search-dismiss="" class="fa fa-times form-control-feedback"></div>
				</div>
				<button type="button" class="hidden btn btn-default">Submit</button>
			</form>
			<!-- END Search form-->
		</nav>
		<!-- END Top Navbar-->
	</header>

	<aside class="aside">
		<!-- START Sidebar (left)-->
		<div class="aside-inner">
			<nav data-sidebar-anyclick-close="" class="sidebar">
				<!-- START sidebar nav-->
				<ul class="nav">
					<!-- START user info-->
					<li class="has-user-block">
						<div id="user-block" class="collapse in" aria-expanded="true">
							<div class="item user-block">
								<!-- User picture-->
								<div class="user-block-picture">
									<div class="user-block-status">
										<img src="" alt="Avatar" width="60" height="60" class="img-thumbnail img-circle">
										<div class="circle circle-success circle-lg"></div>
									</div>
								</div>
								<!-- Name and Job-->
								<div class="user-block-info">
									<span class="user-block-name">Здравствуйте, <?=$user->getFirstName()?></span>
								</div>
							</div>
						</div>
					</li>
					<!-- END user info-->
					<!-- Iterates over all sidebar items-->
					<a type="button" class="btn btn-purple btn-lg btn-menu mb-compose-button" data-toggle="modal" data-target="#modal-add-event">
						<em class="fa fa-pencil"></em>
						<span>Создать событие</span>
					</a>
					<a type="button" class="btn btn-default btn-lg btn-menu mb-compose-button">
						<em class="icon-settings"></em>
						<span>Настройки</span>
					</a>
					<a class="btn btn-default btn-organizations">Подписки</a>
					<div class="ball-pulse text-center subscribed-list-loader">
						<div></div>
						<div></div>
						<div></div>
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
					<div class="col-lg-5 col-md-5 organizations-list-block animated hidden bounceOutLeft">
						<div class="row">
							<div class="col-md-12 col-sm-6 col-xs-12 co-xs-pull-12">
								<!-- START panel-->
								<div class="panel panel-default" id="organizations-col">
									<div class="panel-heading">
										<h4 class="panel-title">
											<button type="button" class="btn btn-default btn-xs pull-right hide-organizations-btn"><span aria-hidden="true" class="">?</span></button>
											Подписки
										</h4>
									</div>

									<div class="panel-body text-center">
										<div class="organizations-loading">
											<div class="ball-pulse">
												<div></div>
												<div></div>
												<div></div>
											</div>
										</div>
										<div class="organizations-search">
											<div class="form-group">
												<label class="control-label">Поиск организаций</label>
												<div>
													<input type="text" class="form-control">
													<span class="help-block m-b-none">Начните вводить название организации, города, сферу деятельности или теги.</span>
												</div>
											</div>
										</div>
										<div class="organizations-and-subs-list">
										</div>
									</div>
								</div>
								<!-- END panel-->
							</div>
						</div>
					</div>
					<div class="col-lg-7 col-md-7">
						<!-- START panel-->
						<div class="panel panel-default">
							<div class="panel-body">
								<!-- START calendar-->
								<div id="calendar" class="fc fc-ltr fc-unthemed">
									<div class="fc-toolbar">
										<div class="fc-left">
											<div class="fc-button-group">
												<button type="button" class="fc-prev-button fc-button fc-state-default fc-corner-left"><span class="fc-icon fc-icon- fa fa-caret-left"></span></button>
												<button type="button" class="fc-next-button fc-button fc-state-default fc-corner-right"><span class="fc-icon fc-icon- fa fa-caret-right"></span></button>
											</div>
											<button type="button" class="fc-today-button fc-button fc-state-default fc-corner-left fc-corner-right">Сегодня</button>
										</div>
										<div class="fc-right">
											<div class="fc-button-group">
												<button type="button" class="fc-month-button fc-button fc-state-default fc-corner-left fc-state-active">месяц</button>
												<button type="button" class="fc-agendaWeek-button fc-button fc-state-default">лента</button>
											</div>
										</div>
										<div class="fc-center">
											<div class="btn-group btn-lg">
												<button data-toggle="dropdown" class="btn btn-default" aria-expanded="true">
													<span id="month-name"></span>
													<b class="caret"></b>
												</button>
												<ul role="menu" class="dropdown-menu animated flipInX month-names-list">

												</ul>
											</div>
										</div>
										<div class="fc-clear"></div>
									</div>
									<div class="fc-view-container" style="">
										<div class="fc-view fc-month-view fc-basic-view">
											<table>
												<thead>
												<tr>
													<td class="fc-widget-header"><div class="fc-row fc-widget-header">
															<table>
																<thead>
																<tr>
																	<th class="fc-day-header fc-widget-header fc-sun">Понедельник</th>
																	<th class="fc-day-header fc-widget-header fc-mon">Вторник</th>
																	<th class="fc-day-header fc-widget-header fc-tue">Среда</th>
																	<th class="fc-day-header fc-widget-header fc-wed">Четверг</th>
																	<th class="fc-day-header fc-widget-header fc-thu">Пятница</th>
																	<th class="fc-day-header fc-widget-header fc-fri">Суббота</th>
																	<th class="fc-day-header fc-widget-header fc-sat">Воскресенье</th>
																</tr>
																</thead>
															</table>
														</div>
													</td>
												</tr>
												</thead>
											</table>
										</div>
									</div>
								</div>
								<!-- END calendar-->
								<div class="calendar-days col-xs-12">
									<table class="text-center col-xs-12" id="calendar-table">

									</table>
								</div>
							</div>
						</div>
						<!-- END panel-->
					</div>
					<div class="col-lg-5 col-md-5">
						<div class="row">
							<div class="col-md-12 col-sm-6 col-xs-12 co-xs-pull-12 events-list-block animated bounceInRight">
								<!-- START panel-->
								<div class="panel panel-default" id="right-col">
									<div class="panel-heading">
										<h4 class="panel-title">
											<span class="label label-purple pull-right events-count"></span>
											События за <span id="events-list-date">сегодня</span>
										</h4>
									</div>
									<!-- Default external events list-->
									<div class="events-loading">
										<div class="ball-pulse events-loading-pulse">
											<div></div>
											<div></div>
											<div></div>
										</div>
									</div>
									<div class="day-events">
										<h3 class="m0 no-events-text hidden text-center">К сожалению, на заданную дату событий нет</h3>
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