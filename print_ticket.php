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


try {
	$user = new User($__db);
} catch (Exception $e) {
	$user = App::getCurrentUser();
}

$ticket = TicketsCollection::oneByUUID( $__db, $user, $_GET['uuid'], Fields::parseFields('order,user,ticket_type'))
	->getParams($user, Fields::parseFields('order,user,number,ticket_type'))
	->getData();

$event = EventsCollection::one( $__db, $user, $ticket['event_id'], Fields::parseFields('location,dates'))
	->getParams($user, Fields::parseFields('location,dates'))
	->getData();

function formatNumber($number) {

	return preg_replace( '/(\d{3})/', '$1 ', $number);
}

function formatDates($start_date, $end_date) {
	$current_date = new DateTimeImmutable();
	$first_date = new DateTimeImmutable($start_date);
	$last_date = new DateTimeImmutable($end_date);


}

?>
<link rel="stylesheet" href="/dist/app.css">
<style><?php
	require_once "{$ROOT_PATH}/app/src/css/print.css"; ?>
</style>
<header class="ticket_header">
	<div class="ticket_header_unit"><span class="-transform_uppercase -color_marginal">Билет</span> <span class="-color_accent"><?=formatNumber($ticket['number']) ?></span></div>
	<div class="ticket_header_unit"><span class="-transform_uppercase -color_marginal">Заказ</span> <span class="-color_accent"><?=formatNumber($ticket['order']['number']) ?></span></div>
	<div class="ticket_header_unit"><span><?="{$ticket['user']['last_name']} {$ticket['user']['first_name']} {$ticket['user']['middle_name']}"?></span></div>
</header>
<h1><?=$event['title']?></h1>
<div class="fields_wrapper -columns_2">
	<div class="field "><span class="field_name">Тип билета</span><span class="field_value"><?=$ticket['ticket_type']['name']?></span></div>
	<div class="field "><span class="field_name">Цена билета</span><span class="field_value"><?=$ticket['price']?></span></div>
</div>
<div class="fields_wrapper -columns_2">
	<div class="field "><span class="field_name">Место</span><span class="field_value"><?=$event['location']?></span></div>
	<div class="field "><span class="field_name">Дата и время</span><span class="field_value"><?php print_r( $event['last_event_date']);?></span></div>
</div>