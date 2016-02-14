<?php

	require_once $BACKEND_FULL_PATH . '/events/Class.Event.php';
	require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';
	require_once $BACKEND_FULL_PATH . '/events/Class.EventDate.php';
	require_once $BACKEND_FULL_PATH . '/events/Class.EventsDatesCollection.php';
	require_once $BACKEND_FULL_PATH . '/tags/Class.Tag.php';
	require_once $BACKEND_FULL_PATH . '/tags/Class.TagsCollection.php';
	require_once $BACKEND_FULL_PATH . '/events/Class.Notification.php';
	require_once $BACKEND_FULL_PATH . '/events/Class.NotificationsCollection.php';

$__modules['events'] = array(
	'GET' => array(
		'{{/(id:[0-9]+)}/notifications}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);
			return new Result(true, '', array($event->getNotifications($__user, $__fields)->getData()));
		},
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
				array_merge($__request, array('favorites' => true)),
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
		'{{/(id:[0-9]+)}/notifications}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);

			return $event->addNotification($__user, $__request);
		},
		'{{/(id:[0-9]+)}/favorites}' => function ($id) use ($__db, $__request, $__user, $__fields){
			$event = EventsCollection::one($__db, $__user, intval($id), array());
			return $__user->addFavoriteEvent($event);
		},
		'' => function () use ($__db, $__request, $__user){
			return $__user->createEvent($__request['payload']);
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
		'{/(id:[0-9]+)/notifications/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function($id, $notification_uuid) use ($__request, $__fields, $__db, $__user){

			$notification = NotificationsCollection::oneByUUID(
				$__db,
				$__user,
				$notification_uuid,
				$__fields
			);
			return $notification->update($__db, $__request);
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
		'{/(id:[0-9]+)/notifications/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function($id, $notification_uuid) use ($__db, $__fields, $__user){
			$notification = NotificationsCollection::oneByUUID(
				$__db,
				$__user,
				$notification_uuid,
				$__fields
			);
			return $notification->delete($__db);
		},
		'{/(id:[0-9]+)/favorites}' => function ($id) use ($__db, $__request, $__user){
			$event = EventsCollection::one($__db, $__user, intval($id), array());
			return $__user->deleteFavoriteEvent($event);
		}
	)
);