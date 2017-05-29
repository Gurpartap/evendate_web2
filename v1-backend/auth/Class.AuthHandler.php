<?php

require_once "{$BACKEND_FULL_PATH}/auth/Class.AbstractAuth.php";
require_once "{$BACKEND_FULL_PATH}/auth/Class.FacebookAuth.php";
require_once "{$BACKEND_FULL_PATH}/auth/Class.GoogleAuth.php";
require_once "{$BACKEND_FULL_PATH}/auth/Class.VkAuth.php";

class AuthHandler
{

	private $oauth_data;

	/**
	 * AuthHandler constructor.
	 * @param array $oauth_data
	 */
	public function __construct(array $oauth_data)
	{
		$this->oauth_data = $oauth_data;
	}


	public function startAuth()
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

		$provider
			->getRemoteUserInfo()
			->getRemoteFriendsList()
			->getRemoteGroupsList()
			->fillToInsData();

		$this->saveDataInDB($provider);


	}


	private function saveDataInDB(AbstractAuth $provider)
	{
		$q_get_user = App::queryFactory()->newSelect();
		$q_get_user
			->from('users')
			->where('email IS NOT NULL AND email = ?', $provider->getToInsData()['email'])
			->orWhere(strtolower($provider::$type_name) . '_uid = ?', $provider->getUID());

		$p = App::DB()->prepareExecute($q_get_user, 'CANT_FIND_USER_ERROR');
		$is_new_user = $p->rowCount() == 0;
		$provider->saveSignInData();
	}

}