<?php

interface PricingRuleInterface
{


	function verify();

	function apply(Preorder $preorder);

	function attempt();


}