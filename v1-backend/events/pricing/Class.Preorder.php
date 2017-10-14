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
		$this->tickets = $data;
		$this->event = $event;
	}

	public function getSum()
	{
		if (!$this->sum) {
			foreach ($this->tickets as $ticket) {
				$ticket_type = TicketTypesCollection::oneByUUID($this->db, $this->user, $ticket['uuid'], array());
				if ($ticket_type->getPrice() > 0) {
					$this->tickets_count = $ticket['count'];
					$this->sum = intval($ticket['count']) * $ticket_type->getPrice();
				}
			}
		}
		return $this->sum;
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
		foreach ($this->event->getPricingRules() as $rule){

		}
	}

}
