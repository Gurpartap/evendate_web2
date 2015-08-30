<?php

require_once $ROOT_PATH.'backend/events/Class.Event.php';
require_once $ROOT_PATH.'backend/events/Class.EventsCollection.php';

$__modules['events'] = array(
	'GET' => array(
		'all' => function () use ($__db, $__request, $__user) {
			return EventsCollection::filter($__db, $__user, array());
		},
		'{/(date:[0-9]+-[0-9]+-[0-9]+)}' => function($date) use ($__db, $__request, $__user){
			return EventsCollection::filter($__db, $__user, array('date' => $date));
		},
		'' => function () use ($__db, $__request, $__user) { /*MY EVENTS!*/
			//return Events::filter();
		},
		'my' => function () use ($__db, $__request, $__user, $__page, $__length) { /*MY EVENTS!*/
			return EventsCollection::filter($__db, $__user,
				array('my' => $__user,
					'type' => 'future'),
				' ORDER BY events.event_start_date LIMIT ' . ($__page * $__length) . ' , ' . $__length);
		},
		'search' => function() use ($__db, $__request, $__user){
			return EventsCollection::filter($__db, $__user, $__request);
		},
		'favorites' => function () use ($__db, $__request, $__user, $__page, $__length) { /*MY EVENTS!*/
			return EventsCollection::filter($__db, $__user,
				array('my' => $__user,
					'type' => 'favorites'),
				' ORDER BY events.event_start_date LIMIT ' . ($__page * $__length) . ' , ' . $__length);
		}
	),
	'POST' => array(
		'' => function () use ($__db, $__request, $__user){
			return $__user->createEvent($__request['payload']);
		},
		'favorites' => function () use ($__db, $__request, $__user){
			$event = new Event($__request['event_id'], $__db);
			return $__user->addFavoriteEvent($event, $__request['event_date']);
		},
	),
	'DELETE' => array(
		'favorites' => function () use ($__db, $__request, $__user){
			$event = new Event($__request['event_id'], $__db);
			return $__user->deleteFavoriteEvent($event, $__request['event_date']);
		},
	)
);