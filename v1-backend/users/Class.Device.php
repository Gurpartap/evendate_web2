<?php

class Device extends AbstractEntity{

	protected static $DEFAULT_COLS = array(
		'device_token',
		'client_type'
	);

	protected static $ADDITIONAL_COLS = array(
		'device_name',
		'created_at',
		'updated_at',
		'expires_on'
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

		$p_upd_device = App::DB()->prepare($q_upd);
		$result = $p_upd_device->execute(array(':id' => $this->getId()));

		if ($result === FALSE) throw new DBQueryException('', App::DB());
		return new Result(true, 'Данные успешно обновлены');
	}


}