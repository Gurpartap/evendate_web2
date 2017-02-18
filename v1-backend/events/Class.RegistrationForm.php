<?php

require_once $BACKEND_FULL_PATH . '/events/Class.Order.php';
require_once $BACKEND_FULL_PATH . '/events/Class.Ticket.php';
require_once $BACKEND_FULL_PATH . '/events/Class.TicketsCollection.php';


class RegistrationForm
{


	private static function getFormFieldTypeInfo(string $type, ExtendedPDO $db): array
	{
		$q_get_field = App::queryFactory()->newSelect();
		$q_get_field->cols(array('id', 'description'))
			->from('registration_field_types')
			->where('field_type = ?', $type);

		$p_get_field = $db->prepareExecute($q_get_field, 'BAD_FORM_FIELD_TYPE_NAME');
		return $p_get_field->fetch();
	}

	private static function addFormField(int $event_id, string $type, string $label, bool $required, ExtendedPDO $db)
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

		$db->prepareExecute($q_ins_field, 'CANT_INSERT_FIELD');
	}

	public static function create(int $event_id, array $fields, ExtendedPDO $db)
	{
		if (count($fields) == 0) throw new InvalidArgumentException('REGISTRATION_NEEDS_FIELDS');
		$q_upd_fields = App::queryFactory()->newUpdate();
		$q_upd_fields->table('registration_form_fields')
			->cols(array('status' => 'false'))
			->where('event_id = ?', $event_id)
			->where('(SELECT COUNT(id) FROM registration_field_values WHERE registration_form_field_id = registration_form_fields.id) < 1');

		$db->prepareExecute($q_upd_fields, 'CANT_UPDATE_FIELDS');

		foreach ($fields as $field) {
			if (!isset($field['type'])) throw new InvalidArgumentException('BAD_FIELD_TYPE');
			self::addFormField($event_id, $field['type'], $field['label'], filter_var($field['required'], FILTER_VALIDATE_BOOLEAN), $db);
		}
	}

	public static function registerUser($order_id, User $user, Event $event, array $fields, $approvement_required)
	{

		$db = App::DB();

		/* Form inserted, insert fields */
		$q_ins_fields = 'INSERT INTO registration_field_values(
				ticket_order_id, 
				registration_form_field_id, 
				value, 
				created_at) 
		
			SELECT :ticket_order_id AS ticket_order_id, id AS registration_form_field_id, :val AS value, NOW() AS created_ad
			 FROM registration_form_fields
			 WHERE registration_form_fields.uuid = :uuid
			ON CONFLICT (ticket_order_id, registration_form_field_id) 
			DO UPDATE SET 
			updated_at = NOW(),
			value = :val';
		$p_ins_field = $db->prepare($q_ins_fields);

		foreach ($fields as $field) {
			$result = $p_ins_field->execute(array(
				':ticket_order_id' => $order_id,
				':val' => $field['value'],
				':uuid' => $field['uuid'],
			));
			if ($result === FALSE) throw new DBQueryException('CANT_INSERT_FIELD_WITH_ID: ' . $field['uuid'], $db);
		}

		$text = $approvement_required ? 'Данные успешно отправлены. Ожидайте подтверждения регистрации от организатора.' : 'Вы успешно зарегистированы на событие.';
		return new Result(true, $text);
	}

	public static function processOrder(Event $event, AbstractUser $user, ExtendedPDO $db, array $tickets)
	{
		try{
			$db->beginTransaction();

			$order_info = Order::create($event, $user, $db, $tickets);
			$tickets = Ticket::createBatch($event, $order_info['id'], $db, $tickets);

			$db->commit();

			return array('order_info' => $order_info, 'tickets' => $tickets);
		}catch (Exception $e){
			$db->rollBack();
			throw $e;
		}
	}

	public static function getFilledFields(ExtendedPDO $db, Order $order){
		$q_get = App::queryFactory()->newSelect();
		$q_get->from('view_registration_field_values')
			->cols(array(
				'form_field_uuid',
				'form_field_label',
				'form_field_type',
				'form_field_required',
				'value',
				'created_at',
				'updated_at'
			))->where('ticket_order_uuid = ?', $order->getUUID());

		$result = $db->prepareExecute($q_get, 'CANT_GET_FILLED_FIELDS')->fetchAll();
		return new Result(true, '', $result);
	}

}