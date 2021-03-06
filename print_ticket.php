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

require_once "{$BACKEND_FULL_PATH}/events/Class.EventDate.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.EventsDatesCollection.php";
require_once "{$BACKEND_FULL_PATH}/users/Class.UsersCollection.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.OrdersCollection.php";
require_once "{$BACKEND_FULL_PATH}/events/Class.TicketsCollection.php";


if (App::$ENV == 'prod' || App::$ENV == 'test') {
	$DEBUG_MODE = isset($_GET['debug']) ? true : false;
} else {
	$DEBUG_MODE = true;
	ini_set("display_errors", 1);
	error_reporting(E_ALL);
}
App::buildGlobal($__db);

$user = App::getCurrentUser();

$ticket_instance = TicketsCollection::oneByUUID($__db, $user, $_GET['uuid'], Fields::parseFields('order,user,ticket_type'));
$ticket = $ticket_instance->getParams($user, Fields::parseFields('order,user,number,ticket_type'))
	->getData();

$order = OrdersCollection::oneByUUID($__db, $user, $ticket_instance->getOrderUUID(), array());
$user_names = $order->getCustomerName();

$event = EventsCollection::filter($__db, $user, array('id' => $ticket['event_id'], 'ticket' => $ticket_instance), Fields::parseFields('location,dates,organization_logo_small_url,organization_short_name,organization_name'))
	->getParams($user, Fields::parseFields('location,dates{fields:"start_time,end_time,start_datetime_utc,end_datetime_utc",order_by:"start_datetime_utc"},organization_short_name,organization_logo_small_url,organization_name'))
	->getData();

$first_date_time = $event['dates'][0]['start_time'];

function formatNumber($number)
{

	return preg_replace('/(\d{3})/', '$1 ', $number);
}

function formatDates($start_date_timestamp, $end_timestamp)
{
  global $first_date_time;
	$first_date = new DateTimeImmutable('@' . $start_date_timestamp);
	$last_date = new DateTimeImmutable('@' . $end_timestamp);
	$interval = $first_date->diff($last_date);

	$month = array(
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	);
	$ru_month = array(
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	);

	if ($interval->format('y') == 0) {
		if ($interval->format('m') == 0) {
			if ($interval->format('d') == 0) {
				$formatted_string = $first_date->format('j F Y');
			} else {
				$formatted_string = $first_date->format('j') . '-' . $last_date->format('j F Y');
			}
		} else {
			$formatted_string = $first_date->format('j F') . ' — ' . $last_date->format('j F Y');
		}
	} else {
		$formatted_string = $first_date->format('F Y') . ' — ' . $last_date->format('F Y');
	}

	$formatted_string = str_replace($month, $ru_month, $formatted_string);

	if ($interval->format('s') == 0) {
		$formatted_string .= ', ' . $first_date_time;
	}

	return $formatted_string;
}

?>
<style>

  <?php
    if (realpath(__FILE__) == realpath($_SERVER['SCRIPT_FILENAME'])) {
	if ($DEBUG_MODE) {
		require_once "{$ROOT_PATH}/dist/app.css";
	} else {
		require_once "{$ROOT_PATH}/dist/app.min.css";
	}
}
  ?>

  body {
    background: transparent;
  }

  <?php require_once "{$ROOT_PATH}/app/src/css/print.css"; ?>
</style>

<div class="ticket">
  <img class="ticket_qr" src="/api/v1/events/<?= "{$event['id']}/tickets/{$ticket['uuid']}/qr" ?>">
  <header class="ticket_header">
    <div class="ticket_header_unit"><span class="ticket_header_unit_key">Билет</span> <span
        class="ticket_header_unit_value"><?= formatNumber($ticket['number']) ?></span></div>
    <div class="ticket_header_unit"><span class="ticket_header_unit_key">Заказ</span> <span
        class="ticket_header_unit_value"><?= formatNumber($ticket['order']['number']) ?></span></div>
    <div class="ticket_header_unit">
      <span><?= "{$user_names['last_name']} {$user_names['first_name']}" ?></span>
    </div>
  </header>
  <h1 class="ticket_title"><?= $event['title'] ?></h1>
  <div class="fields_wrapper -columns_2">
    <div class="field" style="width: 50%"><span class="field_name">Тип билета</span><span
        class="field_value"><?=$ticket['ticket_type']['name'] ?></span></div>
    <div class="field" style="width: 50%"><span class="field_name">Цена билета</span><span
        class="field_value"><?= $ticket['price'] == 0 ? 'Бесплатный' : number_format($ticket['price'], 0, ',', ' ') . ' ₽' ?></span></div>
  </div>
  <div class="fields_wrapper -columns_2">
    <div class="field" style="width: 50%"><span class="field_name">Место</span><span
        class="field_value"><?= $event['location'] ?></span></div>
    <div class="field" style="width: 50%"><span class="field_name">Дата и время</span><span
        class="field_value"><?= formatDates($event['first_event_date'], $event['last_event_date']); ?></span></div>
  </div>
  <div class="fields_wrapper -columns_2">
    <div class="field">
      <span class="field_name">Организатор</span>
      <div class="field_value">
        <div class="avatar_block">
          <div class="avatar -size_30x30" title="<?= $event['organization_short_name'] ?>"><img
              src="<?= $event['organization_logo_small_url'] ?>"></div>
          <span class="avatar_name"><?= $event['organization_short_name'] ?></span>
        </div>
      </div>
    </div>
  </div>
  <hr class="line_dashed" style="margin-top: 24px">
  <p class="ticket_description">Организатор — <?= $event['organization_name'] ?></p>
  <p class="ticket_description">Организатор — Билетный агент — Evendate.io<br>
    ООО « Эвендейт; ОГРН 1170726002501; ИНН 0706005473; КПП 070601001;
    Юридический адрес: 361820, с. Аушигер, ул.Бицуева, д.70, Контактная информация: support@evendate.io, +7 (499) 381-6106;</p>
  <p class="ticket_description -text_small">— Этот электронный билет является подтверждением вашей оплаты участия в
    мероприятии. Обязательно возьмите его с собой на мероприятие (в электронном и/или бумажном виде).<br>
    — Не передавайте и не пересылайте свой электронный билет третьим лицам! Электронный билет действителен для прохода
    на мероприятие 1 раз. В случае использования электронного билета третьим лицом ответственность за это несет
    покупатель.<br>
    — Агент не несет ответственности за достоверность информации о мероприятии и соответствие мероприятия ожиданиям
    покупателя. Всю ответственность за анонсирование, организацию и проведение мероприятия, а также за возможный ущерб в
    случае изменения программы, переноса или отмены мероприятия, несет организатор мероприятия.<br>
    — Политика возврата электронных билетов определяется организатором мероприятия<br>
    — Полная версия правил покупки электронного билета размещена в интернете по адресу <a
      href="//evendate.ru/docs/useragreement.pdf" class="link">https//evendate.ru/docs/useragreement.pdf</a></p>
  <hr class="line_dashed" style="margin-bottom: 24px">
  <div class="ticket_bottoms">
    <span class="field_value"><?= $event['location'] ?></span>
    <img style="object-fit: cover" width="100%" height="269"
         src="https://maps.googleapis.com/maps/api/staticmap?markers=<?= urlencode($event['location']) ?>&zoom=15&size=640x640&scale=2&format=png&maptype=roadmap&key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg">
  </div>
  <footer class="ticket_footer">
    <div class="ticket_footer_brand img_holder">
      <img src="/app/img/brand.png?v=f7ff6c58ee76c1a3a7ed091510e9e288">
    </div>
    <div class="ticket_footer_text">
      <span>Электронные билеты и информация о мероприятии в мобильном приложении</span>
    </div>
    <div class="ticket_mobile_app">
      <div class="img_holder"><img width="36" src="/app/img/qr/android.png"></div>
      <aside class="ticket_mobile_app_aside">
					<span>Evendate<br>
							для Android</span>
        <div class="img_holder">
          <img width="47" src="/app/img/download_app_band/download_android_app.png">
        </div>
      </aside>
    </div>
    <div class="ticket_mobile_app">
      <div class="img_holder"><img width="36" src="/app/img/qr/ios.png"></div>
      <aside class="ticket_mobile_app_aside">
					<span>Evendate<br>
							для iOS</span>
        <div class="img_holder">
          <img width="47" src="/app/img/download_app_band/download_ios_app.png">
        </div>
      </aside>
    </div>
  </footer>
</div>