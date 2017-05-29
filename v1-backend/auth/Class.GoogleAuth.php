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
			'avatar_url' => $this->user_info['name']['familyName'],
			'gender' => $this->getSex(),
			'token' => $this->getUserToken(),
			'email' => null,
		);

		if (isset($this->user_info['emails']) && count($this->user_info['emails']) > 0) {
			$this->to_ins_data['email'] = $this->user_info['emails'][0]['value'];
		}

		return $this;
	}


}