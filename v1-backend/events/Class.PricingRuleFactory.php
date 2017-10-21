<?php

require_once $BACKEND_FULL_PATH . '/events/pricing/Class.Preorder.php';
require_once $BACKEND_FULL_PATH . '/events/pricing/Class.AbstractPricingRule.php';
require_once $BACKEND_FULL_PATH . '/events/pricing/Class.RuleNoDiscount.php';
require_once $BACKEND_FULL_PATH . '/events/pricing/Class.RuleOrderSumBetween.php';
require_once $BACKEND_FULL_PATH . '/events/pricing/Class.RuleTicketsCountBetween.php';
require_once $BACKEND_FULL_PATH . '/events/pricing/Class.RuleUserOrdersCountBetween.php';
require_once $BACKEND_FULL_PATH . '/events/pricing/Class.RuleUserOrdersSumBetween.php';


class PricingRuleFactory
{


	public static function create(array $rule): AbstractPricingRule
	{
		switch ($rule['type_code']) {
			case RuleTicketsCountBetween::TYPE: {
				return new RuleTicketsCountBetween($rule);
				break;
			}
			case RuleOrderSumBetween::TYPE: {
				return new RuleOrderSumBetween($rule);
				break;
			}
			default: {
				return new RuleNoDiscount();
				break;
			}
		}
	}
}