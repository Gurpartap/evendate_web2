<?php

class Action extends AbstractEntity{
	protected $entity;
	protected $created_at;
	protected $stat_type_id;
	protected $type_code;
	protected $event_id;
	protected $organization_id;
	protected $user_id;

	const EVENT_FIELD_NAME = Statistics::ENTITY_EVENT;
	const ORGANIZATION_FIELD_NAME = Statistics::ENTITY_ORGANIZATION;
	const USER_FIELD_NAME = 'user';
	const RANDOM_FIELD_NAME = 'random';

	protected static $DEFAULT_COLS = array(
		'stat_type_id',
		'organization_id',
		'event_id',
		'user_id',
		'entity'
	);

	protected static $ADDITIONAL_COLS = array(
		'name',
		'type_code',
		'created_at',
		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_actions AS va
			WHERE va.id = view_actions.id) AS random',
	);

	protected static $ALLOWED_ACTION_TYPE_CODES = array(
		Statistics::ORGANIZATION_SUBSCRIBE,
		Statistics::ORGANIZATION_UNSUBSCRIBE,
		Statistics::EVENT_FAVE,
		Statistics::EVENT_UNFAVE
	);

	protected static $ALLOWED_ACTION_ENTITIES = array(
		Statistics::ENTITY_EVENT, Statistics::ENTITY_ORGANIZATION
	);

	public function getParams(AbstractUser $user = null, array $fields = null) : Result {
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::EVENT_FIELD_NAME]) && $this->entity == self::EVENT_FIELD_NAME){
			$event_fields = Fields::parseFields($fields[self::EVENT_FIELD_NAME]['fields'] ?? '');
			$result_data[self::EVENT_FIELD_NAME] = EventsCollection::one(
				App::DB(),
				$user,
				$this->event_id,
				$event_fields
			)->getParams($user, $event_fields)->getData();
		}

		if (isset($fields[self::ORGANIZATION_FIELD_NAME]) && $this->entity == self::ORGANIZATION_FIELD_NAME){
			$org_fields = Fields::parseFields($fields[self::ORGANIZATION_FIELD_NAME]['fields'] ?? '');
			$result_data[self::ORGANIZATION_FIELD_NAME] = OrganizationsCollection::one(
				App::DB(),
				$user,
				$this->organization_id,
				$org_fields
			)->getParams($user, $org_fields)->getData();
		}

		if (isset($fields[self::USER_FIELD_NAME])){
			$user_fields = Fields::parseFields($fields[self::USER_FIELD_NAME]['fields'] ?? '');
			$result_data[self::USER_FIELD_NAME] = UsersCollection::one(
				App::DB(),
				$user,
				$this->user_id,
				$user_fields
			)->getParams($user, $user_fields)->getData();
		}

		return new Result(true, '', $result_data);
	}


}