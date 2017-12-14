<?php


require_once $BACKEND_FULL_PATH . '/bin/Class.AbstractCollection.php';
require_once $BACKEND_FULL_PATH . '/events/networking/Class.NetworkingProfile.php';

class NetworkingProfilesCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('user_id'))
	{

		$q_get_profiles = App::queryFactory()->newSelect();
		$statements = array();
		$is_one = false;
		$from_table = 'view_networking_profiles';

		$cols = Fields::mergeFields(NetworkingProfile::getAdditionalCols(), $fields, NetworkingProfile::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_profiles->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_profiles->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'user_id': {
					$q_get_profiles->where('user_id = :user_id');
					$statements[':user_id'] = $value;
					$is_one = true;
					break;
				}
				case 'user': {
					if ($value instanceof User) {
						$q_get_profiles->where('user_id = :user_id');
						$statements[':user_id'] = $value->getId();
						$is_one = true;
					}
					break;
				}
				case 'for_user': {
					if ($value instanceof User) {
						$q_get_profiles->where('for_id = :for_id');
						$statements[':for_id'] = $value->getId();
					}
					break;
				}
				case 'event': {
					if ($value instanceof Event) {
						$q_get_profiles->where('event_id = :event_id');
						$statements[':event_id'] = $value->getId();
					}
					break;
				}
				case 'request_pending': {
					if (filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
						$q_get_profiles->where('request_exists = TRUE AND request_status IS NULL');
					}
					break;
				}
				case 'request_accepted': {
					if (filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
						$q_get_profiles->where('request_exists = TRUE AND request_status = TRUE');
					}
					break;
				}
				case 'request_rejected': {
					if (filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
						$q_get_profiles->where('request_exists = TRUE AND request_status = FALSE');
					}
					break;
				}
				case 'contacts': {
					if (filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
						$q_get_profiles->where('for_id = :contacts_for_id');
						$q_get_profiles->where('user_id IN (SELECT user_id FROM view_networking_contacts WHERE for_id = :contacts_for_id)');
						$statements[':contacts_for_id'] = $user->getId();
					}
					break;
				}
			}
		}


		$q_get_profiles->distinct(true)
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$p_get_tags = $db->prepareExecute($q_get_profiles, 'CANT_FIND_PROFILE', $statements);
		$profiles = $p_get_tags->fetchAll(PDO::FETCH_CLASS, 'NetworkingProfile');
		if (count($profiles) == 0 && $is_one) throw new LogicException('CANT_FIND_PROFILE');
		if ($is_one) return $profiles[0];
		$result = array();
		foreach ($profiles as $profile) {
			$result[] = $profile->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result);
	}


	public static function one(ExtendedPDO $db,
														 AbstractUser $user,
														 int $id,
														 array $fields = null)
	{

		return static::filter($db, $user, array('user' => $id), $fields);
	}

}