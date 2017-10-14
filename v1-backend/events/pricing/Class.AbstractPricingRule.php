<?php

abstract class AbstractPricingRule implements PricingRuleInterface
{
	CONST TYPE = '';
	CONST TYPE_ID = -1;

	protected $data;

	public function save(User $user, Event $event)
	{
		if ($user->hasRights($event->getOrganization(), array('admin', 'moderator')))
			$this->verify();
		$db = App::DB();
		$q_ins_rule = App::queryFactory()->newInsert();
		$q_ins_rule->into('tickets_pricing_rules');
		$db->prepareExecute($q_ins_rule);
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

		if (filter_var(($this->data['is_fixed']), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === false &&
			filter_var(($this->data['is_percentage']), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === false
		)
			throw new InvalidArgumentException('BAD_PRICING_RULE_TYPE');

	}

}