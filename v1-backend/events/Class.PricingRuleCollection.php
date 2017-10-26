<?php


require_once $BACKEND_FULL_PATH . '/bin/Class.AbstractCollection.php';

class PricingRuleCollection extends AbstractCollection
{

	public static function filter(ExtendedPDO $db,
																AbstractUser $user = null,
																array $filters = null,
																array $fields = null,
																array $pagination = null,
																array $order_by = array('id'))
	{

		$q_get_rules = App::queryFactory()->newSelect();
		$is_one_rule = false;
		$from_table = 'view_pricing_rules';

		$cols = Fields::mergeFields(PricingRule::getAdditionalCols(), $fields, PricingRule::getDefaultCols());


		if (isset($pagination['offset'])) {
			$q_get_rules->offset($pagination['offset']);
		}

		if (isset($pagination['length'])) {
			$q_get_rules->limit($pagination['length']);
		}

		foreach ($filters as $name => $value) {
			switch ($name) {
				case 'uuid': {
					$q_get_rules->where('uuid = ?', $value);
					$is_one_rule = true;
					break;
				}
				case 'event': {
					if ($value instanceof Event) {
						$q_get_rules->where('event_id = ?', $value->getId());
						break;
					}
				}
			}
		}


		$q_get_rules->distinct()
			->from($from_table)
			->cols($cols)
			->orderBy($order_by);

		$p_get_rules = $db->prepareExecute($q_get_rules, 'CANT_FIND_PRICING_RULE');
		$rules = $p_get_rules->fetchAll(PDO::FETCH_CLASS, 'PricingRule');
		if (count($rules) == 0 && $is_one_rule) throw new LogicException('CANT_FIND_TAG');
		if ($is_one_rule) return $rules[0];
		$result_events = array();
		foreach ($rules as $tag) {
			$result_events[] = $tag->getParams($user, $fields)->getData();
		}
		return new Result(true, '', $result_events);
	}

	//TODO: Create new pricing rule if not exists
	public static function create(ExtendedPDO $db, array $data) : PricingRule
	{

	}
}