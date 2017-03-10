<?php

class Device extends AbstractEntity{

	const RANDOM_FIELD_NAME = 'random';
	protected static $DEFAULT_COLS = array(
		'device_token',
		'client_type',
		'uuid'
	);

	protected static $ADDITIONAL_COLS = array(
		'device_name',
		'created_at',
		'updated_at',
		'expires_on',
		self::RANDOM_FIELD_NAME => '(SELECT created_at / (random() * 9 + 1)
			FROM view_devices AS vd
			WHERE vd.id = view_devices.id) AS random',
	);

	protected $id;
	protected $token_type;
	protected $user_id;
	protected $device_name;
	protected $expires_on;
	protected $device_token;
	protected $client_type;
	protected $created_at;
	protected $updated_at;



	public function delete() : Result {
		$q_upd = App::queryFactory()->newUpdate();
		$q_upd
			->table('tokens')
			->set('expires_on', 'NOW()')
			->where('id = :id');

		App::DB()->prepareExecute($q_upd, 'CANT_DELETE_DEVICE', array(':id' => $this->getId()));
		return new Result(true, 'Данные успешно обновлены');
	}


}