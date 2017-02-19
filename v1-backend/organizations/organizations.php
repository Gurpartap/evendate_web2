<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationTypesCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.PrivateOrganization.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationType.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';

$__modules['organizations'] = array(
	'GET' => array(
		'{(id:[0-9]+)/staff}' => function ($id) use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by) {
			return UsersCollection::filter(
				$__db,
				$__user,
				array_merge($__request,
					array('staff' => OrganizationsCollection::one($__db, $__user, $id, array()))
				),
				$__fields,
				$__pagination,
				$__order_by ?? array('id')
			);
		},
		'{/(id:[0-9]+)/invitations/users/(uuid:\w+-\w+-\w+-\w+-\w+)/qr}' => function ($organization_id, $uuid) use ($__request) {
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

			echo file_get_contents(App::DEFAULT_NODE_LOCATION . '/utils/invitation-qr/' . $organization_id . '/' . $uuid . '?format=' . $format . '&size=' . $size);
			die();
		},
		'{/(id:[0-9]+)/invitations/links/(uuid:\w+-\w+-\w+-\w+-\w+)/qr}' => function ($organization_id, $uuid) use ($__request) {
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

			echo file_get_contents(App::DEFAULT_NODE_LOCATION . '/utils/invitation-qr/' . $organization_id . '/' . $uuid . '?format=' . $format . '&size=' . $size);
			die();
		},
		'{/(id:[0-9]+)/invitations/users}' => function ($organization_id) use ($__db, $__request, $__user, $__fields, $__order_by) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			return $organization->getInvitedUsers($__user, $__fields ?? array(), $__order_by ?? array());
		},
		'{/(id:[0-9]+)/invitations/links}' => function ($organization_id) use ($__db, $__request, $__user, $__fields, $__order_by) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			return $organization->getInvitationLinks($__user, $__fields ?? array(), $__order_by ?? array());
		},
		'{/(id:[0-9]+)/invitations}' => function ($organization_id) use ($__db, $__request, $__user, $__fields, $__order_by) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			return new Result(true, '', array(
				'links' => $organization->getInvitationLinks($__user, $__fields ?? array(), $__order_by ?? array())->getData(),
				'users' => $organization->getInvitedUsers($__user, $__fields ?? array(), $__order_by ?? array())->getData(),
			));
		},
		'{{/(id:[0-9]+)}}' => function ($id) use ($__db, $__request, $__user, $__fields) {
			$org_instance = OrganizationsCollection::one(
				$__db,
				$__user,
				$id,
				$__fields,
				$__request ?? array());
			$result = $organization = $org_instance->getParams($__user, $__fields)->getData();

			Statistics::Organization(
				$org_instance,
				$__user,
				$__db,
				Statistics::ORGANIZATION_VIEW
			);
			return new Result(true, '', array($result));
		},
		'subscriptions' => function () use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by) {
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('is_subscribed' => true)),
				$__fields,
				$__pagination,
				$__order_by ?? array('organization_type_order', 'organization_type_id')
			);
		},
		'recommendations' => function () use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by) {
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				array_merge($__request, array('recommendations' => true)),
				$__fields,
				$__pagination,
				$__order_by ?? array(Organization::RATING_OVERALL)
			);
		},
		'types' => function () use ($__db, $__request, $__request, $__pagination, $__user, $__fields, $__order_by) {
			return OrganizationTypesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('order_position', 'id')
			);
		},
		'countries' => function () use ($__db, $__request, $__request, $__pagination, $__user, $__fields, $__order_by) {
			return CountriesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('id')
			);
		},
		'cities' => function () use ($__db, $__request, $__request, $__pagination, $__user, $__fields, $__order_by) {
			return CitiesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('id')
			);
		},
		'' => function () use ($__db, $__request, $__user, $__pagination, $__fields, $__order_by) {
			return OrganizationsCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('organization_type_order', 'organization_type_id')
			);
		}
	),
	'PUT' => array(
		'{(id:[0-9]+)}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			return $organization->update($__user, $__request['payload']);
		}
	),
	'POST' => array(
		'{(id:[0-9]+)/staff}' => function ($id) use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by) {
			if (!isset($__request['user_id'])) throw new InvalidArgumentException('Укажите ID пользовател');
			if (!isset($__request['role'])) throw new InvalidArgumentException('Укажите роль пользователя');
			return OrganizationsCollection::one($__db, $__user, $id, array())->addStaff(
				$__user, UsersCollection::one($__db, $__user, $__request['user_id'], array()), $__request['role']
			);
		},
		'{(id:[0-9]+)/invitations/links}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			$result = $organization->createInvitationLink($__user);
			return $result;
		},
		'{(id:[0-9]+)/invitations/users}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			if (isset($__request['email']) && filter_var($__request['email'], FILTER_VALIDATE_EMAIL)){
				return $organization->inviteUserByEmail($__request['email'], $__user);
			}elseif (isset($__request['user_id'])){
				return $organization->inviteUserById($__request['user_id'], $__user);
			}else{
				throw new InvalidArgumentException('EMAIL_OR_USER_ID_ARE_REQUIRED');
			}
		},
		'{(id:[0-9]+)/subscriptions}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			$result = $organization->addSubscription($__user);
			Statistics::Organization($organization, $__user, $__db, Statistics::ORGANIZATION_SUBSCRIBE);
			return $result;
		},
		'' => function () use ($__db, $__request, $__user, $__fields) {
			return $organization = Organization::create(
				$__request['payload'],
				$__user,
				$__db
			);
		},
	),
	'DELETE' => array(
		'{(id:[0-9]+)/subscriptions}' => function ($id) use ($__db, $__request, $__user) {
			$organization = OrganizationsCollection::one($__db, $__user, intval($id), array());
			$result = $organization->deleteSubscription($__user);
			Statistics::Organization($organization, $__user, $__db, Statistics::ORGANIZATION_UNSUBSCRIBE);
			return $result;
		},
		'{(id:[0-9]+)/staff}' => function ($id) use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by) {
			if (!isset($__request['user_id'])) throw new InvalidArgumentException('Укажите ID пользовател');
			if (!isset($__request['role'])) throw new InvalidArgumentException('Укажите роль пользователя');
			return OrganizationsCollection::one($__db, $__user, $id, array())->deleteStaff(
				$__user, UsersCollection::one($__db, $__user, $__request['user_id'], array()), $__request['role']
			);
		},
		'{/(id:[0-9]+)/invitations/users/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($organization_id, $uuid) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			$result = $organization->revokeInvitation($__user, $uuid);
			return $result;
		},
		'{/(id:[0-9]+)/invitations/links/(uuid:\w+-\w+-\w+-\w+-\w+)}' => function ($organization_id, $uuid) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			$result = $organization->revokeInvitationLink($__user, $uuid);
			return $result;
		}
	)
);