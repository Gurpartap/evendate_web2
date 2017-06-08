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
	private $provider_name;

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
				$this->provider_name = 'vk';
				break;
			}
			case 'facebook': {
				$provider = new FacebookAuth($this->oauth_data);
				$this->provider_name = 'facebook';
				break;
			}
			case 'google': {
				$provider = new GoogleAuth($this->oauth_data);
				$this->provider_name = 'google';
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
			'first_name' => $provider->getToInsData()['first_name'],
			'last_name' => $provider->getToInsData()['last_name'],
			'token' => $provider->getUserToken(),
			'email' => $provider->getToInsData()['email'],
			'avatar_url' => $provider->getToInsData()['avatar_url'],
			'gender' => $provider->getToInsData()['gender'],
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
		@file_get_contents(App::DEFAULT_NODE_LOCATION . '/recommendations/users/' . $this->user_id . '?update_texts=true');
		try {
			$this->updateRecs();
		} catch (Exception $e) {
		}

		return $this->saveToken($provider);
	}

	private function updateRecs()
	{

		$q_ins_recs = 'INSERT INTO recommendations_organizations(organization_id, user_id) 
						SELECT id AS organization_id, :user_id AS user_id 
						FROM organizations ON CONFLICT DO NOTHING';
		App::DB()->prepareExecuteRaw($q_ins_recs, array(
			':user_id' => $this->user_id
		), 'CANT_UPDATE_RECS');

		$q_upd = 'UPDATE recommendations_organizations
								SET 
								rating_subscribed_in_social_network = (SELECT COUNT(id) * 50
								FROM view_organizations vo
								WHERE vo.id = view_users_organizations.organization_id AND
								vo.vk_url_path IN (SELECT vk_groups.screen_name
								FROM vk_groups
								INNER JOIN vk_users_subscriptions
								ON vk_users_subscriptions.vk_group_id = vk_groups.id
								WHERE vk_users_subscriptions.user_id = view_users_organizations.user_id)) :: INT,
								
								  rating_active_events_count          = (SELECT COUNT(id) / 5
                                         FROM events
                                         WHERE events.organization_id =
                                               view_users_organizations.organization_id
                                               AND events.last_event_date > NOW()) :: INT,
								updated_at = NOW()
								FROM (SELECT *
										FROM view_users_organizations WHERE user_id = :user_id) AS view_users_organizations
								WHERE view_users_organizations.user_id = recommendations_organizations.user_id
								AND view_users_organizations.organization_id = recommendations_organizations.organization_id';

		App::DB()->prepareExecuteRaw($q_upd, array(
			':user_id' => $this->user_id
		));
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
				'expires_on' => 1609459140
			))
			->returning(array('id'));

		App::DB()->prepareExecute($q_ins, 'CANT_SAVE_TOKEN')->fetch();

		return new NewUser(array(
			'email' => $provider->getToInsData()['email'],
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