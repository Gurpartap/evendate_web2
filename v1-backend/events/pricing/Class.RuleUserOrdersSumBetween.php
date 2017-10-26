<?php

final class RuleUserOrdersSumBetween extends AbstractPricingRule implements PricingRuleInterface
{

	const TYPE = 'user_orders_sum_between';
	const TYPE_ID = 4;

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
		if (!isset($this->data['min_sum']) || filter_var(($this->data['min_sum']), FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) == null)
			throw new InvalidArgumentException('BAD_PRICING_RULE_MIN_SUM');
		if (!isset($this->data['max_sum']) || filter_var(($this->data['max_sum']), FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) == null)
			throw new InvalidArgumentException('BAD_PRICING_RULE_MAX_SUM');
	}

	function isApplicable(Preorder $preorder): bool
	{
		$user = App::getCurrentUser();
		if ($user instanceof User == false) return false;
		$orders = $user->getOrdersInOrganization($preorder->getEvent());
		$sum = 0;
		foreach($orders as $order){
			$sum += $order['final_sum'];
		}
		if ($sum > $this->data['min_sum'] && $sum < $this->data['max_sum']) {
			return true;
		}
		return false;
	}


	function getRuleData()
	{
		return array(
			'min_sum' => $this->data['min_sum'],
			'max_sum' => $this->data['max_sum']
		);
	}
}