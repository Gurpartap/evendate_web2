<?php

require_once $BACKEND_FULL_PATH . '/statistics/Class.AbstractAggregator.php';

class EventsStatistics extends AbstractAggregator
{


    const SQL_GET_DATA = '
      SELECT
      COUNT(stat_events.id)::INT AS value,
      DATE_PART(\'epoch\', ts.time_value)::INT AS time_value
      FROM stat_events
        INNER JOIN stat_event_types ON stat_events.stat_type_id = stat_event_types.id 
          AND stat_event_types.entity = :entity
          AND stat_event_types.type_code = :type_code
          AND stat_events.event_id = :event_id
        INNER JOIN events ON events.id = stat_events.event_id 
        INNER JOIN tokens ON stat_events.token_id = tokens.id
          AND tokens.user_id NOT IN (SELECT user_id
            FROM users_organizations
            WHERE users_organizations.organization_id = events.organization_id
            AND users_organizations.status = TRUE)
        RIGHT OUTER JOIN (SELECT *
                    FROM generate_series(to_timestamp(:till), to_timestamp(:since), \'-1 {SCALE}\')) AS ts(time_value)
                    ON stat_events.created_at BETWEEN (ts.time_value - INTERVAL \'1 {SCALE}\') AND ts.time_value
        GROUP BY ts.time_value
        ORDER BY ts.time_value
        LIMIT 10000';

    const SQL_GET_NOTIFICATIONS = 'SELECT
      COUNT(stat_notifications.id)::INT AS value,
      DATE_PART(\'epoch\', ts.time_value)::INT AS time_value
      FROM stat_notifications
        INNER JOIN events_notifications ON stat_notifications.event_notification_id = events_notifications.id 
        INNER JOIN events ON events_notifications.event_id = events.id AND events.id = :event_id
        RIGHT OUTER JOIN (SELECT *
                    FROM generate_series(to_timestamp(:till), to_timestamp(:since), \'-1 {SCALE}\')) AS ts(time_value)
                    ON stat_notifications.created_at BETWEEN (ts.time_value - INTERVAL \'1 {SCALE}\') AND ts.time_value
        GROUP BY ts.time_value
        ORDER BY ts.time_value
        LIMIT 10000';


    private $db;
    private $event;


    public function __construct(PDO $db, Event $event, User $user)
    {
        if (!$user->isAdmin($event->getOrganization())) throw new PrivilegesException('', $db);
        $this->db = $db;
        $this->event = $event;
    }


    private function getValue($type, $scale, DateTime $since, DateTime $till)
    {
        switch ($type) {
            case Statistics::EVENT_VIEW:
            case Statistics::EVENT_VIEW_DETAIL:
            case Statistics::EVENT_FAVE:
            case Statistics::EVENT_UNFAVE:
            case Statistics::EVENT_OPEN_SITE: {
                $query = $this->replaceScale(self::SQL_GET_DATA, $scale);
                $statements = array(
                    ':event_id' => $this->event->getId(),
                    ':entity' => Statistics::ENTITY_EVENT,
                    ':type_code' => $type,
                    ':since' => $since->getTimestamp(),
                    ':till' => $till->getTimestamp(),
                );
                break;
            }
            case Statistics::EVENT_NOTIFICATIONS_SENT: {
                $query = $this->replaceScale(self::SQL_GET_NOTIFICATIONS, $scale);
                $statements = array(
                    ':event_id' => $this->event->getId(),
                    ':since' => $since->getTimestamp(),
                    ':till' => $till->getTimestamp(),
                );
                break;
            }
            default: {
                throw new InvalidArgumentException();
            }
        }

        $q_get_data = $this->db->prepare($query);

        $q_get_data->execute($statements);

        return new Result(true, '', $q_get_data->fetchAll());
    }

    public function get(array $fields, $scale, DateTime $since, DateTime $till)
    {
        $result = array();
        foreach ($fields as $key => $value) {
            switch ($key) {
                case Statistics::FIELD_DYNAMICS: {
                    $result[Statistics::FIELD_DYNAMICS] = $this->getDynamics(
                        Fields::parseFields($value['fields'] ?? ''),
                        $value['scale'] ?? $scale,
                        isset($value['since']) ? DateTime::createFromFormat('U', $value['since']) : $since,
                        isset($value['till']) ? DateTime::createFromFormat('U', $value['till']) : $till
                    )->getData();
                    break;
                }
                case Statistics::FIELD_OPEN_CONVERSION:
                case Statistics::FIELD_FAVE_CONVERSION: {
                    $result[$key] = $this->getConversion(
                        $value['scale'] ?? $scale,
                        isset($value['since']) ? DateTime::createFromFormat('U', $value['since']) : $since,
                        isset($value['till']) ? DateTime::createFromFormat('U', $value['till']) : $till,
                        $key
                    )->getData();
                    break;
                }
                case Statistics::EVENT_NOTIFICATIONS_SENT:
                case Statistics::EVENT_FAVE:
                case Statistics::EVENT_UNFAVE:
                case Statistics::EVENT_VIEW:
                case Statistics::EVENT_VIEW_DETAIL:
                case Statistics::EVENT_OPEN_SITE: {
                    $result[$key] = $this->getValue(
                        $key,
                        $value['scale'] ?? $scale,
                        isset($value['since']) ? DateTime::createFromFormat('U', $value['since']) : $since,
                        isset($value['till']) ? DateTime::createFromFormat('U', $value['till']) : $till
                    )->getData();
                    break;
                }
            }
        }
        return new Result(true, '', $result);
    }

    private function getDynamics(array $fields = null, $scale, DateTime $since, DateTime $till)
    {
        $default_fields = array(
            Statistics::ORGANIZATION_SUBSCRIBE => null,
            Statistics::ORGANIZATION_VIEW => null,
            Statistics::EVENT_FAVE => null
        );

        if (!is_array($fields) || (is_array($fields) && count($fields) == 0)) {
            $fields = $default_fields;
        }
        $result = array();

        foreach ($fields as $key => $param) {
            switch ($key) {
                case Statistics::ORGANIZATION_VIEW:
                case Statistics::EVENT_FAVE:
                case Statistics::ORGANIZATION_SUBSCRIBE: {
                    $result[$key] = $this->getValue($key, $scale, $since, $till)->getData();
                    break;
                }
                case Statistics::FIELD_OPEN_CONVERSION:
                case Statistics::FIELD_FAVE_CONVERSION: {
                    $result[$key] = $this->getConversion($scale, $since, $till, $key)->getData();
                    break;
                }
            }
        }
        return new Result(true, '', $result);
    }

    private function getConversion($scale, $since, $till, $type)
    {
        if ($type == Statistics::FIELD_FAVE_CONVERSION) {
            $with = Statistics::EVENT_VIEW;
            $to = Statistics::EVENT_FAVE;
        } else {
            $with = Statistics::EVENT_VIEW;
            $to = Statistics::EVENT_OPEN_SITE;
        }

        $views = $this->getValue(
            $with,
            $scale,
            $since,
            $till
        )->getData();

        $subscribes = $this->getValue(
            $to,
            $scale,
            $since,
            $till
        )->getData();

        $result = array();

        foreach ($views as $key => $view) {
            $result[] = array(
                'time_value' => $view['time_value'],
                'with' => $subscribes[$key]['value'],
                'to' => $view['value'],
                'value' => $view['value'] == 0 ? 0 : $subscribes[$key]['value'] / $view['value'] * 100
            );
        }
        return new Result(true, '', $result);
    }

}