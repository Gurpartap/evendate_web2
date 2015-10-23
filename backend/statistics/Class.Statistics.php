<?php

	class Statistics{

		const ENTITY_EVENT = 'event';
		const ENTITY_ORGANIZATION = 'organization';


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


		public static function getTypeId($entity_type, $type_name, PDO $db){
			$q_get = 'SELECT id FROM stat_event_types
				WHERE type_code = :type_code
				AND entity = :entity';
			$p_get = $db->prepare($q_get);
			$res = $p_get->execute(array(
				':entity' => $entity_type,
				':type_code' => $type_name
			));
			if ($res === FALSE) throw new DBQueryException('', $db);
			if ($p_get->rowCount() != 1) throw new InvalidArgumentException('', $db);
			return $p_get->fetchColumn(0);
		}

		public static function Event(Event $event, User $user, PDO $db, $type){
			try {
				$type_id = self::getTypeId(self::ENTITY_EVENT, $type, $db);
			}catch(Exception $e){
				return FALSE;
			}
			$q_ins_event = 'INSERT INTO stat_events(event_id, token_id, stat_type_id, created_at)
				VALUES (:event_id, :token_id, :stat_type_id, NOW())';

			$p_ins = $db->prepare($q_ins_event);
			$p_ins->execute(array(
				':event_id' => $event->getId(),
				':token_id' => $user->getTokenId(),
				':stat_type_id' => $type_id
			));
		}

		public static function Organization(Organization $organization, User $user, PDO $db, $type){
			try {
				$type_id = self::getTypeId(self::ENTITY_ORGANIZATION, $type, $db);
			}catch(Exception $e){
				return FALSE;
			}
			$q_ins_event = 'INSERT INTO stat_organizations(organization_id, token_id, stat_type_id, created_at)
				VALUES (:organization_id, :token_id, :stat_type_id, NOW())';

			$p_ins = $db->prepare($q_ins_event);
			$p_ins->execute(array(
				':organization_id' => $organization->getId(),
				':token_id' => $user->getTokenId(),
				':stat_type_id' => $type_id
			));
		}


		public static function StoreBatch(array $events, User $user, PDO $db){
			foreach ($events as $event){
				switch($event['entity_type']){
					case self::ENTITY_EVENT: {
						self::Event(new Event($event['entity_id'], $db), $user, $db, $event['event_type']);
						break;
					}
					case self::ENTITY_ORGANIZATION: {
						self::Organization(new Organization($event['entity_id'], $db), $user, $db, $event['event_type']);
						break;
					}
				}
			}
			return new Result(true, '');
		}

	}