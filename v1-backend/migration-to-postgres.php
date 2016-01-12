<?php

	require 'bin/db.php';

	$result = $__db->query('SELECT id, event_start_date, event_end_date, end_time, begin_time,
 		  (SELECT COUNT(*) FROM events_dates WHERE event_id = events.id AND status = 1) as dates_count
 		FROM events');
	$rows = $result->fetchAll();

	$p_upd_event = $__db->prepare("UPDATE events SET dates_range = :is_range, images_domain = 'http://dn" . (rand(1, 4) . ".evendate.ru/'"));
	$p_upd_event_dates = $__db->prepare("UPDATE events_dates SET start_time = :start_time, end_time = :end_time WHERE event_id = :event_id");

	$p_ins_date = $__db->prepare('INSERT INTO events_dates(event_date, event_id, start_time, end_time, status)
			VALUES(:date, :event_id, :start_time, :end_time, TRUE)');

	foreach($rows as $event){
		if ($event['dates_count'] == 0){
			$p_upd_event->execute(array(':is_range' => true));
			$end_date = new DateTime($event['event_end_date']);
			$end_date->add(new DateInterval('P1D'));
			$period = new DatePeriod(
				new DateTime($event['event_start_date']),
				new DateInterval('P1D'),
				$end_date
			);
			foreach($period as $date){
				$to_ins_dates[] = $date->format('Y-m-d');
			}
			if (count($event['dates_range']) == 0 && $event['event_start_date'] == $event['event_end_date']){
				$_date = new DateTime($event['event_start_date']);
				$to_ins_dates[] = $_date->format('Y-m-d');
			}

			foreach($to_ins_dates as $date){
				$p_ins_date->execute(array(
					':date' => $date,
					':event_id' => $event['id'],
					':start_time' => $event['start_time'],
					':end_time' => $event['end_time'],
				));
			}
		}

		$p_upd_event_dates->execute(array(
			':start_time' => $event['start_time'],
			':end_time' => $event['end_time'],
			':event_id' => $event['id']
		));
	}
