<?php

require_once $BACKEND_FULL_PATH . '/tags/Class.TagsCollection.php';
require_once $BACKEND_FULL_PATH . '/tags/Class.Tag.php';

$__modules['tags'] = array(
	'GET' => array(
		'' => function () use ($__db, $__user, $__length, $__page, $__request, $__fields, $__pagination, $__order_by) {
			if (isset($__request['event_id'])){
				$__request['event'] = EventsCollection::one($__db, $__user,
					intval($__request['event_id']), array());
			}
			return TagsCollection::filter($__db, $__user, $__request, $__fields, $__pagination, $__order_by ?? array('id'));
		},
		'top' => function () use ($__db, $__user, $__length, $__page, $__request, $__fields, $__pagination, $__order_by) {
            if (isset($__request['organization_id'])){
                $__request['organization'] = OrganizationsCollection::one($__db, $__user,
                    intval($__request['organization_id']), array());
            }
			return TagsCollection::filter($__db, $__user, $__request, $__fields, $__pagination, $__order_by ?? array('id'));
		},
		'{{/(id:[0-9]+)}}' => function ($id) use ($__db, $__user, $__length, $__page, $__fields, $__pagination, $__order_by) {
			return TagsCollection::filter($__db, $__user, array('id' => $id), $__fields, $__pagination, $__order_by ?? array('id'));
		}
	)
);