<?php

require_once $BACKEND_FULL_PATH . '/statistics/Class.AbstractAggregator.php';

class EventsStatistics extends AbstractAggregator
{

    private $db;
    private $event;

    const SQL_GET_VALUES = 'SELECT COUNT(stat_events.id) AS value
      FROM stat_events
      INNER JOIN stat_event_types ON stat_events.stat_type_id = stat_event_types.id
      WHERE stat_events.created_at BETWEEN :since AND :till';

    const SQL_GET_NOTIFICATIONS_SENT = 'SELECT COUNT("view_stat_notifications"."id") AS "value"
      FROM view_stat_notifications 
      WHERE view_stat_notifications.notification_time BETWEEN :since AND :till';

    const SQL_GET_NOTIFICATIONS_SENT_AGGREGATED = 'SELECT notifications_count
      FROM stat_notifications_aggregated 
      WHERE 1 = 1 ';

    const SQL_GET_USERS_NOTIFICATIONS = 'SELECT COUNT(users_notifications.id) AS value
      FROM users_notifications
      WHERE users_notifications.created_at BETWEEN :since AND :till';

    const SQL_GET_VIEWS = self::SQL_GET_VALUES . '';

    public function __construct(PDO $db, Event $event, User $user)
    {
        if (!$user->isEventAdmin($event)) throw new PrivilegesException('', $db);
        $this->db = $db;
        $this->event = $event;
    }
    
    public static function getValueSQLWithNamedParams($type){
        return self::SQL_GET_VALUES 
        . ' AND stat_event_types.type_code = :type_code_' . $type 
        . ' AND stat_events.event_id = view_events.id';
    } 
    
}