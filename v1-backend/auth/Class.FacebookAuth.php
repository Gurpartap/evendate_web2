<?php

class FacebookAuth extends AbstractAuth
{


	static $type_name = 'FACEBOOK';


	public function getRemoteUserInfo()
	{
		$response = $this->client->request('GET', $this->URLS[self::$type_name]['GET_USER_INFO'],
			array(
				'query' => array(
					'access_token' => $this->oauth_data['access_token'],
					'fields' => 'first_name,last_name,email,middle_name,picture,gender,about,education,books,events,movies,groups'
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
				'query' => array(
					'access_token' => $this->oauth_data['access_token']
				)
			)
		);
		$this->friends_list = $this->getBodyJSON($response);

		if (isset($this->friends_list['data'])){
			$this->friends_list = $this->friends_list['data'];
		}
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
			'first_name' => $this->user_info['first_name'],
			'last_name' => $this->user_info['last_name'],
			'avatar_url' => $this->user_info['picture']['data']['url'],
			'gender' => $this->getSex(),
			'token' => $this->getUserToken(),
			'email' => $this->user_info['email'],
		);
		return $this;
	}



	public function getSex()
	{
		if ($this->user_info['gender'] == 'male' || $this->user_info['gender'] == 'female'){
			return $this->user_info['gender'];
		}else{
			return null;
		}
	}

	public function saveSignInData($user_id)
	{

		$ins_data = array(
			'uid' => $this->getUID(),
			'user_id' => $user_id,
			'access_token' => $this->oauth_data['access_token'],
			'expires_in' => $this->oauth_data['expires_in'],
			'secret' => null,
			'photo_50' => $this->user_info['photo_50'],
			'photo_100' => $this->user_info['photo_100'],
			'photo_max_orig' => $this->user_info['photo_max_orig']
		);

		$p_ins = App::queryFactory()->newInsert();
		$p_ins
			->into('vk_sign_in')
			->cols($ins_data)
			->onConflictUpdate(array('uid'), $ins_data);
		App::DB()->prepareExecute($p_ins, 'CANT_INSERT_VK_DATA');
	}


}