<?php


class Notification extends AbstractEntity{

	protected $uuid;
	protected $event_id;
	protected $notification_time;
	protected $created_at;
	protected $updated_at;
	protected $done;
	protected $sent_time;
	protected $notification_type;

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
	);



	public function update(PDO $db, array $notification){
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

		$p_upd = $db->prepare($q_upd_notification->getStatement());
		$result = $p_upd->execute($q_upd_notification->getBindValues());
		if ($result === FALSE) throw new DBQueryException('', $db);
		$result = $p_upd->fetch(PDO::FETCH_ASSOC);
		return new Result(true, 'Уведомление успешно обновлено', $result);
	}

	public function delete(PDO $db){
		$q_upd = App::queryFactory()->newUpdate();

		$q_upd
			->table('users_notifications')
			->set('status', 'false')
			->where('uuid = ?', $this->uuid);

		$p_upd = $db->prepare($q_upd->getStatement());

		$result = $p_upd->execute($q_upd->getBindValues());

		if ($result === FALSE) throw new DBQueryException('CANT_DELETE_NOTIFICATION', $db);

		return new Result(true, 'Уведомление успешно удалено');
	}
}