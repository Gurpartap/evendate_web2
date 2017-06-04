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
		unset($this->groups_data[0]);
		return $this;
	}

	public function getUID()
	{
		return $this->oauth_data['user_id'];
	}

	public function saveSignInData($user_id)
	{
		$p_ins = App::queryFactory()->newInsert();
		$p_ins
			->into('vk_sign_in')
			->cols(array(
				'uid' => $this->getUID(),
				'user_id' => $user_id,
				'access_token' => $this->oauth_data['access_token'],
				'expires_in' => $this->oauth_data['expires_in'],
				'secret' => NULL,
				'photo_50' => $this->user_info['photo_50'],
				'photo_100' => $this->user_info['photo_100'],
				'photo_max_orig' => $this->user_info['photo_max_orig']
			));
		App::DB()->prepareExecute($p_ins, 'CANT_INSERT_VK_DATA');

	}

	public function saveFriendsList($user_id)
	{
		if (count($this->friends_list) == 0) return;
		$q_ins = App::queryFactory()->newInsert()->into('vk_friends');

		foreach ($this->friends_list as $friend) {
			$q_ins
				->addRow(array(
					'user_id' => $user_id,
					'friend_uid' => $friend['uid'],
				));
		}

		$q_ins->onConflictDoNothing();
		App::DB()->prepareExecute($q_ins, 'CANT_INSERT_VK_DATA');

	}

	public function saveInterests($user_id)
	{
		$p_ins_group = App::queryFactory()->newInsert();
		$p_ins_group->into('vk_groups');
		$group_ids = [];

		foreach ($this->groups_data as $group) {
			$data = array(
				'gid' => $group['gid'],
				'name' => $group['name'],
				'screen_name' => $group['screen_name'],
				'description' => $group['description'],
				'photo' => $group['photo']
			);
			$p_ins_group->cols($data)
				->onConflictUpdate(array('gid'), $data)
				->returning(array('id'));
			$group = App::DB()->prepareExecute($p_ins_group, 'CANT_INSERT_GROUP')->fetch();
			$group_ids[] = $group['id'];
		}

		$p_ins_sub = App::queryFactory()->newInsert();
		$p_ins_sub->into('vk_users_subscriptions');


		foreach($group_ids as $group_id){
			$p_ins_sub->addRow(array(
				'vk_group_id' => $group_id,
				'user_id' => $user_id
			));
		}
		if (count($group_ids) > 0){
			$p_ins_sub->onConflictDoNothing();
			App::DB()->prepareExecute($p_ins_sub, 'CANT_INSERT_SUBSCRIPTION')->fetch();
		}
	}


}