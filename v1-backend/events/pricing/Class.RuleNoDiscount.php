<?php

final class RuleNoDiscount extends AbstractPricingRule
{

	public function __construct()
	{
	}


	function verify()
	{
		return true;
	}

	function isApplicable(Preorder $preorder): bool
	{
		return false;
	}

	function getRuleData()
	{
		return array();
	}


}