<?php

require_once "{$BACKEND_FULL_PATH}/auth/Class.AbstractAuth.php";
require_once "{$BACKEND_FULL_PATH}/auth/Class.FacebookAuth.php";
require_once "{$BACKEND_FULL_PATH}/auth/Class.GoogleAuth.php";
require_once "{$BACKEND_FULL_PATH}/auth/Class.VkAuth.php";
require_once "{$BACKEND_FULL_PATH}/auth/Class.NewUser.php";

class AuthHandler
{

	private $oauth_data;
	private $provider;
	private $user_id;

	/**
	 * AuthHandler constructor.
	 * @param array $oauth_data
	 */
	public function __construct(array $oauth_data)
	{
		$this->oauth_data = $oauth_data;
	}


	public function startAuth(): NewUser
	{
		switch ($this->oauth_data['type']) {
			case 'vk': {
				$provider = new VkAuth($this->oauth_data);
				break;
			}
			case 'facebook': {
				$provider = new FacebookAuth($this->oauth_data);
				break;
			}
			case 'google': {
				$provider = new GoogleAuth($this->oauth_data);
				break;
			}
			default: {
				throw new InvalidArgumentException('BAD_PROVIDER');
			}
		}

		$provider->getRemoteUserInfo();
		$provider->getRemoteFriendsList();
		$provider->getRemoteGroupsList();
		$provider->fillToInsData();

		$this->provider = $provider;

		return $this->saveDataInDB($provider);

	}


	private function saveDataInDB(AbstractAuth $provider)
	{
		$type = strtolower($provider::$type_name);

		$q_get_user = App::queryFactory()->newSelect();
		$q_get_user
			->from('users')
			->cols(array('id'))
			->where('email IS NOT NULL AND email = ?', $provider->getToInsData()['email'])
			->orWhere(strtolower($type) . '_uid = ?', $provider->getUID());

		$p = App::DB()->prepareExecute($q_get_user, 'CANT_FIND_USER_ERROR');
		$is_new_user = $p->rowCount() == 0;

		$_data = array(
			'first_name' => $provider->getUserInfo()['first_name'],
			'last_name' => $provider->getUserInfo()['last_name'],
			'token' => $provider->getUserToken(),
			'email' => $provider->getOauthData()['email'],
			'avatar_url' => $provider->getUserInfo()['avatar_url'],
			'gender' => $provider->getUserInfo()['gender'],
		);

		if ($is_new_user) {

			$q_user = App::queryFactory()->newInsert()
				->cols($_data)
				->into('users')
				->returning(array('id'));

		} else {
			$current_user = $p->fetch();

			$q_user = App::queryFactory()->newUpdate()
				->cols($_data)
				->table('users')
				->where('id = ?', $current_user['id'])
				->returning(array('id'));
		}

		$current_user = App::DB()->prepareExecute($q_user, 'CANT_ADD_OR_UPDATE_USER_ERROR')->fetch();

		$this->user_id = $current_user['id'];

		$provider->saveSignInData($this->user_id);
		$provider->saveFriendsList($this->user_id);
		$provider->saveInterests($this->user_id);
		@file_get_contents(App::DEFAULT_NODE_LOCATION . '/recommendations/users/' . $this->user_id);
		return $this->saveToken($provider);
	}

	private function saveToken(AbstractAuth $provider)
	{
		$oauth_data = $provider->getOauthData();
		$now = new DateTime();
		$now->add(new DateInterval('P1Y'));
		$q_ins = App::queryFactory()->newInsert()
			->into('tokens')
			->cols(array(
				'token' => $provider->getUserToken(),
				'user_id' => $this->user_id,
				'token_type' => isset($oauth_data['mobile']) && $oauth_data['mobile'] == true ? 'mobile' : 'bearer',
				'expires_on' => 0
			))
			->returning(array('id'));

		App::DB()->prepareExecute($q_ins, 'CANT_SAVE_TOKEN')->fetch();

		return new NewUser(array(
			'email' => $provider->getOauthData()['email'],
			'token' => $provider->getUserToken(),
			'user_id' => $this->user_id
		));
	}

	/**
	 * @return mixed
	 */
	public function getProvider(): AbstractAuth
	{
		return $this->provider;
	}

	/**
	 * @return mixed
	 */
	public function getUserId()
	{
		return $this->user_id;
	}


}