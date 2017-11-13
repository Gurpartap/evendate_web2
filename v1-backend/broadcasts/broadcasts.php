<?php

require_once $BACKEND_FULL_PATH . '/broadcasts/Class.Broadcast.php';
require_once $BACKEND_FULL_PATH . '/broadcasts/Class.BroadcastsCollection.php';


$__modules['broadcasts'] = array(
	'GET' => array(
		'' => function () use ($__db, $__user, $__length, $__page, $__request, $__fields, $__pagination, $__order_by) {
			return BroadcastsCollection::filter($__db, $__user, $__request, $__fields, $__pagination, $__order_by ?? array('uuid'));
		}
	),
	'POST' => array(
		'' => function () use ($__db, $__user, $__request) {
			if (isset($__request['event_id'])) {
				$event = EventsCollection::one($__db, $__user, $__request['event_id'], array());
				$organization = $event->getOrganization();
			} else {
				$event = null;
			}
			if (isset($__request['organization_id'])) {
				$organization = OrganizationsCollection::one($__db, $__user, $__request['organization_id'], array());
			}

			$broadcast = new Broadcast();
			$broadcast->setData($__request, $__db, $organization, $event);
			return $broadcast->save();
		}
	),
	'PUT' => array(
		'{/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($uuid) use ($__db, $__user, $__length, $__page, $__request, $__fields, $__pagination, $__order_by) {
			if (isset($__request['event_id'])) {
				$event = EventsCollection::one($__db, $__user, $__request['event_id'], array());
				$organization = $event->getOrganization();
			} else {
				$event = null;
			}
			if (isset($__request['organization_id'])) {
				$organization = OrganizationsCollection::one($__db, $__user, $__request['organization_id'], array());
			}

			$__request['uuid'] = $uuid;
			$broadcast = new Broadcast();
			$broadcast->setData($__request, $__db, $organization, $event);
			return $broadcast->save();
		}
	)
);