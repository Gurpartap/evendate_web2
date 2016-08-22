<?php

class Statistics
{


		const SCALE_MINUTE = 'minute';
		const SCALE_HOUR = 'hour';
		const SCALE_DAY = 'day';
		const SCALE_WEEK = 'week';
		const SCALE_MONTH = 'month';
		const SCALE_YEAR = 'year';


		const SCALES = array(
			self::SCALE_MINUTE,
			self::SCALE_HOUR,
			self::SCALE_DAY,
			self::SCALE_WEEK,
			self::SCALE_MONTH,
			self::SCALE_YEAR,
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
        $q_get = 'SELECT id::INT FROM stat_event_types
				WHERE type_code = :type_code
				AND entity = :entity';
			$p_get = $db->prepare($q_get);
			$res = $p_get->execute(array(
				':entity' => $entity_type,
				':type_code' => $type_name
			));
			if ($res === FALSE) throw new DBQueryException('', $db);
			if ($p_get->rowCount() < 1) throw new InvalidArgumentException('', $db);
			return $p_get->fetchColumn(0);
		}

    private static function updateIOsBadges(PDO $db, User $user, $type, Event $event = null, Organization $organization = null)
    {
//        if (App::$ENV != 'prod') return;
        $exec_command = 'cd ' . App::getVar('node_path') . ' && ENV=' . App::$ENV . ' node update_ios_badges.js ' . $user->getId() . ' > /dev/null 2>/dev/null &';
        if (isset($event)) {
            exec($exec_command);
        } else if (isset($organization)) {
            if ($type == self::ORGANIZATION_VIEW) {
                try {
                    $subscribed = $organization->isSubscribed($user);
                    $subscribed = $subscribed['is_subscribed'];
                } catch (Exception $e) {
                    $subscribed = false;
                }
                if ($subscribed) {
                    exec($exec_command);
                }
            }
        }

    }

    public static function Event(Event $event, User $user = null, PDO $db, $type, $no_update_badges = null)
    {
        try {
            $type_id = self::getTypeId(self::ENTITY_EVENT, $type, $db);
        } catch (Exception $e) {
            return FALSE;
        }

        if ($no_update_badges == null
            && $event->isSeenByUser($user)->getData()['is_seen'] == false
            && $event->isInUserFeed($user)->getData()['is_in_feed']
        ) {
            $no_update_badges = false;
        } else {
            $no_update_badges = true;
        }

        $q_ins_event = 'INSERT INTO stat_events(event_id, token_id, stat_type_id, created_at)
				VALUES (:event_id, :token_id, :stat_type_id, NOW())';

        $p_ins = $db->prepare($q_ins_event);
        $p_ins->execute(array(
            ':event_id' => $event->getId(),
            ':token_id' => $user ? $user->getTokenId() : null,
            ':stat_type_id' => $type_id
        ));
        if ($no_update_badges !== true) {
            self::updateIOsBadges($db, $user, $type, $event);
        }
    }

    public static function Organization(Organization $organization, User $user = null, PDO $db, $type, $no_update_badges = false)
    {
        try {
            $type_id = self::getTypeId(self::ENTITY_ORGANIZATION, $type, $db);
        } catch (Exception $e) {
            return FALSE;
        }
        $q_ins_event = 'INSERT INTO stat_organizations(organization_id, token_id, stat_type_id, created_at)
				VALUES (:organization_id, :token_id, :stat_type_id, NOW())';

        $p_ins = $db->prepare($q_ins_event);
        $p_ins->execute(array(
            ':organization_id' => $organization->getId(),
            ':token_id' => $user ? $user->getTokenId() : null,
            ':stat_type_id' => $type_id
        ));

        if ($no_update_badges !== true) {
            self::updateIOsBadges($db, $user, $type, null, $organization);
        }
    }

    public static function Friend(Friend $friend, User $user = null, PDO $db, $type)
    {
        if ($friend->getId() == $user->getId()) return FALSE;
        try {
            $type_id = self::getTypeId(self::ENTITY_FRIEND, $type, $db);
        } catch (Exception $e) {
            return FALSE;
        }
        $q_ins_event = 'INSERT INTO stat_users(user_id, token_id, stat_type_id, created_at)
				VALUES (:user_id, :token_id, :stat_type_id, NOW())';

        $p_ins = $db->prepare($q_ins_event);
        $p_ins->execute(array(
            ':user_id' => $friend->getId(),
            ':token_id' => $user ? $user->getTokenId() : null,
            ':stat_type_id' => $type_id
        ));
    }

    public static function StoreBatch(array $events, User $user = null, PDO $db)
    {
        $organization_events = 0;
        $organization = null;
        $event_instance = null;
        foreach ($events as $event) {
            switch ($event['entity_type']) {
                case self::ENTITY_EVENT:
                case self::ENTITY_EVENTS: {
                    $event_instance = EventsCollection::one($db, $user, $event['entity_id'], array());
                    self::Event($event_instance, $user, $db, $event['event_type'], true);
                    $organization_events++;
                    break;
                }
                case self::ENTITY_ORGANIZATION:
                case self::ENTITY_ORGANIZATIONS: {
                    $organization = OrganizationsCollection::one($db, $user, $event['entity_id'], array());
                    self::Organization($organization, $user, $db, $event['event_type'], true);
                    if ($event['event_type'] == self::ORGANIZATION_VIEW) {
                        $organization_events++;
                    }
                    break;
                }
                case self::ENTITY_FRIEND:
                case self::ENTITY_FRIENDS: {
                    self::Friend(UsersCollection::one($db, $user, $event['entity_id'], array()), $user, $db, $event['event_type']);
                    break;
                }
            }
        }
        if ($organization_events > 0) {
            self::updateIOsBadges($db, $user, self::ORGANIZATION_VIEW, $event_instance, $organization);
        }
        return new Result(true, '');
    }

}