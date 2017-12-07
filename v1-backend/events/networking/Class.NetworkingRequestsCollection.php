<?php


require_once $BACKEND_FULL_PATH . '/bin/Class.AbstractCollection.php';
require_once $BACKEND_FULL_PATH . '/events/networking/Class.NetworkingRequest.php';

class NetworkingRequestsCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('uuid'))
	{

		$q_get_requests = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_tag = false;
		$from_table = 'view_networking_requests';

		$cols = Fields::mergeFields(NetworkingRequest::getAdditionalCols(), $fields, NetworkingRequest::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_requests->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_requests->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'uuid': {
					$q_get_requests->where('uuid = :uuid');
					$statements[':uuid'] = $value;
					$is_one_tag = true;
					break;
				}
				case 'user': {
					if ($value instanceof User) {
						$q_get_requests->where('recipient_user_id = :recipient_user_id');
						$statements[':recipient_user_id'] = $value->getId();
					}
					break;
				}
				case 'event': {
					if ($value instanceof Event) {
						$q_get_requests->where('event_id = :event_id');
						$statements[':event_id'] = $value->getId();
					}
					break;
				}
			}
		}


		$q_get_requests->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$p_get_tags = $db->prepareExecute($q_get_requests, 'CANT_FIND_REQUEST', $statements);
		$tags = $p_get_tags->fetchAll(PDO::FETCH_CLASS, 'NetworkingRequest');
		if (count($tags) == 0 && $is_one_tag) throw new LogicException('CANT_FIND_REQUEST');
		if ($is_one_tag) return $tags[0];
		$result_events = array();
		foreach ($tags as $tag) {
			$result_events[] = $tag->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}
}