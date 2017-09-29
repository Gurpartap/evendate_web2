<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationsCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationTypesCollection.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.Organization.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.PrivateOrganization.php';
require_once $BACKEND_FULL_PATH . '/organizations/Class.OrganizationType.php';
require_once $BACKEND_FULL_PATH . '/events/Class.EventsCollection.php';
require_once "{$BACKEND_FULL_PATH}/vendor/autoload.php";
use Elasticsearch\ClientBuilder;

$__modules['organizations'] = array(
	'GET' => array(
		'{update/drop-index}' => function () use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			return OrganizationsCollection::dropElasticIndex();
		},
		'{update/index}' => function () use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
		},
		'{update/search}' => function () use ($__db, $__request, $__offset, $__length, $__user, $__fields) {
			return OrganizationsCollection::reindexCollection($__db, $__user, $__request);
		},
		'{vk_groups}' => function () use ($__db, $__pagination, $__request, $__user, $__fields, $__order_by) {
			if ($__user instanceof User === false) throw new PrivilegesException('NOT_AUTHORIZED', $__db);
			return $__user->getEditorInstance()->getVkGroupsToPost();
		},
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
		'{/(id:[0-9]+)/requisites}' => function ($organization_id) use ($__db, $__request, $__user, $__fields, $__order_by) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			return $organization->getRequisites($__user);
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
			$result = OrganizationTypesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('order_position', 'id')
			);

			if (isset($__request['new_separated']) && $result->getStatus() == true) {
				$data = $result->getData();

				$fields_data = array(
					'created_at' => 1,
					'updated_at' => null,
					'random' => 0,
					'organizations' => OrganizationsCollection::filter(
						$__db,
						$__user,
						array_merge($__request, array('is_new' => true)),
						Fields::parseFields($__fields['organizations']['fields'] ?? ''),
						$__pagination,
						Fields::parseOrderBy($__fields['order_by'] ?? 'id')
					)->getData()
				);
				$new_orgs = array(
					'id' => 0,
					'name' => 'Новые организации',
					'order_position' => 0
				);
				if (count($fields_data['organizations']) > 0) {
					foreach ($__fields as $key => $field) {
						if (isset($fields_data[$key])) {
							$new_orgs[$key] = $fields_data[$key];
						} elseif (is_string($field) && isset($fields_data[$field])) {
							$new_orgs[$field] = $fields_data[$field];
						}
					}
					array_unshift($data, $new_orgs);
				}

				return new Result(true, '', $data);
			} else {
				return $result;
			}
		},
		'countries' => function () use ($__db, $__request, $__pagination, $__user, $__fields, $__order_by) {
			return CountriesCollection::filter(
				$__db,
				$__user,
				$__request,
				$__fields,
				$__pagination,
				$__order_by ?? array('id')
			);
		},
		'cities' => function () use ($__db, $__request, $__pagination, $__user, $__fields, $__order_by) {
			if (isset($__fields) && isset($__fields['distance'])) {
				if (!isset($__request['latitude']) || !isset($__request['longitude'])) {
					if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
					{
						$ip = $_SERVER['HTTP_CLIENT_IP'];
					} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
					{
						$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
					} else {
						$ip = $_SERVER['REMOTE_ADDR'];
					}
					try {
						$geo_data = @file_get_contents('https://freegeoip.net/json/' . $ip);
						$geo_data = json_decode($geo_data, true);
						if (!isset($geo_data['latitude']) || !isset($geo_data['longitude'])) throw new InvalidArgumentException('CANT_GET_GEO_FROM_IP');
						$__request['latitude'] = $geo_data['latitude'];
						$__request['longitude'] = $geo_data['longitude'];
					} catch (Exception $e) {
						throw new InvalidArgumentException('CANT_GET_GEO_FROM_IP');
					}
				}
			}

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
			if (!isset($__request['user_id'])) throw new InvalidArgumentException('USER_ID_REQUIRED');
			if (!isset($__request['role'])) throw new InvalidArgumentException('USER_ROLE_REQUIRED');
			return OrganizationsCollection::one($__db, $__user, $id, array())->addStaff(
				$__user, UsersCollection::one($__db, $__user, $__request['user_id'], array()), $__request['role']
			);
		},
		'{/(id:[0-9]+)/requisites}' => function ($organization_id) use ($__db, $__request, $__user, $__fields, $__order_by) {
			$organization = OrganizationsCollection::onePrivate(
				$__db,
				$__user,
				intval($organization_id),
				null,
				$__fields
			);
			return $organization->updateRequisites($__user, $__request);
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
			if (isset($__request['email']) && filter_var($__request['email'], FILTER_VALIDATE_EMAIL)) {
				return $organization->inviteUserByEmail($__request['email'], $__user);
			} elseif (isset($__request['user_id'])) {
				return $organization->inviteUserById($__request['user_id'], $__user);
			} else {
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
		'{(id:[0-9]+)/withdraws}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			if (!$__user->isAdmin($organization)) throw new PrivilegesException('', $__db);
			return $organization->withdraw($__request, $__user);
		},
		'{(id:[0-9]+)/feedback}' => function ($organization_id) use ($__db, $__request, $__user, $__fields) {
			$organization = OrganizationsCollection::one(
				$__db,
				$__user,
				intval($organization_id),
				$__fields
			);
			return $organization->sendFeedback($__request);
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
			if (!isset($__request['user_id'])) throw new InvalidArgumentException('USER_ID_REQUIRED');
			if (!isset($__request['role'])) throw new InvalidArgumentException('USER_ROLE_REQUIRED');
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