<?php


class Broadcast extends AbstractEntity
{

	protected $event_id;
	protected $creator_id;
	protected $uuid;
	protected $organization_id;
	protected $is_email;
	protected $is_push;
	protected $is_sms;
	protected $title;
	protected $message_text;
	protected $subject;
	protected $url;
	protected $notification_time;
	protected $is_active;
	protected $done;
	protected $created_at;
	protected $updated_at;
	protected $db;

	const EVENT_FIELD_NAME = 'event';
	const ORGANIZATION_FIELD_NAME = 'organization';

	protected static $DEFAULT_COLS = array(
		'uuid',
		'event_id',
		'organization_id',
		'is_email',
		'is_push',
		'is_sms',
		'is_active',
		'done',
		'subject',
		'title'
	);

	protected static $ADDITIONAL_COLS = array(
		'message_text',
		'url',
		'creator_id',
		'notification_time'
	);


	public function setData(array $data, ExtendedPDO $db, Organization $organization, Event $event = null)
	{
		$current_user = App::getCurrentUser();
		if ($current_user instanceof User == false) throw new PrivilegesException('', $db);
		if ($current_user->isAdmin($organization) == false) throw new PrivilegesException('', $db);

		if (filter_var($data['is_email'], FILTER_VALIDATE_BOOLEAN)) {
			$this->is_email = true;
			$this->is_push = false;
		} elseif (filter_var($data['is_push'], FILTER_VALIDATE_BOOLEAN)) {
			$this->is_push = true;
			$this->is_email = false;
			$this->is_sms = filter_var($data['is_sms'], FILTER_VALIDATE_BOOLEAN);
		} else throw new InvalidArgumentException('BAD_BROADCAST_TYPE');

		if (empty(trim($data['title']))) throw new InvalidArgumentException('BAD_BROADCAST_TITLE');
		if (empty(trim($data['message_text']))) throw new InvalidArgumentException('BAD_BROADCAST_TEXT');

		$this->event_id = $data['event_id'] ?? null;
		$this->organization_id = $data['organization_id'] ?? null;
		$this->title = $data['title'];
		$this->message_text = $data['message_text'];
		$this->url = $data['url'] ?? null;
		$this->uuid = $data['uuid'] ?? null;
		$this->is_active = $data['is_active'] ?? true;
		$this->subject = $data['subject'] ?? null;
		$this->creator_id = $current_user->getId();

		if (isset($data['notification_time'])) {
			try {
				$this->notification_time = new DateTime($data['notification_time']);
			} catch (Exception $e) {
				$this->notification_time = null;
			}
		} else {
			$this->notification_time = null;
		}
		$this->db = $db;
	}

	public function save()
	{
		if ($this->uuid) {
			$broadcast = BroadcastsCollection::filter($this->db, App::getCurrentUser(), array('uuid' => $this->uuid),
				array('done'))->getData();
			if (count($broadcast) > 0 && $broadcast[0]['done'] == true) {
				throw new LogicException('CANT_CHANGE_SENT_BROADCAST');
			}
		}

		$q = App::queryFactory()->newInsert();
		$update_cols = array(
			'event_id' => $this->event_id,
			'organization_id' => $this->organization_id,
			'is_email' => filter_var($this->is_email, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false',
			'is_push' => filter_var($this->is_push, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false',
			'is_sms' => filter_var($this->is_sms, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false',
			'title' => $this->title,
			'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false',
			'message_text' => $this->message_text,
			'subject' => $this->subject,
			'url' => $this->url,
			'notification_time' => $this->notification_time instanceof DateTime ? $this->notification_time->format(App::DB_DATETIME_FORMAT) : null
		);
		$q->into('broadcasts')
			->cols($update_cols)
			->returning(array('uuid'));

		if ($this->uuid) {
			$q->onConflictUpdate(array('uuid'), $update_cols);
		}
		$res = $this->db->prepareExecute($q, 'CANT_INSERT_BROADCAST')->fetch();
		return new Result(true, '', $res);
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::EVENT_FIELD_NAME])) {
			if (is_int($this->event_id)){
				$_fields =
					Fields::parseFields($fields[self::EVENT_FIELD_NAME]['fields'] ?? '');
				$result_data[self::EVENT_FIELD_NAME] =
					EventsCollection::one(
						App::DB(),
						$user,
						$this->event_id,
						$_fields,
						array()
					)->getParams($user, $_fields)->getData();
			}else{
				$result_data[self::EVENT_FIELD_NAME] = null;
			}

		}

		if (isset($fields[self::ORGANIZATION_FIELD_NAME])) {
			$_fields =
				Fields::parseFields($fields[self::ORGANIZATION_FIELD_NAME]['fields'] ?? '');
			$result_data[self::ORGANIZATION_FIELD_NAME] =
				OrganizationsCollection::one(
					App::DB(),
					$user,
					$this->organization_id,
					$_fields,
					array()
				)->getParams($user, $_fields)->getData();
		}
		return new Result(true, '', $result_data);
	}


}