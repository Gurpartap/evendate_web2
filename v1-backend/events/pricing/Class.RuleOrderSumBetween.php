<?php

final class RuleOrderSumBetween extends AbstractPricingRule implements PricingRuleInterface
{

	CONST TYPE = 'order_sum_between';
	CONST TYPE_ID = 2;

	private $data;

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
		if (!isset($this->data['sum']) || filter_var(($this->data['sum']), FILTER_VALIDATE_FLOAT, FILTER_NULL_ON_FAILURE) == null)
			throw new InvalidArgumentException('BAD_PRICING_RULE_SUM');
	}

	function apply(Preorder $preorder)
	{
		// TODO: Implement apply() method.
	}


	function attempt()
	{
		// TODO: Implement attempt() method.
	}
}