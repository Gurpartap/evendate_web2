<?php

require_once $BACKEND_FULL_PATH . '/events/Class.Promocode.php';


class PromocodesCollection extends AbstractCollection
{


	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('code'))
	{
		$q_get_promocodes = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_code = false;
		$is_checking = false;

		$cols = Fields::mergeFields(Promocode::getAdditionalCols(), $fields, Promocode::getDefaultCols());


		$cols[] = 'id';
		if (isset($pagination['offset'])) {
			$q_get_promocodes->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_promocodes->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'code': {
					$q_get_promocodes->where('code = :code');
					$statements[':code'] = $value;
					$is_one_code = true;
					$is_checking = true;
					break;
				}
				case 'uuid': {
					$q_get_promocodes->where('uuid = :uuid');
					$statements[':uuid'] = $value;
					$is_one_code = true;
					$is_checking = true;
					break;
				}
				case 'ticket_order_uuid': {
					if ($value instanceof User == false) throw new PrivilegesException('', $db);
					$is_one_code = true;
					$is_checking = true;
					break;
				}
				case 'statistics_event': {
					if ($value instanceof Event == false) throw new InvalidArgumentException('BAD_EVENT');
					if ($user instanceof User == false) throw new PrivilegesException('', $db);
					if ($user->isEventAdmin($value) == false) throw new PrivilegesException('', $db);
					$q_get_promocodes->where('event_id = :event_id');
					$statements[':event_id'] = $value->getId();
					break;
				}
			}
		}

		if ($is_one_code && $is_checking) {
			if (!isset($filters['event_id'])) throw new InvalidArgumentException('EVENT_ID_REQUIRED');
			$q_get_promocodes->where('is_active = TRUE OR (
				SELECT COUNT(user_id) 
				FROM events 
				INNER JOIN users_organizations ON users_organizations.organization_id = events.organization_id 
				WHERE user_id = :user_id AND events.id = view_promocodes.event_id
				AND users_organizations.status = TRUE
			) > 0');
			$q_get_promocodes->where('enabled = TRUE');
			$q_get_promocodes->where('event_id = :event_id');
			$statements[':event_id'] = $filters['event_id'];
			$statements[':user_id'] = $user->getId();
		} else {
			if (!isset($filters['statistics_event']) && $filters['statistics_event'] instanceof Event == false)
				throw new InvalidArgumentException('EVENT_ID_REQUIRED');
		}

		$q_get_promocodes->distinct()
			->from('view_promocodes')
			->cols($cols)
			->orderBy($order_by);

		$p_get_tags = $db->prepareExecute($q_get_promocodes, 'CANT_FIND_PROMOCODE', $statements);
		$promocodes = $p_get_tags->fetchAll(PDO::FETCH_CLASS, 'Promocode');
		if (count($promocodes) == 0 && $is_one_code) throw new LogicException('CANT_FIND_PROMOCODE');
		if ($is_one_code) return $promocodes[0];
		$result_events = array();
		foreach ($promocodes as $promocode) {
			$result_events[] = $promocode->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}


	public static function updateForEvent(ExtendedPDO $db, $event_id, array $data)
	{
		$extremum_dates = Event::getExtremumDates($event_id, $db);
		$q_ins = App::queryFactory()->newInsert();

		foreach ($data as $code) {
			$_code = Promocode::checkData($code, $extremum_dates);
			$ins_cols = array(
				'event_id' => $event_id,
				'code' => $_code['code'],
				'is_fixed' => $_code['is_fixed'],
				'is_percentage' => $_code['is_percentage'],
				'effort' => $_code['effort'],
				'use_limit' => $_code['use_limit'],
				'start_date' => $_code['start_date']->format(App::DB_DATETIME_FORMAT),
				'end_date' => $_code['end_date']->format(App::DB_DATETIME_FORMAT),
				'enabled' => $_code['enabled']
			);
			$q_ins->into('promocodes')
				->cols($ins_cols)
				->onConflictUpdate(
					array('event_id', 'code'),
					$ins_cols
				);

			$db->prepareExecute($q_ins);

		}
	}


}