<?php

require_once $ROOT_PATH. $BACKEND_FOLDER . '/events/Class.Event.php';
require_once $ROOT_PATH. $BACKEND_FOLDER . '/events/Class.EventsCollection.php';

$__modules['events'] = array(
	'GET' => array(
		'{{/(id:[0-9]+)}}' => function ($id) use ($__db, $__request, $__user) { /*MY EVENTS!*/
			$events = EventsCollection::filter($__db, $__user,
				array('id' => new Event($id, $__db)), '')->getData();
			return new Result(true, '', count($events) > 0 ? $events[0] : null);
		},
		'my' => function () use ($__db, $__request, $__user, $__page, $__length) { /*MY EVENTS!*/
			return EventsCollection::filter($__db, $__user,
				array_merge(array('my' => $__user,
					'type' => 'future'),
					$__request),
				' ORDER BY nearest_event_date, events.begin_time LIMIT ' . ($__page * $__length) . ' , ' . $__length);
		},
		'search' => function() use ($__db, $__request, $__user){
			return EventsCollection::filter($__db, $__user, $__request);
		},
		'favorites' => function () use ($__db, $__request, $__user, $__page, $__length) { /*MY EVENTS!*/
			return EventsCollection::filter($__db, $__user,
				array('type' => 'favorites'),
				' ORDER BY first_date, events.begin_time LIMIT ' . ($__page * $__length) . ' , ' . $__length);
		},
		'all' => function () use ($__db, $__request, $__user) {
			return EventsCollection::filter($__db, $__user, $__request);
		},
		'' => function () use ($__db, $__request, $__user) {
			return EventsCollection::filter($__db, $__user, $__request,
				'ORDER BY first_date, events.begin_time');
		},
	),
	'POST' => array(
		'' => function () use ($__db, $__request, $__user){
			return $__user->createEvent($__request['payload']);
		},
		'favorites' => function () use ($__db, $__request, $__user){
			$event = new Event($__request['event_id'], $__db);
			return $__user->addFavoriteEvent($event);
		},
	),
	'PUT' => array(
		'{(id:[0-9]+)/status}' => function($id) use ($__request, $__db, $__user){
			$event = new Event($id, $__db);
			if (!isset($__request['hidden'])) throw new BadMethodCallException('Bad Request');
			if ($__request['hidden'] == 1){
				return $event->hide($__user);
			}else{
				return $event->show($__user);
			}
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user) {
			$event = new Event($id, $__db);

			if (!isset($__request['payload'])) throw new BadMethodCallException('Bad Request');

			if (isset($__request['payload']['organization_id'])){
				$organization = new Organization($__request['payload']['organization_id'], $__db);
			}else{
				$organization = $__user->getEditorInstance()->getDefaultOrganization();
			}
			return $event->update($__request['payload'], $organization, $__user->getEditorInstance());
		}
	),
	'DELETE' => array(
		'{favorites/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user){
			$event = new Event($id, $__db);
			return $__user->deleteFavoriteEvent($event);
		},
	)
);