<?php

require_once $ROOT_PATH.'backend/events/Class.Event.php';
require_once $ROOT_PATH.'backend/events/Class.EventsCollection.php';

$__modules['events'] = array(
	'GET' => array(
		'all' => function () use ($__db, $__request, $__user) {
			return EventsCollection::filter($__db, array());
		},
		'{/(date:[0-9]+-[0-9]+-[0-9]+)}' => function($date) use ($__db, $__request, $__user){
			return EventsCollection::filter($__db, array('date' => $date));
		},
		'' => function () use ($__db, $__request, $__user) { /*MY EVENTS!*/
			//return Events::filter();
		},
		'my' => function () use ($__db, $__request, $__user) { /*MY EVENTS!*/
			//return Events::filter();
		},
		'timeline' => function () use ($__db, $__request, $__user) { /*MY EVENTS!*/
			//return Events::filter();
		}
	),
	'POST' => array(
		'' => function () use ($__db, $__request, $__user){
			return $__user->createEvent($__request['payload']);
		},
	)
);