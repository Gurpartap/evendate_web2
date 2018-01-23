<?php

require_once $BACKEND_FULL_PATH . '/events/Class.Order.php';
require_once $BACKEND_FULL_PATH . '/events/Class.Ticket.php';
require_once $BACKEND_FULL_PATH . '/events/Class.TicketsCollection.php';


class RegistrationForm
{

	const SELECT_FORM_FIELD_TYPE = 'select';
	const SELECT_MULTI_FORM_FIELD_TYPE = 'select_multi';


	private static function getFormFieldTypeInfo(string $type, ExtendedPDO $db): array
	{
		$q_get_field = App::queryFactory()->newSelect();
		$q_get_field->cols(array('id', 'description'))
			->from('registration_field_types')
			->where('field_type = ?', $type);

		$p_get_field = $db->prepareExecute($q_get_field, 'BAD_FORM_FIELD_TYPE_NAME');
		return $p_get_field->fetch();
	}

	private static function addFormField(int $event_id, string $type, string $label = null, bool $required, ExtendedPDO $db, array $values = null, $order_number = null)
	{
		if (!is_numeric($order_number)) {
			$order_number = null;
		}
		$q_ins_field = App::queryFactory()->newInsert();
		$field_type_info = self::getFormFieldTypeInfo($type, $db);
		if ($type == self::SELECT_FORM_FIELD_TYPE || $type == self::SELECT_MULTI_FORM_FIELD_TYPE) {
			if ($values == null) throw new InvalidArgumentException('CANT_ADD_SELECT_WITHOUT_VALUES');
		}
		$q_ins_field
			->into('registration_form_fields')
			->cols(array(
				'event_id' => $event_id,
				'field_type_id' => $field_type_info['id'],
				'order_number' => $order_number,
				'label' => $label == '' || $label == null ? $field_type_info['description'] : $label,
				'required' => $required ? 'true' : 'false'
			))
			->onConflictUpdate(array('event_id', 'field_type_id', 'label'), array(
				'status' => 'true',
				'required' => $required ? 'true' : 'false',
				'order_number' => $order_number
			))
			->returning(array('id'));

		$result = $db->prepareExecute($q_ins_field, 'CANT_INSERT_FIELD')->fetch();


		// Inserting values for select and multiselect fields
		if ($type == self::SELECT_FORM_FIELD_TYPE || $type == self::SELECT_MULTI_FORM_FIELD_TYPE) {
			$q_disable_all = App::queryFactory()->newUpdate();
			$q_disable_all->table('registration_select_values');
			$q_disable_all->cols(array('status' => 'false'))->where('registration_form_field_id = ?', $result['id']);
			$db->prepareExecute($q_disable_all, 'CANT_DISABLE_CURRENT_VALUES');

			foreach ($values as $item) {
				if (!isset($item['value']) || trim($item['value']) == '') throw new InvalidArgumentException('SELECT_VALUE_IS_EMPTY');

				$cols = array(
					'registration_form_field_id' => $result['id'],
					'value' => $item['value'],
					'status' => 'true'
				);
				if (isset($item['uuid'])) {
					$cols['uuid'] = $item['uuid'];
				}

				$q_ins_value = App::queryFactory()->newInsert();
				$q_ins_value->into('registration_select_values')
					->cols($cols)
					->onConflictUpdate(array('uuid'), $cols);
				$db->prepareExecute($q_ins_value, 'CANT_INSERT_VALUE');
			}
		}
	}

	public static function create(int $event_id, array $fields, ExtendedPDO $db)
	{
		if (count($fields) == 0) throw new InvalidArgumentException('REGISTRATION_NEEDS_FIELDS');
		$q_upd_fields = App::queryFactory()->newUpdate();
		$q_upd_fields->table('registration_form_fields')
			->cols(array('status' => 'false'))
			->where('event_id = ?', $event_id);

		$db->prepareExecute($q_upd_fields, 'CANT_UPDATE_FIELDS');

		foreach ($fields as $field) {
			if (!isset($field['type'])) throw new InvalidArgumentException('BAD_FIELD_TYPE');
			self::addFormField($event_id, $field['type'], $field['label'], filter_var($field['required'], FILTER_VALIDATE_BOOLEAN), $db, $field['values'] ?? null, $field['order_number'] ?? null);
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
				values, 
				created_at) 
			SELECT 
			:ticket_order_id AS ticket_order_id, 
			id AS registration_form_field_id, 
			:val AS value, 
			:vals AS value, 
			NOW() AS created_ad
			 FROM registration_form_fields
			 WHERE registration_form_fields.uuid = :uuid
			ON CONFLICT (ticket_order_id, registration_form_field_id) 
			DO UPDATE SET 
			updated_at = NOW(),
			value = :val,
			values = :vals';

		$rows = array();


		foreach ($fields as $field) {
			$rows[] = array(
				':ticket_order_id' => $order_id,
				':val' => $field['value'] ?? null,
				':vals' => json_encode($field['ins_values'] ?? null),
				':uuid' => $field['uuid'],
			);
		}
		$db->bulkPrepareExecuteRaw($q_ins_fields, $rows, 'CANT_FINISH_REGISTRATION');

		$text = $approvement_required ? 'Данные успешно отправлены. Ожидайте подтверждения регистрации от организатора.' : 'Вы успешно зарегистированы на событие.';
		return new Result(true, $text);
	}

	public static function processOrder(Event $event, AbstractUser $user, ExtendedPDO $db, array $tickets, $promocode = null)
	{
		try {
			$db->beginTransaction();
			$order_info = Order::create($event, $user, $db, $tickets, $promocode);
			$preorder = new Preorder($event, array('tickets' => $tickets, 'promocode' => $promocode));
			$tickets = Ticket::createBatch($event, $order_info['id'], $db, $tickets);
			Order::updateSum($order_info['id'], $db, $event, $preorder->getFinalSum()->getData());

			$db->commit();

			return array('order_info' => $order_info, 'tickets' => $tickets);
		} catch (Exception $e) {
			$db->rollBack();
			throw $e;
		}
	}

	public static function getFilledFieldsQuery()
	{
		$q_get = App::queryFactory()->newSelect();
		$q_get->from('view_registration_field_values')
			->cols(array(
				'form_field_uuid',
				'form_field_label',
				'form_field_type',
				'form_field_type_id',
				'form_field_required',
				'value',
				'values',
				'created_at',
				'updated_at',
				'order_number'
			))->where('ticket_order_uuid = :ticket_order_uuid')
			->orderBy(array('order_number'));
		return $q_get;
	}

	public static function getFilledFields(ExtendedPDO $db, Order $order)
	{
		$q_get = self::getFilledFieldsQuery();
		$result = $db->prepareExecute($q_get, 'CANT_GET_FILLED_FIELDS', array(':ticket_order_uuid' => $order->getUUID()))->fetchAll();
		foreach ($result as &$item) {
			$item['values'] = json_decode($item['values'], true);
		}
		return new Result(true, '', $result);
	}

}