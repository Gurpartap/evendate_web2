<?php

require_once $BACKEND_FULL_PATH . '/statistics/Class.AbstractAggregator.php';


class EventFinance extends AbstractAggregator
{

	private $user;
	private $event;
	private $db;
	private $tickets_count;
	private $ticket_types;
	private $finance_info;


	//ticket types fields
	const SUM_AMOUNT_FIELD_NAME = 'sum_amount';
	const SOLD_COUNT_FIELD_NAME = 'sold_count';

	// finance fields
	const CHECKED_OUT_COUNT_FIELD_NAME = 'checked_out_count';
	const TOTAL_INCOME_FIELD_NAME = 'total_income';
	const ORDERS_COUNT_FIELD_NAME = 'orders_count';
	const WITHDRAW_AVAILABLE_FIELD_NAME = 'withdraw_available';
	const PROCESSING_COMMISSION_VALUE_FIELD_NAME = 'processing_commission_value';
	const PROCESSING_COMMISSION_FIELD_NAME = 'processing_commission';
	const EVENDATE_COMMISSION_VALUE_FIELD_NAME = 'evendate_commission_value';

	//
	const TICKET_TYPES_FIELD_NAME = 'ticket_types';
	const TICKETS_DYNAMICS_FIELD_NAME = 'ticket_dynamics';
	const INCOME_DYNAMICS_FIELD_NAME = 'income_dynamics';

	private $tickets_numbers_fields = array(
		self::SUM_AMOUNT_FIELD_NAME,
		self::SOLD_COUNT_FIELD_NAME,
	);

	private $subentites = array(
		self::TICKET_TYPES_FIELD_NAME,
		self::TICKETS_DYNAMICS_FIELD_NAME,
		self::INCOME_DYNAMICS_FIELD_NAME,
	);

	private $finance_fields = array(
		self::CHECKED_OUT_COUNT_FIELD_NAME,
		self::TOTAL_INCOME_FIELD_NAME,
		self::ORDERS_COUNT_FIELD_NAME,
		self::WITHDRAW_AVAILABLE_FIELD_NAME,
		self::PROCESSING_COMMISSION_VALUE_FIELD_NAME,
		self::PROCESSING_COMMISSION_FIELD_NAME,
		self::EVENDATE_COMMISSION_VALUE_FIELD_NAME
	);

	public function __construct(ExtendedPDO $db, Event $event, User $user)
	{
		if (!$user->isEventAdmin($event)) throw new PrivilegesException('', $db);

		$this->user = $user;
		$this->event = $event;
		$this->db = $db;

	}


	private function getFinanceInfo(): array
	{
		if ($this->finance_info) return $this->finance_info;
		$q_get = App::queryFactory()->newSelect();
		$q_get->from('view_event_finance')
			->cols(array('checked_out_count', 'total_income', 'orders_count',
				'withdraw_available', 'processing_commission_value',
				'processing_commission', 'evendate_commission_value'))
			->where('event_id = ?', $this->event->getId());

		$this->finance_info = $this->db->prepareExecute($q_get)->fetch();
		if (!is_array($this->finance_info)){
			$this->finance_info = array();
		}
		return $this->finance_info;
	}

	private function getTicketsCount(): array
	{
		if ($this->tickets_count) return $this->tickets_count;
		$all_count = 0;
		$sold_count = 0;
		foreach ($this->getTicketTypesInfo() as $ticket_type) {
			$sold_count += $ticket_type['sold_count'];
			if ($ticket_type['is_selling']) {
				$all_count += $ticket_type['amount'];
			}
		}
		$this->tickets_count = array(
			'sum_amount' => $all_count,
			'sold_count' => $sold_count
		);

		return $this->tickets_count;
	}

	private function getField(string $field, $params = null)
	{
		$finance_info = $this->getFinanceInfo();
		$ticket_types_numbers = $this->getTicketsCount();
		if (in_array($field, $this->finance_fields)) {
			return $finance_info[$field] ?? null;
		} elseif (in_array($field, $this->tickets_numbers_fields)) {
			return $ticket_types_numbers[$field];
		} elseif ($field == self::TICKET_TYPES_FIELD_NAME) {
			return $this->getTicketTypesInfo();
		} elseif ($field == self::TICKETS_DYNAMICS_FIELD_NAME) {
			return $this->getTicketsCountDynamics($params);
		} elseif ($field == self::INCOME_DYNAMICS_FIELD_NAME) {
			return $this->getSellDynamics($params);
		} else return null;
	}

	public function getFields(array $fields)
	{
		$result = array();
		foreach ($fields as $key => $params) {
			if (!in_array($key, $this->finance_fields)
				&& !in_array($key, $this->tickets_numbers_fields)
				&& !in_array($key, $this->subentites)
			)
				continue;
			$result[$key] = $this->getField($key, $params);
		}
		return new Result(true, '', $result);
	}

	private function getTicketTypesInfo(): array
	{
		if ($this->ticket_types) return $this->ticket_types;
		$this->ticket_types = TicketTypesCollection::filter($this->db, $this->user, array(
			'event' => $this->event
		), Fields::parseFields('sold_count,is_selling'))->getData();
		return $this->ticket_types;
	}

	private function getDateTimes(array $params)
	{
		$result = array(
			'since' => null,
			'till' => null
		);
		try {
			$result['since'] = new DateTime($params['since'] ?? '2015-01-01');
		} catch (Exception $e) {
			$result['since'] = new DateTime('2015-01-01');
		}
		try {
			$result['till'] = new DateTime($params['till'] ?? null);
		} catch (Exception $e) {
			$result['till'] = new DateTime();
		}
		return $result;
	}


	private function getSellDynamics(array $params)
	{
		$dates = $this->getDateTimes($params);
		$q_get_data = "
		      SELECT
		      COALESCE(SUM(view_tickets_orders.final_sum), 0)::INT AS value,
		      DATE_PART('epoch', ts.time_value)::INT AS time_value
		      FROM view_tickets_orders
		      RIGHT OUTER JOIN (SELECT *
		      						FROM generate_series(to_timestamp(:till), to_timestamp(:since), '-1 {SCALE}')) AS ts(time_value)
		      						ON to_timestamp(view_tickets_orders.created_at) <= ts.time_value 
		      						AND view_tickets_orders.payed > 0
		      						AND view_tickets_orders.event_id = :event_id
        	GROUP BY ts.time_value
        	ORDER BY ts.time_value
		";
		return $this->db->prepareExecuteRaw($this->replaceScale($q_get_data, $params['scale'] ?? ''), array(
			':till' => $dates['till']->getTimestamp(),
			':since' => $dates['since']->getTimestamp(),
			':event_id' => $this->event->getId()
		))->fetchAll();
	}

	private function getTicketsCountDynamics(array $params)
	{

		$dates = $this->getDateTimes($params);
		$q_get_data = "
		      SELECT
		      COALESCE(SUM(view_tickets_orders.tickets_count), 0)::INT AS value,
		      DATE_PART('epoch', ts.time_value)::INT AS time_value
		      FROM view_tickets_orders
		      RIGHT OUTER JOIN (SELECT *
		      						FROM generate_series(to_timestamp(:till), to_timestamp(:since), '-1 {SCALE}')) AS ts(time_value)
		      						ON to_timestamp(view_tickets_orders.created_at) <= ts.time_value 
		      						AND view_tickets_orders.status_id IN (2, 4, 8, 10, 13)
		      						AND view_tickets_orders.event_id = :event_id
		      GROUP BY ts.time_value
        	ORDER BY ts.time_value
		";
		return $this->db->prepareExecuteRaw($this->replaceScale($q_get_data, $params['scale'] ?? ''), array(
			':till' => $dates['till']->getTimestamp(),
			':since' => $dates['since']->getTimestamp(),
			':event_id' => $this->event->getId()
		))->fetchAll();
	}


}