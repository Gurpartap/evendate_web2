<?php


class GoogleAuth extends AbstractAuth
{


	static $type_name = 'GOOGLE';


	public function getRemoteUserInfo()
	{
		$response = $this->client->request('GET', $this->URLS[self::$type_name]['GET_USER_INFO'],
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $this->oauth_data['access_token']
				)
			)
		);

		$this->user_info = $this->getBodyJSON($response);

		return $this;
	}

	public function getRemoteFriendsList()
	{
		$response = $this->client->request('GET', $this->URLS[self::$type_name]['GET_FRIENDS_LIST'],
			array(
				'headers' => array(
					'Authorization' => 'Bearer ' . $this->oauth_data['access_token']
				)
			)
		);
		$this->friends_list = $this->getBodyJSON($response);

		$this->friends_list = $this->friends_list['items'];

		return $this;

	}

	public function getRemoteGroupsList()
	{
		$this->groups_data = array();
		return $this;
	}

	public function fillToInsData()
	{

		$this->to_ins_data = array(
			'first_name' => $this->user_info['name']['givenName'],
			'last_name' => $this->user_info['name']['familyName'],
			'avatar_url' => isset($this->user_info['cover']['coverPhoto']['url']) ? $this->user_info['cover']['coverPhoto']['url'] : null,
			'gender' => $this->getSex(),
			'token' => $this->getUserToken(),
			'email' => null,
		);

		if (isset($this->user_info['emails']) && count($this->user_info['emails']) > 0) {
			$this->to_ins_data['email'] = $this->user_info['emails'][0]['value'];
		}

		return $this;
	}

	public function saveSignInData($user_id)
	{
		$p_ins = App::queryFactory()->newInsert();
		$p_ins
			->into('google_sign_in')
			->cols(array(
				'google_id' => $this->getUID(),
				'user_id' => $user_id,
				'access_token' => $this->oauth_data['access_token'],
				'expires_in' => $this->oauth_data['expires_in'],
				'etag' => $this->user_info['etag'],
				'cover_photo_url' => isset($this->user_info['cover']['coverPhoto']['url']) ? $this->user_info['cover']['coverPhoto']['url'] : null
			));
		App::DB()->prepareExecute($p_ins, 'CANT_INSERT_GOOGLE_DATA');

	}

	public function saveFriendsList($user_id)
	{
		if (count($this->friends_list) == 0) return;
		$q_ins = App::queryFactory()->newInsert()->into('google_friends');

		foreach ($this->friends_list as $friend) {
			$q_ins
				->addRow(array(
					'user_id' => $user_id,
					'friend_uid' => $friend['uid'],
				))
				->set('updated_at', 'NOW()')
			->bind;
		}
		$q_ins->onConflictDoNothing();
		App::DB()->prepareExecute($q_ins, 'CANT_INSERT_GOOGLE_DATA');
	}


}