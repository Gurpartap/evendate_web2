<?php

final class RuleOrderSumBetween extends AbstractPricingRule implements PricingRuleInterface
{

	CONST TYPE = 'order_sum_between';
	CONST TYPE_ID = 2;

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
			throw new InvalidArgumentException('BAD_PRICING_RULE_MIN_SUM');
	}

	function isApplicable(Preorder $preorder): bool
	{
		if ($preorder->getSum() > $this->data['min_sum'] && $preorder->getSum() < $this->data['max_sum']) {
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