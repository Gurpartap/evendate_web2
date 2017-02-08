<?php


require_once './Class.Ticket.php';

class TicketsCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$q_get_tags = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_tag = false;
		$from_table = 'view_tickets';

		$cols = Fields::mergeFields(Tag::getAdditionalCols(), $fields, Tag::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_tags->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_tags->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id': {
					$q_get_tags->where('id = :id');
					$statements[':id'] = $value;
					$is_one_tag = true;
					break;
				}
			}
		}


		$q_get_tags->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$p_get_tags = $db->prepare($q_get_tags->getStatement());
		$p_get_tags->execute($statements);
		$tags = $p_get_tags->fetchAll(PDO::FETCH_CLASS, 'Ticket');
		if (count($tags) == 0 && $is_one_tag) throw new LogicException('CANT_FIND_TAG');
		if ($is_one_tag) return $tags[0];
		$result_events = array();
		foreach ($tags as $tag) {
			$result_events[] = $tag->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}



}