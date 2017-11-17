<?php


require_once $BACKEND_FULL_PATH . '/bin/Class.AbstractCollection.php';

class BroadcastsCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('uuid'))
	{

		$q_get_broadcasts = App::queryFactory()->newSelect();
		$is_one_broadcast = false;
		$from_table = 'view_broadcasts';

		$cols = Fields::mergeFields(Broadcast::getAdditionalCols(), $fields, Broadcast::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_broadcasts->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_broadcasts->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'event': {
					if ($value instanceof Event && $user->isEventAdmin($value)) {
						$q_get_broadcasts->where('event_id = ?', $value->getId());
					}
					break;
				}
				case 'organization': {
					if ($value instanceof Organization && $user->isAdmin($value)) {
						$q_get_broadcasts->where('owner_organization_id = ?', $value->getId());
					}
					break;
				}
				case 'uuid': {
					$q_get_broadcasts->where('uuid = ?', $value);
					break;
				}
			}
		}

		$q_get_broadcasts->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$q_get_broadcasts->where('owner_organization_id IN 
			(SELECT organization_id FROM users_organizations WHERE user_id = ? AND status = TRUE AND role_id = 1)', $user->getId());

		$p_get_broadcasts = $db->prepareExecute($q_get_broadcasts, 'CANT_FIND_BROADCAST');
		$broadcasts = $p_get_broadcasts->fetchAll(PDO::FETCH_CLASS, 'Broadcast');
		if (count($broadcasts) == 0 && $is_one_broadcast) throw new LogicException('CANT_FIND_BROADCAST');
		if ($is_one_broadcast) return $broadcasts[0];
		$result_events = array();
		foreach ($broadcasts as $broadcast) {
			$result_events[] = $broadcast->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}

}