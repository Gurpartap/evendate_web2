<?php

require_once $BACKEND_FULL_PATH . '/events/Class.Event.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventDate.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsDatesCollection.php';

$__modules['events'] = array(
	'GET' => array(
		'{{/(id:[0-9]+)}}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);
			return new Result(true, '', array($event->getParams($__user, $__fields)->getData()));
		},
		'my' => function () use ($__db, $__request, $__user, $__offset, $__length, $__fields, $__order_by) { /*MY EVENTS!*/
			return
				EventsCollection::filter(
					$__db,
					$__user,
					array_merge(array(
						'my' => $__user,
						'type' => 'future'),
						$__request
					),
					$__fields,
					array('length' => $__length, 'offset' => $__offset),
					array('nearest_event_date', 'first_event_date')
				);
		},
		'search' => function() use ($__db, $__request, $__user, $__offset, $__length, $__fields, $__order_by){
			return EventsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				$__order_by);
		},
		'favorites' => function () use ($__db, $__request, $__fields, $__user, $__order_by, $__offset, $__length) { /*MY EVENTS!*/
			return EventsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				$__order_by);
		},
		'dates' => function () use ($__db, $__request,$__fields, $__user, $__offset, $__length) { /*MY EVENTS!*/
			if (isset($__request['month'])){
				$__request['month'] = new DateTime($__request['month']);
			}
			if (isset($__request['organization_id'])){
				$__request['organization'] = OrganizationsCollection::one(
					$__db,
					$__user,
					intval($__request['organization_id']),
					array()
				);
			}
			if (isset($__request['event_id'])){
				$__request['event'] = EventsCollection::one(
					$__db,
					$__user,
					intval($__request['event_id']),
					array()
				);
			}
			return EventsDatesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				array());
		},
		'' => function () use ($__db, $__request, $__user, $__fields, $__offset, $__length) {
			return EventsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				array('nearest_event_date', 'first_event_date'));
		}
	),
	'POST' => array(
		'' => function () use ($__db, $__request, $__user){
			return $__user->createEvent($__request['payload']);
		},
		'favorites' => function () use ($__db, $__request, $__user, $__fields){
			$event = EventsCollection::one($__db, $__user, intval($__request['event_id']));
			return $__user->addFavoriteEvent($event);
		},
		'{(id:[0-9]+)/notifications}' => function($id) use ($__request, $__db, $__user){
			$event = new Event($id, $__db);
			if (!isset($__request['hidden'])) throw new BadMethodCallException('Bad Request');
			if ($__request['hidden'] == 1){
				return $event->hide($__user);
			}else{
				return $event->show($__user);
			}
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
		'{(id:[0-9]+)/notifications/(notification_id:[0-9]+)}' => function($id, $notification_id) use ($__request, $__db, $__user){
			$event = new Event($id, $__db);
			if (!isset($__request['hidden'])) throw new BadMethodCallException('Bad Request');
			if ($__request['hidden'] == 1){
				return $event->hide($__user);
			}else{
				return $event->show($__user);
			}
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user) {
			$event = EventsCollection::one($__db, $__user, intval($id));

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
		'{(id:[0-9]+)/favorites}' => function ($id) use ($__db, $__request, $__user){
			$event = EventsCollection::one($__db, $__user, intval($id));
			return $__user->deleteFavoriteEvent($event);
		},
		'{(id:[0-9]+)/notifications/(notification_id:[0-9]+)}' => function($id, $notification_id) use ($__request, $__db, $__user){
			$event = new Event($id, $__db);
			if (!isset($__request['hidden'])) throw new BadMethodCallException('Bad Request');
			if ($__request['hidden'] == 1){
				return $event->hide($__user);
			}else{
				return $event->show($__user);
			}
		},
	)
);