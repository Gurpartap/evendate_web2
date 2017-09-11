<?php

require_once $BACKEND_FULL_PATH . '/organizations/Class.Withdraw.php';


class WithdrawsCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$q_get_withdraws = App::queryFactory()->newSelect();
		$statements = array();
		$is_one_withdraw = false;
		$from_table = 'view_organizations_withdraws';

		$cols = Fields::mergeFields(Withdraw::getAdditionalCols(), $fields, Withdraw::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_withdraws->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_withdraws->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'id': {
					$q_get_withdraws->where('id = ?', $value);
					$is_one_withdraw = true;
					break;
				}
				case 'number': {
					$q_get_withdraws->where('number = ?', $value);
					$is_one_withdraw = true;
					break;
				}
				case 'organization_id': {
					$q_get_withdraws->where('organization_id = ?', $value);
					break;
				}
			}
		}


		$q_get_withdraws->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$p_get_withdraws = $db->prepareExecute($q_get_withdraws, 'CANT_FIND_WITHDRAW', $statements);
		$tags = $p_get_withdraws->fetchAll(PDO::FETCH_CLASS, 'Withdraw');
		if (count($tags) == 0 && $is_one_withdraw) throw new LogicException('CANT_FIND_TAG');
		if ($is_one_withdraw) return $tags[0];
		$result_events = array();
		foreach ($tags as $tag) {
			$result_events[] = $tag->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}


}