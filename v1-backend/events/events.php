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
        '{{/(id:[0-9]+)}/notifications}' => function ($id) use ($__db, $__order_by, $__request, $__user, $__fields) {
            $event = EventsCollection::one(
                $__db,
                $__user,
                intval($id),
                $__fields);

            return $event->getNotifications($__user, $__fields);
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
                array_merge($__request, array('favorites' => true)),
                $__fields,
                array('length' => $__length, 'offset' => $__offset),
                $__order_by ?? array('nearest_event_date', 'first_event_date'));
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
        '' => function () use ($__db, $__request, $__user) {
            return $__user->createEvent($__request['payload']);
        },
    ),
    'PUT' => array(
        '{(id:[0-9]+)/status}' => function ($id) use ($__request, $__db, $__user) {
            $event = EventsCollection::one($__db, $__user, $id, array());
            if (isset($__request['hidden'])) {
                if ($__request['hidden'] == 'true') {
                    $result = $event->hide($__user);
                } else {
                    $result = $event->show($__user);
                }
            }
            if (isset($__request['canceled'])) {
                $result = $event->setCanceled($__request['canceled'] == 'true', $__user);
            }
            if (!isset($__request['canceled']) && !isset($__request['hidden'])) throw new BadMethodCallException('Bad Request');
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
        '{/(id:[0-9]+)}' => function ($id) use ($__db, $__request, $__user) {
            $event = EventsCollection::one($__db, $__user, intval($id), array());

            if (!isset($__request['payload'])) throw new BadMethodCallException('Bad Request');
            if (isset($__request['payload']['organization_id'])) {
                $organization = OrganizationsCollection::one($__db, $__user, intval($__request['payload']['organization_id']), array());
            } else {
                $organization = $__user->getEditorInstance()->getDefaultOrganization();
            }
            return $event->update($__request['payload'], $organization, $__user->getEditorInstance());
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