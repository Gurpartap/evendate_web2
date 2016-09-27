<?php

class GlobalSearch
{


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
     * @param $tags
     * @param PDO $db
     */
    public function __construct($query, $tags, PDO $db)
    {
        $this->initial_query = $query;
        $this->query = $query;
        $this->tags = $tags;

        $this->db = $db;

        $start_week = new DateTime('@' . strtotime("last monday midnight"));
        $end_week = new DateTime('@' . strtotime("+1 week", strtotime("last monday midnight")));

        $next_week_start = new DateTime('@' . strtotime("next monday midnight"));
        $next_week_end = new DateTime('@' . strtotime("+1 week", strtotime("next monday midnight")));

        $curr_month_start = new DateTime('first day of this month');
        $curr_month_end = new DateTime('last day of this month');

        $next_month_start = new DateTime('first day of next month');
        $next_month_end = new DateTime('last day of next month');


        $this->DATE_CONSTANTS = array(
            '(сегодн.*?(\s|$))' => array(
                'since' => new DateTime(),
                'till' => new DateTime()
            ),
            '((на|в).*?завтр.*?(\s|$))' => array(
                'since' => new DateTime('tomorrow'),
                'till' => new DateTime('tomorrow')
            ),
            '((на|в).*?послезавтр.*?(\s|$))' => array(
                'since' => new DateTime('tomorrow + 1day'),
                'till' => new DateTime('tomorrow + 1day')
            ),
            '((на|в).*?эт.*? нед.*?(\s|$))' => array(
                'since' => $start_week,
                'till' => $end_week
            ),
            '((на|в).*?след.*? нед.*?(\s|$))' => array(
                'since' => $next_week_start,
                'till' => $next_week_end
            ),
            '((на|в).*?эт.*? мес.*?(\s|$))' => array(
                'since' => $curr_month_start,
                'till' => $curr_month_end
            ),
            '((на|в).*?след.*? мес.*?(\s|$))' => array(
                'since' => $next_month_start,
                'till' => $next_month_end
            )
        );

        $this->all_dates = $this->parseDates();
        if (isset($this->all_dates['since'])) {
            $this->all_dates['since']->setTime(0, 0, 0);
        }
        if (isset($this->all_dates['till'])) {
            $this->all_dates['till']->setTime(23, 59, 59);
        }
    }

    private function parseDates($type = null)
    {
        if ($this->dates == null) {
            $this->dates = array('since' => null, 'till' => null);
            foreach ($this->DATE_CONSTANTS as $constant => $value) {
                if (preg_match('/.*?' . $constant . '/', $this->query, $match) > 0) {
                    $this->dates = $value;
                    if (count($match) > 1) {
                        $this->query = str_replace($match[1], '', $this->query);
                    }
                }
            }
        }

        if ($type == 'since') {
            return $this->dates['since'];
        } elseif ($type == 'till') {
            return $this->dates['till'];
        } elseif ($type == null) {
            return $this->dates;
        } else {
            return array();
        }
    }

    public function find(User $user, array $fields)
    {
        $result_data = array();
        if (isset($fields[self::ORGANIZATIONS_FIELD_NAME])) {
            $_filters = Fields::parseFilters($fields[self::ORGANIZATIONS_FIELD_NAME]['filters'] ?? '');
            if ($this->query != null){
                $_filters['q'] = $this->query;
            }
            $result_data[self::ORGANIZATIONS_FIELD_NAME] = OrganizationsCollection::filter($this->db,
                $user,
                $_filters,
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
            if ($this->query != null){
                $filters['q'] = $this->query;
            }
            if ($this->tags != null){
                $filters['tags'] = $this->tags;
            }
            if ($this->all_dates != null){
                if (isset($this->all_dates['since']) && $this->all_dates['since'] instanceof DateTime){
                    $filters['since'] = $this->all_dates['since'];
                }
                if (isset($this->all_dates['till']) && $this->all_dates['till'] instanceof DateTime){
                    $filters['till'] = $this->all_dates['till'];
                }
            }

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