<?php

require_once $BACKEND_FULL_PATH . '/statistics/Class.AbstractAggregator.php';


class OrganizationFinance extends AbstractAggregator
{

	private $user;
	private $organization;
	private $db;
	private $finance_info;


	// finance fields
	const TOTAL_INCOME_FIELD_NAME = 'total_income';
	const WITHDRAW_AVAILABLE_FIELD_NAME = 'withdraw_available';
	const PROCESSING_COMMISSION_VALUE_FIELD_NAME = 'processing_commission_value';
	const PROCESSING_COMMISSION_FIELD_NAME = 'processing_commission';
	const EVENDATE_COMMISSION_VALUE_FIELD_NAME = 'evendate_commission_value';

	//
	const WITHDRAWS_FIELD_NAME = 'withdraws';
	const TICKETS_DYNAMICS_FIELD_NAME = 'ticket_dynamics';
	const INCOME_DYNAMICS_FIELD_NAME = 'income_dynamics';


	private $subentites = array(
		self::WITHDRAWS_FIELD_NAME,
		self::TICKETS_DYNAMICS_FIELD_NAME,
		self::INCOME_DYNAMICS_FIELD_NAME,
	);

	private $finance_fields = array(
		self::TOTAL_INCOME_FIELD_NAME,
		self::WITHDRAW_AVAILABLE_FIELD_NAME,
		self::PROCESSING_COMMISSION_VALUE_FIELD_NAME,
		self::PROCESSING_COMMISSION_FIELD_NAME,
		self::EVENDATE_COMMISSION_VALUE_FIELD_NAME
	);

	public function __construct(ExtendedPDO $db, Organization $organization, User $user)
	{
		if (!$user->isAdmin($organization)) throw new PrivilegesException('', $db);

		$this->user = $user;
		$this->organization = $organization;
		$this->db = $db;

	}


	private function getFinanceInfo(): array
	{
		if ($this->finance_info) return $this->finance_info;
		$q_get = App::queryFactory()->newSelect();
		$q_get->from('view_organization_finance')
			->cols(array('total_income', 'withdraw_available',
				'processing_commission_value', 'processing_commission',
				'evendate_commission_value'))
			->where('organization_id = ?', $this->organization->getId());

		$this->finance_info = $this->db->prepareExecute($q_get)->fetch();
		if (!is_array($this->finance_info)) {
			$this->finance_info = array();
		}
		return $this->finance_info;
	}


	private function getField(string $field, $params = null)
	{
		$finance_info = $this->getFinanceInfo();
		if (in_array($field, $this->finance_fields)) {
			return $finance_info[$field] ?? null;
		} elseif ($field == self::WITHDRAWS_FIELD_NAME) {
			return $this->getWithdraws();
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
				&& !in_array($key, $this->subentites)
			)
				continue;
			$result[$key] = $this->getField($key, $params);
		}
		return new Result(true, '', $result);
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
		      LEFT JOIN events ON view_tickets_orders.event_id = events.id
		      RIGHT OUTER JOIN (SELECT *
		      						FROM generate_series(to_timestamp(:till), to_timestamp(:since), '-1 {SCALE}')) AS ts(time_value)
		      						ON to_timestamp(view_tickets_orders.created_at) <= ts.time_value 
		      						AND view_tickets_orders.payed > 0
		      						AND events.organization_id = :organization_id
        	GROUP BY ts.time_value
        	ORDER BY ts.time_value
		";
		return $this->db->prepareExecuteRaw($this->replaceScale($q_get_data, $params['scale'] ?? ''), array(
			':till' => $dates['till']->getTimestamp(),
			':since' => $dates['since']->getTimestamp(),
			':organization_id' => $this->organization->getId()
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
		      LEFT JOIN events ON view_tickets_orders.event_id = events.id
		      RIGHT OUTER JOIN (SELECT *
		      						FROM generate_series(to_timestamp(:till), to_timestamp(:since), '-1 {SCALE}')) AS ts(time_value)
		      						ON to_timestamp(view_tickets_orders.created_at) <= ts.time_value 
		      						AND view_tickets_orders.status_id IN (2, 4, 8, 10, 13)
		      						AND events.organization_id = :organization_id
		      GROUP BY ts.time_value
        	ORDER BY ts.time_value
		";
		return $this->db->prepareExecuteRaw($this->replaceScale($q_get_data, $params['scale'] ?? ''), array(
			':till' => $dates['till']->getTimestamp(),
			':since' => $dates['since']->getTimestamp(),
			':organization_id' => $this->organization->getId()
		))->fetchAll();
	}

	private function getWithdraws()
	{

	}

}