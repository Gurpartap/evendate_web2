<?php

class GlobalSearch {


	private $query;
	private $db;
	private $tags;
	private $dates;
	private $initial_query;

	private $DATE_CONSTANTS;

	const ORGANIZATIONS_FIELD_NAME = 'organizations';
	const EVENTS_FIELD_NAME = 'events';

	/**
	 * GlobalSearch constructor.
	 * @param $query
	 * @param PDO $db
	 */
	public function __construct($query, PDO $db) {
		$this->initial_query = $query;
		$this->query = $query;
		$this->db = $db;
		$this->tags = $this->parseTags();

		$start_week = new DateTime('@' . strtotime("last monday midnight"));
		$end_week = new DateTime('@' . strtotime("+1 week", strtotime("last monday midnight")));

		$next_week_start = new DateTime('@' . strtotime("next monday midnight"));
		$next_week_end = new DateTime('@' . strtotime("+1 week", strtotime("next monday midnight")));

		$curr_month_start = new DateTime('first day of this month');
		$curr_month_end = new DateTime('last day of this month');

		$next_month_start = new DateTime('first day of next month');
		$next_month_end = new DateTime('last day of next month');


		$this->DATE_CONSTANTS = array('(сегодн.*?(\s|$))' => array('since_date' => new DateTime(), 'till_date' => new DateTime(),), '((на|в).*?завтр.*?(\s|$))' => array('since_date' => new DateTime('tomorrow'), 'till_date' => new DateTime('tomorrow'),), '((на|в).*?послезавтр.*?(\s|$))' => array('since_date' => new DateTime('tomorrow + 1day'), 'till_date' => new DateTime('tomorrow + 1day'),), '((на|в).*?эт.*? нед.*?(\s|$))' => array('since_date' => $start_week, 'till_date' => $end_week,), '((на|в).*?след.*? нед.*?(\s|$))' => array('since_date' => $next_week_start, 'till_date' => $next_week_end,), '((на|в).*?эт.*? мес.*?(\s|$))' => array('since_date' => $curr_month_start, 'till_date' => $curr_month_end,), '((на|в).*?след.*? мес.*?(\s|$))' => array('since_date' => $next_month_start, 'till_date' => $next_month_end,));
		$this->all_dates = $this->parseDates();
	}

	private function parseTags() {
		$pattern = '/(^|\s)(\#[а-яА-Яa-zA-ZЁё0-9]+)/u';
		preg_match_all($pattern, $this->query, $tags);
		$this->query = preg_replace($pattern, '', $this->query);
		if (count($tags) > 0) {
			return $tags[0];
		}
		else {
			return $tags;
		}

	}

	private function parseDates($type = null) {
		if ($this->dates == null) {
			$this->dates = array('since_date' => null, 'till_date' => null);
			foreach ($this->DATE_CONSTANTS as $constant => $value) {
				if (preg_match('/.*?' . $constant . '/', $this->query, $match) > 0) {
					$this->dates = $value;
					if (count($match) > 1) {
						$this->query = str_replace($match[1], '', $this->query);
					}
				}
			}
		}

		if ($type == 'since_date') {
			return $this->dates['since_date'];
		}
		elseif ($type == 'till_date') {
			return $this->dates['till_date'];
		}
		elseif ($type == null) {
			return $this->dates;
		}
		else {
			return array();
		}
	}

	public function find(User $user, array $fields) {

		$result_data = array();

		if (isset($fields[self::ORGANIZATIONS_FIELD_NAME])) {
			$result_data[self::ORGANIZATIONS_FIELD_NAME] = OrganizationsCollection::filter($this->db,
				$user,
				array(
					'name' => $this->query,
					'description' => $this->query,
					'short_name' => $this->query
				),
				Fields::parseFields($fields[self::ORGANIZATIONS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::ORGANIZATIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::ORGANIZATIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::ORGANIZATIONS_FIELD_NAME]['order_by'] ?? '')
			)->getData();
		}
		if (isset($fields[self::EVENTS_FIELD_NAME])) {
			$filters = Fields::parseFilters($fields[self::EVENTS_FIELD_NAME]['filters'] ?? '');
			$filters['title'] = $this->query;
			$filters['tags'] = $this->tags;
			$result_data[self::EVENTS_FIELD_NAME] = EventsCollection::filter($this->db,
				$user,
				$filters,
				Fields::parseFields($fields[self::EVENTS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::EVENTS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::EVENTS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET
				),
				Fields::parseOrderBy($fields[self::EVENTS_FIELD_NAME]['order_by'] ?? '')
			)->getData();
		}
		return new Result(true, '', $result_data);
	}

}