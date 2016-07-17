<?php

class Statistics
{


    const SCALE_MINUTE = 'minute';
    const SCALE_HOUR = 'hour';
    const SCALE_DAY = 'day';
    const SCALE_WEEK = 'week';
    const SCALE_MONTH = 'month';
    const SCALE_YEAR = 'year';
    const SCALE_OVERALL = 'overall';


    const SCALES = array(
        self::SCALE_MINUTE,
        self::SCALE_HOUR,
        self::SCALE_DAY,
        self::SCALE_WEEK,
        self::SCALE_MONTH,
        self::SCALE_YEAR,
        self::SCALE_OVERALL
    );

    const ENTITY_EVENT = 'event';
    const ENTITY_ORGANIZATION = 'organization';
    const ENTITY_FRIEND = 'friend';

    const ENTITY_EVENTS = 'events';
    const ENTITY_ORGANIZATIONS = 'organizations';
    const ENTITY_FRIENDS = 'friends';


    const ORGANIZATION_SUBSCRIBE = 'subscribe';
    const ORGANIZATION_VIEW = 'view';
    const ORGANIZATION_UNSUBSCRIBE = 'unsubscribe';
    const ORGANIZATION_OPEN_SITE = 'open_site';

    const EVENT_VIEW = 'view';
    const EVENT_UNFAVE = 'unfave';
    const EVENT_FAVE = 'fave';
    const EVENT_VIEW_DETAIL = 'view_detail';
    const EVENT_OPEN_SITE = 'open_site';
    const EVENT_NOTIFICATIONS_SENT = 'notifications_sent';
    const EVENT_AUTO_NOTIFICATIONS_SENT = 'auto_notifications_sent';
    const EVENT_USERS_NOTIFICATIONS_SENT = 'users_notifications_sent';
    const EVENT_USERS_NOTIFICATIONS = 'users_notifications';

    const SHARE_FACEBOOK = 'share_fb';
    const SHARE_VK = 'share_vk';
    const SHARE_TWITTER = 'share_tw';

    const FRIEND_VIEW_SUBSCRIPTIONS = 'view_subscriptions';
    const FRIEND_VIEW_ACTIONS = 'view_actions';
    const FRIEND_VIEW_EVENT_FROM_USER = 'view_event_from_user';

    const FIELD_DYNAMICS = 'dynamics';
    const FIELD_CONVERSION = 'conversion';
    const FIELD_AUDIENCE = 'audience';

    public static function getTypeId($entity_type, $type_name, PDO $db)
    {
        $q_get = App::queryFactory()
            ->newSelect()
            ->from('stat_event_types')
            ->cols(array('id'))
            ->where('type_code = ?', $type_name)
            ->where('entity = ?', $entity_type);

        $p_get = $db->prepare($q_get->getStatement());
        $res = $p_get->execute($q_get->getBindValues());
        if ($res === FALSE) throw new DBQueryException('', $db);
        if ($p_get->rowCount() < 1) throw new InvalidArgumentException('', $db);
        return $p_get->fetchColumn(0);
    }

    public static function Event(Event $event, User $user = null, PDO $db, $type)
    {
        try {
            $type_id = self::getTypeId(self::ENTITY_EVENT, $type, $db);
        } catch (Exception $e) {
            return;
        }
        $q_ins_event = App::queryFactory()
            ->newInsert()
            ->into('stat_events')
            ->cols(array(
                'event_id' => $event->getId(),
                'token_id' => $user ? $user->getTokenId() : null,
                'stat_type_id' => $type_id
            ));

        $p_ins = $db->prepare($q_ins_event->getStatement());
        $p_ins->execute($q_ins_event->getBindValues());
    }

    public static function Organization(Organization $organization, User $user = null, PDO $db, $type)
    {
        try {
            $type_id = self::getTypeId(self::ENTITY_ORGANIZATION, $type, $db);
        } catch (Exception $e) {
            return;
        }
        $q_ins_event = App::queryFactory()
            ->newInsert()
            ->into('stat_organizations')
            ->cols(array(
                'organization_id' => $organization->getId(),
                'token_id' => $user ? $user->getTokenId() : null,
                'stat_type_id' => $type_id
            ));

        $p_ins = $db->prepare($q_ins_event->getStatement());
        $p_ins->execute($q_ins_event->getBindValues());
    }

    public static function Friend(Friend $friend, User $user = null, PDO $db, $type)
    {
        if ($friend->getId() == $user->getId()) return;
        try {
            $type_id = self::getTypeId(self::ENTITY_FRIEND, $type, $db);
        } catch (Exception $e) {
            return;
        }
        $q_ins_event = App::queryFactory()
            ->newInsert()
            ->into('stat_users')
            ->cols(array(
                'user_id' => $friend->getId(),
                'token_id' => $user ? $user->getTokenId() : null,
                'stat_type_id' => $type_id
            ));

        $p_ins = $db->prepare($q_ins_event->getStatement());
        $p_ins->execute($q_ins_event->getBindValues());
    }

    public static function storeBatch(array $events, User $user = null, PDO $db)
    {
        foreach ($events as $event) {
            switch ($event['entity_type']) {
                case self::ENTITY_EVENT:
                case self::ENTITY_EVENTS: {
                    self::Event(EventsCollection::one($db, $user, $event['entity_id'], array()), $user, $db, $event['event_type']);
                    break;
                }
                case self::ENTITY_ORGANIZATION:
                case self::ENTITY_ORGANIZATIONS: {
                    self::Organization(OrganizationsCollection::one($db, $user, $event['entity_id'], array()), $user, $db, $event['event_type']);
                    break;
                }
                case self::ENTITY_FRIEND:
                case self::ENTITY_FRIENDS: {
                    self::Friend(UsersCollection::one($db, $user, $event['entity_id'], array()), $user, $db, $event['event_type']);
                    break;
                }
            }
        }
        return new Result(true, '');
    }

}