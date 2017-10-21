<?php

interface PricingRuleInterface
{


	function verify();

	function isApplicable(Preorder $preorder): bool;

	function getRuleData();

}