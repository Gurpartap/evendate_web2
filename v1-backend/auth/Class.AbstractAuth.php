<?php

require "{$BACKEND_FULL_PATH}/vendor/autoload.php";
use GuzzleHttp\Client;


abstract class AbstractAuth
{

	protected $oauth_data;
	protected $user_info;
	protected $friends_list;
	protected $groups_data;
	protected $type;

	protected $to_ins_data;

	protected $client;

	protected $URLS;

	static $type_name;

	/**
	 * AbstractAuth constructor.
	 * @param $oauth_data
	 */
	public function __construct($oauth_data)
	{
		$this->oauth_data = $oauth_data;
		$this->client = new Client([
			// You can set any number of default request options.
			'timeout' => 10.0,
		]);

		$this->URLS = App::getSocialUrls();

	}


	public abstract function getRemoteUserInfo();

	public abstract function getRemoteFriendsList();

	public abstract function getRemoteGroupsList();

	public abstract function fillToInsData();

	public abstract function saveSignInData($user_id);

	public abstract function saveFriendsList($user_id);

	public function saveInterests($user_id)
	{
		return;
	}

	protected function getBodyJSON(\GuzzleHttp\Psr7\Response $response, bool $object = true)
	{
		return json_decode($response->getBody()->getContents(), $object);
	}

	public function getUID()
	{
		return $this->user_info['id'];
	}

	public function getSex()
	{
		if (isset($this->user_info['sex'])) {
			switch ($this->user_info['sex']) {
				case 1: {
					return 'male';
				}
				case 2: {
					return 'male';
				}
				default: {
					return null;
				}
			}
		} else return null;
	}

	public function getUserToken(){
		return $this->oauth_data['access_token'] . ($this->oauth_data['secret'] ?? '') . md5(time());
	}

	/**
	 * @return mixed
	 */
	public function getOauthData()
	{
		return $this->oauth_data;
	}

	/**
	 * @return mixed
	 */
	public function getGroupsData()
	{
		return $this->groups_data;
	}

	/**
	 * @return mixed
	 */
	public function getType()
	{
		return $this->type;
	}

	/**
	 * @return mixed
	 */
	public function getToInsData()
	{
		return $this->to_ins_data;
	}

	/**
	 * @return array
	 */
	public function getURLS(): array
	{
		return $this->URLS;
	}

	/**
	 * @return mixed
	 */
	public function getUserInfo()
	{
		return $this->user_info;
	}

	/**
	 * @return mixed
	 */
	public function getFriendsList()
	{
		return $this->friends_list;
	}

}