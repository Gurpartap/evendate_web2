<?php

class AbstractAggregator
{
    const ORGANIZATION_SQL_GET_VIEWS = 'SELECT COUNT(stat_organizations.id) AS value
      FROM stat_organizations
      INNER JOIN stat_event_types ON stat_organizations.stat_type_id = stat_event_types.id
      INNER JOIN tokens ON stat_organizations.token_id = tokens.id
      WHERE organization_id = :organization_id
      AND stat_event_types.entity = :entity
      AND stat_event_types.type_code = :type_code
      AND tokens.user_id NOT IN 
        (SELECT user_id 
          FROM users_organizations 
          WHERE users_organizations.organization_id = :organization_id 
          AND users_organizations.status = TRUE)
      AND DATE_PART(\'epoch\', stat_organizations.created_at)::INT BETWEEN :since AND :till';

    const ORGANIZATION_SQL_GET_FAVORED = 'SELECT COUNT(stat_events.id) AS value
      FROM stat_events
      INNER JOIN stat_event_types ON stat_events.stat_type_id = stat_event_types.id
      INNER JOIN tokens ON stat_events.token_id = tokens.id
      INNER JOIN view_events ON view_events.id = stat_events.event_id
      WHERE view_events.organization_id = :organization_id
      AND stat_event_types.entity = :entity
      AND stat_event_types.name = :type_code
      AND tokens.user_id NOT IN 
        (SELECT user_id 
          FROM users_organizations 
          WHERE users_organizations.organization_id = :organization_id 
          AND users_organizations.status = TRUE)
      AND DATE_PART(\'epoch\', stat_events.created_at)::INT BETWEEN :since AND :till';

    const ORGANIZATION_SQL_GET_NOTIFICATIONS = 'SELECT COUNT(stat_notifications.id) AS value
      FROM stat_notifications
      INNER JOIN events_notifications ON stat_notifications.event_notification_id = events_notifications.id
      INNER JOIN events ON events_notifications.event_id = events.id
      WHERE events.organization_id = :organization_id
      AND DATE_PART(\'epoch\', stat_events.created_at)::INT BETWEEN :since AND :till';

    const ORGANIZATION_SQL_GET_AUDIENCE_DEVICES = '
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

    const ORGANIZATION_SQL_GET_AUDIENCE_GENDER = '
        SELECT gender, COUNT(users.id) AS count 
        FROM users 
        INNER JOIN subscriptions ON subscriptions.user_id = users.id 
        WHERE subscriptions.status = TRUE
        AND subscriptions.organization_id = :organization_id
        GROUP BY gender
    ';

    const ORGANIZATION_SQL_GET_SUBSCRIBED = self::ORGANIZATION_SQL_GET_VIEWS;


    protected function getOrganizationQueryForScale($scale) : string
    {

        if (!in_array($scale, Statistics::SCALES)) throw new InvalidArgumentException('INVALID_SCALE');
        switch ($scale) {
            case Statistics::SCALE_MINUTE: {
                return ' GROUP BY ROUND(EXTRACT(\'epoch\' from stat_organizations.created_at) / 60)';
            }
            case Statistics::SCALE_HOUR: {
                return ' GROUP BY ROUND(EXTRACT(\'epoch\' from stat_organizations.created_at) / 3600)';
            }
            case Statistics::SCALE_DAY: {
                return ' GROUP BY ROUND(EXTRACT(\'epoch\' from stat_organizations.created_at) / 86400)';
            }
            case Statistics::SCALE_WEEK: {
                return ' GROUP BY ROUND(EXTRACT(\'epoch\' from stat_organizations.created_at) / 604800)';
            }
            case Statistics::SCALE_MONTH: {
                return ' GROUP BY ROUND(EXTRACT(\'epoch\' from stat_organizations.created_at) / 2592000)';
            }
            case Statistics::SCALE_YEAR: {
                return ' GROUP BY ROUND(EXTRACT(\'epoch\' from stat_organizations.created_at) / 31557600)';
            }
            case Statistics::SCALE_OVERALL: {
                return ' GROUP BY ROUND(EXTRACT(\'epoch\' from stat_organizations.created_at) / 2147483647)';
            }
        }
    }

    protected function iterate($query, array $data, DateTime $d_since, DateTime $d_till, $scale)
    {
        $query .= $this->getQueryForScale($scale);
        $return_values = array();

        echo $query;

            $till = $d_till->getTimestamp();
            $since = $d_since->getTimestamp();

        print_r(array_merge($data,
                array(
                    ':till' => $till,
                    ':since' => $since
                )));

//        while($iterate_start >= $d_since && $count++ < 1000){
//
//            $till = $iterate_start->getTimestamp();
//            $since = $iterate_start->sub($interval)->getTimestamp();
//            $result = $query->execute(array_merge($data,
//                array(
//                    ':till' => $till,
//                    ':since' => $since
//                )));
//            if ($result === FALSE) throw new DBQueryException('CANT_GET_VIEWS', $this->db);
//            $return_values[] = array(
//                'till' => $till,
//                'since' => $since,
//                'value' => $query->fetchColumn(0)
//            );
//        }

        return new Result(true, '', $return_values);
    }

}