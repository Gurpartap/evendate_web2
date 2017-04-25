<?php


require_once $BACKEND_FULL_PATH . '/statistics/Class.AbstractAggregator.php';
require_once $BACKEND_FULL_PATH . '/statistics/Class.OrganizationsStatistics.php';
require_once $BACKEND_FULL_PATH . '/statistics/Class.EventsStatistics.php';
require_once $BACKEND_FULL_PATH . '/statistics/Class.Statistics.php';
require_once $BACKEND_FULL_PATH . '/events/Class.OrdersCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.TicketsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.NotificationsCollection.php';
require_once $BACKEND_FULL_PATH . '/events/Class.Notification.php';


$__modules['statistics'] = array(
	'GET' => array(
		'{/events/(id:[0-9]+)/tickets/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($id, $uuid) use ($__db, $__request, $__user, $__fields, $__pagination) {
			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			$__request['statistics_event'] = EventsCollection::one($__db, $__user, $id, array());

			if (!$__user->isAdmin($__request['statistics_event']->getOrganization())) throw new PrivilegesException('NOT_ADMIN', $__db);

			$data = TicketsCollection::oneByUUID($__db,
				$__user,
				$uuid,
				$__fields
			)->getParams($__user, $__fields);
			return new Result($data->getStatus(),'', array($data->getData()));
		},
		'{/events/(id:[0-9]+)}/participants' => function ($id) use ($__db, $__request, $__user, $__fields, $__pagination) {

			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			$__request['statistics_event'] = EventsCollection::one($__db, $__user, $id, array());

			if (!$__user->isAdmin($__request['statistics_event']->getOrganization())) throw new PrivilegesException('NOT_ADMIN', $__db);

			$event = EventsCollection::one(
				$__db,
				$__user,
				intval($id),
				$__fields);


			return UsersCollection::filter(
				$__db,
				$__user,
				array_merge($__request ?? array(), array('participants' => $event)),
				$__fields ?? array(),
				$__pagination,
				$__order_by ?? array());


		},
		'{/organizations/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				$id,
				array()
			);
			$stats = new OrganizationsStatistics($__db, $organization, $__user);
			return $stats->get($__fields,
				$__request['scale'] ?? Statistics::SCALE_MONTH,
				new DateTime($__request['since'] ?? null),
				new DateTime($__request['till'] ?? null));
		},
		'{/events/(id:[0-9]+)}/orders' => function ($id) use ($__db, $__request, $__user, $__fields, $__pagination) {
			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			$__request['statistics_event'] = EventsCollection::one($__db, $__user, $id, array());

			if (!$__user->isAdmin($__request['statistics_event']->getOrganization())) throw new PrivilegesException('NOT_ADMIN', $__db);

			return OrdersCollection::filter($__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'{/events/(id:[0-9]+)/tickets}' => function ($id) use ($__db, $__request, $__user, $__fields, $__pagination) {
			if ($__user instanceof User == false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			$__request['statistics_event'] = EventsCollection::one($__db, $__user, $id, array());

			if (!$__user->isAdmin($__request['statistics_event']->getOrganization())) throw new PrivilegesException('NOT_ADMIN', $__db);

			return TicketsCollection::filter($__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array()
			);
		},
		'{/events/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$event = EventsCollection::one(
				$__db,
				$__user,
				$id,
				array()
			);
			$stats = new EventsStatistics($__db, $event, $__user);
			return $stats->get($__fields,
				$__request['scale'] ?? Statistics::SCALE_MONTH,
				new DateTime($__request['since'] ?? null),
				new DateTime($__request['till'] ?? null)
			);
		},
	),
	'POST' => array(
		'batch' => function () use ($__db, $__request, $__user) {
			return Statistics::storeBatch($__request['payload'], $__user, $__db);
		}
	),
	'PUT' => array(
		'{/events/(id:[0-9]+)/tickets/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($id, $uuid) use ($__request, $__fields, $__db, $__user) {
			$updated = false;
			$event = EventsCollection::one(
				$__db,
				$__user,
				$id,
				$__fields
			);
			if (isset($__request['checkout'])) {
				$value = filter_var($__request['checkout'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
				$ticket = TicketsCollection::oneByUUID($__db, $__user, $uuid, array());
				$ticket->setCheckOut($__request['checkout']);
				$event->addNotification(UsersCollection::one($__db, $__user, $ticket->getUserId(), array()),
					array(
						'notification_type' => $value == 'true' ?
							Notification::NOTIFICATION_TYPE_REGISTRATION_CHECKED_OUT :
							Notification::NOTIFICATION_TYPE_REGISTRATION_NOT_CHECKED_OUT,
						'notification_time' => (new DateTime())->add(new DateInterval('PT5M'))->format('Y-m-d H:i:s')
					));
				$updated = true;
			}
			if ($updated) {
				return new Result(true, 'Данные успешно обновлены');
			} else {
				return new Result(false, 'Не указаны поля для обновления');
			}
		},
	)
);