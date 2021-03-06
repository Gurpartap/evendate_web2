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

	const EMAIL_OPEN = 'open';
	const EMAIL_OPEN_LINK = 'open_link';

	const PUSH_OPEN = 'open';

	const FRIEND_VIEW_SUBSCRIPTIONS = 'view_subscriptions';
	const FRIEND_VIEW_ACTIONS = 'view_actions';
	const FRIEND_VIEW_EVENT_FROM_USER = 'view_event_from_user';

	const FIELD_DYNAMICS = 'dynamics';
	const FIELD_CONVERSION = 'conversion';
	const FIELD_OPEN_CONVERSION = 'open_conversion';
	const FIELD_FAVE_CONVERSION = 'fave_conversion';
	const FIELD_AUDIENCE = 'audience';

	public static function getTypeId($entity_type, $type_name, ExtendedPDO $db)
	{
		$q_get = App::queryFactory()
			->newSelect();
		$q_get->from('stat_event_types')
			->cols(array('id'))
			->where('type_code = ?', $type_name)
			->where('entity = ?', $entity_type);

		$p_get = $db->prepareExecute($q_get, 'CANT_GET_STATS_TYPE_ID');
		if ($p_get->rowCount() < 1) throw new InvalidArgumentException('NOT_ADMIN', $db);
		return $p_get->fetchColumn(0);
	}

	private static function updateIOsBadges(ExtendedPDO $db, AbstractUser $user, $type, Event $event = null, Organization $organization = null)
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

	public static function Event(Event $event, AbstractUser $user = null, ExtendedPDO $db, $type, $no_update_badges = null)
	{
		try {
			$type_id = self::getTypeId(self::ENTITY_EVENT, $type, $db);
		} catch (Exception $e) {
			return FALSE;
		}

		if ($user instanceof User &&
			$no_update_badges == null
			&& $event->isSeenByUser($user)->getData()['is_seen'] == false
			&& $event->isInUserFeed($user)->getData()['is_in_feed']
		) {
			$no_update_badges = false;
		} else {
			$no_update_badges = true;
		}

		$q_ins_event = 'INSERT INTO stat_events(event_id, token_id, stat_type_id, created_at, utm_fields)
				VALUES (:event_id, :token_id, :stat_type_id, NOW(), :utm_fields)';

		$db->prepareExecuteRaw($q_ins_event, array(
			':event_id' => $event->getId(),
			':token_id' => $user ? $user->getTokenId() : null,
			':stat_type_id' => $type_id,
			':utm_fields' => App::$__REQUEST['utm'] ?? null
		), 'CANT_INSERT_EVENT_STATS');
		if ($no_update_badges !== true) {
			self::updateIOsBadges($db, $user, $type, $event);
		}
		return true;
	}

	public static function Email($uuid, AbstractUser $user = null, ExtendedPDO $db, $type)
	{
		try {
			$type_id = self::getTypeId(self::ENTITY_EVENT, $type, $db);
		} catch (Exception $e) {
			return FALSE;
		}


		$q_ins_event = 'INSERT INTO stat_events(event_id, token_id, stat_type_id, created_at, utm_fields)
				VALUES (:event_id, :token_id, :stat_type_id, NOW(), :utm_fields)';

		$db->prepareExecuteRaw($q_ins_event, array(
			':event_id' => $event->getId(),
			':token_id' => $user ? $user->getTokenId() : null,
			':stat_type_id' => $type_id,
			':utm_fields' => App::$__REQUEST['utm'] ?? null
		), 'CANT_INSERT_EVENT_STATS');
		if ($no_update_badges !== true) {
			self::updateIOsBadges($db, $user, $type, $event);
		}
		return true;
	}


	public static function Organization(Organization $organization, AbstractUser $user = null, ExtendedPDO $db, $type, $no_update_badges = false)
	{
		try {
			$type_id = self::getTypeId(self::ENTITY_ORGANIZATION, $type, $db);
		} catch (Exception $e) {
			return FALSE;
		}

		$q_ins_event = App::queryFactory()
			->newInsert();
		$q_ins_event->into('stat_organizations')
			->cols(array(
				'organization_id' => $organization->getId(),
				'token_id' => $user ? $user->getTokenId() : null,
				'stat_type_id' => $type_id
			));

		$db->prepareExecute($q_ins_event);

		if ($no_update_badges !== true && $user instanceof User) {
			self::updateIOsBadges($db, $user, $type, null, $organization);
		}
	}

	public static function Friend(Friend $friend, AbstractUser $user = null, ExtendedPDO $db, $type)
	{
		if ($friend->getId() == $user->getId()) return;
		try {
			$type_id = self::getTypeId(self::ENTITY_FRIEND, $type, $db);
		} catch (Exception $e) {
			return;
		}
		$q_ins_event = App::queryFactory()
			->newInsert();
		$q_ins_event->into('stat_users')
			->cols(array(
				'user_id' => $friend->getId(),
				'token_id' => $user ? $user->getTokenId() : null,
				'stat_type_id' => $type_id
			));

		$p_ins = $db->prepareExecute($q_ins_event, 'CANT_SAVE_FRIEND_STATS');
	}

	public static function StoreBatch(array $events, AbstractUser $user = null, ExtendedPDO $db, array $__request = null)
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