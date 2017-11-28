<?php


class Preorder
{

	private $db;
	private $user;
	private $tickets;
	private $sum;
	private $tickets_count;

	/**
	 * Preorder constructor.
	 * @param Event $event
	 * @param array $data
	 */
	public function __construct(Event $event, array $data)
	{
		$this->db = App::DB();
		$this->user = App::getCurrentUser();
		$this->tickets = $data['tickets'];
		$this->event = $event;

		if ($data['promocode']) {
			try {
				$this->promocode = PromocodesCollection::filter($this->db, $this->user, array('code' => $data['promocode'], 'event_id' => $event->getId()), array());
			} catch (Exception $e) {
				$this->promocode = null;
			}
		} else {
			$this->promocode = null;
		}
	}

	public function getSum()
	{
		if (!$this->sum) {
			$this->tickets_count = 0;
			$this->sum = 0;
			foreach ($this->tickets as $ticket) {
				if (!isset($ticket['uuid']) || empty($ticket['uuid'])){
				}else{
					$ticket_type = TicketTypesCollection::oneByUUID($this->db, $this->user, $ticket['uuid'], array());
					if ($ticket_type->getPrice() > 0) {
						$this->tickets_count += $ticket['count'];
						$this->sum = $this->sum + intval($ticket['count']) * $ticket_type->getPrice();
					}
				}
			}
		}
		return $this->sum;
	}

	/**
	 * @return Event
	 */
	public function getEvent(): Event
	{
		return $this->event;
	}

	public function getTicketsCount()
	{
		if (!$this->sum) {
			$this->getSum();
		}
		return $this->tickets_count;
	}

	public function applyPricingRules()
	{
		$applicable = array();
		$rules = $this->event->getPricingRules()->getData();
		foreach ($rules as $rule) {
			$rule_instance = PricingRuleFactory::create($rule);
			if ($rule_instance->isApplicable($this) && $rule_instance->getEnabled() == true) {
				$applicable[] = array(
					'rule' => $rule_instance,
					'rule_data' => $rule,
					'discount' => $rule_instance->getDiscount($this)
				);
			}
		}

		if (count($applicable) > 0) {
			usort($applicable, function ($a, $b) {
				return $a['discount'] <=> $b['discount'];
			});
			return $applicable[0];
		} else {
			$rule_instance = new RuleNoDiscount();
			return array(
				'rule' => $rule_instance,
				'rule_data' => null,
				'discount' => $rule_instance->getDiscount($this)
			);
		}
	}

	private function getPromocodeDiscount(Promocode $promocode = null)
	{
		if ($promocode == null) return 0;
		if ($promocode->getIsPercentage() == true) {
			return ($promocode->getEffort() / 100) * $this->getSum();
		} elseif ($promocode->getIsFixed() == true) {
			return $promocode->getEffort();
		} else return 0;
	}

	public function getFinalSum()
	{
		$rule_instance = $this->applyPricingRules();
		$promocode_discount = $this->getPromocodeDiscount($this->promocode);
		if ($this->event->getApplyPromocodesAndPricingRules()) {
			$final_sum = ($this->getSum() - $rule_instance['discount'] - $promocode_discount);
		} else {
			if ($promocode_discount != 0) {
				$final_sum = $this->getSum() - $promocode_discount;
				$rule_instance = array(
					'pricing_rule' => null,
					'rule_data' => null,
					'discount' => 0,
				);
			} else {
				$final_sum = $this->getSum() - $rule_instance['discount'];
			}
		}
		$final_sum = $final_sum < 0 ? 0 : $final_sum;
		return new Result(true, '', array(
			'pricing_rule' => $rule_instance['rule_data'],
			'promocode' => $this->promocode instanceof Promocode ? $this->promocode->getParams(App::getCurrentUser(), array())->getData() : null,
			'price' => array(
				'discount' => $rule_instance['discount'],
				'promocode_discount' => $promocode_discount,
				'final_sum' => $final_sum
			)
		));
	}


}
