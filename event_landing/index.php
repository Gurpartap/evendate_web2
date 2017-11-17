<?php

if (!isset($BACKEND_FULL_PATH)) {
	require_once '../v1-backend/bin/env_variables.php';
}

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

require_once "{$BACKEND_FULL_PATH}/vendor/Mobile_Detect/Mobile_Detect.php";
App::buildGlobal($__db);

try {
	$user = new User($__db);

	if (isset($_GET['logout']) && $_GET['logout'] == true) {
		$user->logout();
	}

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
if (App::$ENV == 'prod' || App::$ENV == 'test') {
	$DEBUG_MODE = false;
}
$url = parse_url($_SERVER['REQUEST_URI'])['path'];
$url_parts = explode('/', $url);

if (count($url_parts) == 2 && !isset($_REQUEST['id'])) {
	$_REQUEST['id'] = EventsCollection::getIdByAlias($__db, $url_parts[1]);
}


$event_instance = EventsCollection::one($__db, $user, $_REQUEST['id'], Fields::parseFields('description,landing_data,organization_id,organization_logo_medium_url,organization_short_name'));
$event = $event_instance->getParams($user, array('description', 'organization_id', 'landing_data', 'organization_logo_medium_url', 'organization_short_name'))->getData();

$bckg_color = '';
$path_url = $event['id'];
$l_data = null;
if ($event['landing_data'] && !is_null($event['landing_data'])) {
	$event['landing_data'] = json_decode($event['landing_data'], true);
	$l_data = $event['landing_data'];
	if (isset($event['landing_data']['color_scheme']) && is_array($event['landing_data']['color_scheme'])) {
		$bckg_color = "background-color: rgb({$event['landing_data']['color_scheme'][0]}, {$event['landing_data']['color_scheme'][1]},{$event['landing_data']['color_scheme'][2]})";
	}
}

if (isset($_REQUEST['edit']) && $_REQUEST['edit'] == true) {
	if ($user instanceof User == false || !$user->isEventAdmin($event_instance)) {
		header('Location: ' . '/' . $path_url);
	}
}

?>
<!doctype html>
<html lang="en" ng-app="LandingApp">
<head>
	<?php
	echo "<script>window.event_id = {$_REQUEST['id']};</script>\n";
	?>


  <script src="/event_landing/js/angular.min.js"></script>
  <script src="/event_landing/js/ng-file-upload-shim.min.js"></script>
  <script src="/event_landing/js/ng-file-upload-all.min.js"></script>

  <link rel="stylesheet" href="/event_landing/css/angular-gridster.css"/>
  <!--<script src="bower_components/javascript-detect-element-resize/jquery.resize.js"></script>-->
  <script src="/event_landing/js/angular-gridster.min.js"></script>
  <meta charset="utf-8">

  <!-- TITLE OF SITE -->
  <title><?= htmlentities($event['title']) ?></title>

  <!-- META DATA -->
  <meta name="description" content="<?= htmlentities($event['description']) ?>"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

  <!-- =========================
  STYLESHEETS
  ============================== -->
  <!-- BOOTSTRAP -->
  <link rel="stylesheet" href="/event_landing/css/bootstrap.css">
  <link rel="stylesheet" href="/event_landing/css/font-awesome.min.css">

  <!-- FOR EXTERNAL PLUGINS -->
  <link rel="stylesheet" href="/event_landing/css/swiper.min.css"> <!-- Screenshot Slider -->
  <link rel="stylesheet" href="/event_landing/css/themes/default/default.css"> <!-- Nivo Lightbox -->
  <link rel="stylesheet" href="/event_landing/css/nivo-lightbox.css"> <!-- Nivo Lightbox Theme -->
  <link rel="stylesheet" href="/event_landing/css/nprogress.css">
  <link rel="stylesheet" href="/event_landing/css/introjs.min.css">

  <!-- TYPOGRAPHY -->
  <link rel="stylesheet" id="font-switch" href="/event_landing/css/typography/typography-1.css">

  <!-- MAIN -->
  <link rel="stylesheet" href="/event_landing/css/style.css">

  <!-- TEMPLATE COLORS -->
  <link rel="stylesheet" id="color-switch" href="/event_landing/css/colors/green.css">

  <!-- TEMPLATE COLORS -->
  <link rel="stylesheet" href="/event_landing/css/spectrum.css">
  <link href="/app/css/loader.css" rel="stylesheet">

  <!-- RESPONSIVE FIXES -->
  <!-- <link rel="stylesheet" href="css/responsive.css"> -->

  <!-- CSS FOR DEMO - NOT INCLUDED IN MAIN FILES -->
  <link rel="stylesheet" href="/event_landing/demo/demo.css">

  <!--[if lt IE 9]>
  <script src="/event_landing/js/html5shiv.js"></script>
  <script src="/event_landing/js/respond.min.js"></script>
  <![endif]-->

</head>
<body class="body-container" ng-controller="WholeWorldController">
<div
  ng-hide="hide_loader"
  class="mask-loading" style="
    position: fixed;
    background-color: #fff;
    z-index: 99999999;
    width: 100%;
    height: 100%;
    display: block">
  <div class="spinner">
    <div class="double-bounce1" style="<?= $bckg_color ?>"></div>
    <div class="double-bounce2" style="<?= $bckg_color ?>"></div>
  </div>
  <div id="progress-text"
       style="color: rgb(0, 0, 0); width: 100%; position: absolute; top: calc(50% + 55px); margin-top: -25px; text-align: center;">
  </div>
</div>
<!-- =========================
     NAVBAR 
============================== -->
<div class="navbar navbar-nemo appear-onscroll navbar-fixed-top">
  <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nemo-navigation"
                  aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar icon-bar-top"></span>
            <span class="icon-bar icon-bar-middle"></span>
            <span class="icon-bar icon-bar-bottom"></span>
          </button>
        </div>

    <div class="collapse navbar-collapse navbar-center" id="nemo-navigation">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#home">Главное</a></li>
        <li ng-hide="!data.speakers.enabled"><a href="#speakers">{{data.speakers.title}}</a></li>
        <li ng-hide="!data.schedule.enabled"><a href="#schedule">{{data.schedule.title}}</a></li>
        <li ng-hide="!data.custom.enabled"><a href="#custom-html">{{data.custom.title}}</a></li>
        <li ng-hide="!data.testimonials.enabled"><a href="#testimonials">{{data.testimonials.title}}</a></li>
        <li ng-hide="!data.gallery.enabled"><a href="#gallery">{{data.gallery.title}}</a></li>
        <li ng-hide="!data.tickets.enabled"><a href="#ticket-booking-1">{{data.tickets.title}}</a></li>
        <li ng-hide="!data.sponsors.enabled"><a href="#sponsors">{{data.sponsors.title}}</a></li>
        <li ng-hide="!data.faq.enabled"><a href="#faq">{{data.faq.title}}</a></li>
      </ul>
    </div>
  </div>
</div>


<!-- =========================
     EVENT HOME 1
============================== -->
<section class="home event-home-1 polygon-bg cover-bg" id="home">
  <div data-intro='{{intro.steps[1]}}' data-step="2" ng-if="edit_mode"
       class="board-settings-btn mod-show-menu js-show-sidebar main-btn" href="#"
       data-panel-id="header-panel">
    <span class="fa fa-ellipsis-h"></span>
    <span class="board-header-btn-text u-text-underline">Настройки</span></div>
  <div class="container">
    <div class="row">
      <div class="col-lg-10 col-md-10 col-lg-offset-1 col-md-offset-1 text-center">
        <div class="logo-home">
          <!-- REPLACE WITH YOUR LOGO -->
          <!--          <img src="" alt="">-->
        </div>

        <p class="heading-pre-suf text-center text-uppercase" contenteditable="true" ng-model="data.header.title">
          {{data.header.title}}</p>

        <h1 data-intro='{{intro.steps[0]}}' data-step="1" class="heading-text" contenteditable
            ng-model="data.header.subtitle">{{data.header.subtitle}}</h1>
        <p class="sub-heading" contenteditable ng-model="data.header.location_addresses">
          {{data.header.location_addresses}}</p>

        <div class="home-download-btn">

          <a href="#ticket-booking-1" class="btn btn-white btn-lg" ng-if="data.tickets.enabled"><span>{{data.tickets.title}}</span></a>
          <!--<div class="stores-on text-center">-->
          <!--Hurry up!!! Only <strong>29</strong> left-->
          <!--</div>-->

        </div>
      </div>
    </div>  <!-- /.row -->
  </div>
</section>


<!-- =========================
     SMALL TEXT SECTION 
============================== -->
<div class="small-content-2 white-bg text-center">
  <div class="container">
    <p class="p_lr150 text-big text-dark" contenteditable ng-model="data.main_description">{{data.main_description}}</p>
  </div>
</div>


<!-- =========================
     SPEAKERS 
============================== -->
<section ng-hide="!edit_mode && !data.speakers.enabled" class="speakers speakers-1 secondary-bg" id="speakers"
         ng-class="{'disabled': data.speakers.enabled == false}">
  <div data-intro='{{intro.steps[2]}}' data-step="3" ng-if="edit_mode" ng-click="data.speakers.toggleEnabled($event);"
       ng-title="data.speakers.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main show-hide-btn" href="#">
    <span class="board-header-btn-text">
      <span class="fa"
            ng-class="{'fa-eye-slash': data.speakers.enabled, 'fa-eye': data.speakers.enabled == false}"></span>
    </span>
  </div>
  <div data-intro='{{intro.steps[3]}}' data-step="4" ng-if="edit_mode" ng-click="data.speakers.addItem();"
       title="Добавить блок"
       class="not-main board-settings-btn mod-add-block js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa fa-plus"></span> Добавить спикера
    </span>
  </div>
  <div class="hidden-overlay">Блок <strong>{{data.speakers.title}}</strong> скрыт, <a href="#"
                                                                                      ng-click="data.speakers.toggleEnabled($event);">нажмите
      здесь</a>, чтобы сделать блок видимым для пользователей
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-8 col-sm-10 col-lg-offset-3 col-md-offset-2 col-sm-offset-1">
        <div class="section-heading text-center">

          <h2 class="heading-text" contenteditable ng-model="data.speakers.title">{{data.speakers.title}}</h2>
          <hr class="lines">
          <p class="sub-heading" contenteditable ng-model="data.speakers.subtitle">{{data.speakers.subtitle}}</p>

        </div> <!-- /.section-heading -->
      </div>
    </div>  <!-- /.row -->

    <div class="row">
      <!-- Nav tabs -->
      <ul class="hero-tabs speakers-nav" gridster="data.speakers.gridOptions">
        <li role="presentation" class="col-md-3 col-sm-6 active speaker-item" gridster-item="speaker"
            ng-repeat="(uuid, speaker) in data.speakers.items">
          <div class="item-remover" ng-show="edit_mode">
            <span class="fa fa-bars drag-icon"></span>
            <span class="fa fa-remove remove-icon" ng-click="data.speakers.removeItem(uuid);"></span>
          </div>
          <!-- THUMBNAIL -->
          <figure class="speaker-intro secondary-color-bg" data-target="#speaker-{{speaker.uuid}}">
            <div class="img-scale">
              <img
                ngf-select=""
                ngf-drop=""
                ng-disabled="!edit_mode"
                ngf-change="data.speakers.imageChange($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, speaker.uuid)"
                ngf-no-object-url="true"
                ng-model="speaker.image"
                ngf-model-invalid="invalidFiles"
                ngf-model-options="modelOptionsObj"
                ngf-multiple="multiple"
                ngf-pattern="pattern"
                ngf-accept="acceptSelect"
                ngf-capture="capture"
                ngf-drag-over-class="dragOverClassObj"
                ngf-validate="validateObj"
                ngf-resize="resizeObj"
                ngf-resize-if="resizeIfFn($file, $width, $height)"
                ngf-dimensions="dimensionsFn($file, $width, $height)"
                ngf-duration="durationFn($file, $duration)"
                ngf-keep="keepDistinct ? 'distinct' : keep"
                ngf-fix-orientation="orientation"
                ngf-max-files="maxFiles"
                ngf-ignore-invalid="ignoreInvalid"
                ngf-run-all-validations="runAllValidations"
                ngf-allow-dir="allowDir"
                class="drop-box ng-pristine ng-valid"
                ngf-drop-available="dropAvailable"
                ng-src="{{speaker.base64_image || (speaker.image.$ngfBlobUrl ? speaker.image.$ngfBlobUrl : speaker.image)}}"
                alt="{{speaker.name}}"
                class="thumb">
            </div>
            <figcaption>
              <div class="icon-collapsed">
                <i class="icon svg-icon-plus"></i>
                <i class="icon svg-icon-minus-06 active"></i>
              </div>
              <h4 class="speaker-name" ng-model="speaker.name" contenteditable>{{speaker.name}}</h4>
              <p class="position text-uppercase" ng-model="speaker.company_name" contenteditable>
                {{speaker.company_name}}</p>
            </figcaption>
          </figure>

          <!--<div class="speakers-bio secondary-color-bg" id="speaker-{{speaker.uuid}}">-->
          <!--<p class="strong">{{speaker.name}}</p>-->
          <!--<p ng-model="speaker.description" contenteditable>{{speaker.description}}</p>-->
          <!--</div>-->
        </li>
      </ul>
    </div>  <!-- /.row -->
  </div>
</section>


<!-- =========================
     SCHEDULE 
============================== -->
<section ng-hide="!edit_mode && !data.schedule.enabled" class="descriptions schedule white-bg padding-120-75"
         id="schedule"
         ng-class="{'disabled': data.schedule.enabled == false}">
  <div ng-if="edit_mode" ng-click="data.schedule.toggleEnabled($event);"
       ng-title="data.schedule.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa"
            ng-class="{'fa-eye-slash': data.schedule.enabled, 'fa-eye': data.schedule.enabled == false}"></span>
    </span>
  </div>
  <div ng-if="edit_mode" ng-click="data.schedule.addDay($event)" title="Добавить блок"
       class="not-main board-settings-btn mod-add-block js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa fa-plus"></span> Добавить день
    </span>
  </div>
  <div class="hidden-overlay">Блок <strong>{{data.schedule.title}}</strong> скрыт, <a href="#"
                                                                                      ng-click="data.schedule.toggleEnabled($event);">нажмите
      здесь</a>, чтобы сделать блок видимым для пользователей
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-8 col-sm-10 col-lg-offset-3 col-md-offset-2 col-sm-offset-1">
        <div class="section-heading text-center">

          <h2 class="heading-text" contenteditable ng-model="data.schedule.title">{{data.schedule.title}}</h2>
          <hr class="lines">
          <p class="sub-heading" contenteditable ng-model="data.schedule.subtitle">{{data.schedule.subtitle}}</p>

        </div> <!-- /.section-heading -->
      </div>
    </div>  <!-- /.row -->

    <div class="row">
      <div class="col-md-12">
        <!-- TAB NAVIGATION -->
        <ul class="tab-btn" role="tablist" gridster="data.schedule.gridOptions">
          <li role="presentation" class="schedule-tab-title" gridster-item="day"
              ng-repeat="(uuid, day) in data.schedule.days track by day.uuid">
            <div class="item-remover" ng-show="edit_mode">
              <span class="fa fa-bars drag-icon"></span>
              <span class="fa fa-remove remove-icon" ng-click="data.schedule.removeDay(uuid);"></span>
            </div>
            <a class="days-tab-link" href="#day-{{day.uuid}}"
               aria-controls="day-{{day.uuid}}" role="tab" data-toggle="tab"><span ng-model="day.name" contenteditable>{{day.name}}</span></a>
          </li>
        </ul>

        <!-- TAB PANES -->
        <div class="schedule-content tab-content">
          <!-- DAY 1 -->
          <div role="tabpanel" class="tab-pane fade in schedule-tab" id="day-{{_uuid}}"
               ng-repeat="(_uuid, _day) in data.schedule.days track by _uuid">

            <div class="row" ng-if="edit_mode"> <!-- OBJECTIVE -->
              <div class="col-sm-offset-3 col-md-8 col-sm-8 mb50 add-new-objective"
                   ng-click="data.schedule.addDayItem(_uuid)">
                <div class="objective">
                  <i class="fa fa-plus add-icon" aria-hidden="true"></i>
                  <strong style="margin-top: 50px;">ДОБАВИТЬ ПУНКТ</strong>
                </div>
              </div>
            </div> <!-- /END OBJECTIVE -->

            <div class="schedule-items-wrapper" gridster="data.schedule.itemsGridOptions">
              <div class="row" ng-repeat="(objective_uuid, objective) in _day.items" gridster-item="objective">
                <!-- OBJECTIVE -->
                <div class="item-remover" ng-show="edit_mode">
                  <span class="fa fa-bars drag-icon"></span>
                  <span class="fa fa-remove remove-icon"
                        ng-click="data.schedule.removeDayItem(_uuid, objective_uuid);"></span>
                </div>
                <div class="col-md-2 col-sm-3 col-md-offset-1 mb30">
                  <div class="objective-time">

                    <p ng-model="objective.time" contenteditable="{{edit_mode}}">{{objective.time}}</p>

                  </div>
                </div>
                <div class="col-md-8 col-sm-9 mb50">
                  <div class="objective secondary-color-bg">
                    <ul class="category">
                      <li>
                        <a href="#" ng-model="objective.text_1" contenteditable="{{edit_mode}}">{{objective.text_1}}
                        </a>
                      </li>
                      <li>
                        <a href="#" ng-model="objective.text_2" contenteditable="{{edit_mode}}">{{objective.text_2}}
                        </a>
                      </li>
                    </ul>
                    <h3 class="title-text"><a href="#" ng-model="objective.title"
                                              contenteditable>{{objective.title}}</a></h3>
                    <p><a href="#" ng-model="objective.description" contenteditable="{{edit_mode}}">{{objective.description}}</a>
                    </p>
                  </div>
                </div>
              </div> <!-- /END OBJECTIVE -->
            </div>


          </div> <!-- /END DAY 1 -->
        </div>
      </div>
    </div>  <!-- /.row -->
  </div>
</section>


<!-- =========================
     CUSTOM BLOCK
============================== -->
<section ng-hide="!edit_mode && !data.custom.enabled" class="testimonials testimonials-4 padding-120-75"
         id="custom-html"
         ng-class="{'disabled': data.custom.enabled == false}">
  <div ng-if="edit_mode" ng-click="data.custom.toggleEnabled($event);"
       ng-title="data.custom.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa" ng-class="{'fa-eye-slash': data.custom.enabled, 'fa-eye': data.custom.enabled == false}"></span>
    </span>
  </div>

  <div class="hidden-overlay">Блок <strong>{{data.custom.title}}</strong> скрыт, <a href="#"
                                                                                    ng-click="data.custom.toggleEnabled($event);">нажмите
      здесь</a>, чтобы сделать блок видимым для пользователей
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-8 col-sm-10 col-lg-offset-3 col-md-offset-2 col-sm-offset-1">
        <div class="section-heading text-center">

          <h2 class="heading-text" contenteditable ng-model="data.custom.title">{{data.custom.title}}</h2>
          <hr class="lines">
          <p class="sub-heading" contenteditable ng-model="data.custom.subtitle">
            {{data.custom.subtitle}}</p>

        </div> <!-- /.section-heading -->
      </div>
    </div>  <!-- /.row -->

    <div class="row">
      <textarea ui-tinymce="data.custom.tinymce_options" class="textarea-html" ng-model="data.custom.html"
                ng-if="edit_mode"></textarea>
      <div ng-if="!edit_mode" ng-bind-html="data.custom.html"></div>
    </div>  <!-- /.row -->
  </div>
</section>

<!-- =========================
     TESTIMONIALS
============================== -->
<section ng-hide="!edit_mode && !data.testimonials.enabled"
         class="testimonials testimonials-4 secondary-bg padding-120-75" id="testimonials"
         ng-class="{'disabled': data.testimonials.enabled == false}">
  <div ng-if="edit_mode" ng-click="data.testimonials.toggleEnabled($event);"
       ng-title="data.testimonials.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa"
            ng-class="{'fa-eye-slash': data.testimonials.enabled, 'fa-eye': data.testimonials.enabled == false}"></span>
    </span>
  </div>
  <div ng-if="edit_mode" ng-click="data.testimonials.addItem();" title="Добавить блок"
       class="not-main board-settings-btn mod-add-block js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa fa-plus"></span> Добавить отзыв
    </span>
  </div>
  <div class="hidden-overlay">Блок <strong>{{data.testimonials.title}}</strong> скрыт, <a href="#"
                                                                                          ng-click="data.testimonials.toggleEnabled($event);">нажмите
      здесь</a>, чтобы сделать блок видимым для пользователей
  </div>

  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-8 col-sm-10 col-lg-offset-3 col-md-offset-2 col-sm-offset-1">
        <div class="section-heading text-center">

          <h2 class="heading-text" contenteditable ng-model="data.testimonials.title">{{data.testimonials.title}}</h2>
          <hr class="lines">
          <p class="sub-heading" contenteditable ng-model="data.testimonials.subtitle">
            {{data.testimonials.subtitle}}</p>

        </div> <!-- /.section-heading -->
      </div>
    </div>  <!-- /.row -->

    <div class="row" gridster="data.testimonials.gridOptions">
      <div
        gridster-item="item"
        ng-repeat="(key, item) in data.testimonials.items"
        class="col-md-4 col-sm-8 col-xs-12 col-md-offset-0 col-sm-offset-2"> <!-- TESTIMONIAL ITEM -->
        <div class="item-remover" ng-show="edit_mode">
          <span class="fa fa-bars drag-icon"></span>
          <span class="fa fa-remove remove-icon" ng-click="data.testimonials.removeItem(key);"></span>
        </div>
        <div class="testimonial-item secondary-color-bg text-center">
          <img
            ngf-select=""
            ngf-drop=""
            ng-disabled="!edit_mode"
            ngf-change="data.testimonials.imageChange($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, key)"
            ngf-no-object-url="true"
            ng-model="item.image"
            ngf-model-invalid="invalidFiles"
            ngf-model-options="modelOptionsObj"
            ngf-multiple="multiple"
            ngf-pattern="pattern"
            ngf-accept="acceptSelect"
            ngf-capture="capture"
            ngf-drag-over-class="dragOverClassObj"
            ngf-validate="validateObj"
            ngf-resize="resizeObj"
            ngf-resize-if="resizeIfFn($file, $width, $height)"
            ngf-dimensions="dimensionsFn($file, $width, $height)"
            ngf-duration="durationFn($file, $duration)"
            ngf-keep="keepDistinct ? 'distinct' : keep"
            ngf-fix-orientation="orientation"
            ngf-max-files="maxFiles"
            ngf-ignore-invalid="ignoreInvalid"
            ngf-run-all-validations="runAllValidations"
            ngf-allow-dir="allowDir"
            class="drop-box ng-pristine ng-valid thumb"
            ngf-drop-available="dropAvailable"
            ng-src="{{item.base64_image || (item.image.$ngfBlobUrl ? item.image.$ngfBlobUrl : item.image)}}"
            alt="{{item.name}}">
          <p class="client-name" contenteditable ng-model="item.name">{{item.name}}</p>
          <p class="position" contenteditable ng-model="item.details">{{item.details}}</p>
          <blockquote contenteditable ng-model="item.text">{{item.text}}</blockquote>

        </div>
      </div> <!-- /END TESTIMONIAL ITEM -->
    </div>  <!-- /.row -->
  </div>
</section>


<!-- =========================
     PHOTO GALLERY 
============================== -->
<section ng-hide="!edit_mode && !data.gallery.enabled" class="recap-gallery dark-image-bg gradient-overlay" id="gallery"
         ng-class="{'disabled': data.gallery.enabled == false}">
  <div ng-if="edit_mode" ng-click="data.gallery.toggleEnabled($event);"
       ng-title="data.gallery.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa"
            ng-class="{'fa-eye-slash': data.gallery.enabled, 'fa-eye': data.gallery.enabled == false}"></span>
    </span>
  </div>
  <div ng-if="edit_mode" ng-click="data.gallery.addItem();" title="Добавить блок"
       class="not-main board-settings-btn mod-add-block js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa fa-plus"></span> Добавить фото
    </span>
  </div>
  <div ng-if="edit_mode" class="board-settings-btn mod-show-menu js-show-sidebar gallery-btn" href="#"
       data-panel-id="gallery-panel">
    <span class="fa fa-ellipsis-h"></span>
    <span class="board-header-btn-text u-text-underline">Настройки</span></div>

  <div class="hidden-overlay">Блок <strong>{{data.gallery.title}}</strong> скрыт, <a href="#"
                                                                                     ng-click="data.gallery.toggleEnabled($event);">нажмите
      здесь</a>, чтобы сделать блок видимым для пользователей
  </div>

  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-8 col-sm-10 col-lg-offset-3 col-md-offset-2 col-sm-offset-1">
        <div class="section-heading text-center">

          <h2 class="heading-text" contenteditable ng-model="data.gallery.title">{{data.gallery.title}}</h2>
          <hr class="lines">
          <p class="sub-heading" contenteditable ng-model="data.gallery.subtitle">{{data.gallery.subtitle}}</p>
        </div> <!-- /.section-heading -->
      </div>

    </div>  <!-- /.row -->
    <div class="row">
      <div class="col-md-12" gridster="data.gallery.gridOptions">
        <!--<a
          ng-repeat="(key, image) in data.gallery.items"
          href="{{item.image.$ngfBlobUrl ? item.image.$ngfBlobUrl : item.image}}" class="lightbox" data-lightbox-gallery="recap" title="John Doe on SVG">-->
        <div ng-repeat="(key, image) in data.gallery.items" gridster-item="image">
          <!-- EVENT RECAP -->
          <div class="item-remover" ng-show="edit_mode">
            <span class="fa fa-bars drag-icon"></span>
            <span class="fa fa-remove remove-icon" ng-click="data.gallery.removeItem(key);"></span>
          </div>

          <figure class="recap-gallery-item" ng-if="edit_mode">
            <div class="img-scale">
              <img
                ngf-select=""
                ngf-drop=""
                ng-disabled="!edit_mode"
                ngf-change="data.gallery.itemImageChange($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, key)"
                ng-model="image.image"
                ngf-no-object-url="true"
                disallowObjectUrl
                ngf-model-invalid="invalidFiles"
                ngf-model-options="modelOptionsObj"
                ngf-multiple="multiple"
                ngf-pattern="pattern"
                ngf-accept="acceptSelect"
                ngf-capture="capture"
                ngf-drag-over-class="dragOverClassObj"
                ngf-validate="validateObj"
                ngf-resize="resizeObj"
                ngf-resize-if="resizeIfFn($file, $width, $height)"
                ngf-dimensions="dimensionsFn($file, $width, $height)"
                ngf-duration="durationFn($file, $duration)"
                ngf-keep="keepDistinct ? 'distinct' : keep"
                ngf-fix-orientation="orientation"
                ngf-max-files="maxFiles"
                ngf-ignore-invalid="ignoreInvalid"
                ngf-run-all-validations="runAllValidations"
                ngf-allow-dir="allowDir"
                class="drop-box ng-pristine ng-valid img-responsive"
                ngf-drop-available="dropAvailable"
                ng-src="{{image.base64_image || (image.image.$ngfBlobUrl ? image.image.$ngfBlobUrl : image.image)}}"
                alt="{{image.title}}">
              <!--<img src="images/gallery/event-1.jpg" alt="" class="">-->
            </div>
            <figcaption class="recap-title">
              <h5 class="title-text text-center" contenteditable ng-model="image.title">{{image.title}}</h5>
            </figcaption>
          </figure>
          <a ng-href="{{image.base64_image || (image.image.$ngfBlobUrl ? image.image.$ngfBlobUrl : image.image)}}"
             ng-if="!edit_mode" class="lightbox" data-lightbox-gallery="recap" title="{{image.title}}">
            <figure class="recap-gallery-item">
              <div class="img-scale">
                <img
                  class="drop-box ng-pristine ng-valid img-responsive"
                  ngf-drop-available="dropAvailable"
                  ng-src="{{image.base64_image || (image.image.$ngfBlobUrl ? image.image.$ngfBlobUrl : image.image)}}"
                  alt="{{image.title}}">
                <!--<img src="images/gallery/event-1.jpg" alt="" class="">-->
              </div>
              <figcaption class="recap-title">
                <h5 class="title-text text-center" contenteditable ng-model="image.title">{{image.title}}</h5>
              </figcaption>
            </figure>
          </a>
        </div> <!-- /END EVENT RECAP -->

      </div>
    </div>  <!-- /.row -->
  </div>
</section>


<!-- =========================
     TICKET BOOKING - 1
============================== -->
<section class="ticket-booking-1 padding-120-125 white-bg" ng-if="data.tickets.enabled" id="ticket-booking-1">
  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-8 col-sm-10 col-lg-offset-3 col-md-offset-2 col-sm-offset-1">
        <div class="section-heading text-center">

          <h2 class="heading-text">{{data.tickets.title}}</h2>
          <hr class="lines">
          <br>
          <script src="/widget/builder/order/<?= $event['id'] ?>"></script>

        </div> <!-- /.section-heading -->
      </div>
    </div>  <!-- /.row -->
  </div>
</section>


<!-- =========================
     SPONSORS  1
============================== -->
<section ng-hide="!edit_mode && !data.sponsors.enabled" class="sponsors-1 secondary-bg text-center"
         ng-class="{'disabled': data.sponsors.enabled == false}"
         id="sponsors">
  <div ng-if="edit_mode" ng-click="data.sponsors.toggleEnabled($event);"
       ng-title="data.sponsors.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa"
            ng-class="{'fa-eye-slash': data.sponsors.enabled, 'fa-eye': data.sponsors.enabled == false}"></span>
    </span>
  </div>
  <div ng-if="edit_mode" ng-click="data.sponsors.addItem();" title="Добавить лого"
       class="not-main board-settings-btn mod-add-block js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa fa-plus"></span> Добавить логотип
    </span>
  </div>
  <div ng-if="edit_mode" style="background-color: var(--accent);"
       class="board-settings-btn mod-show-menu js-show-sidebar" ng-click="data.sponsors.toggleBecomeASponsor()">
    <span class="fa"
          ng-class="{'fa-eye-slash': data.sponsors.become_a_sponsor_enabled, 'fa-eye': !data.sponsors.become_a_sponsor_enabled}"></span>
    <span class="board-header-btn-text u-text-underline">{{data.sponsors.toggler_text}}</span></div>

  <div class="hidden-overlay">Блок <strong>{{data.sponsors.title}}</strong> скрыт,
    <a href="#" ng-click="data.sponsors.toggleEnabled($event);">нажмите здесь</a>,
    чтобы сделать блок видимым для пользователей
  </div>

  <div class="container">
    <p class="heading-pre-suf mb50" contenteditable ng-model="data.sponsors.title">{{data.sponsors.title}}</p>
    <ul class="client-logo" gridster="data.sponsors.gridOptions">
      <li
        gridster-item="item"
        ng-repeat="(key, item) in data.sponsors.items"> <!-- TESTIMONIAL ITEM -->
        <div class="item-remover" ng-show="edit_mode">
          <span class="fa fa-bars drag-icon"></span>
          <span class="fa fa-remove remove-icon" ng-click="data.sponsors.removeItem(key);"></span>
        </div>
        <img
          ngf-select=""
          ngf-drop=""
          ng-disabled="!edit_mode"
          ngf-change="data.sponsors.imageChange($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, key)"
          ng-model="item.image"
          ngf-no-object-url="true"
          ngf-model-invalid="invalidFiles"
          ngf-model-options="modelOptionsObj"
          ngf-multiple="multiple"
          ngf-pattern="pattern"
          ngf-accept="acceptSelect"
          ngf-capture="capture"
          ngf-drag-over-class="dragOverClassObj"
          ngf-validate="validateObj"
          ngf-resize="resizeObj"
          ngf-resize-if="resizeIfFn($file, $width, $height)"
          ngf-dimensions="dimensionsFn($file, $width, $height)"
          ngf-duration="durationFn($file, $duration)"
          ngf-keep="keepDistinct ? 'distinct' : keep"
          ngf-fix-orientation="orientation"
          ngf-max-files="maxFiles"
          ngf-ignore-invalid="ignoreInvalid"
          ngf-run-all-validations="runAllValidations"
          ngf-allow-dir="allowDir"
          class="drop-box ng-pristine ng-valid thumb"
          ngf-drop-available="dropAvailable"
          ng-src="{{item.base64_image || (item.image.$ngfBlobUrl ? item.image.$ngfBlobUrl : item.image)}}"
          alt="{{item.name}}">
      </li>
    </ul>

    <a href="#" class="btn btn-trans btn-lg btn-sponsors" ng-hide="!data.sponsors.become_a_sponsor_enabled"
       contenteditable
       ng-click="data.sponsors.openFeedbackModal()"
       ng-model="data.sponsors.become_a_sponsor">{{data.sponsors.become_a_sponsor}}</a>

  </div>
</section>


<!-- =========================
     FAQ 
============================== -->
<section ng-hide="!edit_mode && !data.faq.enabled" class="faqs faqs-2 padding-120-60" id="faq"
         ng-class="{'disabled': data.faq.enabled == false}">
  <div ng-if="edit_mode" ng-click="data.faq.toggleEnabled($event);"
       ng-title="data.faq.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa" ng-class="{'fa-eye-slash': data.faq.enabled, 'fa-eye': data.faq.enabled == false}"></span>
    </span>
  </div>
  <div ng-if="edit_mode" ng-click="data.faq.addItem();" title="Добавить вопрос"
       class="not-main board-settings-btn mod-add-block js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa fa-plus"></span> Добавить вопрос
    </span>
  </div>
  <div class="hidden-overlay">Блок <strong>{{data.faq.title}}</strong> скрыт, <a href="#"
                                                                                 ng-click="data.faq.toggleEnabled($event);">нажмите
      здесь</a>, чтобы сделать блок видимым для пользователей
  </div>


  <div class="container">
    <div class="row">
      <div class="col-lg-6 col-md-8 col-sm-10 col-lg-offset-3 col-md-offset-2 col-sm-offset-1">
        <div class="section-heading text-center">

          <h2 class="heading-text" contenteditable ng-model="data.faq.title">{{data.faq.title}}</h2>
          <hr class="lines">
          <p class="sub-heading" contenteditable ng-model="data.faq.subtitle">{{data.faq.subtitle}}</p>

        </div> <!-- /.section-heading -->
      </div>
    </div>  <!-- /.row -->

    <div class="row faqs-2-items" gridster="data.faq.gridOptions">
      <div class="col-md-6 mb60" gridster-item="item" ng-repeat="(key,item) in data.faq.items track by item.uuid">
        <div class="item-remover" ng-show="edit_mode">
          <span class="fa fa-bars drag-icon"></span>
          <span class="fa fa-remove remove-icon" ng-click="data.faq.removeItem(key);"></span>
        </div>
        <h5 class="title-text" contenteditable ng-model="item.question">{{item.question}}</h5>
        <p contenteditable ng-model="item.answer">{{item.answer}}</p>
      </div>
    </div>  <!-- /.row -->

  </div>
</section>


<!-- =========================
     OUR LOCATION 
============================== -->
<section ng-hide="!edit_mode && !data.map.enabled" class="map-container padding-120-60"
         ng-class="{'disabled': data.map.enabled == false}">
  <div ng-if="edit_mode" ng-click="data.map.toggleEnabled($event);"
       ng-title="data.map.enabled == true ? 'Скрыть блок' : 'Показать блок'"
       class="board-settings-btn mod-show-menu js-show-sidebar not-main" href="#">
    <span class="board-header-btn-text">
      <span class="fa" ng-class="{'fa-eye-slash': data.map.enabled, 'fa-eye': data.map.enabled == false}"></span>
    </span>
  </div>
  <div class="hidden-overlay">Блок <strong>{{data.map.title}}</strong> скрыт, <a href="#"
                                                                                 ng-click="data.map.toggleEnabled($event);">нажмите
      здесь</a>, чтобы сделать блок видимым для пользователей
  </div>
  <div class="container">
    <div id="mapBig" class="map cover-map"></div>
  </div>
</section>

<button type="button" ng-click="saveLandingData();" class="fab" id="fab-save" data-intro="{{intro.steps[6]}}"
        data-step="7" ng-show="edit_mode"
        style="position: fixed; bottom: 50px; right: 50px; border-radius: 500px; background-color: var(--accent)">
  <span class="fa fa-save"></span>
</button>

<footer class="footers footer-1">

  <div class="container text-center">
    <p class="contact-help">Возникли вопросы?</p>
    <p><a href="#" ng-click="data.sponsors.openFeedbackModal();" class="btn btn-primary feedback-btn">Свяжитесь с
        нами</a></p>

    <ul class="socialize">
      <li ng-if="data.main.vk_url"><a href="#" target="_blank" ng-href="/away.php?url={{data.main.vk_url}}">
          <span class="fa fa-vk"></span>
        </a></li>

      <li ng-if="data.main.facebook_url"><a href="#" target="_blank" ng-href="/away.php?url={{data.main.facebook_url}}">
          <span class="fa fa-facebook-official"></span>
        </a></li>

      <li ng-if="data.main.instagram_url"><a href="#" target="_blank"
                                             ng-href="/away.php?url={{data.main.instagram_url}}">
          <span class="fa fa-instagram"></span>
        </a></li>
    </ul>

    <p class="copyright"><a target="_blank"
                            href="https://evendate.io/organization/<?= $event['organization_id'] ?>"><?= $event['organization_short_name'] ?></a>
    </p>
    <p class="copyright">© <a target="_blank" href="https://evendate.io">Evendate</a></p>
  </div>
</footer>

<div class="board-menu js-fill-board-menu" id="header-panel">
  <div class="board-menu-container">
    <div class="board-menu-header js-board-menu-title is-in-frame">
      <h3 class="board-menu-header-title js-board-menu-title-text">Настройки заголовка
        <span class="fa fa-close panel-close"></span>
      </h3>
      <hr class="board-menu-header-divider">
    </div>
    <div class="board-menu-content u-fancy-scrollbar js-board-menu-content-wrapper">
      <div class="board-menu-content-frame">
        <div>Прозрачность наложения:</div>
        <div class="range-slider">
          <input type="range" ng-model="data.overlay_opacity" ng-change="setOverlayOpacity()"
                 class="range-slider__range" min="0" max="100">
          <span class="range-slider__value">{{data.overlay_opacity}} %</span>
        </div>
        <hr class="board-menu-header-divider">
        <div class="board-backgrounds-section-tiles u-clearfix">
          <div ng-click="setHeaderImage(background.image)" ng-repeat="background in backgrounds"
               class="board-backgrounds-section-tile board-backgrounds-photos-tile js-bg-photos">
            <div class="image" style="background-image: url({{background.thumb || background.image}})"></div>
            <div class="title" style="">{{background.title}} <a ng-if="background.user"
                                                                ng-href="{{background.user.links.html}}?utm_source=Evendate&utm_medium=referral&utm_campaign=api-credit"
                                                                target="_blank">{{background.user.name}}</a></div>
          </div>
          <div class="board-backgrounds-section-tile board-backgrounds-photos-tile js-bg-photos">
            <div ngf-select=""
                 ngf-drop=""
                 ngf-change="data.header.imageChange($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event)"
                 ng-model="data.main_background"
                 ngf-no-object-url="true"
                 ngf-model-invalid="invalidFiles"
                 ngf-model-options="modelOptionsObj"
                 ngf-multiple="multiple"
                 ngf-pattern="pattern"
                 ngf-accept="acceptSelect"
                 ngf-capture="capture"
                 ngf-drag-over-class="dragOverClassObj"
                 ngf-validate="validateObj"
                 ngf-resize="resizeObj"
                 ngf-resize-if="resizeIfFn($file, $width, $height)"
                 ngf-dimensions="dimensionsFn($file, $width, $height)"
                 ngf-duration="durationFn($file, $duration)"
                 ngf-keep="keepDistinct ? 'distinct' : keep"
                 ngf-fix-orientation="orientation"
                 ngf-max-files="maxFiles"
                 ngf-ignore-invalid="ignoreInvalid"
                 ngf-run-all-validations="runAllValidations"
                 ngf-allow-dir="allowDir"
                 class="image drop-box ng-pristine ng-valid thumb"
                 ngf-drop-available="dropAvailable"
                 style="background-image: url({{data.main_background.$ngfBlobUrl ? data.main_background.$ngfBlobUrl : data.default_img}})">
            </div>
            <div class="title" style="">Загрузить</div>
          </div>
        </div>
      </div>
    </div>
    <div style="display: block; font-size: 15px;">Background recommendations by <a
        href="https://unsplash.com/?utm_source=Evendate&utm_medium=referral&utm_campaign=api-credit" target="_blank">Unsplash.com</a>
    </div>
  </div>
</div>

<div class="main-settings-btn" data-intro="{{intro.steps[4]}}" data-step="5" ng-if="edit_mode"
     data-panel-id="main-settings-panel">
  <span class="fa fa-cog"></span>
</div>

<div class="board-menu js-fill-board-menu left-menu" style="left: -340px;" id="main-settings-panel">
  <div class="board-menu-container">
    <div class="board-menu-header js-board-menu-title is-in-frame">
      <h3 class="board-menu-header-title js-board-menu-title-text">Общие настройки
        <span class="fa fa-close panel-close"></span>
      </h3>
    </div>
    <div class="board-menu-content u-fancy-scrollbar js-board-menu-content-wrapper">
      <div class="board-menu-content-frame">
        <div class="demo-style-switch" id="switch-style" style="left: 0px;">
          <div class="switched-options">
            <div class="config-title">Адрес страницы:</div>
            <div class="form-group" ng-class="{'has-success': data.main.bad_url === false}">
              <div class="input-group">
                <div class="input-group-addon" style="font-size: 12px;">https://evendate.io/</div>
                <input type="text" class="form-control" placeholder="" ng-model="data.main.url">
                <span class="input-group-btn">
                <button class="btn btn-primary btn-apply-url" type="button" ng-click="checkAlias()"><span
                    class="fa fa-check"></span></button>
              </span>
              </div>
              <div class="alert" ng-class="{'alert-danger': data.main.bad_url === true}"
                   ng-show="data.main.bad_url === true" id="url-check" role="alert">
                {{data.main.bad_url_text}}
              </div>
            </div>

            <div class="config-title">Цветовая тема:</div>
            <ul class="styles" data-intro="{{intro.steps[5]}}" data-step="6">
              <li>
                <div class="green color" id="green" ng-click="setGlobalColor({r: 0, g: 205, b: 175})">
                </div>
              </li>

              <li>
                <div class="red color" id="red" ng-click="setGlobalColor({r: 252, g: 95, b: 69})">
                </div>
              </li>

              <li>
                <div class="purple color" id="purple" ng-click="setGlobalColor({r: 178, g: 124, b: 245})">
                </div>
              </li>

              <li>
                <div class="yellow color" id="yellow" ng-click="setGlobalColor({r: 254, g: 185, b: 96})">
                </div>
              </li>

              <li>
                <div class="green-2 color" id="green-2" ng-click="setGlobalColor({r: 117, g: 169, b: 50})">
                </div>
              </li>

              <li>
                <div class="blue color" id="blue" ng-click="setGlobalColor({r: 0, g: 142, b: 214})">
                </div>
              </li>

              <li>
                <div class="gold color" id="gold" ng-click="setGlobalColor({r: 186, g: 173, b: 124})">
                </div>
              </li>

              <li>
                <div class="pink color" id="pink" ng-click="setGlobalColor({r: 254, g: 55, b: 162})">
                </div>
              </li>

              <li>
                <div class="violet color" id="violet" ng-click="setGlobalColor({r: 120, g: 92, b: 180})">
                </div>
              </li>
              <li>
                <input type="color" id="html5colorpicker" ng-model="data.color_scheme" ng-change="setGlobalColor()"
                       value="#ff0000" style="width: 100%; display: none;"
                       class="ng-pristine ng-untouched ng-valid ng-not-empty">
                <div class="sp-replacer sp-light">
              </li>
            </ul>

            <div class="config-title">Ссылки на социальные сети:</div>
            <div class="input-group">
              <div class="input-group-addon" style="font-size: 12px;"><span class="fa fa-vk"></span></div>
              <input type="text" class="form-control" placeholder="Вконтакте" ng-model="data.main.vk_url">
            </div>
            <div class="input-group">
              <div class="input-group-addon" style="font-size: 14px; padding: 0 14px;"><span
                  class="fa fa-facebook"></span></div>
              <input type="text" class="form-control" placeholder="Facebook" ng-model="data.main.facebook_url">
            </div>
            <div class="input-group">
              <div class="input-group-addon" style="font-size: 12px;"><span class="fa fa-instagram"></span></div>
              <input type="text" class="form-control" placeholder="Instagram" ng-model="data.main.instagram_url">
            </div>

            <div class="config-title">Идентификаторы для аналитики:</div>
            <div class="input-group">
              <div class="input-group-addon" style="font-size: 12px;"><span class="fa fa-yahoo"></span></div>
              <input type="text" class="form-control" placeholder="Яндекс.Метрика"
                     ng-model="data.main.yandex_metrica_id">
            </div>
            <div class="input-group">
              <div class="input-group-addon" style="font-size: 12px;"><span class="fa fa-google"></span></div>
              <input type="text" class="form-control" placeholder="Google Analytics"
                     ng-model="data.main.google_analytics_id">
            </div>
            <div class="config-title">Идентификаторы ретаргетинга:</div>
            <div class="input-group">
              <div class="input-group-addon" style="font-size: 12px;"><span class="fa fa-vk"></span></div>
              <input type="text" class="form-control" placeholder="ВКонтакте" ng-model="data.main.vk_retargeting_id">
            </div>
            <div class="input-group">
              <div class="input-group-addon" style="font-size: 14px; padding: 0 14px;"><span
                  class="fa fa-facebook"></span></div>
              <input type="text" class="form-control" placeholder="Facebook"
                     ng-model="data.main.facebook_retargeting_id">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="board-menu js-fill-board-menu" id="gallery-panel">
  <div class="board-menu-container">
    <div class="board-menu-header js-board-menu-title is-in-frame">
      <h3 class="board-menu-header-title js-board-menu-title-text">Настройки галлереи
        <span class="fa fa-close panel-close"></span>
      </h3>
      <hr class="board-menu-header-divider">
    </div>
    <div class="board-menu-content u-fancy-scrollbar js-board-menu-content-wrapper">
      <div class="board-menu-content-frame">
        <div>Прозрачность наложения:</div>
        <div class="range-slider">
          <input type="range" ng-model="data.gallery_overlay_opacity" ng-change="setGalleryOverlayOpacity()"
                 class="range-slider__range" min="0" max="100">
          <span class="range-slider__value">{{data.gallery_overlay_opacity}} %</span>
        </div>
        <hr class="board-menu-header-divider">
        <div class="board-backgrounds-section-tiles u-clearfix">

          <div ng-click="setGalleryImage(background.image)" ng-repeat="background in backgrounds"
               class="board-backgrounds-section-tile board-backgrounds-photos-tile js-bg-photos">
            <div class="image" style="background-image: url({{background.thumb || background.image}})"></div>
            <div class="title" style="">{{background.title}} <a ng-if="background.user"
                                                                ng-href="{{background.user.links.html}}?utm_source=Evendate&utm_medium=referral&utm_campaign=api-credit"
                                                                target="_blank">{{background.user.name}}</a></div>
          </div>
          <div class="board-backgrounds-section-tile board-backgrounds-photos-tile js-bg-photos">
            <div ngf-select=""
                 ngf-drop=""
                 ng-disabled="!edit_mode"
                 ngf-no-object-url="true"
                 ng-model="data.gallery_background"
                 ngf-model-invalid="invalidFiles"
                 ngf-model-options="modelOptionsObj"
                 ngf-multiple="multiple"
                 ngf-pattern="pattern"
                 ngf-accept="acceptSelect"
                 ngf-capture="capture"
                 ngf-drag-over-class="dragOverClassObj"
                 ngf-validate="validateObj"
                 ngf-resize="resizeObj"
                 ngf-resize-if="resizeIfFn($file, $width, $height)"
                 ngf-dimensions="dimensionsFn($file, $width, $height)"
                 ngf-duration="durationFn($file, $duration)"
                 ngf-keep="keepDistinct ? 'distinct' : keep"
                 ngf-fix-orientation="orientation"
                 ngf-max-files="maxFiles"
                 ngf-ignore-invalid="ignoreInvalid"
                 ngf-run-all-validations="runAllValidations"
                 ngf-allow-dir="allowDir"
                 class="image drop-box ng-pristine ng-valid thumb"
                 ngf-drop-available="dropAvailable"
                 style="background-image: url({{data.gallery_background.$ngfBlobUrl ? data.gallery_background.$ngfBlobUrl : data.default_img}})">
            </div>
            <div class="title" style="">Загрузить</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Закрыть"><span
            aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Обратная связь с организатором</h4>
      </div>
      <div class="modal-body">
        <div class="alert alert-danger feedback-modal-error hidden" role="alert"><strong>Ошибка</strong>
          <span class="text"></span>
        </div>
        <form class="feedback-form">
          <div class="form-group">
            <label for="sender-name" class="control-label">ФИО:</label>
            <input type="text" name="name" class="form-control" id="sender-name">
          </div>
          <div class="form-group">
            <label for="sender-email" class="control-label">Email:</label>
            <input type="text" name="email" class="form-control" id="sender-email">
          </div>
          <div class="form-group">
            <label for="sender-phone" class="control-label">Номер телефона:</label>
            <input type="text" name="phone" class="form-control" id="sender-phone">
          </div>
          <div class="form-group">
            <label for="message-text" class="control-label">Сообщение:</label>
            <textarea class="form-control" name="message" id="message-text" style=""></textarea>
          </div>
          <input type="hidden" name="URL" id="current-url">
        </form>
        <div class="alert alert-success feedback-modal-success hidden" role="alert"><strong>Ура!</strong>
          <span class="text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default feedback-modal-btn" data-dismiss="modal">Отмена</button>
        <button type="button" class="btn btn-primary feedback-modal-btn send-btn" ng-click="sendFeedback();">Отправить</button>
      </div>
    </div>
  </div>
</div>


<!-- =========================
     SCRIPTS
============================== -->
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-sanitize.js"></script>
<script src="/event_landing/js/md5.min.js"></script>
<script src="/event_landing/js/jquery-1.11.3.min.js"></script>
<script src="/event_landing/js/nprogress.js"></script>
<script src="/event_landing/js/spectrum.js"></script>
<script src="/event_landing/js/bootstrap.min.js"></script>
<script src="/event_landing/js/tinymce.min.js"></script>
<script src="/event_landing/js/angular-tinymce.js"></script>
<script src="/event_landing/js/color-thief.min.js"></script>
<script src="/event_landing/js/application.js"></script>
<script src="/event_landing/js/app.js"></script>
<script src="/event_landing/js/nivo-lightbox.min.js"></script>
<script src="/event_landing/js/jquery.scrollTo.min.js"></script>
<script src="/event_landing/js/jquery.localScroll.min.js"></script>
<script src="/event_landing/js/jquery.nav.js"></script>
<script src="/event_landing/js/jquery.fitvids.js"></script>
<script src="/event_landing/js/matchMedia.js"></script>
<script src="/event_landing/js/jquery.mixitup.js"></script>
<script src="/event_landing/js/swiper.jquery.min.js"></script>
<script src="/event_landing/js/SVGinject.js"></script>
<script src="/event_landing/js/smoothscroll.js"></script>
<script src="/event_landing/js/intro.min.js"></script>
<script src="https://maps.google.com/maps/api/js?sensor=true&key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg"></script>

<!-- Yandex.Metrika counter -->
<script src="https://mc.yandex.ru/metrika/tag.js" type="text/javascript"></script>
<script type="text/javascript"> try {
        window.yaCounter32442130 = new Ya.Metrika2({
            id: 32442130,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            trackHash: true
        });
    } catch (e) {
    } </script>
<noscript>
  <div><img src="https://mc.yandex.ru/watch/32442130" style="position:absolute; left:-9999px;" alt=""/></div>
</noscript> <!-- /Yandex.Metrika counter -->

<?php
if (isset($l_data['main']['yandex_metrica_id'])) {
	$ym_id = htmlspecialchars($l_data['main']['yandex_metrica_id']);
	echo '	<!-- Yandex.Metrika counter -->
	<script src="https://mc.yandex.ru/metrika/tag.js" type="text/javascript"></script>
	<script type="text/javascript"> try {
			window.yaCounter' . $ym_id . ' = new Ya.Metrika2({
				id: ' . $ym_id . ',
				clickmap: true,
				trackLinks: true,
				accurateTrackBounce: true,
				webvisor: true,
				trackHash: true
			});
		} catch (e) {
		} </script>
	<noscript>
		<div><img src="https://mc.yandex.ru/watch/' . $ym_id . '" style="position:absolute; left:-9999px;" alt=""/></div>
	</noscript> <!-- /Yandex.Metrika counter -->';
}
if (isset($l_data['main']['google_analytics_id'])) {
	$ga_id = htmlspecialchars($l_data['main']['google_analytics_id']);
	echo "<script>
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		if (ga) {
			ga('create', '{$ga_id}', 'auto');
			ga('send', 'pageview');
		}

	</script>";
}
if (isset($l_data['main']['vk_retargeting_id'])) {
	$vk_ret_id = htmlspecialchars($l_data['main']['vk_retargeting_id']);
	echo "<script type=\"text/javascript\">(window.Image ? (new Image()) : document.createElement('img')).src = 'https://vk.com/rtrg?p={$vk_ret_id}';</script>";
}
if (isset($l_data['main']['facebook_retargeting_id'])) {
	$fb_ret_id = htmlspecialchars($l_data['main']['facebook_retargeting_id']);
	echo "<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{$fb_ret_id}'); // Insert your pixel ID here.
fbq('track', 'PageView');
</script>
<noscript><img height=\"1\" width=\"1\" style=\"display:none\"
src=\"https://www.facebook.com/tr?id={$fb_ret_id}&ev=PageView&noscript=1\"
/></noscript>
<!-- DO NOT MODIFY -->
<!-- End Facebook Pixel Code -->";
}
?>

</body>
</html>