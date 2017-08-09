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
				case 'statistics_event': {
					if ($value instanceof Event == false) throw new InvalidArgumentException('BAD_EVENT');
					if ($value instanceof User == false) throw new PrivilegesException('', $db);
					if ($user->isEventAdmin($value) == false) throw new PrivilegesException('', $db);
					$q_get_promocodes->where('event_id = :event_id');
					$statements[':event_id'] = $value->getId();
					break;
				}
				case 'ticket_order_uuid': {
					if ($value instanceof User == false) throw new PrivilegesException('', $db);

					break;
				}
			}
		}

		if (!$is_one_code || $is_checking) {
			if (isset($filters['event']) && $filters['event'] instanceof Event) {
				$q_get_promocodes->where('event_id = :event_id');
				$statements[':event_id'] = $filters['event']->getId();
			} else {
				throw new InvalidArgumentException('EVENT_ID_REQUIRED');
			}
		}

		$q_get_promocodes->distinct()
			->from('view_promocodes')
			->cols($cols)
			->orderBy($order_by);

		$p_get_tags = $db->prepareExecute($q_get_promocodes, 'CANT_FIND_PROMOCODE', $statements);
		$tags = $p_get_tags->fetchAll(PDO::FETCH_CLASS, 'Promocode');
		if (count($tags) == 0 && $is_one_code) throw new LogicException('CANT_FIND_PROMOCODE');
		if ($is_one_code) return $tags[0];
		$result_events = array();
		foreach ($tags as $tag) {
			$result_events[] = $tag->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}

	public static function updateForEvent($id, $param)
	{

	}


}