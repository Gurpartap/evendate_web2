<?php
require_once $BACKEND_FULL_PATH . '/events/pricing/Interface.PricingRuleInterface.php';

abstract class AbstractPricingRule implements PricingRuleInterface
{
	protected $data;
	const TYPE = '';
	const TYPE_ID = -1;


	public function save($event_id)
	{
		$db = App::DB();

		$this->verify();
		$q_ins_rule = App::queryFactory()->newInsert();
		$data = array(
			'event_id' => $event_id,
			'name' => $this->data['name'],
			'tickets_pricing_rule_type_id' => static::TYPE_ID,
			'effort' => $this->data['effort'],
			'is_fixed' => filter_var($this->data['is_fixed'] ?? 'false', FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ? 'true' : 'false',
			'is_percentage' => filter_var($this->data['is_percentage'] ?? 'false', FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ? 'true' : 'false',
			'rule' => json_encode($this->getRuleData()),
			'enabled' => 'true'
		);
		$q_ins_rule->into('tickets_pricing_rules')
			->cols($data);

		if (isset($this->data['uuid'])) {
			$data['uuid'] = $this->data['uuid'];
			$q_ins_rule->onConflictUpdate(array('uuid', 'event_id', 'rule', 'effort', 'is_fixed', 'is_percentage'), $data);
		}
		$db->prepareExecute($q_ins_rule, 'CANT_INS_PRICING_RULE');
	}

	function verify()
	{
		if (!isset($this->data['effort']) || filter_var(($this->data['effort']), FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) == null)
			throw new InvalidArgumentException('BAD_PRICING_RULE_EFFORT');

		if (
			(!isset($this->data['is_percentage']) || filter_var(($this->data['is_percentage']), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) == null)
			&&
			(!isset($this->data['is_fixed']) || filter_var(($this->data['is_fixed']), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) == null)
		)
			throw new InvalidArgumentException('BAD_PRICING_RULE_TYPE');

		if (filter_var(($this->data['is_fixed'] ?? null), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === false &&
			filter_var(($this->data['is_percentage'] ?? null), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === false
		)
			throw new InvalidArgumentException('BAD_PRICING_RULE_TYPE');

		if (filter_var(($this->data['is_fixed'] ?? null), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === true &&
			filter_var(($this->data['is_percentage'] ?? null), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === true
		)
			throw new InvalidArgumentException('BAD_PRICING_RULE_TYPE');
	}


	function getDiscount(Preorder $preorder)
	{
		if ($this->isApplicable($preorder)) {
			if ($this->data['is_percentage'] == true) {
				return ($this->data['effort'] / 100) * $preorder->getSum();
			} elseif ($this->data['is_fixed'] == true) {
				return $this->data['effort'];
			}
		}
		return 0;
	}

	public function getEnabled()
	{
		return $this->data['enabled'] ?? false;
	}


}