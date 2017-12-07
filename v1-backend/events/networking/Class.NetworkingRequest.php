<?php

class NetworkingRequest extends AbstractEntity
{


	private $nm;
	protected $db;

	public function setNetworkingManager(NetworkingManager $nm)
	{
		$this->nm = $nm;
	}

	public function setDb(ExtendedPDO $db)
	{
		$this->db = $db;
	}


	protected static $DEFAULT_COLS = array(
		'uuid',
		'event_id',
		'sender_user_id',
		'recipient_user_id',
		'message',
		'status',
		'accept_status',
		'accepted_at'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at'
	);


	public static function save(NetworkingManager $nm, ExtendedPDO $db, array $request)
	{
		$recipient = UsersCollection::one($db, $nm->getUser(), $request['recipient_user_id'], array());
		$q_save_request = App::queryFactory()->newInsert();
		$_data = array(
			'event_id' => $nm->getEvent()->getId(),
			'sender_user_id' => $nm->getUser()->getId(),
			'recipient_user_id' => $recipient->getId(),
			'message' => $request['message'],
			'status' => !isset($request['status']) || filter_var($request['status'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false'
		);
		$q_save_request
			->cols($_data)
			->into('networking_requests')
			->onConflictUpdate(array('event_id', 'sender_user_id', 'recipient_user_id'), $_data)
			->returning(array('uuid'));
		return new Result(true, '', $db->prepareExecute($q_save_request)->fetchAll());
	}

	public function update(array $data)
	{
		$q_upd = App::queryFactory()->newUpdate();
		$q_upd->table('networking_requests')
			->set('updated_at', 'NOW()');
		if (isset($data['status'])) {
			$q_upd->set('status', filter_var($data['status'], FILTER_VALIDATE_BOOLEAN));
		}
		if (isset($data['accept_status'])) {
			$q_upd->set('accept_status', filter_var($data['accept_status'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false')
				->set('accepted_at', 'NOW()');
		}
		$this->db->prepareExecute($q_upd);
		return new Result(true, '');
	}

}