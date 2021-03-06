<?php

class EventsDatesCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$q_get_dates = App::queryFactory()->newSelect();

		if (isset($pagination['offset'])) {
			$q_get_dates->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_dates->limit($pagination['length']);
		}

		//remove favored_count and events_count if flat unique is not defined
		if (!isset($filters['unique']) || boolval($filters['unique']) == false) {
			if (isset($fields[EventDate::EVENTS_COUNT_FIELD_NAME])) {
				unset($fields[EventDate::EVENTS_COUNT_FIELD_NAME]);
			}
			if (isset($fields[EventDate::FAVORED_COUNT_FIELD_NAME])) {
				unset($fields[EventDate::FAVORED_COUNT_FIELD_NAME]);
			}
		}

		$q_get_dates
			->from('view_dates');
		$_fields = Fields::mergeFields(EventDate::getAdditionalCols(), $fields, EventDate::getDefaultCols());

		$cols = $_fields;
		$statement_array = array();

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'month': {
					if ($value instanceof DateTime) {
						$q_get_dates
							->where("DATE_PART('year', to_timestamp(event_date)) = :year")
							->where("DATE_PART('month', to_timestamp(event_date)) = :month");
						$statement_array[':year'] = $value->format('Y');
						$statement_array[':month'] = $value->format('m');
					}
					break;
				}
				case 'future': {
					if (mb_strtolower(trim($value)) == 'true') {
						$q_get_dates
							->where("event_date > DATE_PART('epoch', NOW())");
					}
					break;
				}
				case 'since': {
					if ($value instanceof DateTime == false) {
						$date_parts = explode(' ', $value);
						$value = new DateTime($value);
						$with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
					} else {
						$with_time = true;
					}

					if ($with_time) {
						$column_type = '::TIMESTAMP';
					} else {
						$column_type = '::DATE';
					}
					$statement_array[':since_date'] = $value->format($with_time ? 'Y-m-d H:i:s' : 'Y-m-d');
					$q_get_dates->where(':since_date' . $column_type . ' <= CONCAT(to_timestamp(event_date)::DATE, \' \', start_time)' . $column_type);
					break;
				}
				case 'till': {
					if ($value instanceof DateTime == false) {
						$date_parts = explode(' ', $value);
						$value = new DateTime($value);
						$with_time = count($date_parts) > 1 && Fields::checkIsTime($date_parts[1]);
					} else {
						$with_time = true;
					}

					if ($with_time) {
						$column_type = '::TIMESTAMP';
					} else {
						$column_type = '::DATE';
					}
					$statement_array[':till_date'] = $value->format($with_time ? 'Y-m-d H:i:s' : 'Y-m-d');
					$q_get_dates->where(':till_date' . $column_type . ' >= CONCAT(to_timestamp(event_date)::DATE, \' \', end_time)' . $column_type);
					break;
				}
				case 'event': {
					if ($value instanceof Event) {
						$q_get_dates
							->where('view_dates.event_id = :event_id');
						$statement_array[':event_id'] = $value->getId();
					}
					break;
				}
				case 'unique': {
					if ($value == 'true') {
						$cols = array_merge(EventDate::getDefaultCols(), array(
							EventDate::getAdditionalCols()[EventDate::EVENTS_COUNT_FIELD_NAME],
							EventDate::getAdditionalCols()[EventDate::FAVORED_COUNT_FIELD_NAME],
						));
						$_fields = array_merge(EventDate::getDefaultCols(),
							array(EventDate::EVENTS_COUNT_FIELD_NAME => '', EventDate::FAVORED_COUNT_FIELD_NAME => ''));
						$q_get_dates->join(
							'LEFT',
							'favorite_events',
							' ON favorite_events.event_id = view_dates.event_id AND favorite_events.user_id = :user_id')
							->groupBy(array('event_date'));
						$statement_array[':user_id'] = $user->getId();
					}
					break;
				}
				case 'organization': {
					if ($value instanceof Organization) {
						$q_get_dates
							->where('organization_id = :organization_id');
						$statement_array[':organization_id'] = $value->getId();
					}
					break;
				}
				case 'my': {
					if (mb_strtolower(trim($value)) == 'true') {
						if ($user instanceof User) {
							$q_get_dates
								->where('view_dates.event_id IN (
								    SELECT event_id FROM view_user_event_ids WHERE user_id = :user_id
								 )');
							$statement_array[':user_id'] = $user->getId();
						}
					}
					break;
				}
				case 'city_id': {
					$q_get_dates->where('view_dates.event_id IN (
				 	SELECT id FROM view_events WHERE city_id = :city_id)');
					$statement_array[':city_id'] = $value;
					break;
				}
			}
		}


		$q_get_dates
			->cols($cols)
			->orderBy($order_by);

		$events_dates = $db->prepareExecute($q_get_dates, '', $statement_array)->fetchAll(PDO::FETCH_CLASS, 'EventDate');
		$result_dates = array();
		foreach ($events_dates as $event_date) {
			$result_dates[] = $event_date->getParams($user, $_fields)->getData();
		}

		return new Result(true, '', $result_dates);
	}


}