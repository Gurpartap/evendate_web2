<?php


class Notification extends AbstractEntity
{

	protected $id;
	protected $uuid;
	protected $event_id;
	protected $notification_time;
	protected $created_at;
	protected $updated_at;
	protected $done;
	protected $sent_time;
	protected $notification_type;

	const RANDOM_FIELD_NAME = 'random';

	protected static $DEFAULT_COLS = array(
		'uuid',
		'event_id',
		'notification_time',
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at',
		'done',
		'sent_time',
		'notification_type',
		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_notifications AS vn
			WHERE vn.id = view_notifications.id) AS random',
	);

	const NOTIFICATION_TYPE_NOW = 'notification-now';
	const NOTIFICATION_TYPE_CANCELED = 'notification-event-canceled';
	const NOTIFICATION_TYPE_CHANGED_DATES = 'notification-event-changed-dates';
	const NOTIFICATION_TYPE_CHANGED_LOCATION = 'notification-event-changed-location';
	const NOTIFICATION_TYPE_CHANGED_PRICE = 'notification-event-changed-price';
	const NOTIFICATION_TYPE_CHANGED_REGISTRATION = 'notification-event-changed-registration';
	const NOTIFICATION_TYPE_ONE_DAY_REGISTRATION_CLOSE = 'notification-one-day-registration-close';


	const NOTIFICATION_TYPE_BEFORE_THREE_HOURS = 'notification-before-three-hours';
	const NOTIFICATION_TYPE_BEFORE_DAY = 'notification-before-day';
	const NOTIFICATION_TYPE_BEFORE_THREE_DAYS = 'notification-before-three-days';
	const NOTIFICATION_TYPE_BEFORE_WEEK = 'notification-before-week';
	const NOTIFICATION_TYPE_BEFORE_QUARTER_OF_HOUR = 'notification-before-quarter-of-hour';
	const NOTIFICATION_TYPE_CUSTOM = 'notification-custom';
	const NOTIFICATION_TYPE_REGISTRATION_APPROVED = 'notification-registration-approved';
	const NOTIFICATION_TYPE_REGISTRATION_CHECKED_OUT = 'notification-registration-checked-out';
	const NOTIFICATION_TYPE_REGISTRATION_NOT_CHECKED_OUT = 'notification-registration-not-checked-out';
	const NOTIFICATION_TYPE_REGISTRATION_NOT_APPROVED = 'notification-registration-not-approved';
	const NOTIFICATION_TYPE_USERS = 'users-notification';

	const NOTIFICATION_TYPE_NOW_ID = 1;

	const USERS_NOTIFICATION_ID = 13;

	const NOTIFICATION_CHANGED_TYPES = array(
		self::NOTIFICATION_TYPE_CANCELED,
		self::NOTIFICATION_TYPE_CHANGED_DATES,
		self::NOTIFICATION_TYPE_CHANGED_LOCATION,
		self::NOTIFICATION_TYPE_CHANGED_REGISTRATION,
		self::NOTIFICATION_TYPE_CHANGED_PRICE,
	);

	const NOTIFICATION_PREDEFINED_CUSTOM = array(
		self::NOTIFICATION_TYPE_BEFORE_THREE_HOURS,
		self::NOTIFICATION_TYPE_BEFORE_THREE_DAYS,
		self::NOTIFICATION_TYPE_BEFORE_WEEK,
		self::NOTIFICATION_TYPE_BEFORE_DAY,
		self::NOTIFICATION_TYPE_BEFORE_QUARTER_OF_HOUR
	);

	const NOTIFICATION_REGISTRATION_TYPES = array(
		self::NOTIFICATION_TYPE_REGISTRATION_APPROVED,
		self::NOTIFICATION_TYPE_REGISTRATION_NOT_APPROVED,
		self::NOTIFICATION_TYPE_REGISTRATION_NOT_CHECKED_OUT,
		self::NOTIFICATION_TYPE_REGISTRATION_CHECKED_OUT
	);

	const NOTIFICATION_TYPES = array(
		self::NOTIFICATION_TYPE_NOW,
		self::NOTIFICATION_TYPE_BEFORE_THREE_HOURS,
		self::NOTIFICATION_TYPE_BEFORE_THREE_DAYS,
		self::NOTIFICATION_TYPE_BEFORE_WEEK,
		self::NOTIFICATION_TYPE_BEFORE_DAY,
		self::NOTIFICATION_TYPE_CUSTOM,
		self::NOTIFICATION_TYPE_CANCELED,
		self::NOTIFICATION_TYPE_CHANGED_DATES,
		self::NOTIFICATION_TYPE_CHANGED_LOCATION,
		self::NOTIFICATION_TYPE_CHANGED_REGISTRATION,
		self::NOTIFICATION_TYPE_CHANGED_PRICE,
		self::NOTIFICATION_TYPE_REGISTRATION_APPROVED,
		self::NOTIFICATION_TYPE_REGISTRATION_NOT_APPROVED,
		'notification-event-registration-ending'
	);


	public function update(ExtendedPDO $db, array $notification)
	{
		if ($this->done == true) throw new LogicException('CANT_UPDATE_SENT_NOTIFICATION');
		if (!isset($notification['notification_time'])) throw new LogicException('CANT_FIND_NOTIFICATION_TIME');

		$time = new DateTime($notification['notification_time']);
		if ($time <= new DateTime()) throw new InvalidArgumentException('BAD_NOTIFICATION_TIME');

		$q_upd_notification = App::queryFactory()->newUpdate();
		$q_upd_notification
			->table('users_notifications')
			->cols(array(
				'notification_time' => $time->format('Y-m-d H:i:s')
			))
			->where('uuid = ?', $this->uuid);

		$result = $db->prepareExecute($q_upd_notification, 'CANT_UPDATE_NOTIFICATION')->fetch(PDO::FETCH_ASSOC);;
		return new Result(true, 'Уведомление успешно обновлено', $result);
	}

	public function delete(ExtendedPDO $db)
	{
		$q_upd = App::queryFactory()->newUpdate();

		$q_upd
			->table('users_notifications')
			->set('status', 'false')
			->where('uuid = ?', $this->uuid);

		$db->prepareExecute($q_upd, 'CANT_DELETE_NOTIFICATION');
		return new Result(true, 'Уведомление успешно удалено');
	}

	public function getNotificationTime()
	{
		return $this->notification_time;
	}

	public function setNotificationTime(DateTime $dt)
	{
		$q_upd = App::queryFactory()->newUpdate();
		$q_upd
			->table('events_notifications')
			->set('notification_time', $dt->format('Y-m-d H:i:s'))
			->where('id = ?', $this->id);

		App::DB()->prepareExecute($q_upd);

		return $this->notification_time = $dt->getTimestamp();
	}

	public function getType()
	{
		return $this->notification_type;
	}

	public function getDone()
	{
		return $this->done;
	}

}