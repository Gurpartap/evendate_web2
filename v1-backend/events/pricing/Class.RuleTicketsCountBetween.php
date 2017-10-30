<?php

final class RuleTicketsCountBetween extends AbstractPricingRule implements PricingRuleInterface
{

	const TYPE = 'tickets_count_between';
	const TYPE_ID = 1;

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
		if ($preorder->getTicketsCount() > $this->data['min_count']
			&& $preorder->getTicketsCount() < $this->data['max_count']) {
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