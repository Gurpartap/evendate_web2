<?php

require_once $BACKEND_FULL_PATH . '/events/Class.RegistrationField.php';

class RegistrationFieldsCollection extends AbstractCollection
{

	public static function filter(
		ExtendedPDO $db,
		AbstractUser $user = null,
		array $filters = null,
		array $fields = null,
		array $pagination = null,
		array $order_by = array('order_number'))
	{

		$q_get_fields = App::queryFactory()->newSelect();
		$_fields = Fields::mergeFields(RegistrationField::getAdditionalCols(), $fields, RegistrationField::getDefaultCols());

		$q_get_fields
			->from('view_registration_form_fields')
			->cols($_fields)
			->where('status = TRUE')
			->orderBy($order_by);

		$statement_array = [];

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'event': {
					if ($value instanceof Event) {
						$q_get_fields
							->where('event_id = :event_id ');
						$statement_array[':event_id'] = $value->getId();
					}
					break;
				}
			}
		}

		if (isset($pagination['offset'])) {
			$q_get_fields->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_fields->limit($pagination['length']);
		}


		$registration_fields = $db->prepareExecute($q_get_fields, '', $statement_array)->fetchAll(PDO::FETCH_CLASS, 'RegistrationField');
		$result_fields = array();

		foreach ($registration_fields as $field) {
			$to_add = $field->getParams($user, $fields)->getData();
			if (isset($to_add['values']) && $to_add['values'] != null){
				try{
					$to_add['values'] = json_decode($to_add['values'], true);
				}catch(Exception $e){}
			}
			$result_fields[] = $to_add;
		}
		return new Result(true, '', $result_fields);
	}

}