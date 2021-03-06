<?php

/*THIS IS ONE BIG KOSTYL*/

require_once $BACKEND_FULL_PATH . '/users/Class.Friend.php';

class RegisteredUser extends Friend
{

	protected $event_id;

	const REGISTRATION_INFO_FIELD_NAME = 'registration_info';

	private function getRegistrationInfo(AbstractUser $user){

		$db = App::DB();

		$q_get_registration_fields = App::queryFactory()->newSelect();
		$q_get_registration_fields->from('view_registration_fields')
			->cols(array(
				'uuid',
				'field_type',
				'field_type_id',
				'label',
				'required',
				'created_at',
				'value'

			))
		->where('user_id = ?', $this->getId())
		->where('event_id = ?', $this->event_id);

		$p_get_registration_fields = $db->prepareExecute($q_get_registration_fields);

		$q_get_registration_info = App::queryFactory()->newSelect();
		$q_get_registration_info->from('view_users_registrations')
			->cols(array(
				'uuid',
				'checked_out',
				'organization_approved',
				'status',
				'created_at',
				'updated_at'
			))
		->where('user_id = ?', $this->getId())
		->where('event_id = ?', $this->event_id);

		$p_get_info = $db->prepareExecute($q_get_registration_info);

		$result = $p_get_info->fetch();
		$result['fields'] = $p_get_registration_fields->fetchAll();
		return $result;
	}

	public static function getAdditionalCols()
	{
		$additional_cols = parent::getAdditionalCols();
		$additional_cols[] = 'event_id';
		return $additional_cols;
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::REGISTRATION_INFO_FIELD_NAME])) {
			$result_data[self::REGISTRATION_INFO_FIELD_NAME] =
				$this->getRegistrationInfo($user);
		}

		return new Result(true, '', $result_data);
	}


}