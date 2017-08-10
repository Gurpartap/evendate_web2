<?php

require_once $BACKEND_FULL_PATH . '/events/Class.Event.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventDate.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsDatesCollection.php';
require_once $BACKEND_FULL_PATH . '/tags/Class.Tag.php';
require_once $BACKEND_FULL_PATH . '/tags/Class.TagsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.Notification.php';
require_once $BACKEND_FULL_PATH . '/events/Class.NotificationsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.OrdersCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.Order.php';
require_once $BACKEND_FULL_PATH . '/search/Class.ElasticUpdater.php';


$__modules['events'] = array(
	'GET' => array(
		'{update/drop-index}' => function () use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			return EventsCollection::dropElasticIndex();
		},
		'{update/index}' => function () use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			return EventsCollection::createElasticIndex();
		},
		'{update/search}' => function () use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			return EventsCollection::reindexCollection($__db, $__user, array());
		},

		'{/(id:[0-9]+)/tickets/(uuid:\w+-\w+-\w+-\w+-\w+)/qr}' => function ($event_id, $uuid) use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			$format = 'png';
			$available_types = ['png', 'svg', 'pdf', 'eps'];
			$headers = array(
				'png' => 'image/png',
				'svg' => 'image/svg+xml',
				'pdf' => 'application/pdf',
				'eps' => 'application/postscript',
			);
			$size = 10;
			if (isset($__request['format'])) {
				if (isset($available_types[$__request['format']])) {
					$format = $__request['format'];

				}
			}
			$mime_type = $headers[$format];
			if (isset($__request['size'])) {
				$size = filter_var($__request['size'], FILTER_VALIDATE_INT);
			}

			header("Content-type: " . $mime_type);

			echo file_get_contents(App::DEFAULT_NODE_LOCATION . '/utils/qr/' . $event_id . '/' . $uuid . '?format=' . $format . '&size=' . $size);
			die();
		},
		'{/(id:[0-9]+)/tickets/(uuid:\w+-\w+-\w+-\w+-\w+)/export}' => function ($event_id, $uuid) use ($__db, $__request, $__offset, $__length, $__user, $__fields) {

			global $ROOT_PATH;
			header('Content-type: application/pdf');
			header('Content-Disposition: attachment; filename=ticket-' . $uuid . '.pdf');
			header('Pragma: no-cache');


			if (file_exists($ROOT_PATH . 'email_files/' . $uuid . '.pdf')) {
				echo file_get_contents($ROOT_PATH . '/email_files/' . $uuid . '.pdf');
			} else {
				file_get_contents(App::DEFAULT_NODE_LOCATION . '/utils/pdf/tickets/' . $uuid);
				echo file_get_contents($ROOT_PATH . '/email_files/' . $uuid . '.pdf');
			}
			die();
		},
		'{/(id:[0-9]+)/tickets}' => function ($event_id) use ($__db, $__request, $__offset, $__pagination, $__length, $__user, $__fields, $__order_by) {

			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);

			$__request['event'] = EventsCollection::one($__db, $__user, $event_id, array());

			return TicketsCollection::filter($__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'{/(id:[0-9]+)/promocodes}' => function ($event_id) use ($__db, $__request, $__offset, $__pagination, $__length, $__user, $__fields, $__order_by) {

			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			if (!isset($__request['code']) && !isset($__request['uuid'])) throw new PrivilegesException('BAD_PROMOCODE', $__db);
			$__request['event_id'] = $event_id;

			return PromocodesCollection::filter($__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			)->getParams($__user, $__fields);
		},
		'{/(id:[0-9]+)/orders/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($event_id, $uuid) use ($__db, $__request, $__offset, $__pagination, $__length, $__user, $__fields, $__order_by) {

			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			$__request['event'] = EventsCollection::one($__db, $__user, $event_id, array());
			if ($__user->isAdmin($__request['event']->getOrganization()) == false) throw new PrivilegesException('NOT_ADMIN', $__db);


			return OrdersCollection::oneByUUID($__db,
				$__user,
				$uuid,
				$__fields ?? array()
			)->getParams($__user, $__fields);
		},
		'{/(id:[0-9]+)/orders}' => function ($event_id) use ($__db, $__request, $__offset, $__pagination, $__length, $__user, $__fields, $__order_by) {

			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			$__request['event'] = EventsCollection::one($__db, $__user, $event_id, array());
			if ($__user->isAdmin($__request['event']->getOrganization()) == false) throw new PrivilegesException('NOT_ADMIN', $__db);


			return OrdersCollection::filter($__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},

		'{{/(id:[0-9]+)}/notifications}' => function ($id) use ($__db, $__order_by, $__request, $__offset, $__length, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);

			return $event->getNotifications($__user, $__fields, $__length, $__offset, $__order_by);
		},

		'{{/(id:[0-9]+)}/ticket_types/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($id, $uuid) use ($__db, $__request, $__user, $__fields, $__pagination, $__order_by) {

			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);


			$result = TicketTypesCollection::filter(
				$__db,
				$__user,
				array('uuid' => $uuid),
				$__fields ?? array(),
				$__pagination,
				$__order_by ?? array('price'));

			return new Result(true, '', array($result->getParams($__user, $__fields)->getData()));
		},
		'{{/(id:[0-9]+)}/ticket_types}' => function ($id) use ($__db, $__request, $__user, $__fields, $__pagination, $__order_by) {

			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);


			return TicketTypesCollection::filter(
				$__db,
				$__user,
				array_merge($__request ?? array(), array('event' => $event)),
				$__fields ?? array(),
				$__pagination,
				$__order_by ?? array('price'));

		},
		'{{/(id:[0-9]+)}}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);
			Statistics::Event($event, App::getCurrentUser(), App::DB(), Statistics::EVENT_VIEW_DETAIL);
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
					$__order_by ?? array('nearest_event_date', 'first_event_date')
				);
		},
		'search' => function () use ($__db, $__request, $__user, $__offset, $__length, $__fields, $__order_by) {

			return EventsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				$__order_by ?? array('nearest_event_date', 'first_event_date'));
		},
		'favorites' => function () use ($__db, $__request, $__fields, $__user, $__order_by, $__offset, $__length) { /*MY EVENTS!*/
			return EventsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('favorites' => $__user)),
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				$__order_by ?? array('nearest_event_date', 'first_event_date'));
		},
		'tickets' => function () use ($__db, $__request, $__fields, $__user, $__order_by, $__offset, $__length) { /*MY EVENTS!*/
			return TicketsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('user' => $__user)),
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				$__order_by ?? array('checkout'));
		},
		'recommendations' => function () use ($__db, $__request, $__fields, $__user, $__order_by, $__pagination) { /*MY EVENTS!*/
			return EventsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('recommendations' => true, 'future' => true)),
				$__fields,
				$__pagination,
				$__order_by ?? array(Event::RATING_OVERALL));
		},
		'dates' => function () use ($__db, $__request, $__fields, $__user, $__order_by, $__offset, $__length) { /*MY EVENTS!*/
			if (isset($__request['month'])) {
				$__request['month'] = new DateTime($__request['month']);
			}
			if (isset($__request['organization_id'])) {
				$__request['organization'] = OrganizationsCollection::one(
					$__db,
					$__user,
					intval($__request['organization_id']),
					array()
				);
			}
			if (isset($__request['event_id'])) {
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
				$__order_by ?? array()
			);
		},
		'orders' => function () use ($__db, $__request, $__fields, $__user, $__order_by, $__offset, $__length, $__pagination) {
			return OrdersCollection::filter($__db,
				$__user,
				array_merge($__request, array('user' => $__user)),
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'' => function () use ($__db, $__request, $__user, $__order_by, $__fields, $__offset, $__length) {
			return EventsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				array('length' => $__length, 'offset' => $__offset),
				$__order_by ?? array('nearest_event_date', 'first_event_date'));
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
		'{{/(id:[0-9]+)}/favorites}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$event = EventsCollection::one($__db, $__user, intval($id), array());
			Statistics::Event($event, $__user, $__db, Statistics::EVENT_FAVE);
			return $__user->addFavoriteEvent($event);
		},
		'{/(id:[0-9]+)/orders/(uuid:\w+-\w+-\w+-\w+-\w+)/legal_entity}' => function ($id, $uuid) use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);

			$order = OrdersCollection::oneByUUID($__db, $__user, $uuid, array());

			return $order->makeLegalEntityPayment($__request['payload'] ?? $__request, $event);
		},
		'{{/(id:[0-9]+)}/orders}' => function ($id) use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);

			if (!isset($__request['payload']) || !isset($__request['payload']['registration_fields']))
				throw new InvalidArgumentException('REGISTRATION_FIELDS_NOT_FOUND');

			return $event->registerUser($__user, $__request['payload']);
		},
		'' => function () use ($__db, $__request, $__user) {
			if ($__user instanceof User) {
				$result = $__user->createEvent($__request['payload']);

			} else throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			return $result;
		},
	),
	'PUT' => array(
		'{(id:[0-9]+)/status}' => function ($id) use ($__request, $__db, $__user) {
			$event = EventsCollection::one($__db, $__user, $id, array());
			if (isset($__request['hidden'])) {
				if (filter_var($__request['hidden'], FILTER_VALIDATE_BOOLEAN)) {
					$result = $event->hide($__user);
				} else {
					$result = $event->show($__user);
				}
			}
			if (isset($__request['canceled'])) {
				$result = $event->setCanceled(filter_var($__request['canceled'], FILTER_VALIDATE_BOOLEAN), $__user);
			}
			if (!isset($__request['canceled']) && !isset($__request['hidden'])) throw new BadMethodCallException('BAD_REQUEST_NO_FIELDS');
			return $result;
		},
		'{/(id:[0-9]+)/notifications/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($id, $notification_uuid) use ($__request, $__fields, $__db, $__user) {

			$notification = NotificationsCollection::oneByUUID(
				$__db,
				$__user,
				$notification_uuid,
				$__fields
			);
			return $notification->update($__db, $__request);
		},
		'{/(id:[0-9]+)/orders/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($id, $uuid) use ($__request, $__fields, $__db, $__user) {
			$updated = false;
			$event = EventsCollection::one(
				$__db,
				$__user,
				$id,
				$__fields
			);
			if (isset($__request['status'])) {
				$order = OrdersCollection::oneByUUID($__db, $__user, $uuid, array());
				$order->setStatus($__request['status'], $__user, $event);
				$updated = true;
			}
			if ($updated) {
				return new Result(true, 'Данные успешно обновлены');
			} else {
				return new Result(false, 'Не указаны поля для обновления');
			}
		},
		'{/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user) {
			$event = EventsCollection::one($__db, $__user, intval($id), array());

			if (!isset($__request['payload'])) throw new BadMethodCallException('BAD_REQUEST_NO_PAYLOAD');
			if (isset($__request['payload']['organization_id'])) {
				$organization = OrganizationsCollection::one($__db, $__user, intval($__request['payload']['organization_id']), array());
			} else {
				$organization = $__user->getEditorInstance()->getDefaultOrganization();
			}
			$result = $event->update($__request['payload'], $organization, $__user->getEditorInstance());

			return $result;
		}
	),
	'DELETE' => array(
		'{/(id:[0-9]+)/notifications/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($id, $notification_uuid) use ($__db, $__fields, $__user) {
			$notification = NotificationsCollection::oneByUUID(
				$__db,
				$__user,
				$notification_uuid,
				$__fields
			);
			return $notification->delete($__db);
		},
		'{/(id:[0-9]+)/favorites}' => function ($id) use ($__db, $__request, $__user) {
			$event = EventsCollection::one($__db, $__user, intval($id), array());
			Statistics::Event($event, $__user, $__db, Statistics::EVENT_UNFAVE);
			return $__user->deleteFavoriteEvent($event);
		}
	)
);