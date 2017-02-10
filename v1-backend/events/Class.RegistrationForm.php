<?php

class RegistrationForm
{
	protected $event;
	private $db;

	/**
	 * RegistrationForm constructor.
	 * @param Event $event
	 * @param PDO $db
	 */
	public function __construct(Event $event, PDO $db)
	{
		$this->event = $event;
		$this->db = $db;
	}

	private static function getFormFieldTypeInfo(string $type, PDO $db): array
	{
		$q_get_field = App::queryFactory()
			->newSelect()
			->cols(array('id', 'description'))
			->from('registration_field_types')
			->where('field_type = ?', $type);
		$p_get_field = $db->prepare($q_get_field->getStatement());
		$result = $p_get_field->execute($q_get_field->getBindValues());
		if ($result === FALSE) throw new DBQueryException('BAD_FORM_FIELD_TYPE_NAME', $db);

		return $p_get_field->fetch();
	}

	private static function addFormField(int $event_id, string $type, string $label = null, bool $required, PDO $db)
	{
		$q_ins_field = App::queryFactory()->newInsert();
		$field_type_info = self::getFormFieldTypeInfo($type, $db);
		$q_ins_field
			->into('registration_form_fields')
			->cols(array(
				'event_id' => $event_id,
				'field_type_id' => $field_type_info['id'],
				'label' => $label == '' || $label == null ? $field_type_info['description'] : $label,
				'required' => $required ? 'true' : 'false'
			))
			->onConflictUpdate(array('event_id', 'field_type_id', 'label'), array(
				'status' => 'true',
				'required' => $required ? 'true' : 'false'
			));

		$p_ins_field = $db->prepare($q_ins_field->getStatement());
		$result = $p_ins_field->execute($q_ins_field->getBindValues());
		if ($result === FALSE) throw new DBQueryException('CANT_INSERT_FIELD', $db);
	}

	public static function create(int $event_id, array $fields, PDO $db)
	{
		if (count($fields) == 0) throw new InvalidArgumentException('REGISTRATION_NEEDS_FIELDS');
		$q_upd_fields = App::queryFactory()->newUpdate()
			->table('registration_form_fields')
			->cols(array('status' => 'false'))
			->where('event_id = ?', $event_id);

		$p_upd_values = $db->prepare($q_upd_fields->getStatement());
		$result = $p_upd_values->execute($q_upd_fields->getBindValues());

		if ($result === FALSE) throw new DBQueryException('CANT_UPDATE_FIELDS', $db);

		foreach ($fields as $field) {
			if (!isset($field['type'])) throw new InvalidArgumentException('BAD_FIELD_TYPE');
			self::addFormField($event_id, $field['type'], $field['label'], filter_var($field['required'], FILTER_VALIDATE_BOOLEAN), $db);
		}
	}

	public static function registerUser(User $user, Event $event, array $fields, $approvement_required)
	{
		$db = App::DB();
		$q_ins_reg = App::queryFactory()
			->newInsert()
			->into('users_registrations')
			->cols(array(
				'user_id' => $user->getId(),
				'event_id' => $event->getId(),
				'status' => 'true',
				'organization_approved' => $approvement_required ? 'false' : 'true',
			))
			->onConflictUpdate(array('user_id', 'event_id'), array(
				'status' => 'true',
				'organization_approved' => $approvement_required ? 'false' : 'true'
			))
			->returning(array('id', 'uuid'));

		$p_ins_reg = $db->prepare($q_ins_reg->getStatement());
		$result = $p_ins_reg->execute($q_ins_reg->getBindValues());
		if ($result === FALSE) throw new DBQueryException('CANT_INSERT_REGISTRATION', $db);

		$result = $p_ins_reg->fetch(PDO::FETCH_ASSOC);
		$user_reg_id = $result['id'];
		$user_reg_uuid = $result['uuid'];

		/* Form inserted, insert fields */
		$q_ins_fields = 'INSERT INTO registration_info(user_registration_id, registration_form_field_id, value, created_at) 
		
			SELECT :user_registration_id AS user_registration_id, id AS registration_form_field_id, :val AS value, NOW() AS created_ad
			 FROM registration_form_fields
			 WHERE registration_form_fields.uuid = :uuid
			ON CONFLICT (user_registration_id, registration_form_field_id) DO UPDATE SET updated_at = NOW(),
			value = :val';
		$p_ins_field = $db->prepare($q_ins_fields);

		foreach ($fields as $field) {
			$result = $p_ins_field->execute(array(
				':user_registration_id' => $user_reg_id,
				':val' => $field['value'],
				':uuid' => $field['uuid'],
			));
			if ($result === FALSE) throw new DBQueryException('CANT_INSERT_FIELD_WITH_ID: ' . $field['uuid'], $db);
		}

		$text = $approvement_required ? 'Данные успешно отправлены. Ожидайте подтверждения регистрации от организатора.' : 'Вы успешно зарегистированы на событие.';
		return new Result(true, $text, array(
			'uuid' => $user_reg_uuid
		));
	}

	public static function unregisterUser(User $user, Event $event)
	{
		$db = App::DB();
		$q_upd_reg = App::queryFactory()
			->newUpdate()
			->table('users_registrations')
			->cols(array(
				'status' => 'false'
			))
			->where('user_id = ? ', $user->getId())
			->where('event_id = ? ', $event->getId());

		$p_upd_reg = $db->prepare($q_upd_reg->getStatement());
		$result = $p_upd_reg->execute($q_upd_reg->getBindValues());
		if ($result === FALSE) throw new DBQueryException('CANT_UPDATE_REGISTRATION', $db);

		return new Result(true, 'Регистрация успешно отменена');
	}

	private static function updateBooleanColumn($type, User $user, Event $event, $uuid, $bool_val){
		if ($user->isEventAdmin($event) == false) throw new PrivilegesException(null, App::DB());
		$db = App::DB();
		$value = filter_var($bool_val, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
		$q_upd_col = App::queryFactory()->newUpdate()
			->table('users_registrations')
			->cols(array(
				$type => $value
			))
		->where('uuid = ?', $uuid)
		->where('status = true')
		->where('event_id = ?', $event->getId());
		$p_upd_col = $db->prepare($q_upd_col->getStatement());
		$result = $p_upd_col->execute($q_upd_col->getBindValues());
		if ($result === FALSE) throw new DBQueryException('CANT_UPDATE_INFO', $db);
		if ($p_upd_col->rowCount() != 1) throw new InvalidArgumentException('BAD_REGISTRATION_UUID', $db);


		$q_get_user_id = App::queryFactory()
			->newSelect()
			->cols(array(
				'user_id'
			))
			->from('users_registrations')
			->where('event_id = ?', $event->getId())
			->where('status = true')
			->where('uuid = ?', $uuid);
		$p_get_user_id = $db->prepare($q_get_user_id->getStatement());
		$result = $p_get_user_id->execute($q_get_user_id->getBindValues());

		$user_id = $p_get_user_id->fetchColumn(0);

		$event->addNotification(UsersCollection::one($db, $user, $user_id, array()),
			array(
				'notification_type' => $value == 'true' ? Notification::NOTIFICATION_TYPE_REGISTRATION_APPROVED : Notification::NOTIFICATION_TYPE_REGISTRATION_NOT_APPROVED,
				'notification_time' => (new DateTime())->add(new DateInterval('PT5M'))->format('Y-m-d H:i:s')
			));

		if ($result === FALSE) throw new DBQueryException('CANT_ADD_NOTIFICATION_FOR_USER', $db);
		if ($p_upd_col->rowCount() != 1) throw new InvalidArgumentException('BAD_REGISTRATION_UUID', $db);

		return new Result(true, 'Данные успешно обновлены');
	}

	public static function setCheckOutStatus(User $user, Event $event, $uuid, $bool_val){
		return self::updateBooleanColumn('checked_out', $user, $event, $uuid, $bool_val);
	}

	public static function setApproved(User $user, Event $event, $uuid, $bool_val){
		return self::updateBooleanColumn('organization_approved', $user, $event, $uuid, $bool_val);
	}

}