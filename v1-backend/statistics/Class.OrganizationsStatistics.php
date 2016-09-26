<?php

/**
 * Created by PhpStorm.
 * User: kardi
 * Date: 14.06.2016
 * Time: 13:39
 */
class OrganizationsStatistics extends AbstractAggregator
{

    const SQL_GET_DATA = '
      SELECT
      COUNT(stat_organizations.id) AS value,
      DATE_PART(\'epoch\', ts.time_value)::INT AS time_value
      FROM stat_organizations
        INNER JOIN stat_event_types ON stat_organizations.stat_type_id = stat_event_types.id 
          AND stat_event_types.entity = :entity
          AND stat_event_types.type_code = :type_code
          AND stat_organizations.organization_id = :organization_id
        INNER JOIN tokens ON stat_organizations.token_id = tokens.id
          AND tokens.user_id NOT IN (SELECT user_id
            FROM users_organizations
            WHERE users_organizations.organization_id = :organization_id
            AND users_organizations.status = TRUE)
        RIGHT OUTER JOIN (SELECT *
                    FROM generate_series(to_timestamp(:till), to_timestamp(:since), \'-1 {SCALE}\')) AS ts(time_value)
                    ON stat_organizations.created_at BETWEEN (ts.time_value - INTERVAL \'1 {SCALE}\') AND ts.time_value
        GROUP BY ts.time_value
        ORDER BY ts.time_value
        LIMIT 10000';

    const SQL_GET_AUDIENCE_DEVICES = '
        SELECT CASE 
          WHEN client_type = \'android\' THEN \'android\'
          WHEN client_type = \'ios\' THEN \'ios\'
          ELSE \'browser\'
           END AS name,
         COUNT(tokens.id) AS count 
        FROM tokens 
        INNER JOIN subscriptions ON subscriptions.user_id = tokens.user_id 
        WHERE subscriptions.status = TRUE
        AND subscriptions.organization_id = :organization_id
        GROUP BY client_type
    ';

    const SQL_GET_AUDIENCE_GENDER = '
        SELECT gender, COUNT(users.id) AS count 
        FROM users 
        INNER JOIN subscriptions ON subscriptions.user_id = users.id 
        WHERE subscriptions.status = TRUE
        AND subscriptions.organization_id = :organization_id
        GROUP BY gender
    ';


    const SQL_GET_FAVORED = 'SELECT 
      COUNT(stat_events.id) AS value,
      DATE_PART(\'epoch\', ts.time_value)::INT AS time_value
      FROM stat_events
      INNER JOIN stat_event_types ON stat_events.stat_type_id = stat_event_types.id 
        AND stat_event_types.entity = :entity
        AND stat_event_types.name = :type_code
      INNER JOIN tokens ON stat_events.token_id = tokens.id
        AND tokens.user_id NOT IN 
          (SELECT user_id 
            FROM users_organizations 
            WHERE users_organizations.organization_id = :organization_id 
            AND users_organizations.status = TRUE)
      INNER JOIN events ON events.id = stat_events.event_id 
        AND events.organization_id = :organization_id
      
      RIGHT OUTER JOIN (SELECT *
                    FROM generate_series(to_timestamp(:till), to_timestamp(:since), \'-1 {SCALE}\')) AS ts(time_value)
                    ON stat_events.created_at BETWEEN (ts.time_value - INTERVAL \'1 {SCALE}\') AND ts.time_value
      GROUP BY ts.time_value
        ORDER BY ts.time_value
        LIMIT 10000';

    const SQL_GET_NOTIFICATIONS = 'SELECT
      COUNT(stat_notifications.id) AS value,
      DATE_PART(\'epoch\', ts.time_value)::INT AS time_value
      FROM stat_notifications
        INNER JOIN events_notifications ON stat_notifications.event_notification_id = events_notifications.id 
        INNER JOIN events ON events_notifications.event_id = events.id AND events.organization_id = :organization_id
        RIGHT OUTER JOIN (SELECT *
                    FROM generate_series(to_timestamp(:till), to_timestamp(:since), \'-1 {SCALE}\')) AS ts(time_value)
                    ON stat_notifications.created_at BETWEEN (ts.time_value - INTERVAL \'1 {SCALE}\') AND ts.time_value
        GROUP BY ts.time_value
        ORDER BY ts.time_value
        LIMIT 10000';


    private $db;
    private $organization;


    public function __construct(PDO $db, Organization $organization, User $user)
    {
        if (!$user->isAdmin($organization)) throw new PrivilegesException('', $db);
        $this->db = $db;
        $this->organization = $organization;
    }


    private function getValue($type, $scale, DateTime $since, DateTime $till)
    {
        switch ($type) {
            case Statistics::ORGANIZATION_VIEW:
            case Statistics::ORGANIZATION_UNSUBSCRIBE:
            case Statistics::ORGANIZATION_SUBSCRIBE: {
                $query = $this->replaceScale(self::SQL_GET_DATA, $scale);
                $statements = array(
                    ':organization_id' => $this->organization->getId(),
                    ':entity' => Statistics::ENTITY_ORGANIZATION,
                    ':type_code' => $type,
                    ':since' => $since->getTimestamp(),
                    ':till' => $till->getTimestamp(),
                );
                break;
            }
            case Statistics::EVENT_UNFAVE:
            case Statistics::EVENT_FAVE: {
            $query = $this->replaceScale(self::SQL_GET_FAVORED, $scale);
                $statements = array(
                    ':organization_id' => $this->organization->getId(),
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
                    ':organization_id' => $this->organization->getId(),
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
                case Statistics::FIELD_CONVERSION: {
                    $result[Statistics::FIELD_CONVERSION] = $this->getConversion(
                        $value['scale'] ?? $scale,
                        isset($value['since']) ? DateTime::createFromFormat('U', $value['since']) : $since,
                        isset($value['till']) ? DateTime::createFromFormat('U', $value['till']) : $till
                    )->getData();
                    break;
                }
                case Statistics::FIELD_AUDIENCE: {
                    $result[Statistics::FIELD_AUDIENCE] = $this->getAudience()->getData();
                    break;
                }
                case Statistics::EVENT_NOTIFICATIONS_SENT:
                case Statistics::EVENT_FAVE:
                case Statistics::EVENT_UNFAVE:
                case Statistics::ORGANIZATION_UNSUBSCRIBE:
                case Statistics::ORGANIZATION_SUBSCRIBE:
                case Statistics::ORGANIZATION_VIEW: {
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
                case Statistics::FIELD_CONVERSION: {
                    $result[Statistics::FIELD_CONVERSION] = $this->getConversion($scale, $since, $till)->getData();
                    break;
                }
            }
        }
        return new Result(true, '', $result);
    }

    private function getConversion($scale, $since, $till)
    {
        $views = $this->getValue(
            Statistics::ORGANIZATION_VIEW,
            $scale,
            $since,
            $till
        )->getData();

        $subscribes = $this->getValue(
            Statistics::ORGANIZATION_SUBSCRIBE,
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

    private function getAudience()
    {
        $p_get_devices = $this->db->prepare(self::SQL_GET_AUDIENCE_DEVICES);
        $p_get_gender = $this->db->prepare(self::SQL_GET_AUDIENCE_GENDER);
        $data = array(
            ':organization_id' => $this->organization->getId()
        );
        $result = $p_get_devices->execute($data);
        if ($result === FALSE) throw new DBQueryException('CANT_GET_DEVICES', $this->db);

        $result = $p_get_gender->execute($data);
        if ($result === FALSE) throw new DBQueryException('CANT_GET_GENDERS', $this->db);

        $devices = $p_get_devices->fetchAll();
        $res_devices = array();
        $keys = array();

        foreach ($devices as $type) {
            if (isset($keys[$type['name']])) {
                $keys[$type['name']] += $type['count'];
            } else {
                $keys[$type['name']] = $type['count'];
            }
        }

        foreach ($keys as $name => $count) {
            $res_devices[] = array('name' => $name, 'count' => $count);
        }

        $result = array(
            'devices' => $res_devices,
            'gender' => $p_get_gender->fetchAll()
        );
        return new Result(true, '', $result);
    }
}