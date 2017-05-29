<?php

class VkAuth extends AbstractAuth
{

	static $type_name = 'VK';

	public function getRemoteUserInfo()
	{
		$response = $this->client->request('GET', $this->URLS[self::$type_name]['GET_USER_INFO'],
			array(
				'query' => array(
					'user_ids' => $this->oauth_data['user_id'],
					'fields' => 'photo_50, sex, city, photo_100, photo_max, photo_max_orig, education, activities, occupation, relation, personal, interests, music, movies, tv, books, games, about',
					'name_case' => 'nom'
				),
				'headers' => array(
					'Accept-Language' => 'ru,en-us'
				)
			)
		);

		$this->user_info = $this->getBodyJSON($response);

		if (!isset($this->user_info['response']) || count($this->user_info['response']) == 0) throw new RuntimeException('ERROR_IN_RESPONSE');
		$this->user_info = $this->user_info['response'][0];
		return $this;
	}

	public function getRemoteFriendsList()
	{
		$response = $this->client->request('GET', $this->URLS[self::$type_name]['GET_FRIENDS_LIST'],
			array(
				'query' => array(
					'user_id' => $this->oauth_data['user_id'],
					'order' => 'hints',
					'fields' => 'city, domain',
					'countr' => 50000
				),
				'headers' => array(
					'Accept-Language' => 'ru,en-us'
				)
			)
		);
		$this->friends_list = $this->getBodyJSON($response);

		if (!isset($this->friends_list['response'])) throw new RuntimeException('ERROR_IN_RESPONSE');
		$this->friends_list = $this->friends_list['response'];


		return $this;

	}

	public function fillToInsData()
	{
		$this->to_ins_data = array(
			'first_name' => $this->user_info['first_name'],
			'last_name' => $this->user_info['last_name'],
			'avatar_url' => $this->user_info['photo_100'],
			'gender' => $this->getSex(),
			'token' => $this->getUserToken(),
			'email' => $this->oauth_data['email'],
		);
		return $this;
	}


	public function getRemoteGroupsList()
	{
		$response = $this->client->request('GET', $this->URLS[self::$type_name]['GET_GROUPS_LIST'],
			array(
				'query' => array(
					'user_id' => $this->oauth_data['user_id'],
					'extended' => 1,
					'fields' => 'description, links',
					'count' => 1000,
					'access_token' => $this->oauth_data['access_token']
				),
				'headers' => array(
					'Accept-Language' => 'ru,en-us'
				)
			)
		);

		$this->groups_data = $this->getBodyJSON($response);

		if (!isset($this->groups_data['response'])) throw new RuntimeException('ERROR_IN_RESPONSE');
		$this->groups_data = $this->groups_data['response'];

		return $this;
	}

	public function getUID()
	{
		return $this->oauth_data['user_id'];
	}


}