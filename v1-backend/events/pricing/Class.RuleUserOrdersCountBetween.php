<?php

final class RuleUserOrdersCountBetween extends AbstractPricingRule implements PricingRuleInterface
{

	const TYPE = 'user_orders_count_between';
	const TYPE_ID = 3;

	protected $data;

	/**
	 * RuleInterfaceOrderSumBetween constructor.
	 * @param array $data
	 */
	public function __construct(array $data)
	{
		$this->data = $data;
	}


	function verify()
	{
		parent::verify();
		if (!isset($this->data['min_count']) || filter_var(($this->data['min_count']), FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) === null)
			throw new InvalidArgumentException('BAD_PRICING_RULE_MIN_COUNT');
		if (!isset($this->data['max_count']) || filter_var(($this->data['max_count']), FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) === null)
			throw new InvalidArgumentException('BAD_PRICING_RULE_MAX_COUNT');
	}

	function isApplicable(Preorder $preorder): bool
	{
		$user = App::getCurrentUser();
		if ($user instanceof User == false) return false;
		$orders = $user->getOrdersInOrganization($preorder->getEvent());
		if (count($orders) > $this->data['min_count'] && count($orders) < $this->data['max_count']) {
			return true;
		}
		return false;
	}


	function getRuleData()
	{
		return array(
			'min_count' => $this->data['min_count'],
			'max_count' => $this->data['max_count']
		);
	}
}